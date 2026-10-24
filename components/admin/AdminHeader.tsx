'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, RefreshCw, ExternalLink, LogOut, ShieldCheck } from 'lucide-react';
import { AdminTab } from './AdminSidebar';

interface AdminHeaderProps {
  activeTab: AdminTab;
  onOpenMobileSidebar: () => void;
  onRefreshData: () => void;
  isLoading: boolean;
  onLogout: () => void;
  adminUsername?: string;
}

export default function AdminHeader({
  activeTab,
  onOpenMobileSidebar,
  onRefreshData,
  isLoading,
  onLogout,
  adminUsername
}: AdminHeaderProps) {
  const titles: Record<AdminTab, { title: string; subtitle: string }> = {
    overview: {
      title: 'Executive Dashboard',
      subtitle: 'Real-time metrics, active tracks, and database activity'
    },
    enrollments: {
      title: 'Track Enrollment Management',
      subtitle: 'Review, approve, or reject student specialization track submissions'
    },
    students: {
      title: 'Student Directory',
      subtitle: 'Registered candidates, branch information, and enrollment history'
    },
    'domains-tracks': {
      title: 'Domains & Core Learning Tracks',
      subtitle: 'Manage the six specialized tracks across technical domains'
    },
    awareness: {
      title: 'Awareness CMS & Scam Alerts',
      subtitle: 'Publish weekly technology news, fortnightly cyber updates, and scam exposure guides'
    },
    subjects: {
      title: 'Foundational Learning Subjects',
      subtitle: 'Linux, Networking, Operating System, and Security Fundamentals curriculum'
    },
    resources: {
      title: 'Learning Resource Library',
      subtitle: 'Curated technical documentation, cheat sheets, labs, and walkthroughs'
    },
    certifications: {
      title: 'Certification Roadmap',
      subtitle: 'Industry-standard cybersecurity credentials mapped by domain'
    },
    projects: {
      title: 'Student Projects & Tools',
      subtitle: 'Adversarial tools, repositories, and defensive platforms'
    },
    activities: {
      title: 'Club Activities & Workshops',
      subtitle: 'Schedule of hands-on labs, CTF scrimmages, and guest seminars'
    },
    announcements: {
      title: 'Official Announcements',
      subtitle: 'Broadcast executive directives and club updates to members'
    },
    applications: {
      title: 'Club Membership Applications',
      subtitle: 'General club candidate registration submissions'
    },
    uploads: {
      title: 'Storage & Document Assets',
      subtitle: 'Upload files and host architecture diagrams in Supabase storage'
    }
  };

  const current = titles[activeTab] || {
    title: 'Management Portal',
    subtitle: 'System Administration'
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-[#E8D8C3] px-4 sm:px-8 py-4 flex items-center justify-between gap-4 shadow-2xs">
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onOpenMobileSidebar}
          className="lg:hidden p-2 rounded-xl border border-[#E8D8C3] text-[#151417] hover:bg-[#FAF7F2] transition-colors"
          aria-label="Open navigation sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#967223]">
              OXNULL Portal
            </span>
            <span className="text-[#8A8592] text-xs">•</span>
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#645E6D]">
              {activeTab}
            </span>
          </div>
          <h1 className="text-lg sm:text-xl font-black text-[#151417] tracking-tight leading-tight">
            {current.title}
          </h1>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        {/* Refresh Database Records */}
        <button
          onClick={onRefreshData}
          disabled={isLoading}
          className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white border border-[#E8D8C3] text-xs font-semibold text-[#8C6B1B] hover:bg-[#FAF7F2] hover:border-[#C89D3C] transition-all flex items-center gap-1.5 cursor-pointer shadow-2xs disabled:opacity-50"
          title="Refresh database records"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          <span className="hidden sm:inline">Refresh</span>
        </button>

        {/* View Public Website */}
        <Link
          href="/"
          className="hidden md:inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white border border-[#E8D8C3] text-xs font-semibold text-[#151417] hover:bg-[#FAF7F2] transition-colors shadow-2xs"
          title="Open public website in current tab"
        >
          <span>Public Site</span>
          <ExternalLink className="w-3.5 h-3.5 text-[#8A8592]" />
        </Link>

        {/* Sign Out */}
        <button
          onClick={onLogout}
          className="px-3 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
          title="Terminate administrator session"
        >
          <LogOut className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Sign Out</span>
        </button>
      </div>
    </header>
  );
}
