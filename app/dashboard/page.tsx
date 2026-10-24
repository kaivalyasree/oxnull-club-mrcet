'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  DOMAINS,
  FOUNDATION_TOPICS,
  INITIAL_RESOURCES,
  INITIAL_CERTIFICATIONS,
  INITIAL_PROJECTS,
  ACTIVITIES,
  getTrackById
} from '@/lib/data';
import ResourceCard from '@/components/ResourceCard';
import CertificationCard from '@/components/CertificationCard';
import ProjectCard from '@/components/ProjectCard';
import {
  User,
  Shield,
  BookOpen,
  Award,
  FolderGit2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Save,
  Sparkles,
  Compass,
  FileText,
  ArrowLeftRight,
  LogOut,
  Lock
} from 'lucide-react';

import { TrackEnrollment } from '@/lib/store';

export default function StudentDashboardPage() {
  const { user, progress, updateUserNotes, logout, switchAccount, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'tracks' | 'resources' | 'certifications' | 'activities' | 'notes'>('overview');
  const [notesInput, setNotesInput] = useState(progress.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Real Database Track Enrollments
  const [trackEnrollments, setTrackEnrollments] = useState<TrackEnrollment[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);

  React.useEffect(() => {
    if (!user?.id) {
      setTrackEnrollments([]);
      return;
    }
    setIsLoadingEnrollments(true);
    fetch(`/api/enrollments?userId=${encodeURIComponent(user.id)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setTrackEnrollments(data.data);
        } else {
          setTrackEnrollments([]);
        }
      })
      .catch((err) => {
        console.error('Failed to load student track enrollments:', err);
        setTrackEnrollments([]);
      })
      .finally(() => {
        setIsLoadingEnrollments(false);
      });
  }, [user?.id]);

  React.useEffect(() => {
    setNotesInput(progress.notes || '');
  }, [progress.notes]);

  // Derive user specific items
  const enrolledDomainsList = DOMAINS.filter((d) => progress.enrolledDomains.includes(d.id));
  const savedResourcesList = INITIAL_RESOURCES.filter((r) => progress.savedResourceIds.includes(r.id));
  const trackedCertsList = INITIAL_CERTIFICATIONS.filter((c) => progress.trackedCertificationIds.includes(c.id));
  const rsvpdActivitiesList = ACTIVITIES.filter((a) => progress.rsvpdActivityIds.includes(a.id));

  const foundationPercent = Math.round(
    (progress.completedFoundationIds.length / FOUNDATION_TOPICS.length) * 100
  );

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setSaveSuccess(false);
    await updateUserNotes(notesInput);
    setIsSavingNotes(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-6 space-y-4">
        <div className="w-14 h-14 rounded-2xl bg-[#151417] text-[#FAF7F2] flex items-center justify-center border border-[#D4AF37] animate-pulse">
          <Shield className="w-6 h-6 text-[#C89D3C]" />
        </div>
        <p className="text-xs font-semibold text-[#645E6D]">Authenticating student session & records...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-[75vh] flex items-center justify-center py-12 px-4 sm:px-6">
        <div className="w-full max-w-md glass-card rounded-3xl p-8 sm:p-10 border-[#D4AF37]/40 shadow-2xl bg-white/95 text-center space-y-6">
          <div className="w-16 h-16 rounded-2xl bg-[#151417] text-[#FAF7F2] flex items-center justify-center font-bold text-2xl border border-[#D4AF37] mx-auto shadow-sm">
            <Lock className="w-8 h-8 text-[#C89D3C]" />
          </div>
          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#967223]">
              Authentication Required
            </span>
            <h1 className="text-2xl font-black text-[#151417] tracking-tight">
              Student Portal Access
            </h1>
            <p className="text-xs text-[#645E6D] leading-relaxed">
              Please sign in to access your enrolled specialization tracks, laboratory progress, bookmarked papers, and private study notes.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <Link
              href="/login?returnUrl=/dashboard"
              className="w-full py-3 px-4 rounded-xl text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors shadow-sm inline-flex items-center justify-center gap-2 cursor-pointer"
            >
              <User className="w-4 h-4 text-[#E5C378]" />
              <span>Sign In to Student Portal</span>
            </Link>
            <Link
              href="/domains"
              className="w-full py-2.5 px-4 rounded-xl text-xs font-semibold border border-[#E8D8C3] bg-white text-[#55505C] hover:bg-[#FAF7F2] transition-colors inline-block"
            >
              Browse 0XNULL Domains
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Profile Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/35 bg-gradient-to-r from-white/90 via-[#FAF7F2] to-[#F5EBDD]/50 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#151417] text-[#FAF7F2] flex items-center justify-center font-bold text-xl border border-[#D4AF37]">
            {user?.name ? user.name[0].toUpperCase() : 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#151417]">{user?.name || 'Member'}</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#F5EBDD] text-[#8C6B1B] border border-[#E8D8C3]">
                {user?.role || 'Student'}
              </span>
            </div>
            {user?.email && (
              <p className="text-xs text-[#645E6D] mt-0.5">{user.email}</p>
            )}
            <p className="text-[11px] font-semibold text-[#967223] mt-0.5">
              {user?.department || 'Department of Cybersecurity'} • Active Member Cohort
            </p>
          </div>
        </div>

        {/* Visible Actions: Switch Account & Logout */}
        <div className="flex items-center gap-2.5 self-start md:self-center">
          <button
            onClick={() => switchAccount()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-[#E8D8C3] bg-white text-xs font-semibold text-[#8C6B1B] hover:bg-[#FAF7F2] hover:border-[#C89D3C] transition-all cursor-pointer shadow-xs"
            title="Sign out and switch to another student account"
          >
            <ArrowLeftRight className="w-3.5 h-3.5 text-[#C89D3C]" />
            <span>Switch Account</span>
          </button>
          <button
            onClick={() => logout()}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-[#151417] text-[#FAF7F2] hover:bg-rose-900 transition-colors text-xs font-semibold cursor-pointer shadow-xs"
            title="Log out of current student session"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-300" />
            <span>Log Out</span>
          </button>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Foundation Progress */}
        <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
            Foundation Mastery
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#151417]">{foundationPercent}%</span>
            <span className="text-xs text-[#645E6D]">
              ({progress.completedFoundationIds.length}/{FOUNDATION_TOPICS.length})
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E8D8C3] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C89D3C] to-[#E5C378]"
              style={{ width: `${foundationPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Real Track Enrollments */}
        <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
            Track Enrollments
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#151417]">
              {trackEnrollments.length}
            </span>
            <span className="text-xs text-[#645E6D]">
              ({trackEnrollments.filter((e) => e.status === 'approved').length} approved)
            </span>
          </div>
          <p className="text-[11px] text-[#8C6B1B] font-medium line-clamp-1">
            {trackEnrollments.length > 0
              ? trackEnrollments.map((e) => e.trackTitle).join(', ')
              : `${progress.enrolledDomains.length} domain bookmark(s)`}
          </p>
        </div>

        {/* Metric 3: Saved & Completed Resources */}
        <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
            Resource Library
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#151417]">
              {progress.completedResourceIds.length}
            </span>
            <span className="text-xs text-[#645E6D]">
              completed ({progress.savedResourceIds.length} saved)
            </span>
          </div>
          <p className="text-[11px] text-[#8C6B1B] font-medium">Curated living library</p>
        </div>

        {/* Metric 4: RSVPs */}
        <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
            Club Engagement
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#151417]">
              {progress.rsvpdActivityIds.length}
            </span>
            <span className="text-xs text-[#645E6D]">RSVPs booked</span>
          </div>
          <p className="text-[11px] text-[#8C6B1B] font-medium">Weekly labs & seminars</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E8D8C3] pb-3 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Overview & Guidance', icon: Sparkles },
          { id: 'tracks', label: `My Tracks (${trackEnrollments.length})`, icon: Shield },
          { id: 'resources', label: `Saved Resources (${savedResourcesList.length})`, icon: BookOpen },
          { id: 'certifications', label: `Certifications (${trackedCertsList.length})`, icon: Award },
          { id: 'activities', label: `My Activities (${rsvpdActivitiesList.length})`, icon: Calendar },
          { id: 'notes', label: 'Lab Notes & Plan', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#151417] text-[#FAF7F2]'
                  : 'text-[#645E6D] hover:bg-[#FAF7F2] hover:text-[#151417]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#C89D3C]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Recommended Next Steps */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Recommended Next Steps */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/30">
            <span className="text-xs uppercase font-bold tracking-widest text-[#967223] block mb-2">
              Personalized Guidance
            </span>
            <h3 className="text-xl font-bold text-[#151417] mb-4">Recommended Next Steps</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-[#E8D8C3] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F5EBDD] text-[#8C6B1B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#151417]">
                    Complete Operating Systems & Memory Models
                  </h4>
                  <p className="text-xs text-[#55505C] mt-0.5">
                    Finish module 03 of the shared foundation before diving into volatile memory forensics.
                  </p>
                </div>
                <Link
                  href="/learn"
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#FAF7F2] text-[#8C6B1B] hover:bg-[#F5EBDD] shrink-0"
                >
                  Go to Learn →
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8D8C3] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F5EBDD] text-[#8C6B1B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#151417]">
                    Attend Friday CTF Practice Session
                  </h4>
                  <p className="text-xs text-[#55505C] mt-0.5">
                    Hands-on Wireshark packet capture analysis with senior mentors in Cyber Lab 402.
                  </p>
                </div>
                <Link
                  href="/activities"
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#FAF7F2] text-[#8C6B1B] hover:bg-[#F5EBDD] shrink-0"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>

          {/* Active Core Track Enrollments Section */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/35 bg-white/80">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
              <div>
                <span className="text-xs uppercase font-bold tracking-widest text-[#967223] block mb-1">
                  Specialization Track Enrollments
                </span>
                <h3 className="text-xl font-bold text-[#151417]">Your Enrolled Core Tracks</h3>
              </div>
              <Link
                href="/domains"
                className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417] inline-flex items-center gap-1"
              >
                <span>Browse All 7 Domains</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            {isLoadingEnrollments ? (
              <div className="p-8 text-center text-xs text-[#8A8592] animate-pulse">
                Loading your track enrollment records...
              </div>
            ) : trackEnrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {trackEnrollments.map((enr) => {
                  const domain = DOMAINS.find((d) => d.id === enr.domainId);
                  const track = getTrackById(enr.trackId);
                  return (
                    <div
                      key={enr.id}
                      className="p-5 rounded-2xl bg-white border border-[#E8D8C3] hover:border-[#D4AF37]/60 shadow-xs transition-all space-y-3"
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[10px] font-mono font-bold tracking-wider uppercase text-[#967223] block">
                            {enr.domainName || domain?.name}
                          </span>
                          <h4 className="text-base font-bold text-[#151417] leading-snug">
                            {enr.trackTitle}
                          </h4>
                        </div>
                        {/* Status badge */}
                        <div>
                          {enr.status === 'approved' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                              <span>Approved</span>
                            </span>
                          )}
                          {enr.status === 'pending' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                              <Clock className="w-3 h-3 text-amber-600" />
                              <span>Pending Review</span>
                            </span>
                          )}
                          {enr.status === 'rejected' && (
                            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
                              <span className="w-1.5 h-1.5 rounded-full bg-rose-500" />
                              <span>Not Approved</span>
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="text-[11px] text-[#645E6D] space-y-1">
                        <div className="flex items-center justify-between text-[#8A8592]">
                          <span>Roll Number:</span>
                          <span className="font-mono font-semibold text-[#151417]">{enr.rollNumber}</span>
                        </div>
                        <div className="flex items-center justify-between text-[#8A8592]">
                          <span>Enrolled Date:</span>
                          <span className="font-medium text-[#151417]">
                            {new Date(enr.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {track?.description && (
                        <p className="text-xs text-[#55505C] line-clamp-2 pt-1 border-t border-[#E8D8C3]/50">
                          {track.description}
                        </p>
                      )}

                      <div className="pt-2 flex items-center justify-between">
                        {domain ? (
                          <Link
                            href={`/domains/${domain.slug}#${enr.trackId}`}
                            className="inline-flex items-center gap-1 text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
                          >
                            <span>Open Track Hub</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        ) : (
                          <span />
                        )}
                        <span className="text-[10px] text-[#8A8592] font-mono">
                          ID: {enr.id.slice(0, 10)}...
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="p-8 text-center rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-3">
                <Shield className="w-8 h-8 text-[#C89D3C] mx-auto opacity-70" />
                <div className="space-y-1">
                  <h4 className="text-sm font-bold text-[#151417]">No Core Tracks Enrolled Yet</h4>
                  <p className="text-xs text-[#645E6D] max-w-md mx-auto">
                    Select a specialization track within any of the 7 cybersecurity domains to submit an enrollment request to club administration.
                  </p>
                </div>
                <Link
                  href="/domains"
                  className="inline-flex items-center gap-2 px-5 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors"
                >
                  <span>Explore Domains & Tracks</span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
                </Link>
              </div>
            )}
          </div>

          {/* Enrolled Domains Overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#151417]">Your Domain Bookmarks</h3>
              <Link
                href="/domains"
                className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
              >
                Manage Domains →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledDomainsList.map((domain) => (
                <div
                  key={domain.id}
                  className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex items-start justify-between gap-4"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#967223]">
                      DOMAIN {domain.number}
                    </span>
                    <h4 className="text-base font-bold text-[#151417] mt-0.5">{domain.name}</h4>
                    <p className="text-xs text-[#645E6D] mt-1 line-clamp-2">{domain.tagline}</p>
                  </div>
                  <Link
                    href={`/domains/${domain.slug}`}
                    className="p-2 rounded-xl bg-[#FAF7F2] text-[#8C6B1B] hover:bg-[#F5EBDD] shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab: Dedicated Track Enrollments Management */}
      {activeTab === 'tracks' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">My Enrolled Core Tracks</h3>
              <p className="text-xs text-[#645E6D]">
                Official specialization tracks recorded in the 0XNULL database.
              </p>
            </div>
            <Link
              href="/domains"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors shrink-0"
            >
              <span>Enroll in Another Track</span>
              <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
            </Link>
          </div>

          {isLoadingEnrollments ? (
            <div className="py-16 text-center text-xs text-[#8A8592] glass-card rounded-2xl animate-pulse">
              Loading your verified track enrollment records...
            </div>
          ) : trackEnrollments.length > 0 ? (
            <div className="space-y-6">
              {trackEnrollments.map((enr) => {
                const domain = DOMAINS.find((d) => d.id === enr.domainId);
                const track = getTrackById(enr.trackId);
                return (
                  <div
                    key={enr.id}
                    className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/35 bg-white space-y-5"
                  >
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-[#E8D8C3]/60">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="font-mono text-xs font-bold text-[#967223] uppercase">
                            {enr.domainName || domain?.name}
                          </span>
                          {track?.level && (
                            <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                              {track.level}
                            </span>
                          )}
                          {track?.durationWeeks && (
                            <span className="text-[10px] font-mono text-[#8A8592]">
                              {track.durationWeeks} Weeks
                            </span>
                          )}
                        </div>
                        <h4 className="text-2xl font-black text-[#151417]">{enr.trackTitle}</h4>
                      </div>

                      {/* Status Display */}
                      <div className="shrink-0 flex items-center gap-3">
                        {enr.status === 'approved' && (
                          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-left">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-800 uppercase tracking-wider">
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Approved Enrollment</span>
                            </div>
                            <p className="text-[11px] text-emerald-700 mt-0.5">
                              {enr.reviewedAt
                                ? `Reviewed ${new Date(enr.reviewedAt).toLocaleDateString()}`
                                : 'Active access to track labs & mentors'}
                            </p>
                          </div>
                        )}
                        {enr.status === 'pending' && (
                          <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-left">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-800 uppercase tracking-wider">
                              <Clock className="w-4 h-4 text-amber-600" />
                              <span>Pending Review</span>
                            </div>
                            <p className="text-[11px] text-amber-700 mt-0.5">
                              Submitted to administration. Awaiting mentor approval.
                            </p>
                          </div>
                        )}
                        {enr.status === 'rejected' && (
                          <div className="p-3 rounded-2xl bg-rose-50 border border-rose-200 text-left">
                            <div className="flex items-center gap-1.5 text-xs font-bold text-rose-800 uppercase tracking-wider">
                              <span className="w-2 h-2 rounded-full bg-rose-500" />
                              <span>Not Approved</span>
                            </div>
                            <p className="text-[11px] text-rose-700 mt-0.5">
                              Contact department lead or select an alternate track.
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Description */}
                    {track?.description && (
                      <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                        {track.description}
                      </p>
                    )}

                    {/* Competencies & Deliverables Grid */}
                    {(() => {
                      const competenciesList = track?.competencies || track?.topics || [];
                      const deliverablesList = track?.deliverables || (track?.deliverable ? [track.deliverable] : []);
                      return (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                          {competenciesList.length > 0 && (
                            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#967223] block">
                                Target Competencies
                              </span>
                              <ul className="space-y-1.5 text-xs text-[#151417]">
                                {competenciesList.map((comp: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#C89D3C] mt-1.5 shrink-0" />
                                    <span>{comp}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}

                          {deliverablesList.length > 0 && (
                            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-2">
                              <span className="text-[10px] font-bold uppercase tracking-wider text-[#967223] block">
                                Milestones & Deliverables
                              </span>
                              <ul className="space-y-1.5 text-xs text-[#151417]">
                                {deliverablesList.map((deliv: string, idx: number) => (
                                  <li key={idx} className="flex items-start gap-2">
                                    <span className="w-1.5 h-1.5 rounded-full bg-[#8C6B1B] mt-1.5 shrink-0" />
                                    <span>{deliv}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                        </div>
                      );
                    })()}

                    {/* Registration Meta details */}
                    <div className="p-4 rounded-2xl bg-white border border-[#E8D8C3] flex flex-wrap items-center justify-between gap-4 text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block">
                          Candidate Details
                        </span>
                        <p className="font-semibold text-[#151417]">
                          {enr.fullName} • <span className="font-mono">{enr.rollNumber}</span> ({enr.year}, {enr.branch})
                        </p>
                      </div>

                      <div className="flex items-center gap-3">
                        {domain && (
                          <Link
                            href={`/domains/${domain.slug}#${enr.trackId}`}
                            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#FAF7F2] border border-[#E8D8C3] text-[#8C6B1B] hover:bg-[#F5EBDD] transition-colors"
                          >
                            Track Curriculum →
                          </Link>
                        )}
                        <Link
                          href="/resources"
                          className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white border border-[#E8D8C3] text-[#151417] hover:bg-[#FAF7F2] transition-colors"
                        >
                          Domain Resources
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="py-16 text-center text-[#8A8592] glass-card rounded-2xl space-y-3">
              <Shield className="w-10 h-10 mx-auto opacity-40 text-[#C89D3C]" />
              <div className="space-y-1">
                <p className="font-bold text-sm text-[#151417]">No Track Enrollments Recorded</p>
                <p className="text-xs text-[#645E6D] max-w-sm mx-auto">
                  Browse our seven specialized cybersecurity domains and enroll in one of our core tracks to begin hands-on mentorship.
                </p>
              </div>
              <Link
                href="/domains"
                className="mt-3 inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors"
              >
                <span>Browse Domains & Tracks</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Saved Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#151417]">Your Saved Reading List</h3>
            <Link
              href="/resources"
              className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
            >
              Browse More Resources →
            </Link>
          </div>

          {savedResourcesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedResourcesList.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#8A8592] glass-card rounded-2xl">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C89D3C]" />
              <p className="font-semibold text-sm">You haven&apos;t bookmarked any resources yet</p>
              <Link
                href="/resources"
                className="mt-2 inline-block text-xs font-bold text-[#8C6B1B]"
              >
                Browse Curated Library →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Tracked Certifications */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#151417]">Active Credential Targets</h3>
            <Link
              href="/certifications"
              className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
            >
              Explore Certifications Roadmap →
            </Link>
          </div>

          {trackedCertsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trackedCertsList.map((cert) => (
                <CertificationCard key={cert.id} certification={cert} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#8A8592] glass-card rounded-2xl">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C89D3C]" />
              <p className="font-semibold text-sm">No certifications actively tracked</p>
              <Link
                href="/certifications"
                className="mt-2 inline-block text-xs font-bold text-[#8C6B1B]"
              >
                Add Certification to Roadmap →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Activities & RSVPs */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#151417]">Your Confirmed Activity RSVPs</h3>
            <Link
              href="/activities"
              className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
            >
              Browse 12 Formats →
            </Link>
          </div>

          {rsvpdActivitiesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rsvpdActivitiesList.map((act) => (
                <div
                  key={act.id}
                  className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#967223]">
                        {act.number}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                        {act.type}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#151417] mt-1">{act.title}</h4>
                    <p className="text-xs text-[#55505C] mt-1">{act.summary}</p>
                    <p className="text-[11px] text-[#8A8592] mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C89D3C]" />
                      <span>Cadence: {act.cadence}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#8A8592] glass-card rounded-2xl">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C89D3C]" />
              <p className="font-semibold text-sm">No activity RSVPs booked</p>
              <Link
                href="/activities"
                className="mt-2 inline-block text-xs font-bold text-[#8C6B1B]"
              >
                View Club Calendar →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Lab Notes & Study Plan */}
      {activeTab === 'notes' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#E8D8C3] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Personal Study & Lab Notes</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Saved securely to your 0XNULL student profile and persistent database.
              </p>
            </div>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Saved Successfully
              </span>
            )}
          </div>

          <textarea
            rows={8}
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            placeholder="Document lab VM IP addresses, active CTF notes, or exam study milestones..."
            className="w-full p-4 rounded-2xl bg-white border border-[#E8D8C3] text-xs sm:text-sm text-[#151417] outline-none focus:border-[#C89D3C] font-mono leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#E5C378]" />
              <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
