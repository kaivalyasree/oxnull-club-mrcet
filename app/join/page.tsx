'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { DOMAINS } from '@/lib/data';
import {
  ShieldCheck,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  User,
  GraduationCap,
  Hash,
  BookOpen,
  Phone,
  Check,
  Sparkles,
  Lock
} from 'lucide-react';

const ACADEMIC_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const BRANCHES = [
  'CSE - Cybersecurity',
  'Computer Science & Engineering',
  'CSE - Artificial Intelligence & Machine Learning',
  'CSE - Data Science',
  'Information Technology',
  'Electronics & Communication Engineering'
];

export default function JoinClubPage() {
  const { user, loginWithGoogle, isLoading: authLoading } = useAuth();

  // Form Fields State
  const [fullName, setFullName] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [branch, setBranch] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [selectedDomains, setSelectedDomains] = useState<string[]>([]);

  // UI & Submission State
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [submittedApplication, setSubmittedApplication] = useState<any | null>(null);

  // Restore preserved draft values from sessionStorage if returning from Google Auth
  useEffect(() => {
    try {
      const draft = sessionStorage.getItem('0xnull_join_draft');
      if (draft) {
        const parsed = JSON.parse(draft);
        if (parsed.fullName) setFullName(parsed.fullName);
        if (parsed.academicYear) setAcademicYear(parsed.academicYear);
        if (parsed.rollNumber) setRollNumber(parsed.rollNumber);
        if (parsed.branch) setBranch(parsed.branch);
        if (parsed.phoneNumber) setPhoneNumber(parsed.phoneNumber);
        if (parsed.selectedDomains) setSelectedDomains(parsed.selectedDomains);
      }
    } catch (e) {
      console.warn('Could not restore draft from session', e);
    }
  }, []);

  // Sync draft to sessionStorage on changes
  useEffect(() => {
    try {
      sessionStorage.setItem(
        '0xnull_join_draft',
        JSON.stringify({
          fullName,
          academicYear,
          rollNumber,
          branch,
          phoneNumber,
          selectedDomains
        })
      );
    } catch (e) {}
  }, [fullName, academicYear, rollNumber, branch, phoneNumber, selectedDomains]);

  // Pre-fill name from authenticated user if available and empty
  useEffect(() => {
    if (user?.name && !fullName) {
      setFullName(user.name);
    }
  }, [user, fullName]);

  // Check if candidate already has an existing application
  useEffect(() => {
    if (!user) return;
    fetch(`/api/applications?userId=${user.id}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data) && res.data.length > 0) {
          setSubmittedApplication(res.data[0]);
        }
      })
      .catch((err) => console.error(err));
  }, [user]);

  const toggleDomain = (domainId: string) => {
    setSelectedDomains((prev) =>
      prev.includes(domainId) ? prev.filter((id) => id !== domainId) : [...prev, domainId]
    );
  };

  const handleGoogleSignIn = async () => {
    setErrorMessage('');
    try {
      await loginWithGoogle();
    } catch (err: any) {
      setErrorMessage(err.message || 'Google authentication failed. Please try again.');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    // Frontend pre-validation
    if (!fullName.trim()) {
      setErrorMessage('Full name is required.');
      return;
    }
    if (!academicYear) {
      setErrorMessage('Please select your academic year.');
      return;
    }
    if (!rollNumber.trim()) {
      setErrorMessage('Please enter your college roll number.');
      return;
    }
    if (!branch) {
      setErrorMessage('Please select your department branch.');
      return;
    }
    if (!phoneNumber.trim()) {
      setErrorMessage('Please enter a valid contact phone number.');
      return;
    }
    if (selectedDomains.length === 0) {
      setErrorMessage('Please select at least one cybersecurity domain interest.');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        userId: user?.id || `anon-${Date.now()}`,
        fullName: fullName.trim(),
        year: academicYear,
        rollNumber: rollNumber.trim().toUpperCase(),
        branch,
        phoneNumber: phoneNumber.trim(),
        domainInterests: selectedDomains
      };

      const res = await fetch('/api/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to submit application.');
      }

      // Confirmed persistence
      setSubmittedApplication(data.data);
      sessionStorage.removeItem('0xnull_join_draft');
    } catch (err: any) {
      setErrorMessage(err.message || 'Error saving application to database.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-4xl mx-auto space-y-10">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <div className="relative w-14 h-14 rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-md mx-auto bg-white p-1.5 flex items-center justify-center">
          <Image
            src="/assets/0xnull-symbol.png"
            alt="0XNULL Logo"
            width={48}
            height={48}
            className="object-contain"
            priority
          />
        </div>

        <span className="text-xs uppercase font-bold tracking-[0.25em] text-[#967223] block">
          0XNULL Cybersecurity Club • Membership Registration
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#151417] tracking-tight">
          Join the Club
        </h1>
        <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
          Department of Cybersecurity • Malla Reddy College of Engineering and Technology. Complete the registration form below to join active working tracks.
        </p>
      </div>

      {/* Success Confirmed Persistence State */}
      {submittedApplication ? (
        <div className="glass-card rounded-3xl p-8 sm:p-12 border-[#D4AF37]/40 bg-white/95 shadow-xl text-center space-y-6 animate-in fade-in duration-300">
          <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 border border-emerald-200 mx-auto flex items-center justify-center">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-[#967223]">
              Application Recorded • ID: {submittedApplication.id}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#151417]">
              Registration Submitted Successfully
            </h2>
            <p className="text-xs sm:text-sm text-[#55505C] max-w-md mx-auto leading-relaxed">
              Your application has been received and persisted with status:
              <span className="inline-block ml-1.5 px-2.5 py-0.5 rounded-full font-bold uppercase text-[10px] bg-amber-50 text-amber-800 border border-amber-200">
                {submittedApplication.status || 'Pending Review'}
              </span>
            </p>
          </div>

          {/* Submission Summary Card */}
          <div className="max-w-md mx-auto rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] p-5 text-left space-y-2.5 text-xs">
            <div className="flex justify-between border-b border-[#E8D8C3]/50 pb-1.5">
              <span className="text-[#8A8592]">Applicant Name:</span>
              <span className="font-bold text-[#151417]">{submittedApplication.fullName}</span>
            </div>
            <div className="flex justify-between border-b border-[#E8D8C3]/50 pb-1.5">
              <span className="text-[#8A8592]">Roll Number:</span>
              <span className="font-mono font-bold text-[#151417]">{submittedApplication.rollNumber}</span>
            </div>
            <div className="flex justify-between border-b border-[#E8D8C3]/50 pb-1.5">
              <span className="text-[#8A8592]">Academic Year & Branch:</span>
              <span className="font-medium text-[#151417]">
                {submittedApplication.year} • {submittedApplication.branch}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#8A8592]">Selected Domains:</span>
              <span className="font-medium text-[#967223]">
                {submittedApplication.domainInterests?.length || 0} Domain(s)
              </span>
            </div>
          </div>

          <div className="pt-2 flex flex-wrap justify-center gap-3">
            <Link
              href="/"
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors"
            >
              Back to Home
            </Link>
            <Link
              href="/domains"
              className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-[#E8D8C3] text-[#8C6B1B] hover:bg-[#FAF7F2] transition-colors"
            >
              Explore Domains
            </Link>
          </div>
        </div>
      ) : (
        /* Registration Form */
        <div className="glass-card rounded-3xl p-6 sm:p-10 border-[#D4AF37]/35 bg-white/90 shadow-xl space-y-8">
          {/* Google Auth Integration Section */}
          <div className="p-4 sm:p-5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-full bg-white border border-[#E8D8C3] flex items-center justify-center shrink-0">
                {user ? (
                  <User className="w-5 h-5 text-[#967223]" />
                ) : (
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
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
                )}
              </div>
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#967223] block">
                  Student Verification
                </span>
                <p className="text-xs font-semibold text-[#151417]">
                  {user ? `Authenticated as ${user.name || user.email}` : 'Sign in with your student Google account'}
                </p>
              </div>
            </div>

            {!user && (
              <button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={authLoading}
                className="px-4 py-2 rounded-xl border border-[#E8D8C3] bg-white text-xs font-bold text-[#151417] hover:bg-[#FAF7F2] hover:border-[#C89D3C] transition-all flex items-center gap-2 cursor-pointer shadow-2xs whitespace-nowrap"
              >
                <span>Continue with Google</span>
              </button>
            )}
          </div>

          {/* Validation Feedback */}
          {errorMessage && (
            <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Full Name */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1.5">
                  1. Full Name <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Enter your official full name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] outline-none focus:border-[#C89D3C] focus:bg-white transition-all font-medium"
                  />
                </div>
              </div>

              {/* 2. Academic Year */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1.5">
                  2. Academic Year <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    required
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] outline-none focus:border-[#C89D3C] focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="">Select officially confirmed year</option>
                    {ACADEMIC_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* 3. Roll Number */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1.5">
                  3. Roll Number <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 23N31A6201"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] outline-none focus:border-[#C89D3C] focus:bg-white transition-all font-mono font-medium uppercase"
                  />
                </div>
              </div>

              {/* 4. Branch */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1.5">
                  4. College Branch <span className="text-rose-600">*</span>
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <select
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] outline-none focus:border-[#C89D3C] focus:bg-white transition-all font-medium appearance-none cursor-pointer"
                  >
                    <option value="">Select approved branch</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 5. Phone Number */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1.5">
                5. Phone Number <span className="text-rose-600">*</span>
              </label>
              <div className="relative max-w-md">
                <Phone className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="+91 9876543210"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] outline-none focus:border-[#C89D3C] focus:bg-white transition-all font-medium"
                />
              </div>
              <p className="text-[10px] text-[#8A8592] mt-1 flex items-center gap-1">
                <Lock className="w-3 h-3 text-[#967223]" />
                <span>Private & encrypted. Never displayed publicly or shared.</span>
              </p>
            </div>

            {/* 6. Domain Interests — Selectable from the exact 7 domains */}
            <div className="pt-2 border-t border-[#E8D8C3]/50">
              <div className="mb-3">
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block">
                  6. Domain Interests <span className="text-rose-600">*</span>
                </label>
                <p className="text-xs text-[#645E6D]">
                  Select one or multiple cybersecurity domains you wish to participate in (minimum 1 required):
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {DOMAINS.map((domain) => {
                  const isSelected = selectedDomains.includes(domain.id);
                  return (
                    <div
                      key={domain.id}
                      onClick={() => toggleDomain(domain.id)}
                      onKeyDown={(e) => {
                        if (e.key === ' ' || e.key === 'Enter') {
                          e.preventDefault();
                          toggleDomain(domain.id);
                        }
                      }}
                      tabIndex={0}
                      role="checkbox"
                      aria-checked={isSelected}
                      className={`p-3.5 rounded-2xl border text-left cursor-pointer transition-all flex items-center justify-between select-none ${
                        isSelected
                          ? 'bg-[#F5EBDD] border-[#C89D3C] shadow-sm ring-1 ring-[#C89D3C]'
                          : 'bg-white border-[#E8D8C3] hover:bg-[#FAF7F2] hover:border-[#D4AF37]/50'
                      }`}
                    >
                      <div className="pr-2">
                        <span className="font-mono text-[10px] font-bold text-[#967223] block">
                          {domain.number}
                        </span>
                        <h4 className="font-bold text-xs text-[#151417] leading-snug">
                          {domain.name}
                        </h4>
                      </div>

                      <div
                        className={`w-5 h-5 rounded-lg border flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-[#151417] border-[#151417] text-white'
                            : 'border-[#E8D8C3] bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3.5 h-3.5 text-[#E5C378]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Submit Action */}
            <div className="pt-4 border-t border-[#E8D8C3]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
              <span className="text-[11px] text-[#8A8592] text-center sm:text-left">
                By submitting, you agree to adhere to the 0XNULL Ethical Cyber Guardrails.
              </span>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full sm:w-auto px-8 py-3 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-all shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
              >
                <span>{isSubmitting ? 'Recording Application...' : 'Submit Application'}</span>
                <ArrowRight className="w-4 h-4 text-[#E5C378]" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
