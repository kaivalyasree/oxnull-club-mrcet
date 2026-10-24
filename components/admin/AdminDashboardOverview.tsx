'use client';

import React from 'react';
import {
  ShieldAlert,
  Users,
  Compass,
  CheckCircle2,
  Clock,
  BookOpen,
  ArrowRight,
  Plus,
  Award,
  Terminal,
  Upload,
  Layers,
  ChevronRight
} from 'lucide-react';
import type { TrackEnrollment } from '@/lib/store';
import { AdminTab } from './AdminSidebar';

interface AdminDashboardOverviewProps {
  enrollments: TrackEnrollment[];
  studentsCount: number;
  domainsCount: number;
  tracksCount: number;
  resourcesCount: number;
  certificationsCount: number;
  projectsCount: number;
  setActiveTab: (tab: AdminTab) => void;
  onOpenAddResource: () => void;
  onOpenAddCert: () => void;
  onOpenAddProject: () => void;
}

export default function AdminDashboardOverview({
  enrollments,
  studentsCount,
  domainsCount,
  tracksCount,
  resourcesCount,
  certificationsCount,
  projectsCount,
  setActiveTab,
  onOpenAddResource,
  onOpenAddCert,
  onOpenAddProject
}: AdminDashboardOverviewProps) {
  const pendingEnrollments = enrollments.filter((e) => e.status === 'pending');
  const approvedEnrollments = enrollments.filter((e) => e.status === 'approved');
  const recentEnrollments = [...enrollments]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Pending Enrollments Callout Banner (if any pending) */}
      {pendingEnrollments.length > 0 && (
        <div className="p-5 rounded-2xl bg-gradient-to-r from-amber-500/10 via-amber-500/5 to-transparent border border-amber-300 flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-lg shrink-0 shadow-sm">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#151417]">
                {pendingEnrollments.length} Pending Track Enrollment{pendingEnrollments.length > 1 ? 's' : ''} Require Review
              </h4>
              <p className="text-xs text-[#645E6D]">
                Students have submitted applications to join inner cybersecurity specialization tracks.
              </p>
            </div>
          </div>
          <button
            onClick={() => setActiveTab('enrollments')}
            className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors flex items-center gap-2 shrink-0 cursor-pointer shadow-xs"
          >
            <span>Review Enrollments</span>
            <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
          </button>
        </div>
      )}

      {/* Primary KPI Metrics Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Track Enrollments */}
        <div
          onClick={() => setActiveTab('enrollments')}
          className="glass-card rounded-2xl p-5 border-[#E8D8C3] hover:border-[#C89D3C] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8A8592]">
              Track Enrollments
            </span>
            <div className="p-1.5 rounded-lg bg-[#FAF7F2] text-[#8C6B1B] group-hover:scale-110 transition-transform">
              <ShieldAlert className="w-4 h-4 text-[#C89D3C]" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#151417] tracking-tight">
            {enrollments.length}
          </div>
          <div className="mt-2 flex items-center gap-2 text-[11px] font-semibold">
            <span className="text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
              {approvedEnrollments.length} Approved
            </span>
            <span className="text-amber-800 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
              {pendingEnrollments.length} Pending
            </span>
          </div>
        </div>

        {/* Metric 2: Registered Students */}
        <div
          onClick={() => setActiveTab('students')}
          className="glass-card rounded-2xl p-5 border-[#E8D8C3] hover:border-[#C89D3C] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8A8592]">
              Registered Students
            </span>
            <div className="p-1.5 rounded-lg bg-[#FAF7F2] text-[#8C6B1B] group-hover:scale-110 transition-transform">
              <Users className="w-4 h-4 text-[#C89D3C]" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#151417] tracking-tight">
            {studentsCount}
          </div>
          <p className="mt-2 text-[11px] text-[#645E6D]">
            Unique college candidates recorded in Supabase / store
          </p>
        </div>

        {/* Metric 3: Domains & Tracks */}
        <div
          onClick={() => setActiveTab('domains-tracks')}
          className="glass-card rounded-2xl p-5 border-[#E8D8C3] hover:border-[#C89D3C] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8A8592]">
              Domains & Tracks
            </span>
            <div className="p-1.5 rounded-lg bg-[#FAF7F2] text-[#8C6B1B] group-hover:scale-110 transition-transform">
              <Compass className="w-4 h-4 text-[#C89D3C]" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#151417] tracking-tight">
            {domainsCount} Domains
          </div>
          <p className="mt-2 text-[11px] text-[#8C6B1B] font-semibold">
            {tracksCount} Core Specialization Tracks Active
          </p>
        </div>

        {/* Metric 4: CMS Content Library */}
        <div
          onClick={() => setActiveTab('resources')}
          className="glass-card rounded-2xl p-5 border-[#E8D8C3] hover:border-[#C89D3C] cursor-pointer transition-all group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8A8592]">
              Content Library
            </span>
            <div className="p-1.5 rounded-lg bg-[#FAF7F2] text-[#8C6B1B] group-hover:scale-110 transition-transform">
              <BookOpen className="w-4 h-4 text-[#C89D3C]" />
            </div>
          </div>
          <div className="text-3xl font-black text-[#151417] tracking-tight">
            {resourcesCount + certificationsCount + projectsCount}
          </div>
          <p className="mt-2 text-[11px] text-[#645E6D]">
            {resourcesCount} Resources • {certificationsCount} Certs • {projectsCount} Projects
          </p>
        </div>
      </div>

      {/* Recent Enrollment Activity Section */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#E8D8C3] space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-black text-[#151417]">Recent Track Enrollments</h3>
            <p className="text-xs text-[#645E6D]">
              Real database-backed submissions from verified students across the 7 domains.
            </p>
          </div>
          <button
            onClick={() => setActiveTab('enrollments')}
            className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417] inline-flex items-center gap-1 cursor-pointer"
          >
            <span>View All ({enrollments.length})</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentEnrollments.length === 0 ? (
          <div className="py-10 text-center text-xs text-[#8A8592] rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3]">
            No track enrollments recorded yet. Once students select tracks on domain pages, submissions will appear here.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8D8C3] text-[10px] uppercase font-bold text-[#8A8592]">
                  <th className="pb-3 font-mono">Student Name / Roll</th>
                  <th className="pb-3">Domain</th>
                  <th className="pb-3">Selected Track</th>
                  <th className="pb-3">Submitted</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C3]/50">
                {recentEnrollments.map((enr) => (
                  <tr key={enr.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3 pr-3">
                      <div className="font-bold text-[#151417]">{enr.fullName}</div>
                      <div className="font-mono text-[11px] text-[#8A8592]">{enr.rollNumber}</div>
                    </td>
                    <td className="py-3 pr-3 text-[#645E6D]">{enr.domainName}</td>
                    <td className="py-3 pr-3 font-semibold text-[#151417]">{enr.trackTitle}</td>
                    <td className="py-3 pr-3 text-[#8A8592] whitespace-nowrap">
                      {new Date(enr.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3 pr-3">
                      {enr.status === 'approved' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-emerald-50 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Approved</span>
                        </span>
                      )}
                      {enr.status === 'pending' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-amber-50 text-amber-800 border border-amber-200">
                          <Clock className="w-3 h-3 text-amber-600" />
                          <span>Pending</span>
                        </span>
                      )}
                      {enr.status === 'rejected' && (
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider bg-rose-50 text-rose-800 border border-rose-200">
                          <span>Rejected</span>
                        </span>
                      )}
                    </td>
                    <td className="py-3 text-right">
                      <button
                        onClick={() => setActiveTab('enrollments')}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-[#151417] text-white hover:bg-[#2A2830] transition-colors cursor-pointer"
                      >
                        Manage
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Action Navigation Grid */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#E8D8C3] space-y-4">
        <div>
          <h3 className="text-lg font-black text-[#151417]">Administrative Quick Actions</h3>
          <p className="text-xs text-[#55505C]">
            Directly invoke verified operations across curriculum, domains, and multimedia assets.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 pt-2">
          <button
            onClick={() => setActiveTab('enrollments')}
            className="p-4 rounded-2xl border border-[#E8D8C3] bg-white hover:border-[#C89D3C] hover:bg-[#FAF7F2] transition-all text-center space-y-2 cursor-pointer shadow-2xs group"
          >
            <ShieldAlert className="w-5 h-5 mx-auto text-[#C89D3C] group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-[#151417]">Enrollments</span>
          </button>

          <button
            onClick={() => setActiveTab('domains-tracks')}
            className="p-4 rounded-2xl border border-[#E8D8C3] bg-white hover:border-[#C89D3C] hover:bg-[#FAF7F2] transition-all text-center space-y-2 cursor-pointer shadow-2xs group"
          >
            <Compass className="w-5 h-5 mx-auto text-[#C89D3C] group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-[#151417]">Tracks & Domains</span>
          </button>

          <button
            onClick={onOpenAddResource}
            className="p-4 rounded-2xl border border-[#E8D8C3] bg-white hover:border-[#C89D3C] hover:bg-[#FAF7F2] transition-all text-center space-y-2 cursor-pointer shadow-2xs group"
          >
            <BookOpen className="w-5 h-5 mx-auto text-[#C89D3C] group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-[#151417]">Add Resource</span>
          </button>

          <button
            onClick={onOpenAddCert}
            className="p-4 rounded-2xl border border-[#E8D8C3] bg-white hover:border-[#C89D3C] hover:bg-[#FAF7F2] transition-all text-center space-y-2 cursor-pointer shadow-2xs group"
          >
            <Award className="w-5 h-5 mx-auto text-[#C89D3C] group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-[#151417]">Add Cert</span>
          </button>

          <button
            onClick={() => setActiveTab('subjects')}
            className="p-4 rounded-2xl border border-[#E8D8C3] bg-white hover:border-[#C89D3C] hover:bg-[#FAF7F2] transition-all text-center space-y-2 cursor-pointer shadow-2xs group"
          >
            <Terminal className="w-5 h-5 mx-auto text-[#C89D3C] group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-[#151417]">Syllabus</span>
          </button>

          <button
            onClick={() => setActiveTab('uploads')}
            className="p-4 rounded-2xl border border-[#E8D8C3] bg-white hover:border-[#C89D3C] hover:bg-[#FAF7F2] transition-all text-center space-y-2 cursor-pointer shadow-2xs group"
          >
            <Upload className="w-5 h-5 mx-auto text-[#C89D3C] group-hover:scale-110 transition-transform" />
            <span className="block text-xs font-bold text-[#151417]">Upload Assets</span>
          </button>
        </div>
      </div>
    </div>
  );
}
