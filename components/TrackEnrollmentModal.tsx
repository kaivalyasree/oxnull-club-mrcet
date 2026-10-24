'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Domain, DomainTrack } from '@/lib/data';
import {
  X,
  ShieldCheck,
  CheckCircle2,
  Clock,
  AlertCircle,
  ArrowRight,
  User,
  GraduationCap,
  Hash,
  BookOpen,
  Phone,
  Mail,
  Lock,
  Sparkles,
  ExternalLink
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

interface TrackEnrollmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  domain: Domain;
  track: DomainTrack | null;
  onEnrollmentSuccess?: () => void;
}

export default function TrackEnrollmentModal({
  isOpen,
  onClose,
  domain,
  track,
  onEnrollmentSuccess
}: TrackEnrollmentModalProps) {
  const router = useRouter();
  const { user, isLoading: authLoading } = useAuth();

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [rollNumber, setRollNumber] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [branch, setBranch] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [statement, setStatement] = useState('');

  // UI States
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingEnrollment, setExistingEnrollment] = useState<any | null>(null);
  const [isCheckingExisting, setIsCheckingExisting] = useState(false);
  const [submittedSuccessfully, setSubmittedSuccessfully] = useState(false);

  // Pre-fill user data from session or previous local draft
  useEffect(() => {
    if (user) {
      if (user.name && !fullName) setFullName(user.name);
      if (user.email && !email) setEmail(user.email);
    }
  }, [user]);

  // Check if student is already enrolled in this track
  useEffect(() => {
    if (!isOpen || !track) {
      setExistingEnrollment(null);
      setSubmittedSuccessfully(false);
      setErrorMessage('');
      return;
    }

    if (user?.id) {
      setIsCheckingExisting(true);
      fetch(`/api/enrollments?userId=${encodeURIComponent(user.id)}`)
        .then((res) => res.json())
        .then((res) => {
          if (res.success && Array.isArray(res.data)) {
            const match = res.data.find(
              (e: any) => e.domainId === domain.id && e.trackId === track.id
            );
            if (match) {
              setExistingEnrollment(match);
            } else {
              setExistingEnrollment(null);
            }
          }
        })
        .catch((err) => console.warn('Could not check existing enrollment', err))
        .finally(() => setIsCheckingExisting(false));
    }
  }, [isOpen, track, domain, user]);

  if (!isOpen || !track) return null;

  const handleRedirectToLogin = () => {
    const returnUrl = `/domains/${domain.slug}?track=${encodeURIComponent(track.id)}`;
    router.push(`/login?returnUrl=${encodeURIComponent(returnUrl)}`);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!user) {
      handleRedirectToLogin();
      return;
    }

    // Validation
    if (!fullName.trim() || fullName.trim().length < 2) {
      setErrorMessage('Full name is required (minimum 2 characters).');
      return;
    }

    const cleanEmail = email.trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      setErrorMessage('A valid university or student email is required.');
      return;
    }

    const cleanRoll = rollNumber.trim().toUpperCase();
    if (!cleanRoll || cleanRoll.length < 3) {
      setErrorMessage('Please enter your college roll number (e.g. 22N31A6201).');
      return;
    }

    if (!academicYear) {
      setErrorMessage('Please select your academic year.');
      return;
    }

    if (!branch) {
      setErrorMessage('Please select your department branch.');
      return;
    }

    const cleanPhone = phoneNumber.trim().replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 8) {
      setErrorMessage('Please enter a valid contact phone number.');
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch('/api/enrollments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          studentName: fullName.trim(),
          studentEmail: cleanEmail,
          rollNumber: cleanRoll,
          academicYear,
          branch,
          phoneNumber: cleanPhone,
          domainId: domain.id,
          trackId: track.id,
          statement: statement.trim()
        })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (response.status === 409 && data.data) {
          setExistingEnrollment(data.data);
          setErrorMessage(data.error || 'You are already enrolled in this track.');
        } else {
          setErrorMessage(data.error || 'Failed to submit enrollment request. Please retry.');
        }
        setIsSubmitting(false);
        return;
      }

      setExistingEnrollment(data.data);
      setSubmittedSuccessfully(true);
      if (onEnrollmentSuccess) {
        onEnrollmentSuccess();
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Network error occurred while submitting enrollment.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto glass-card rounded-3xl p-6 sm:p-8 bg-white/95 border-[#D4AF37]/40 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full text-[#645E6D] hover:text-[#151417] hover:bg-[#F5EBDD]/60 transition-colors cursor-pointer"
          aria-label="Close dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="font-mono text-[10px] font-bold px-2 py-0.5 rounded bg-[#151417] text-[#FAF7F2]">
              DOMAIN {domain.number}
            </span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-[#967223]">
              {domain.name}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-black text-[#151417] tracking-tight">
            {track.name}
          </h2>
          <p className="text-xs text-[#55505C] leading-relaxed mt-1">
            {track.description}
          </p>
        </div>

        {/* STATE A: NOT AUTHENTICATED */}
        {!user && !authLoading && (
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-4 text-center">
            <div className="w-12 h-12 rounded-2xl bg-[#151417] text-[#D4AF37] mx-auto flex items-center justify-center shadow-xs">
              <Lock className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#151417]">
                Student Sign In Required
              </h3>
              <p className="text-xs text-[#645E6D] mt-1 max-w-md mx-auto">
                Please sign in with your student account to submit this track enrollment and track your progress in your dashboard.
              </p>
            </div>

            <div className="pt-2">
              <button
                onClick={handleRedirectToLogin}
                className="w-full py-3 px-5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-all shadow-md flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Sign In to Continue</span>
                <ArrowRight className="w-4 h-4 text-[#D4AF37]" />
              </button>
            </div>
          </div>
        )}

        {/* STATE B: ALREADY ENROLLED */}
        {user && existingEnrollment && !submittedSuccessfully && (
          <div className="p-6 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-4">
            <div className="flex items-center gap-3">
              {existingEnrollment.status === 'approved' ? (
                <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                </div>
              ) : existingEnrollment.status === 'rejected' ? (
                <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-800 flex items-center justify-center shrink-0">
                  <AlertCircle className="w-5 h-5 text-rose-600" />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
                  <Clock className="w-5 h-5 text-amber-600" />
                </div>
              )}

              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8592] block">
                  Current Enrollment Status
                </span>
                <div className="flex items-center gap-2 mt-0.5">
                  <span
                    className={`text-xs font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
                      existingEnrollment.status === 'approved'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                        : existingEnrollment.status === 'rejected'
                        ? 'bg-rose-50 text-rose-800 border-rose-300'
                        : 'bg-amber-50 text-amber-800 border-amber-300'
                    }`}
                  >
                    {existingEnrollment.status.toUpperCase()}
                  </span>
                  <span className="text-xs text-[#645E6D]">
                    Submitted for {existingEnrollment.rollNumber}
                  </span>
                </div>
              </div>
            </div>

            <p className="text-xs text-[#55505C] leading-relaxed">
              {existingEnrollment.status === 'approved'
                ? 'Your enrollment in this track is approved! You can access all learning resources, participate in lab drills, and build track projects.'
                : existingEnrollment.status === 'rejected'
                ? 'Your enrollment request was not approved. Please consult with club department coordinators if you believe this is in error.'
                : 'Your enrollment has been submitted and is currently pending review by club administrators. You will be notified once reviewed.'}
            </p>

            <div className="pt-2 flex flex-wrap gap-3">
              <button
                onClick={() => {
                  onClose();
                  router.push('/dashboard');
                }}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors cursor-pointer"
              >
                View in Dashboard
              </button>
              <button
                onClick={onClose}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-[#E8D8C3] text-[#47434E] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        )}

        {/* STATE C: SUBMITTED SUCCESSFULLY CONFIRMATION */}
        {user && submittedSuccessfully && (
          <div className="p-6 rounded-2xl bg-emerald-50/70 border border-emerald-200 text-center space-y-4 animate-in fade-in duration-300">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto shadow-xs">
              <CheckCircle2 className="w-7 h-7" />
            </div>

            <div>
              <h3 className="text-lg font-black text-[#151417]">
                Enrollment Submitted Successfully!
              </h3>
              <p className="text-xs text-[#55505C] mt-1 max-w-md mx-auto">
                Your request to join <strong>{track.name}</strong> has been saved. Initial status is <strong>PENDING</strong> administrator review.
              </p>
            </div>

            <div className="p-3 rounded-xl bg-white/80 border border-emerald-200/80 text-left text-xs space-y-1">
              <div className="flex justify-between">
                <span className="text-[#8A8592]">Student:</span>
                <span className="font-semibold text-[#151417]">{fullName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8592]">Roll Number:</span>
                <span className="font-semibold text-[#151417]">{rollNumber}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-[#8A8592]">Track:</span>
                <span className="font-semibold text-[#151417]">{track.name}</span>
              </div>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => {
                  onClose();
                  router.push('/dashboard');
                }}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors cursor-pointer"
              >
                Go to Student Dashboard
              </button>
              <button
                onClick={onClose}
                className="w-full sm:w-auto px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-[#E8D8C3] text-[#47434E] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                Back to Domain
              </button>
            </div>
          </div>
        )}

        {/* STATE D: REGULAR FORM SUBMISSION */}
        {user && !existingEnrollment && !submittedSuccessfully && (
          <form onSubmit={handleSubmit} className="space-y-4">
            {errorMessage && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 font-medium flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{errorMessage}</span>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Full Name */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1">
                  Full Name *
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-[#8A8592] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="Student Name"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] outline-none focus:border-[#C89D3C]"
                  />
                </div>
              </div>

              {/* Email */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1">
                  Student Email *
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-[#8A8592] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="student@mrcet.ac.in"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] outline-none focus:border-[#C89D3C]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Roll Number */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1">
                  College Roll Number *
                </label>
                <div className="relative">
                  <Hash className="w-4 h-4 text-[#8A8592] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    required
                    placeholder="e.g. 22N31A6201"
                    value={rollNumber}
                    onChange={(e) => setRollNumber(e.target.value.toUpperCase())}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] font-mono outline-none focus:border-[#C89D3C]"
                  />
                </div>
              </div>

              {/* Phone Number */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1">
                  Contact Phone Number *
                </label>
                <div className="relative">
                  <Phone className="w-4 h-4 text-[#8A8592] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] outline-none focus:border-[#C89D3C]"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {/* Academic Year */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1">
                  Academic Year *
                </label>
                <div className="relative">
                  <GraduationCap className="w-4 h-4 text-[#8A8592] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    required
                    value={academicYear}
                    onChange={(e) => setAcademicYear(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] outline-none focus:border-[#C89D3C] cursor-pointer"
                  >
                    <option value="">Select Academic Year</option>
                    {ACADEMIC_YEARS.map((y) => (
                      <option key={y} value={y}>
                        {y}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Branch */}
              <div>
                <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1">
                  Department Branch *
                </label>
                <div className="relative">
                  <BookOpen className="w-4 h-4 text-[#8A8592] absolute left-3 top-1/2 -translate-y-1/2" />
                  <select
                    required
                    value={branch}
                    onChange={(e) => setBranch(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] outline-none focus:border-[#C89D3C] cursor-pointer"
                  >
                    <option value="">Select Branch</option>
                    {BRANCHES.map((b) => (
                      <option key={b} value={b}>
                        {b}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Statement / Learning Goal */}
            <div>
              <label className="text-[11px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1">
                Learning Objectives / Prior Experience (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Briefly state your learning background, why you chose this track, or what hands-on projects you want to build..."
                value={statement}
                onChange={(e) => setStatement(e.target.value)}
                className="w-full p-3 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]/60 text-xs text-[#151417] outline-none focus:border-[#C89D3C] resize-none"
              />
            </div>

            {/* Actions */}
            <div className="pt-2 flex items-center justify-end gap-3">
              <button
                type="button"
                onClick={onClose}
                disabled={isSubmitting}
                className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
              >
                Cancel
              </button>

              <button
                type="submit"
                disabled={isSubmitting}
                className="px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-gradient-to-r from-[#C89D3C] to-[#A87D25] text-white hover:opacity-95 transition-all shadow-sm flex items-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? (
                  <>
                    <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Submitting...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Confirm Enrollment</span>
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
