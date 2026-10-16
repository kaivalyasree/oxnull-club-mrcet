import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder-0xnull.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.placeholder';

export const isSupabaseConfigured = Boolean(
  process.env.NEXT_PUBLIC_SUPABASE_URL && 
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY &&
  !process.env.NEXT_PUBLIC_SUPABASE_URL.includes('placeholder')
);

// Singleton Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true
  }
});

/**
 * Initiates Google OAuth authentication via Supabase Auth
 */
export async function signInWithGoogle() {
  if (!isSupabaseConfigured) {
    console.warn('Supabase credentials not configured in environment variables. Falling back to platform student session.');
    return { data: null, error: new Error('SUPABASE_NOT_CONFIGURED') };
  }

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: typeof window !== 'undefined' ? `${window.location.origin}/dashboard` : undefined,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent'
      }
    }
  });

  return { data, error };
}

/**
 * Signs out from Supabase Auth
 */
export async function signOut() {
  if (!isSupabaseConfigured) return;
  await supabase.auth.signOut();
}
