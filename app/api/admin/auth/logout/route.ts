import { NextResponse } from 'next/server';
import { buildAdminLogoutCookie } from '@/lib/admin-auth';

export async function POST() {
  const response = NextResponse.json({
    success: true,
    message: 'Administrator session terminated.'
  });

  response.headers.set('Set-Cookie', buildAdminLogoutCookie());
  return response;
}
