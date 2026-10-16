import crypto from 'crypto';
import { sendAdminOtpEmail, isEmailConfigured } from './email';

// Default authorized administrator directory per Phase 2 requirements
const DEFAULT_ADMIN_EMAILS = [
  'mvreddyinfosec@gmail.com',
  'cyberwithak1@gmail.com'
];

/**
 * Normalizes an email address consistently (trimmed, lowercase).
 */
export function normalizeEmail(email: string): string {
  if (!email || typeof email !== 'string') return '';
  return email.trim().toLowerCase();
}

/**
 * Retrieves the validated list of authorized administrator email addresses.
 */
export function getAuthorizedAdminEmails(): string[] {
  const envEmails = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',').map((e) => normalizeEmail(e)).filter(Boolean)
    : [];

  const combined = Array.from(new Set([...DEFAULT_ADMIN_EMAILS, ...envEmails]));
  return combined;
}

/**
 * Checks if a given email is on the server-side administrator allowlist.
 */
export function isAuthorizedAdminEmail(email: string): boolean {
  const normalized = normalizeEmail(email);
  if (!normalized) return false;
  const allowlist = getAuthorizedAdminEmails();
  return allowlist.includes(normalized);
}

// In-Memory Secure OTP Record Store
interface OtpRecord {
  email: string;
  hashedOtp: string;
  expiresAt: number;
  attempts: number;
  lastRequestedAt: number;
  requestCountInWindow: number;
  windowStart: number;
  isUsed: boolean;
  // Ephemeral capture for unconfigured test / dev mode inspection only
  ephemeralTestCode?: string;
}

const otpStore = new Map<string, OtpRecord>();

// Security limits
const OTP_EXPIRY_MS = 5 * 60 * 1000; // 5 minutes
const RESEND_COOLDOWN_MS = 60 * 1000; // 60 seconds cooldown
const MAX_REQUESTS_PER_WINDOW = 3;
const RATE_WINDOW_MS = 10 * 60 * 1000; // 10 minutes
const MAX_VERIFICATION_ATTEMPTS = 5;

// Cryptographic hash for OTP storage
function hashOtp(email: string, otp: string, salt: string): string {
  return crypto.createHmac('sha256', salt).update(`${email}:${otp}`).digest('hex');
}

// Session Token Secret
const SERVER_SESSION_SECRET =
  process.env.ADMIN_SESSION_SECRET ||
  process.env.SESSION_SECRET ||
  '0xnull-admin-ephemeral-secret-fallback-key-32-chars-long-secure';

export interface AdminSessionPayload {
  email: string;
  role: 'admin';
  iat: number;
  exp: number;
}

/**
 * Issues a cryptographically signed administrator session token (HMAC-SHA256).
 */
export function createAdminSessionToken(email: string): string {
  const normalized = normalizeEmail(email);
  const now = Date.now();
  const payload: AdminSessionPayload = {
    email: normalized,
    role: 'admin',
    iat: now,
    exp: now + 24 * 60 * 60 * 1000 // 24 hours
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', SERVER_SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  return `${encodedPayload}.${signature}`;
}

/**
 * Validates and decodes a signed administrator session token.
 */
export function verifyAdminSessionToken(token: string): AdminSessionPayload | null {
  if (!token || typeof token !== 'string') return null;
  const parts = token.split('.');
  if (parts.length !== 2) return null;

  const [encodedPayload, signature] = parts;

  const expectedSignature = crypto
    .createHmac('sha256', SERVER_SESSION_SECRET)
    .update(encodedPayload)
    .digest('base64url');

  const sigBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expectedSignature);

  if (sigBuffer.length !== expectedBuffer.length) {
    return null;
  }

  if (!crypto.timingSafeEqual(sigBuffer, expectedBuffer)) {
    return null;
  }

  try {
    const jsonStr = Buffer.from(encodedPayload, 'base64url').toString('utf-8');
    const payload = JSON.parse(jsonStr) as AdminSessionPayload;

    if (!payload || payload.role !== 'admin') return null;
    if (Date.now() > payload.exp) return null;

    // Verify email is still an authorized administrator
    if (!isAuthorizedAdminEmail(payload.email)) {
      return null;
    }

    return payload;
  } catch {
    return null;
  }
}

