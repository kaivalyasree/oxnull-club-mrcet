import { NextResponse } from 'next/server';
import { verifyAdminOtp, buildAdminSessionCookie } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const { email, otp } = body;

    const result = await verifyAdminOtp(email, otp);

    if (!result.success || !result.sessionToken) {
      const status = result.rateLimited ? 429 : result.expired ? 410 : 401;
      return NextResponse.json(
        {
          success: false,
          error: result.message,
          attemptsRemaining: result.attemptsRemaining,
          expired: result.expired,
          rateLimited: result.rateLimited
        },
        { status }
      );
    }

    const cookieHeader = buildAdminSessionCookie(result.sessionToken);

    const response = NextResponse.json({
      success: true,
      message: result.message,
      admin: {
        email: result.adminEmail,
        role: 'admin'
      }
    });

    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Verification failed.' },
      { status: 500 }
    );
  }
}
