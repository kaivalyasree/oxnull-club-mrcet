'use client';

import React, { useState, useMemo } from 'react';
import {
  Search,
  Filter,
  Users,
  Eye,
  GraduationCap,
  BookOpen,
  Phone,
  Mail,
  ShieldAlert,
  CheckCircle2,
  Clock,
  XCircle,
  X
} from 'lucide-react';

interface StudentRecord {
  userId: string;
  fullName: string;
  email: string;
  rollNumber: string;
  academicYear: string;
  branch: string;
  phoneNumber: string;
  registeredAt: string;
  enrollments: Array<{
    id: string;
    domainName: string;
    trackName: string;
    status: string;
    createdAt: string;
    reviewedAt?: string;
    reviewedBy?: string;
  }>;
}

interface AdminStudentManagerProps {
  students: StudentRecord[];
  isLoading: boolean;
}

export default function AdminStudentManager({
  students,
  isLoading
}: AdminStudentManagerProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [yearFilter, setYearFilter] = useState('all');
  const [branchFilter, setBranchFilter] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<StudentRecord | null>(null);

  // Derive unique years & branches
  const years = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.academicYear && set.add(s.academicYear));
    return Array.from(set);
  }, [students]);

  const branches = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => s.branch && set.add(s.branch));
    return Array.from(set);
  }, [students]);

  // Filtered students
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      if (yearFilter !== 'all' && s.academicYear !== yearFilter) return false;
      if (branchFilter !== 'all' && s.branch !== branchFilter) return false;

      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = s.fullName?.toLowerCase().includes(q);
        const matchesRoll = s.rollNumber?.toLowerCase().includes(q);
        const matchesEmail = s.email?.toLowerCase().includes(q);
        const matchesBranch = s.branch?.toLowerCase().includes(q);
        if (!matchesName && !matchesRoll && !matchesEmail && !matchesBranch) {
          return false;
        }
      }

      return true;
    });
  }, [students, yearFilter, branchFilter, searchQuery]);

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Filter Bar */}
      <div className="glass-card rounded-3xl p-6 border-[#E8D8C3] space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by student name, roll number, or department..."
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

          {/* Filter Dropdowns */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Year Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#8A8592] font-semibold">Year:</span>
              <select
                value={yearFilter}
                onChange={(e) => setYearFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E8D8C3] bg-white text-xs font-medium text-[#151417] outline-none focus:border-[#C89D3C] cursor-pointer"
              >
                <option value="all">All Years</option>
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
            </div>

            {/* Branch Filter */}
            <div className="flex items-center gap-1.5 text-xs">
              <span className="text-[#8A8592] font-semibold">Branch:</span>
              <select
                value={branchFilter}
                onChange={(e) => setBranchFilter(e.target.value)}
                className="px-3 py-2 rounded-xl border border-[#E8D8C3] bg-white text-xs font-medium text-[#151417] outline-none focus:border-[#C89D3C] cursor-pointer"
              >
                <option value="all">All Departments</option>
                {branches.map((b) => (
                  <option key={b} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-[#8A8592] font-mono pt-2 border-t border-[#E8D8C3]/50">
          Showing {filteredStudents.length} of {students.length} student record(s)
        </div>
      </div>

      {/* Student Directory Table */}
      <div className="glass-card rounded-3xl p-6 border-[#E8D8C3] overflow-hidden">
        {filteredStudents.length === 0 ? (
          <div className="py-16 text-center text-xs text-[#8A8592] space-y-2">
            <Users className="w-8 h-8 mx-auto text-[#C89D3C] opacity-50" />
            <p className="font-bold text-sm text-[#151417]">No Students Found</p>
            <p className="text-[#645E6D]">
              {searchQuery || yearFilter !== 'all' || branchFilter !== 'all'
                ? 'Try adjusting your search criteria.'
                : 'Registered student profiles will appear here.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#E8D8C3] text-[10px] uppercase font-bold text-[#8A8592]">
                  <th className="pb-3 pr-3 font-mono">Student Name / Roll</th>
                  <th className="pb-3 pr-3">Academic Department</th>
                  <th className="pb-3 pr-3">Contact</th>
                  <th className="pb-3 pr-3">Enrolled Tracks</th>
                  <th className="pb-3 pr-3">Registered Date</th>
                  <th className="pb-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C3]/50">
                {filteredStudents.map((s) => (
                  <tr key={s.userId || s.rollNumber} className="hover:bg-[#FAF7F2]/60 transition-colors">
                    <td className="py-3.5 pr-3">
                      <div className="font-bold text-[#151417]">{s.fullName}</div>
                      <div className="font-mono text-[11px] text-[#967223] font-semibold">
                        {s.rollNumber}
                      </div>
                    </td>

                    <td className="py-3.5 pr-3 text-[#55505C]">
                      <div className="font-semibold text-[#151417]">{s.branch}</div>
                      <div className="text-[10px] text-[#8A8592]">{s.academicYear}</div>
                    </td>

                    <td className="py-3.5 pr-3 text-[#645E6D]">
                      <div>{s.email}</div>
                      <div className="text-[10px] text-[#8A8592]">{s.phoneNumber}</div>
                    </td>

                    <td className="py-3.5 pr-3">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                        {s.enrollments?.length || 0} Track(s)
                      </span>
                    </td>

                    <td className="py-3.5 pr-3 text-[#8A8592] whitespace-nowrap">
                      {new Date(s.registeredAt).toLocaleDateString()}
                    </td>

                    <td className="py-3.5 text-right whitespace-nowrap">
                      <button
                        onClick={() => setSelectedStudent(s)}
                        className="px-3 py-1 rounded-lg text-xs font-bold bg-white border border-[#E8D8C3] hover:border-[#C89D3C] text-[#151417] hover:bg-[#FAF7F2] transition-colors inline-flex items-center gap-1.5 cursor-pointer shadow-2xs"
                      >
                        <Eye className="w-3.5 h-3.5 text-[#C89D3C]" />
                        <span>Details</span>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* STUDENT DETAILS & ENROLLMENT HISTORY MODAL */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-[#E8D8C3] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#151417] text-[#FAF7F2] font-bold text-lg flex items-center justify-center border border-[#D4AF37]">
                  {selectedStudent.fullName[0]?.toUpperCase()}
                </div>
                <div>
                  <h3 className="text-xl font-black text-[#151417]">
                    {selectedStudent.fullName}
                  </h3>
                  <p className="text-xs text-[#645E6D] font-mono">
                    Roll: <strong className="text-[#967223]">{selectedStudent.rollNumber}</strong> • {selectedStudent.branch} ({selectedStudent.academicYear})
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedStudent(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Contact Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3] flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#C89D3C] shrink-0" />
                <div className="truncate">
                  <span className="text-[10px] text-[#8A8592] block">Verified Email</span>
                  <span className="font-semibold text-[#151417] truncate">{selectedStudent.email}</span>
                </div>
              </div>

              <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3] flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#C89D3C] shrink-0" />
                <div>
                  <span className="text-[10px] text-[#8A8592] block">Contact Number</span>
                  <span className="font-semibold text-[#151417]">{selectedStudent.phoneNumber}</span>
                </div>
              </div>
            </div>

            {/* Enrollment History */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#967223]">
                  Track Enrollment History ({selectedStudent.enrollments?.length || 0})
                </h4>
              </div>

              {selectedStudent.enrollments?.length === 0 ? (
                <div className="p-6 text-center text-xs text-[#8A8592] rounded-xl bg-[#FAF7F2] border border-[#E8D8C3]">
                  No specialization track enrollments recorded for this student yet.
                </div>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                  {selectedStudent.enrollments.map((enr, i) => (
                    <div
                      key={i}
                      className="p-3.5 rounded-xl bg-white border border-[#E8D8C3] flex items-center justify-between gap-3 text-xs"
                    >
                      <div>
                        <span className="text-[10px] font-mono font-bold uppercase text-[#967223] block">
                          {enr.domainName}
                        </span>
                        <div className="font-bold text-[#151417]">{enr.trackName}</div>
                        <span className="text-[10px] text-[#8A8592]">
                          Enrolled: {new Date(enr.createdAt).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="text-right">
                        {enr.status === 'approved' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            <span>Approved</span>
                          </span>
                        )}
                        {enr.status === 'pending' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                            <Clock className="w-3 h-3 text-amber-600" />
                            <span>Pending</span>
                          </span>
                        )}
                        {enr.status === 'rejected' && (
                          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-rose-50 text-rose-800 border border-rose-200">
                            <span>Rejected</span>
                          </span>
                        )}
                        {enr.reviewedBy && (
                          <div className="text-[10px] text-[#8A8592] mt-0.5">
                            By {enr.reviewedBy}
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="flex justify-end pt-2 border-t border-[#E8D8C3]">
              <button
                type="button"
                onClick={() => setSelectedStudent(null)}
                className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] cursor-pointer"
              >
                Close Profile
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
