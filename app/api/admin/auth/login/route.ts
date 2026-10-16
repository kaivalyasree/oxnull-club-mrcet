import { NextResponse } from 'next/server';
import { verifyAdminCredentials, buildAdminSessionCookie } from '@/lib/admin-auth';

export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const username = body?.username || '';
    const password = body?.password || '';

    // Extract client IP from proxy headers
    const forwarded = request.headers.get('x-forwarded-for');
    const realIp = request.headers.get('x-real-ip');
    const clientIp = forwarded ? forwarded.split(',')[0].trim() : (realIp || 'local');

    const result = await verifyAdminCredentials(username, password, clientIp);

    if (!result.success || !result.sessionToken) {
      const status = result.rateLimited ? 429 : 401;
      return NextResponse.json(
        {
          success: false,
          error: result.error || 'Invalid administrator credentials.',
          rateLimited: result.rateLimited,
          waitMinutes: result.waitMinutes
        },
        { status }
      );
    }

    const response = NextResponse.json({
      success: true,
      message: 'Administrator session authenticated.',
      admin: {
        username: result.username,
        role: 'admin'
      }
    });

    const cookieHeader = buildAdminSessionCookie(result.sessionToken);
    response.headers.set('Set-Cookie', cookieHeader);
    return response;
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Authentication processing error.'
      },
      { status: 500 }
    );
  }
}
