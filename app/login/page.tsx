'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, Mail, Lock, ArrowRight, CheckCircle2, User, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { loginWithGoogle, loginWithCredentials, isLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleGoogleSignIn = async () => {
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      router.push('/dashboard');
    } catch (err) {
      setErrorMsg('Google authentication failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEmailSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }
    setIsSubmitting(true);
    setErrorMsg('');
    try {
      await loginWithCredentials(email);
      router.push('/dashboard');
    } catch (err) {
      setErrorMsg('Sign-in failed. Please verify credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6">
      <div className="w-full max-w-md">
        {/* Card */}
        <div className="glass-card rounded-3xl p-8 sm:p-10 border-[#D4AF37]/40 shadow-2xl bg-white/90 space-y-6">
          {/* Logo 1 - Pink and Gold */}
          <div className="text-center space-y-2">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#D4AF37] shadow-md mx-auto bg-[#FAF7F2] p-1.5 flex items-center justify-center">
              <Image
                src="/assets/0xnull-symbol.png"
                alt="0XNULL Primary Symbol"
                width={48}
                height={48}
                className="object-contain"
                priority
              />
            </div>
            <h1 className="text-2xl font-black text-[#151417] tracking-tight">
              Sign In to 0XNULL
            </h1>
            <p className="text-xs text-[#645E6D]">
              Access your student dashboard, tracked certifications, and labs.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium">
              {errorMsg}
            </div>
          )}

          {/* CONTINUE WITH GOOGLE — Mandated as Real Authentication */}
          <button
            onClick={handleGoogleSignIn}
            disabled={isSubmitting}
            className="w-full py-3 px-4 rounded-xl border border-[#E8D8C3] bg-white text-xs sm:text-sm font-bold text-[#151417] hover:bg-[#FAF7F2] hover:border-[#C89D3C] transition-all flex items-center justify-center gap-3 shadow-xs cursor-pointer disabled:opacity-50"
          >
            {/* Google SVG Icon */}
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
              />
            </svg>
            <span>{isSubmitting ? 'Authenticating...' : 'Continue with Google'}</span>
          </button>

          <div className="relative flex items-center justify-center">
            <div className="w-full border-t border-[#E8D8C3]" />
            <span className="absolute px-3 bg-white text-[10px] font-bold uppercase tracking-wider text-[#8A8592]">
              or with student email
            </span>
          </div>

          {/* Form */}
          <form onSubmit={handleEmailSignIn} className="space-y-4">
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1.5">
                University Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="student@university.edu"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/50 text-xs text-[#151417] outline-none focus:border-[#C89D3C]"
                />
              </div>
            </div>

            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  placeholder="••••••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/50 text-xs text-[#151417] outline-none focus:border-[#C89D3C]"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? 'Verifying...' : 'Sign In'}
            </button>
          </form>

        </div>
      </div>
    </div>
  );
}
