import { NextResponse } from 'next/server';
import { getAdminSessionFromRequest } from '@/lib/admin-auth';

export async function GET(request: Request) {
  try {
    const session = getAdminSessionFromRequest(request);

    if (!session) {
      return NextResponse.json({
        authenticated: false,
        admin: null
      });
    }

    return NextResponse.json({
      authenticated: true,
      admin: {
        email: session.email,
        role: session.role
      }
    });
  } catch (error: any) {
    return NextResponse.json(
      { authenticated: false, admin: null, error: error?.message || 'Session verification error' },
      { status: 500 }
    );
  }
}
