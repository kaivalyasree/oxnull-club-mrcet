'use client';

import React from 'react';
import Image from 'next/image';
import {
  Layers,
  ShieldAlert,
  Users,
  Compass,
  BookOpen,
  Award,
  FolderGit2,
  Terminal,
  Calendar,
  Megaphone,
  Upload,
  UserCheck,
  X,
  LogOut,
  ExternalLink,
  ShieldCheck
} from 'lucide-react';

export type AdminTab =
  | 'overview'
  | 'enrollments'
  | 'students'
  | 'domains-tracks'
  | 'resources'
  | 'certifications'
  | 'projects'
  | 'subjects'
  | 'activities'
  | 'announcements'
  | 'applications'
  | 'uploads';

interface AdminSidebarProps {
  activeTab: AdminTab;
  setActiveTab: (tab: AdminTab) => void;
  mobileOpen: boolean;
  setMobileOpen: (open: boolean) => void;
  adminUsername?: string;
  pendingEnrollmentsCount: number;
  totalEnrollmentsCount: number;
  pendingApplicationsCount: number;
  resourcesCount: number;
  certificationsCount: number;
  projectsCount: number;
  onLogout: () => void;
}

export default function AdminSidebar({
  activeTab,
  setActiveTab,
  mobileOpen,
  setMobileOpen,
  adminUsername,
  pendingEnrollmentsCount,
  totalEnrollmentsCount,
  pendingApplicationsCount,
  resourcesCount,
  certificationsCount,
  projectsCount,
  onLogout
}: AdminSidebarProps) {
  const navSections = [
    {
      group: 'Core Operations',
      items: [
        {
          id: 'overview' as AdminTab,
          label: 'Dashboard Overview',
          icon: Layers
        },
        {
          id: 'enrollments' as AdminTab,
          label: 'Track Enrollments',
          icon: ShieldAlert,
          badge: pendingEnrollmentsCount > 0 ? `${pendingEnrollmentsCount} pending` : `${totalEnrollmentsCount}`,
          badgeVariant: pendingEnrollmentsCount > 0 ? 'amber' : 'neutral'
        },
        {
          id: 'students' as AdminTab,
          label: 'Student Directory',
          icon: Users
        },
        {
          id: 'domains-tracks' as AdminTab,
          label: 'Domains & Tracks',
          icon: Compass,
          badge: '7 Domains'
        }
      ]
    },
    {
      group: 'Curriculum & Content',
      items: [
        {
          id: 'subjects' as AdminTab,
          label: 'Learn Subjects',
          icon: Terminal,
          badge: '4 Core'
        },
        {
          id: 'resources' as AdminTab,
          label: 'Learning Resources',
          icon: BookOpen,
          badge: `${resourcesCount}`
        },
        {
          id: 'certifications' as AdminTab,
          label: 'Certifications',
          icon: Award,
          badge: `${certificationsCount}`
        },
        {
          id: 'projects' as AdminTab,
          label: 'Student Projects',
          icon: FolderGit2,
          badge: `${projectsCount}`
        },
        {
          id: 'activities' as AdminTab,
          label: 'Club Activities',
          icon: Calendar
        },
        {
          id: 'announcements' as AdminTab,
          label: 'Announcements',
          icon: Megaphone
        }
      ]
    },
    {
      group: 'Administration',
      items: [
        {
          id: 'applications' as AdminTab,
          label: 'Club Registrations',
          icon: UserCheck,
          badge: pendingApplicationsCount > 0 ? `${pendingApplicationsCount} new` : undefined,
          badgeVariant: 'amber'
        },
        {
          id: 'uploads' as AdminTab,
          label: 'Storage & Assets',
          icon: Upload
        }
      ]
    }
  ];

  const handleSelectTab = (tab: AdminTab) => {
    setActiveTab(tab);
    setMobileOpen(false);
  };

  const sidebarContent = (
    <div className="flex flex-col h-full bg-[#151417] text-[#FAF7F2] border-r border-[#2A2830]">
      {/* Brand Header */}
      <div className="p-6 border-b border-[#2A2830] flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/5 border border-[#D4AF37]/40 flex items-center justify-center p-1.5 shadow-sm">
            <Image
              src="/assets/0xnull-symbol.png"
              alt="0XNULL"
              width={32}
              height={32}
              className="object-contain"
            />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-mono font-black text-sm tracking-wider text-white">0XNULL</span>
              <span className="text-[10px] uppercase font-bold tracking-widest px-1.5 py-0.5 rounded bg-[#C89D3C]/20 text-[#E5C378] border border-[#C89D3C]/40">
                Admin
              </span>
            </div>
            <p className="text-[10px] text-[#A69FA8] font-mono">Executive Portal</p>
          </div>
        </div>

        {/* Mobile close button */}
        <button
          onClick={() => setMobileOpen(false)}
          className="lg:hidden p-1.5 rounded-lg text-[#A69FA8] hover:text-white hover:bg-white/10"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto px-4 py-5 space-y-6">
        {navSections.map((section, idx) => (
          <div key={idx} className="space-y-1.5">
            <h4 className="px-3 text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#C89D3C]">
              {section.group}
            </h4>
            <div className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleSelectTab(item.id)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all cursor-pointer text-left ${
                      isActive
                        ? 'bg-[#C89D3C] text-[#151417] shadow-sm font-bold'
                        : 'text-[#D8D2DC] hover:bg-white/5 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-[#151417]' : 'text-[#C89D3C]'}`} />
                      <span>{item.label}</span>
                    </div>

                    {item.badge && (
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded-full font-mono font-bold ${
                          isActive
                            ? 'bg-[#151417] text-[#FAF7F2]'
                            : item.badgeVariant === 'amber'
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                            : 'bg-white/10 text-[#D8D2DC]'
                        }`}
                      >
                        {item.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Admin User Footer Card */}
      <div className="p-4 border-t border-[#2A2830] bg-black/20">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="w-8 h-8 rounded-lg bg-[#C89D3C]/20 border border-[#C89D3C]/40 text-[#E5C378] flex items-center justify-center font-bold text-xs shrink-0">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <p className="text-xs font-bold text-white truncate">
                {adminUsername || 'Administrator'}
              </p>
              <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                Verified Session
              </span>
            </div>
          </div>

          <button
            onClick={onLogout}
            title="Terminate administrator session"
            className="p-2 rounded-lg bg-white/5 hover:bg-rose-500/20 text-[#A69FA8] hover:text-rose-300 transition-colors cursor-pointer shrink-0"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Persistent Sidebar */}
      <aside className="hidden lg:block w-72 shrink-0 h-screen sticky top-0 overflow-hidden">
        {sidebarContent}
      </aside>

      {/* Mobile Drawer Overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileOpen(false)}
          />
          <div className="relative w-72 max-w-[85vw] h-full z-10 animate-in slide-in-from-left duration-300">
            {sidebarContent}
          </div>
        </div>
      )}
    </>
  );
}
