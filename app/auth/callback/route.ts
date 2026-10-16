import { NextResponse } from 'next/server';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') || '/join';

  if (code && isSupabaseConfigured) {
    try {
      await supabase.auth.exchangeCodeForSession(code);
    } catch (error) {
      console.error('OAuth code exchange failed:', error);
    }
  }

  // Redirect to join or intended destination
  return NextResponse.redirect(`${origin}${next}`);
}
