'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  CheckCircle2,
  Clock,
  XCircle,
  Eye,
  ShieldAlert,
  UserCheck,
  UserX,
  Phone,
  Mail,
  GraduationCap,
  Calendar,
  X,
  RefreshCw,
  FileText
} from 'lucide-react';
import type { TrackEnrollment } from '@/lib/store';
import { DOMAINS, getTrackById } from '@/lib/data';

interface AdminEnrollmentManagerProps {
  enrollments: TrackEnrollment[];
  onUpdateStatus: (id: string, status: 'approved' | 'rejected') => Promise<void>;
  isLoading: boolean;
}

export default function AdminEnrollmentManager({
  enrollments,
  onUpdateStatus,
  isLoading
}: AdminEnrollmentManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [domainFilter, setDomainFilter] = useState('all');
  const [selectedRecord, setSelectedRecord] = useState<TrackEnrollment | null>(null);
  const [isMutatingId, setIsMutatingId] = useState<string | null>(null);

  // Filtered list
  const filteredEnrollments = useMemo(() => {
    return enrollments.filter((enr) => {
      // Status filter
      if (statusFilter !== 'all' && enr.status !== statusFilter) return false;

      // Domain filter
      if (domainFilter !== 'all' && enr.domainId !== domainFilter) return false;

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = enr.fullName?.toLowerCase().includes(q);
        const matchesRoll = enr.rollNumber?.toLowerCase().includes(q);
        const matchesEmail = enr.email?.toLowerCase().includes(q);
        const matchesTrack = enr.trackTitle?.toLowerCase().includes(q);
        const matchesDomain = enr.domainName?.toLowerCase().includes(q);
        if (!matchesName && !matchesRoll && !matchesEmail && !matchesTrack && !matchesDomain) {
          return false;
        }
      }

      return true;
    });
  }, [enrollments, statusFilter, domainFilter, searchQuery]);

  const handleStatusChange = async (id: string, status: 'approved' | 'rejected') => {
    setIsMutatingId(id);
    try {
      await onUpdateStatus(id, status);
      // If modal open for this record, update local modal state too
      if (selectedRecord && selectedRecord.id === id) {
        setSelectedRecord((prev) => (prev ? { ...prev, status } : null));
      }
    } finally {
      setIsMutatingId(null);
    }
  };

  const pendingCount = enrollments.filter((e) => e.status === 'pending').length;
  const approvedCount = enrollments.filter((e) => e.status === 'approved').length;
  const rejectedCount = enrollments.filter((e) => e.status === 'rejected').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Top Filter Bar */}
      <div className="glass-card rounded-3xl p-6 border-[#E8D8C3] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll number, track, or domain..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-[#E8D8C3] bg-white text-xs text-[#151417] outline-none focus:border-[#C89D3C] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8A8592] hover:text-[#151417]"
              >
                ✕
              </button>
            )}
          </div>

          {/* Domain Filter Dropdown */}
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-[#8C6B1B] shrink-0" />
            <select
              value={domainFilter}
              onChange={(e) => setDomainFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-[#E8D8C3] bg-white text-xs font-medium text-[#151417] outline-none focus:border-[#C89D3C] cursor-pointer"
            >
              <option value="all">All Domains ({DOMAINS.length})</option>
              {DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  Domain {d.number}: {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Pills & Counts */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2 border-t border-[#E8D8C3]/50">
          <div className="flex items-center gap-1.5 text-xs font-bold">
            <button
              onClick={() => setStatusFilter('all')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                statusFilter === 'all'
                  ? 'bg-[#151417] text-[#FAF7F2]'
                  : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
              }`}
            >
              All ({enrollments.length})
            </button>
            <button
              onClick={() => setStatusFilter('pending')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'pending'
                  ? 'bg-amber-600 text-white'
                  : 'bg-white border border-[#E8D8C3] text-amber-800 hover:bg-amber-50'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              <span>Pending ({pendingCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('approved')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer flex items-center gap-1.5 ${
                statusFilter === 'approved'
                  ? 'bg-emerald-600 text-white'
                  : 'bg-white border border-[#E8D8C3] text-emerald-800 hover:bg-emerald-50'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approved ({approvedCount})</span>
            </button>
            <button
              onClick={() => setStatusFilter('rejected')}
              className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${
                statusFilter === 'rejected'
                  ? 'bg-rose-600 text-white'
                  : 'bg-white border border-[#E8D8C3] text-rose-800 hover:bg-rose-50'
              }`}
            >
              Rejected ({rejectedCount})
            </button>
          </div>

          <div className="text-[11px] text-[#8A8592] font-mono">
            Showing {filteredEnrollments.length} of {enrollments.length} record(s)
          </div>
        </div>
      </div>

      {/* Main Records Table */}
      <div className="glass-card rounded-3xl p-6 border-[#E8D8C3] overflow-hidden">
        {filteredEnrollments.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8A8592] space-y-2">
            <ShieldAlert className="w-8 h-8 mx-auto text-[#C89D3C] opacity-50" />
            <p className="font-bold text-sm text-[#151417]">No Matching Enrollment Records Found</p>
            <p className="text-[#645E6D]">
              {searchQuery || domainFilter !== 'all' || statusFilter !== 'all'
                ? 'Try adjusting your search query or status filter.'
                : 'Student track enrollments will populate here automatically upon submission.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8D8C3] text-[10px] uppercase font-bold text-[#8A8592]">
                  <th className="pb-3 pr-3 font-mono">Student Profile</th>
                  <th className="pb-3 pr-3">Domain / Track</th>
                  <th className="pb-3 pr-3">Academic Info</th>
                  <th className="pb-3 pr-3">Submitted</th>
                  <th className="pb-3 pr-3">Status</th>
                  <th className="pb-3 pr-3">Audit Review</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C3]/50">
                {filteredEnrollments.map((enr) => {
                  const isMutating = isMutatingId === enr.id;
                  return (
                    <tr key={enr.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                      {/* Student Profile */}
                      <td className="py-3.5 pr-3">
                        <div className="font-bold text-[#151417]">{enr.fullName}</div>
                        <div className="font-mono text-[11px] text-[#967223] font-semibold">
                          {enr.rollNumber}
                        </div>
                        <div className="text-[10px] text-[#8A8592]">{enr.email}</div>
                      </td>

                      {/* Domain / Track */}
                      <td className="py-3.5 pr-3">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#967223] block">
                          {enr.domainName}
                        </span>
                        <div className="font-bold text-[#151417] leading-snug">{enr.trackTitle}</div>
                      </td>

                      {/* Academic Info */}
                      <td className="py-3.5 pr-3 text-[#55505C]">
                        <div className="font-medium text-[#151417]">{enr.year}</div>
                        <div className="text-[10px] text-[#8A8592] truncate max-w-[140px]">{enr.branch}</div>
                      </td>

                      {/* Date */}
                      <td className="py-3.5 pr-3 text-[#645E6D] whitespace-nowrap">
                        {new Date(enr.createdAt).toLocaleDateString()}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 pr-3">
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
                            <XCircle className="w-3 h-3 text-rose-600" />
                            <span>Rejected</span>
                          </span>
                        )}
                      </td>

                      {/* Audit Trail */}
                      <td className="py-3.5 pr-3 text-[11px] text-[#8A8592]">
                        {enr.reviewedBy ? (
                          <div>
                            <span className="font-semibold text-[#151417]">{enr.reviewedBy}</span>
                            {enr.reviewedAt && (
                              <div className="text-[10px]">
                                {new Date(enr.reviewedAt).toLocaleDateString()}
                              </div>
                            )}
                          </div>
                        ) : (
                          <span className="text-[#A69FA8] italic">Unreviewed</span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 text-right whitespace-nowrap">
                        <div className="inline-flex items-center gap-1.5">
                          <button
                            onClick={() => setSelectedRecord(enr)}
                            className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white hover:bg-[#FAF7F2] text-[#151417] transition-colors cursor-pointer"
                            title="View full record details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>

                          {enr.status !== 'approved' && (
                            <button
                              onClick={() => handleStatusChange(enr.id, 'approved')}
                              disabled={isMutating}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              title="Approve enrollment"
                            >
                              <UserCheck className="w-3 h-3" />
                              <span>Approve</span>
                            </button>
                          )}

                          {enr.status !== 'rejected' && (
                            <button
                              onClick={() => handleStatusChange(enr.id, 'rejected')}
                              disabled={isMutating}
                              className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-1 cursor-pointer disabled:opacity-50"
                              title="Reject enrollment"
                            >
                              <UserX className="w-3 h-3" />
                              <span>Reject</span>
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* DETAILED ENROLLMENT RECORD MODAL */}
      {selectedRecord && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E8D8C3] pb-4">
              <div>
                <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#967223] block">
                  Enrollment Record • ID: {selectedRecord.id}
                </span>
                <h3 className="text-xl font-black text-[#151417]">
                  {selectedRecord.fullName}
                </h3>
                <p className="text-xs text-[#645E6D]">
                  Application to {selectedRecord.trackTitle} ({selectedRecord.domainName})
                </p>
              </div>

              <button
                onClick={() => setSelectedRecord(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Current Status Banner */}
            <div
              className={`p-4 rounded-2xl border flex items-center justify-between ${
                selectedRecord.status === 'approved'
                  ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                  : selectedRecord.status === 'rejected'
                  ? 'bg-rose-50 border-rose-200 text-rose-800'
                  : 'bg-amber-50 border-amber-200 text-amber-800'
              }`}
            >
              <div className="flex items-center gap-2">
                {selectedRecord.status === 'approved' && <CheckCircle2 className="w-5 h-5 text-emerald-600" />}
                {selectedRecord.status === 'pending' && <Clock className="w-5 h-5 text-amber-600" />}
                {selectedRecord.status === 'rejected' && <XCircle className="w-5 h-5 text-rose-600" />}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Current Status: {selectedRecord.status}
                  </h4>
                  <p className="text-[11px] opacity-80">
                    {selectedRecord.reviewedBy
                      ? `Reviewed by ${selectedRecord.reviewedBy} on ${new Date(
                          selectedRecord.reviewedAt || Date.now()
                        ).toLocaleString()}`
                      : 'Pending administrative action'}
                  </p>
                </div>
              </div>

              {/* Status toggle actions inside modal */}
              <div className="flex items-center gap-2">
                {selectedRecord.status !== 'approved' && (
                  <button
                    onClick={() => handleStatusChange(selectedRecord.id, 'approved')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Approve</span>
                  </button>
                )}
                {selectedRecord.status !== 'rejected' && (
                  <button
                    onClick={() => handleStatusChange(selectedRecord.id, 'rejected')}
                    className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                  >
                    <UserX className="w-3.5 h-3.5" />
                    <span>Reject</span>
                  </button>
                )}
              </div>
            </div>

            {/* Candidate & Track Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              {/* Student Details Card */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#967223] block">
                  Student Information
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between border-b border-[#E8D8C3]/50 pb-1">
                    <span className="text-[#8A8592]">Full Name:</span>
                    <strong className="text-[#151417]">{selectedRecord.fullName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#E8D8C3]/50 pb-1">
                    <span className="text-[#8A8592]">Roll Number:</span>
                    <strong className="font-mono text-[#151417]">{selectedRecord.rollNumber}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#E8D8C3]/50 pb-1">
                    <span className="text-[#8A8592]">Academic Year:</span>
                    <span className="font-medium text-[#151417]">{selectedRecord.year}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E8D8C3]/50 pb-1">
                    <span className="text-[#8A8592]">Department:</span>
                    <span className="font-medium text-[#151417] truncate max-w-[150px]">{selectedRecord.branch}</span>
                  </div>
                  <div className="flex justify-between border-b border-[#E8D8C3]/50 pb-1">
                    <span className="text-[#8A8592]">Contact Phone:</span>
                    <span className="font-medium text-[#151417]">{selectedRecord.phoneNumber}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8592]">Email Address:</span>
                    <span className="font-medium text-[#151417]">{selectedRecord.email}</span>
                  </div>
                </div>
              </div>

              {/* Track Details Card */}
              <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-2.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#967223] block">
                  Track Details
                </span>
                <div className="space-y-1.5">
                  <div className="flex justify-between border-b border-[#E8D8C3]/50 pb-1">
                    <span className="text-[#8A8592]">Domain:</span>
                    <strong className="text-[#151417]">{selectedRecord.domainName}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#E8D8C3]/50 pb-1">
                    <span className="text-[#8A8592]">Core Track:</span>
                    <strong className="text-[#151417]">{selectedRecord.trackTitle}</strong>
                  </div>
                  <div className="flex justify-between border-b border-[#E8D8C3]/50 pb-1">
                    <span className="text-[#8A8592]">Submission Date:</span>
                    <span className="text-[#151417]">{new Date(selectedRecord.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-[#8A8592]">User Account ID:</span>
                    <span className="font-mono text-[10px] text-[#8A8592]">{selectedRecord.userId}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Statement of Interest (if student provided) */}
            {selectedRecord.statement && (
              <div className="p-4 rounded-2xl bg-white border border-[#E8D8C3] space-y-1.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#967223] block">
                  Student Statement / Objectives
                </span>
                <p className="text-xs text-[#2A2830] leading-relaxed italic bg-[#FAF7F2] p-3 rounded-xl border border-[#E8D8C3]/50">
                  &ldquo;{selectedRecord.statement}&rdquo;
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-[#E8D8C3]">
              <button
                type="button"
                onClick={() => setSelectedRecord(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] cursor-pointer"
              >
                Close Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
