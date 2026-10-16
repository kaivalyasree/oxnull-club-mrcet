import { NextResponse } from 'next/server';
import { requestAdminOtp } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const email = body?.email || '';

    // Extract client IP if available from standard reverse-proxy headers
    const forwardedFor = request.headers.get('x-forwarded-for');
    const clientIp = forwardedFor ? forwardedFor.split(',')[0].trim() : 'local';

    const result = await requestAdminOtp(email, clientIp);

    if (!result.success) {
      const status = result.rateLimited ? 429 : 400;
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          cooldownSeconds: result.cooldownSeconds,
          rateLimited: result.rateLimited
        },
        { status }
      );
    }

    return NextResponse.json({
      success: true,
      message: result.message,
      liveEmailSent: result.liveEmailSent,
      provider: result.provider,
      devNotice: result.devNotice,
      // Pass testOtp only if non-production simulation for verification testing
      testOtp: result.testOtp
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to dispatch verification code.' },
      { status: 500 }
    );
  }
}
