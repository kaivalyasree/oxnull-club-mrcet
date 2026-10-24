import crypto from 'crypto';
import bcrypt from 'bcryptjs';

export interface AdminSessionPayload {
  username: string;
  email?: string;
  role: 'admin';
  iat: number;
  exp: number;
}

/**
 * Retrieves the configured administrator username from server-only environment.
 */
export function getAdminUsername(): string {
  const raw = process.env.ADMIN_USERNAME?.trim() || '';
  return raw.replace(/^["']|["']$/g, '');
}

/**
 * Retrieves the configured bcrypt password hash from server-only environment.
 */
export function getAdminPasswordHash(): string {
  const raw = process.env.ADMIN_PASSWORD_HASH?.trim() || '';
  return raw.replace(/^["']|["']$/g, '');
}

/**
 * Retrieves the secret used for signing administrator sessions.
 */
export function getSessionSecret(): string {
  const raw = (
    process.env.ADMIN_SESSION_SECRET?.trim() ||
    process.env.SESSION_SECRET?.trim() ||
    ''
  );
  return raw.replace(/^["']|["']$/g, '');
}

/**
 * Checks if administrator authentication has been configured via environment variables.
 */
export function isAdminAuthConfigured(): boolean {
  const user = getAdminUsername();
  const hash = getAdminPasswordHash();
  const secret = getSessionSecret();
  return Boolean(user && hash && secret && hash.startsWith('$2'));
}

// ---------------------------------------------------------------------------
// Rate Limiting (In-Memory per client IP & username)
// ---------------------------------------------------------------------------
interface RateLimitEntry {
  attempts: number;
  firstAttempt: number;
  blockedUntil: number;
}

const rateLimitMap = new Map<string, RateLimitEntry>();
const MAX_FAILED_ATTEMPTS = 5;
const ATTEMPT_WINDOW_MS = 15 * 60 * 1000; // 15 minutes window
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes lockout

export function checkLoginRateLimit(key: string): { allowed: boolean; waitMinutes?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  if (!record) return { allowed: true };

  if (now < record.blockedUntil) {
    const waitMinutes = Math.ceil((record.blockedUntil - now) / 60000);
    return { allowed: false, waitMinutes };
  }

  if (now - record.firstAttempt > ATTEMPT_WINDOW_MS) {
    rateLimitMap.delete(key);
    return { allowed: true };
  }

  return { allowed: true };
}

export function recordFailedLoginAttempt(key: string) {
  const now = Date.now();
  const record = rateLimitMap.get(key);
  if (!record || now - record.firstAttempt > ATTEMPT_WINDOW_MS) {
    rateLimitMap.set(key, { attempts: 1, firstAttempt: now, blockedUntil: 0 });
  } else {
    record.attempts += 1;
    if (record.attempts >= MAX_FAILED_ATTEMPTS) {
      record.blockedUntil = now + LOCKOUT_DURATION_MS;
    }
    rateLimitMap.set(key, record);
  }
}

export function resetLoginRateLimit(key: string) {
  rateLimitMap.delete(key);
}

/**
 * Clears all rate limit records (used in test suite).
 */
export function clearRateLimitStore() {
  rateLimitMap.clear();
}

// ---------------------------------------------------------------------------
// Verification & Session Issuance
// ---------------------------------------------------------------------------
export interface VerifyCredentialsResult {
  success: boolean;
  sessionToken?: string;
  username?: string;
  error?: string;
  rateLimited?: boolean;
  waitMinutes?: number;
}

/**
 * Verifies username and password against server environment variables.
 * Enforces rate limiting, constant-time username checking, and bcrypt comparison.
 */
export async function verifyAdminCredentials(
  rawUsername: string,
  rawPassword: string,
  clientIp: string = 'unknown'
): Promise<VerifyCredentialsResult> {
  const username = (rawUsername || '').trim();
  const password = rawPassword || '';

  if (!username || !password) {
    return {
      success: false,
      error: 'Administrator username and password are required.'
    };
  }

  const rateKey = `${clientIp}:${username.toLowerCase()}`;
  const rateCheck = checkLoginRateLimit(rateKey);
  if (!rateCheck.allowed) {
    return {
      success: false,
      rateLimited: true,
      waitMinutes: rateCheck.waitMinutes,
      error: `Too many failed login attempts. Please wait ${rateCheck.waitMinutes} minute(s) before trying again.`
    };
  }

  const configuredUser = getAdminUsername();
  const configuredHash = getAdminPasswordHash();
  const secret = getSessionSecret();

  // Fail safely if configuration is missing
  if (!configuredUser || !configuredHash || !secret) {
    console.warn(
      '[OXNULL Auth] Admin login failed: ADMIN_USERNAME, ADMIN_PASSWORD_HASH, or ADMIN_SESSION_SECRET is missing.'
    );
    return {
      success: false,
      error: 'Administrator authentication is not configured on this server.'
    };
  }

  // Verify username with constant-time equality check
  const userBuf = Buffer.from(username);
  const confBuf = Buffer.from(configuredUser);
  const usernameMatches =
    userBuf.length === confBuf.length && crypto.timingSafeEqual(userBuf, confBuf);

  let passwordMatches = false;
  if (usernameMatches) {
    try {
      passwordMatches = await bcrypt.compare(password, configuredHash);
    } catch (bcryptErr) {
      console.error('[OXNULL Auth] bcrypt comparison error:', bcryptErr);
    }
  }

  if (!usernameMatches || !passwordMatches) {
    recordFailedLoginAttempt(rateKey);
    return {
      success: false,
      error: 'Invalid administrator credentials.'
    };
  }

  // Clear rate limits upon successful login
  resetLoginRateLimit(rateKey);

  const sessionToken = createAdminSessionToken(configuredUser);
  return {
    success: true,
    sessionToken,
    username: configuredUser
  };
}

/**
 * Creates a cryptographically signed HMAC-SHA256 session token.
 */
export function createAdminSessionToken(username: string): string {
  const secret = getSessionSecret();
  if (!secret) {
    throw new Error('ADMIN_SESSION_SECRET is required to create a session token.');
  }

  const now = Date.now();
  const payload: AdminSessionPayload = {
    username,
    email: username,
    role: 'admin',
    iat: now,
    exp: now + 24 * 60 * 60 * 1000 // 24 hours
  };

  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', secret)
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
  const secret = getSessionSecret();
  if (!secret) return null;

  const expectedSignature = crypto
    .createHmac('sha256', secret)
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

    // Verify username matches configured administrator
    const configuredUser = getAdminUsername();
    if (configuredUser && payload.username !== configuredUser) {
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
 * Verifies that an incoming request has an active, valid administrator session.
 */
export async function verifyAdminSession(
  request: Request
): Promise<{ authorized: boolean; username?: string; email?: string; error?: string }> {
  const session = getAdminSessionFromRequest(request);
  if (!session) {
    return { authorized: false, error: 'Unauthorized. Administrative session required.' };
  }
  return {
    authorized: true,
    username: session.username,
    email: session.username
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