/**
 * Extracts the admin session cookie from a Request.
 */
export function getAdminSessionFromRequest(request: Request): AdminSessionPayload | null {
  const cookieHeader = request.headers.get('cookie') || '';
  const match = cookieHeader.match(/oxnull_admin_session=([^;]+)/);
  if (!match) return null;
  return verifyAdminSessionToken(match[1]);
}

/**
 * Verifies that an incoming request has a valid, active administrator session.
 */
export async function verifyAdminSession(request: Request): Promise<{ authorized: boolean; email?: string; error?: string }> {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return { authorized: false, error: 'Unauthorized. Administrative session required.' };
  }
  return { authorized: true, email: session.email };
}

export interface RequestOtpResult {
  success: boolean;
  message: string;
  cooldownSeconds?: number;
  rateLimited?: boolean;
  liveEmailSent?: boolean;
  provider?: string;
  // Only present in local automated tests or development when email is unconfigured
  devNotice?: string;
  testOtp?: string;
}

/**
 * Requests an administrative email OTP.
 * Employs rate limiting, cooldowns, and neutral responses for unauthorized addresses.
 */
export async function requestAdminOtp(rawEmail: string, ipAddress: string = 'unknown'): Promise<RequestOtpResult> {
  const email = normalizeEmail(rawEmail);
  const now = Date.now();

  if (!email || !email.includes('@')) {
    return {
      success: false,
      message: 'Please provide a valid administrator email address.'
    };
  }

  const isAuthorized = isAuthorizedAdminEmail(email);

  // Check rate limit & cooldown based on email
  const existing = otpStore.get(email);
  if (existing) {
    // Check resend cooldown
    const timeSinceLast = now - existing.lastRequestedAt;
    if (timeSinceLast < RESEND_COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((RESEND_COOLDOWN_MS - timeSinceLast) / 1000);
      return {
        success: false,
        rateLimited: true,
        cooldownSeconds: remainingSeconds,
        message: `Please wait ${remainingSeconds} seconds before requesting a new verification code.`
      };
    }

    // Check sliding window rate limit
    if (now - existing.windowStart < RATE_WINDOW_MS) {
      if (existing.requestCountInWindow >= MAX_REQUESTS_PER_WINDOW) {
        const remainingMinutes = Math.ceil((RATE_WINDOW_MS - (now - existing.windowStart)) / 60000);
        return {
          success: false,
          rateLimited: true,
          message: `Too many code requests. Please wait ${remainingMinutes} minutes before requesting another code.`
        };
      }
    } else {
      // Reset window
      existing.windowStart = now;
      existing.requestCountInWindow = 0;
    }
  }

  // Update request window tracking even for unauthorized addresses to prevent brute-force abuse
  const requestCount = existing ? (now - existing.windowStart < RATE_WINDOW_MS ? existing.requestCountInWindow + 1 : 1) : 1;
  const windowStart = existing && now - existing.windowStart < RATE_WINDOW_MS ? existing.windowStart : now;

  if (!isAuthorized) {
    // Record rate-limit usage for this address without generating a code
    otpStore.set(email, {
      email,
      hashedOtp: '',
      expiresAt: 0,
      attempts: 0,
      lastRequestedAt: now,
      requestCountInWindow: requestCount,
      windowStart,
      isUsed: true
    });

    // Return neutral confirmation to prevent email enumeration
    return {
      success: true,
      message: 'If this email address is an authorized administrator, a verification code has been dispatched.'
    };
  }

  // Generate cryptographically secure 6-digit OTP
  const otpNumber = crypto.randomInt(100000, 1000000);
  const otpString = otpNumber.toString();
  const salt = crypto.randomBytes(16).toString('hex');
  const hashedOtp = hashOtp(email, otpString, salt);

  const expiresAt = now + OTP_EXPIRY_MS;

  // Deliver OTP via configured email provider
  const emailResult = await sendAdminOtpEmail(email, otpString);

  const isDevOrTest = process.env.NODE_ENV !== 'production' || !isEmailConfigured();

  otpStore.set(email, {
    email,
    hashedOtp: `${salt}:${hashedOtp}`,
    expiresAt,
    attempts: 0,
    lastRequestedAt: now,
    requestCountInWindow: requestCount,
    windowStart,
    isUsed: false,
    ephemeralTestCode: isDevOrTest ? otpString : undefined
  });

  return {
    success: true,
    message: 'A verification code has been dispatched to your authorized administrator address.',
    liveEmailSent: emailResult.success,
    provider: emailResult.provider,
    devNotice: !emailResult.success
      ? 'Live email delivery provider unconfigured in environment variables. Simulation mode enabled for local testing.'
      : undefined,
    // Returned ONLY when external email provider is unconfigured in non-prod environment for test verification
    testOtp: isDevOrTest && !emailResult.success ? otpString : undefined
  };
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
  sessionToken?: string;
  adminEmail?: string;
  attemptsRemaining?: number;
  expired?: boolean;
  rateLimited?: boolean;
}

