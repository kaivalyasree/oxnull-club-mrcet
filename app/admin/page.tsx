'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DOMAINS,
  Resource,
  Certification,
  Project,
  Activity,
  Announcement
} from '@/lib/data';
import type { ClubApplication } from '@/lib/store';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  Award,
  FolderGit2,
  Calendar,
  Megaphone,
  Layers,
  Users,
  RefreshCw,
  ExternalLink,
  Lock,
  UserCheck,
  UserX,
  Clock,
  Phone,
  FileCheck,
  LogOut,
  KeyRound,
  RotateCcw
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<'overview' | 'applications' | 'resources' | 'projects' | 'certifications' | 'activities' | 'announcements'>('overview');

  // Server-Verified Administrator Session State
  const [adminSession, setAdminSession] = useState<{ email: string; role: 'admin' } | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Email OTP Gateway State
  const [adminEmail, setAdminEmail] = useState('');
  const [adminStep, setAdminStep] = useState<'email' | 'code'>('email');
  const [adminCode, setAdminCode] = useState('');
  const [authError, setAuthError] = useState<string | null>(null);
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [cooldown, setCooldown] = useState(0);

  const [applications, setApplications] = useState<ClubApplication[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // New Resource Form State
  const [showAddResource, setShowAddResource] = useState(false);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResDomain, setNewResDomain] = useState('d1');
  const [newResCategory, setNewResCategory] = useState<any>('Walkthrough');
  const [newResDifficulty, setNewResDifficulty] = useState<any>('Beginner');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResDesc, setNewResDesc] = useState('');

  // New Announcement Form State
  const [showAddAnn, setShowAddAnn] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnTag, setNewAnnTag] = useState('Official');
  const [newAnnContent, setNewAnnContent] = useState('');

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  // Check active server-side session on mount
  useEffect(() => {
    fetch('/api/admin/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.admin) {
          setAdminSession(data.admin);
          loadAllData();
        }
      })
      .catch((err) => console.error('Failed to verify admin session', err))
      .finally(() => setIsCheckingSession(false));
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [resApps, resR, resP, resC, resA, resAnn] = await Promise.all([
        fetch('/api/applications').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/resources').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/projects').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/certifications').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/activities').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/announcements').then((r) => r.json()).catch(() => ({ success: false, data: [] }))
      ]);
      if (resApps.success) setApplications(resApps.data);
      if (resR.success) setResources(resR.data);
      if (resP.success) setProjects(resP.data);
      if (resC.success) setCertifications(resC.data);
      if (resA.success) setActivities(resA.data);
      if (resAnn.success) setAnnouncements(resAnn.data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAppStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        setStatusMessage(`Application ${id.slice(-6)} set to ${status}.`);
        setTimeout(() => setStatusMessage(null), 3500);
        loadAllData();
      } else {
        alert(data.error || 'Failed to update application');
      }
    } catch (err: any) {
      alert(err.message || 'Status update error');
    }
  };

  const handleCreateResource = async (e: React.FormEvent) => {
    e.preventDefault();
    const domainObj = DOMAINS.find((d) => d.id === newResDomain);
    const payload = {
      title: newResTitle,
      domainId: newResDomain,
      domainName: domainObj?.name || 'Red & Blue Team',
      category: newResCategory,
      difficulty: newResDifficulty,
      description: newResDesc,
      url: newResUrl,
      estimatedHours: 6
    };
    const res = await fetch('/api/resources', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setShowAddResource(false);
      setNewResTitle('');
      setNewResUrl('');
      setNewResDesc('');
      loadAllData();
    }
  };

  const handleDeleteResource = async (id: string) => {
    if (!confirm('Are you sure you want to delete this resource?')) return;
    await fetch(`/api/resources?id=${id}`, { method: 'DELETE' });
    loadAllData();
  };

  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: newAnnTitle,
      date: 'Just Now',
      tag: newAnnTag,
      content: newAnnContent,
      author: adminSession?.email || 'Administrator'
    };
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setShowAddAnn(false);
      setNewAnnTitle('');
      setNewAnnContent('');
      loadAllData();
    }
  };

  const handleDeleteAnnouncement = async (id: string) => {
    await fetch(`/api/announcements?id=${id}`, { method: 'DELETE' });
    loadAllData();
  };

  // Server-Side Two-Factor Email OTP Dispatch Handler
  const handleSendAdminCode = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setAuthError(null);
    setAuthNotice(null);

    const trimmedEmail = adminEmail.trim().toLowerCase();
    if (!trimmedEmail) {
      setAuthError('Please enter an administrator email address.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/admin/auth/send-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail })
      });
      const data = await res.json();
      if (data.success) {
        setAdminStep('code');
        setAuthNotice(data.message);
        setCooldown(60);
      } else {
        setAuthError(data.error || 'Failed to dispatch verification code.');
        if (data.cooldownSeconds) {
          setCooldown(data.cooldownSeconds);
        }
      }
    } catch {
      setAuthError('Network error while requesting verification code. Please check connectivity.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Server-Side Two-Factor Email OTP Verification Handler
  const handleVerifyAdminOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const code = adminCode.trim();
    if (!code) {
      setAuthError('Please enter the 6-digit verification code.');
      return;
    }
    if (code.length !== 6) {
      setAuthError('Verification code must be exactly 6 digits.');
      return;
    }

    setIsVerifying(true);
    try {
      const res = await fetch('/api/admin/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: adminEmail.trim().toLowerCase(),
          otp: code
        })
      });
      const data = await res.json();
      if (data.success && data.admin) {
        setAdminSession(data.admin);
        setAuthNotice(null);
        setAuthError(null);
        loadAllData();
      } else {
        setAuthError(data.error || 'Verification code failed or expired.');
      }
    } catch {
      setAuthError('Network error during verification. Please try again.');
    } finally {
      setIsVerifying(false);
    }
  };

  // Administrator Session Termination Handler
  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setAdminSession(null);
    setAdminStep('email');
    setAdminCode('');
    setAdminEmail('');
    setAuthNotice(null);
    setAuthError(null);
  };

  // Initial session check loading indicator
  if (isCheckingSession) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center space-y-4 border-[#D4AF37]/40 shadow-xl">
          <div className="w-12 h-12 rounded-2xl bg-[#151417] text-[#E5C378] flex items-center justify-center mx-auto border border-[#D4AF37]/50 shadow-md">
            <RefreshCw className="w-6 h-6 animate-spin text-[#C89D3C]" />
          </div>
          <p className="text-xs font-semibold text-[#645E6D]">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  // If user is not authenticated as admin, render the secure Administrator Portal Verification Gate
  if (!adminSession) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="glass-card rounded-3xl p-8 sm:p-10 max-w-md w-full text-center border-[#D4AF37]/50 shadow-xl space-y-6">
          <div className="w-14 h-14 rounded-2xl bg-[#151417] text-[#E5C378] flex items-center justify-center mx-auto border border-[#D4AF37]/60 shadow-md">
            <Lock className="w-7 h-7" />
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-mono font-bold tracking-[0.24em] uppercase text-[#967223] block">
              RESTRICTED EXECUTIVE ACCESS
            </span>
            <h2 className="text-2xl font-black text-[#151417]">Admin Portal Gateway</h2>
            <p className="text-xs text-[#645E6D] leading-relaxed pt-1">
              Direct administrative access is restricted to verified club leadership with single-use two-factor email authorization.
            </p>
          </div>

          {authError && (
            <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs text-left">
              ⚠ {authError}
            </div>
          )}

          {authNotice && (
            <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs text-left">
              ✓ {authNotice}
            </div>
          )}

          {adminStep === 'email' ? (
            <form onSubmit={handleSendAdminCode} className="space-y-4 text-left">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-[#151417] mb-1.5">
                  Authorized Administrator Email
                </label>
                <input
                  type="email"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  placeholder="admin@example.com"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D8C3] bg-white text-xs text-[#151417] focus:outline-none focus:ring-2 focus:ring-[#C89D3C]"
                />
              </div>

              <button
                type="submit"
                disabled={isVerifying || cooldown > 0}
                className="w-full py-3 rounded-xl bg-[#151417] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider hover:bg-[#2A2830] transition-colors border border-[#D4AF37]/50 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isVerifying
                  ? 'Verifying Authorization...'
                  : cooldown > 0
                  ? `Resend Available in ${cooldown}s`
                  : 'Dispatch One-Time Code'}
              </button>

              <div className="text-center pt-2">
                <Link href="/" className="text-xs font-semibold text-[#8A8592] hover:text-[#151417] transition-colors">
                  ← Return to Public Website
                </Link>
              </div>
            </form>
          ) : (
            <form onSubmit={handleVerifyAdminOtp} className="space-y-4 text-left">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-[#151417]">
                    6-Digit One-Time Code
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      setAdminStep('email');
                      setAuthError(null);
                      setAuthNotice(null);
                      setAdminCode('');
                    }}
                    className="text-[11px] text-[#967223] hover:underline"
                  >
                    Change Email
                  </button>
                </div>
                <input
                  type="text"
                  maxLength={6}
                  value={adminCode}
                  onChange={(e) => setAdminCode(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="000000"
                  required
                  autoFocus
                  className="w-full px-4 py-2.5 rounded-xl border border-[#E8D8C3] bg-white text-center text-xl font-mono tracking-[0.3em] font-bold text-[#151417] focus:outline-none focus:ring-2 focus:ring-[#C89D3C]"
                />
                <p className="text-[11px] text-[#8A8592] mt-1 text-center">
                  Verification code expires in 5 minutes
                </p>
              </div>

              <button
                type="submit"
                disabled={isVerifying || adminCode.length !== 6}
                className="w-full py-3 rounded-xl bg-[#151417] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider hover:bg-[#2A2830] transition-colors border border-[#D4AF37]/50 shadow-sm cursor-pointer disabled:opacity-50"
              >
                {isVerifying ? 'Authenticating...' : 'Verify Code & Access Hub'}
              </button>

              <div className="pt-2 flex items-center justify-between text-xs">
                <button
                  type="button"
                  disabled={cooldown > 0 || isVerifying}
                  onClick={() => handleSendAdminCode()}
                  className="text-[#967223] hover:underline disabled:opacity-40 flex items-center gap-1 cursor-pointer"
                >
                  <RotateCcw className="w-3 h-3" />
                  <span>{cooldown > 0 ? `Resend code in ${cooldown}s` : 'Resend Code'}</span>
                </button>
                <Link href="/" className="text-[#8A8592] hover:text-[#151417]">
                  Cancel
                </Link>
              </div>
            </form>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Admin Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/40 bg-gradient-to-r from-white via-[#FAF7F2] to-[#F5EBDD]/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#151417] text-[#E5C378] flex items-center justify-center font-bold text-2xl border border-[#D4AF37]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#151417]">Admin Control Hub</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Authorized Executive
              </span>
            </div>
            <p className="text-xs text-[#645E6D] mt-0.5">
              Authenticated Session: <strong className="text-[#151417]">{adminSession?.email}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-[#E8D8C3] text-[#8C6B1B] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E8D8C3] text-[#151417] hover:bg-[#FAF7F2] transition-colors"
          >
            Public Site
          </Link>
          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Terminate administrator session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Status Alert Banner */}
      {statusMessage && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold flex items-center justify-between">
          <span>✓ {statusMessage}</span>
          <button onClick={() => setStatusMessage(null)} className="text-emerald-600 hover:text-emerald-900">✕</button>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8D8C3] pb-3 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: Layers },
          { id: 'applications', label: `Applications (${applications.length})`, icon: Users },
          { id: 'resources', label: `Resources (${resources.length})`, icon: BookOpen },
          { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
          { id: 'certifications', label: `Certifications (${certifications.length})`, icon: Award },
          { id: 'activities', label: `Activities (${activities.length})`, icon: Calendar },
          { id: 'announcements', label: `Announcements (${announcements.length})`, icon: Megaphone }
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

      {/* TAB 1: OVERVIEW */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Applications
              </span>
              <span className="text-3xl font-black text-[#151417]">{applications.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">
                {applications.filter((a) => a.status === 'pending').length} pending review
              </p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Total Domains
              </span>
              <span className="text-3xl font-black text-[#151417]">{DOMAINS.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">Official tracks</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Library Resources
              </span>
              <span className="text-3xl font-black text-[#151417]">{resources.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">Vetted materials</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Active Projects
              </span>
              <span className="text-3xl font-black text-[#151417]">{projects.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">Student repos</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Certifications
              </span>
              <span className="text-3xl font-black text-[#151417]">{certifications.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">Roadmap exams</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Announcements
              </span>
              <span className="text-3xl font-black text-[#151417]">{announcements.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">Live broadcasts</p>
            </div>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/30">
            <h3 className="text-xl font-bold text-[#151417] mb-2">Seven Managed Domains</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-4">
              {DOMAINS.map((d) => (
                <div
                  key={d.id}
                  className="p-3.5 rounded-xl bg-white border border-[#E8D8C3] flex items-center justify-between"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#967223]">
                      DOMAIN {d.number}
                    </span>
                    <h4 className="text-sm font-bold text-[#151417]">{d.name}</h4>
                  </div>
                  <Link
                    href={`/domains/${d.slug}`}
                    className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
                  >
                    View Hub →
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB: APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Club Membership Applications</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Review submitted candidate details, domain track interests, and decide admissions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setAppFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                    appFilter === status
                      ? 'bg-[#151417] text-[#FAF7F2]'
                      : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {status} ({status === 'all' ? applications.length : applications.filter((a) => a.status === status).length})
                </button>
              ))}
            </div>
          </div>

          {applications.filter((a) => appFilter === 'all' || a.status === appFilter).length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center border-[#E8D8C3]">
              <FileCheck className="w-10 h-10 text-[#C89D3C] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-[#151417]">No applications matching filter</p>
              <p className="text-xs text-[#645E6D] mt-1">
                Student submissions via /join will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications
                .filter((a) => appFilter === 'all' || a.status === appFilter)
                .map((app) => {
                  const domainNames = (app.domainInterests || []).map(
                    (dId) => DOMAINS.find((d) => d.id === dId)?.name || dId
                  );

                  return (
                    <div
                      key={app.id}
                      className="glass-card rounded-2xl p-5 border-[#E8D8C3] bg-white space-y-4 transition-all hover:border-[#D4AF37]/60"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2.5">
                            <h4 className="text-base font-black text-[#151417]">{app.fullName}</h4>
                            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded-md bg-[#FAF7F2] text-[#967223] border border-[#E8D8C3]">
                              {app.rollNumber}
                            </span>
                            <span
                              className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                                app.status === 'approved'
                                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                                  : app.status === 'rejected'
                                  ? 'bg-rose-100 text-rose-800 border border-rose-200'
                                  : 'bg-amber-100 text-amber-800 border border-amber-200'
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mt-2 text-xs text-[#55505C]">
                            <div>
                              <span className="font-bold text-[#8C6B1B]">Year:</span> {app.year}
                            </div>
                            <div>
                              <span className="font-bold text-[#8C6B1B]">Branch:</span> {app.branch}
                            </div>
                            <div className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#967223]" />
                              <span className="font-bold text-[#8C6B1B]">Phone:</span> {app.phoneNumber}
                            </div>
                          </div>
                        </div>

                        {/* Admin Action Buttons */}
                        <div className="flex items-center gap-2 shrink-0">
                          {app.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'approved')}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}
                          {app.status !== 'pending' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'pending')}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D] hover:bg-[#F5EBDD] transition-colors cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Domain Interests */}
                      <div className="pt-2 border-t border-[#E8D8C3]/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1.5">
                          Selected Domain Interests ({domainNames.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {domainNames.map((name, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-[10px] text-[#8A8592] flex items-center justify-between">
                        <span>Application ID: {app.id}</span>
                        <span>Submitted: {new Date(app.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RESOURCES CRUD */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#151417]">Manage Resources Library</h3>
            <button
              onClick={() => setShowAddResource(!showAddResource)}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#E5C378]" />
              <span>Add New Resource</span>
            </button>
          </div>

          {showAddResource && (
            <form
              onSubmit={handleCreateResource}
              className="glass-card rounded-3xl p-6 border-[#D4AF37] space-y-4 bg-white"
            >
              <h4 className="text-base font-bold text-[#151417]">Create New Resource Record</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Title</label>
                  <input
                    type="text"
                    required
                    value={newResTitle}
                    onChange={(e) => setNewResTitle(e.target.value)}
                    placeholder="e.g. Memory Forensics Cheat Sheet"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Domain</label>
                  <select
                    value={newResDomain}
                    onChange={(e) => setNewResDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.number} · {d.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Category</label>
                  <select
                    value={newResCategory}
                    onChange={(e) => setNewResCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    <option value="Walkthrough">Walkthrough</option>
                    <option value="Tool">Tool</option>
                    <option value="Cheat Sheet">Cheat Sheet</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Research Paper">Research Paper</option>
                  </select>
                </div>
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Difficulty</label>
                  <select
                    value={newResDifficulty}
                    onChange={(e) => setNewResDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">External URL</label>
                  <input
                    type="url"
                    required
                    value={newResUrl}
                    onChange={(e) => setNewResUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Description</label>
                  <textarea
                    rows={2}
                    required
                    value={newResDesc}
                    onChange={(e) => setNewResDesc(e.target.value)}
                    placeholder="Brief description of the material..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddResource(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830]"
                >
                  Save Resource to Database
                </button>
              </div>
            </form>
          )}

          {/* Resources Table */}
          <div className="glass-card rounded-2xl overflow-hidden border-[#E8D8C3]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EBDD] text-[#8C6B1B] font-bold uppercase tracking-wider border-b border-[#E8D8C3]">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Difficulty</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C3]/50">
                {resources.map((res) => (
                  <tr key={res.id} className="hover:bg-[#FAF7F2]/60">
                    <td className="p-3.5 font-semibold text-[#151417]">{res.title}</td>
                    <td className="p-3.5 text-[#55505C]">{res.domainName}</td>
                    <td className="p-3.5 text-[#55505C]">{res.category}</td>
                    <td className="p-3.5">
                      <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                        {res.difficulty}
                      </span>
                    </td>
                    <td className="p-3.5 text-right space-x-2">
                      <a
                        href={res.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-1 text-[#8A8592] hover:text-[#151417] inline-block"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                      <button
                        onClick={() => handleDeleteResource(res.id)}
                        className="p-1 text-rose-600 hover:text-rose-800 cursor-pointer inline-block"
                        title="Delete resource"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 6: ANNOUNCEMENTS CRUD */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#151417]">Broadcast Announcements</h3>
            <button
              onClick={() => setShowAddAnn(!showAddAnn)}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#E5C378]" />
              <span>Publish Announcement</span>
            </button>
          </div>

          {showAddAnn && (
            <form
              onSubmit={handleCreateAnnouncement}
              className="glass-card rounded-3xl p-6 border-[#D4AF37] space-y-4 bg-white"
            >
              <h4 className="text-base font-bold text-[#151417]">Publish Club Bulletin</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    placeholder="e.g. Next CTF Tournament Date Confirmed"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Tag</label>
                  <input
                    type="text"
                    required
                    value={newAnnTag}
                    onChange={(e) => setNewAnnTag(e.target.value)}
                    placeholder="e.g. Official, Competition, Workshop"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Content</label>
                  <textarea
                    rows={3}
                    required
                    value={newAnnContent}
                    onChange={(e) => setNewAnnContent(e.target.value)}
                    placeholder="Announcement details..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAnn(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830]"
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5EBDD] text-[#8C6B1B]">
                      {ann.tag}
                    </span>
                    <span className="text-[11px] text-[#8A8592]">{ann.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#151417] mt-1">{ann.title}</h4>
                  <p className="text-xs text-[#55505C] mt-1">{ann.content}</p>
                  <p className="text-[10px] text-[#8A8592] mt-2">Posted by {ann.author}</p>
                </div>
                <button
                  onClick={() => handleDeleteAnnouncement(ann.id)}
                  className="p-1.5 text-rose-600 hover:text-rose-800 cursor-pointer"
                  title="Delete announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3, 4, 5: Projects, Certifications, Activities List */}
      {(activeTab === 'projects' || activeTab === 'certifications' || activeTab === 'activities') && (
        <div className="space-y-4">
          <h3 className="text-xl font-bold text-[#151417] capitalize">
            Manage {activeTab} Records
          </h3>
          <p className="text-xs text-[#645E6D]">
            All {activeTab} records are connected to the persistent backend storage.
          </p>
          <div className="glass-card rounded-2xl p-6 border-[#E8D8C3]">
            <p className="text-xs text-[#55505C]">
              {activeTab === 'projects' && `${projects.length} student projects loaded.`}
              {activeTab === 'certifications' && `${certifications.length} certifications loaded.`}
              {activeTab === 'activities' && `${activities.length} activity formats loaded.`}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