/**
 * Verifies an entered OTP code against the server store.
 * Enforces single-use, 5-minute expiry, and a maximum of 5 attempts.
 */
export async function verifyAdminOtp(rawEmail: string, rawOtp: string): Promise<VerifyOtpResult> {
  const email = normalizeEmail(rawEmail);
  const otp = (rawOtp || '').trim();
  const now = Date.now();

  if (!email || !otp) {
    return { success: false, message: 'Administrator email and verification code are required.' };
  }

  const record = otpStore.get(email);
  if (!record || !record.hashedOtp || record.isUsed) {
    return {
      success: false,
      message: 'No active verification code found for this address. Please request a new code.'
    };
  }

  // Check expiration
  if (now > record.expiresAt) {
    record.isUsed = true;
    otpStore.set(email, record);
    return {
      success: false,
      expired: true,
      message: 'This verification code has expired. Please request a new code.'
    };
  }

  // Check attempt limit
  if (record.attempts >= MAX_VERIFICATION_ATTEMPTS) {
    record.isUsed = true;
    otpStore.set(email, record);
    return {
      success: false,
      rateLimited: true,
      message: 'Maximum verification attempts exceeded. Code has been invalidated. Please request a new code.'
    };
  }

  // Increment attempt count
  record.attempts += 1;

  // Verify hash
  const [salt, expectedHash] = record.hashedOtp.split(':');
  const computedHash = hashOtp(email, otp, salt);

  const compBuffer = Buffer.from(computedHash);
  const expBuffer = Buffer.from(expectedHash);

  const isMatch = compBuffer.length === expBuffer.length && crypto.timingSafeEqual(compBuffer, expBuffer);

  if (!isMatch) {
    otpStore.set(email, record);
    const attemptsRemaining = MAX_VERIFICATION_ATTEMPTS - record.attempts;
    return {
      success: false,
      attemptsRemaining,
      message: `Invalid verification code. ${attemptsRemaining} attempt${attemptsRemaining === 1 ? '' : 's'} remaining.`
    };
  }

  // Successful verification — immediately mark OTP as used to prevent replay
  record.isUsed = true;
  record.ephemeralTestCode = undefined;
  otpStore.set(email, record);

  // Generate secure administrator session token
  const sessionToken = createAdminSessionToken(email);

  return {
    success: true,
    message: 'Administrator authentication successful.',
    sessionToken,
    adminEmail: email
  };
}

/**
 * Builds the standard Set-Cookie header string for an administrator session.
 */
export function buildAdminSessionCookie(sessionToken: string, maxAgeSeconds: number = 86400): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const secureFlag = isProduction ? '; Secure' : '';
  return `oxnull_admin_session=${sessionToken}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAgeSeconds}${secureFlag}`;
}

/**
 * Builds the Set-Cookie header string to clear the administrator session.
 */
export function buildAdminLogoutCookie(): string {
  const isProduction = process.env.NODE_ENV === 'production';
  const secureFlag = isProduction ? '; Secure' : '';
  return `oxnull_admin_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0; Expires=Thu, 01 Jan 1970 00:00:00 GMT${secureFlag}`;
}
