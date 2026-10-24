'use client';

import React, { useState } from 'react';
import {
  Compass,
  Plus,
  Edit3,
  Trash2,
  CheckCircle2,
  AlertTriangle,
  X,
  ExternalLink,
  Shield,
  Layers,
  ChevronRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { DOMAINS, Domain } from '@/lib/data';
import type { TrackEnrollment } from '@/lib/store';

interface TrackItem {
  id: string;
  name?: string;
  title?: string;
  domainId: string;
  domainSlug?: string;
  description: string;
  topics?: string[];
  competencies?: string[];
  deliverable?: string;
  deliverables?: string[];
  level?: string;
  durationWeeks?: number;
  isActive?: boolean;
}

interface AdminTrackManagerProps {
  domains: Domain[];
  tracks: TrackItem[];
  enrollments: TrackEnrollment[];
  onSaveTrack: (trackData: any, mode: 'add' | 'edit') => Promise<boolean>;
  onDeleteTrack: (trackId: string) => Promise<boolean>;
  onEditDomain: (domain: Domain) => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export default function AdminTrackManager({
  domains,
  tracks,
  enrollments,
  onSaveTrack,
  onDeleteTrack,
  onEditDomain,
  showToast
}: AdminTrackManagerProps) {
  const [selectedDomainId, setSelectedDomainId] = useState<string>('all');
  const [trackModalMode, setTrackModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentTrackId, setCurrentTrackId] = useState<string | null>(null);

  // Form State
  const [formName, setFormName] = useState('');
  const [formDomainId, setFormDomainId] = useState('d1');
  const [formDesc, setFormDesc] = useState('');
  const [formTopics, setFormTopics] = useState('');
  const [formDeliverable, setFormDeliverable] = useState('');
  const [formIsActive, setFormIsActive] = useState(true);
  const [formError, setFormError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filtered tracks
  const displayedTracks = tracks.filter((t) => {
    if (selectedDomainId === 'all') return true;
    return t.domainId === selectedDomainId;
  });

  const openAddModal = (domainId?: string) => {
    setCurrentTrackId(null);
    setFormName('');
    setFormDomainId(domainId || (selectedDomainId !== 'all' ? selectedDomainId : 'd1'));
    setFormDesc('');
    setFormTopics('');
    setFormDeliverable('');
    setFormIsActive(true);
    setFormError(null);
    setTrackModalMode('add');
  };

  const openEditModal = (t: TrackItem) => {
    setCurrentTrackId(t.id);
    setFormName(t.name || t.title || '');
    setFormDomainId(t.domainId || 'd1');
    setFormDesc(t.description || '');
    const topicsArr = t.topics || t.competencies || [];
    setFormTopics(Array.isArray(topicsArr) ? topicsArr.join(', ') : '');
    const delivStr = t.deliverable || (Array.isArray(t.deliverables) ? t.deliverables.join('; ') : '');
    setFormDeliverable(delivStr);
    setFormIsActive(t.isActive !== false);
    setFormError(null);
    setTrackModalMode('edit');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!formName.trim() || formName.trim().length < 3) {
      setFormError('Track name must be at least 3 characters.');
      return;
    }

    if (!formDesc.trim() || formDesc.trim().length < 10) {
      setFormError('Track description must be at least 10 characters.');
      return;
    }

    const payload = {
      id: currentTrackId || undefined,
      name: formName.trim(),
      domainId: formDomainId,
      description: formDesc.trim(),
      topics: formTopics
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean),
      deliverable: formDeliverable.trim(),
      isActive: formIsActive
    };

    setIsSubmitting(true);
    try {
      const ok = await onSaveTrack(payload, trackModalMode || 'add');
      if (ok) {
        setTrackModalMode(null);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (trackId: string, trackTitle: string) => {
    // REFERENTIAL INTEGRITY CHECK: Check if any student enrollment exists for this track
    const activeStudentEnrollments = enrollments.filter((e) => e.trackId === trackId);
    if (activeStudentEnrollments.length > 0) {
      showToast(
        `Cannot delete "${trackTitle}": ${activeStudentEnrollments.length} student enrollment(s) depend on it. Deactivate instead to protect records.`,
        'error'
      );
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to permanently remove track "${trackTitle}"? This cannot be undone.`
    );
    if (!confirmed) return;

    await onDeleteTrack(trackId);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* 7 Cybersecurity Domains Header Overview */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#E8D8C3] space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#967223] block mb-1">
              Core Architecture
            </span>
            <h3 className="text-xl font-black text-[#151417]">
              Seven Cybersecurity Domains & Core Tracks
            </h3>
            <p className="text-xs text-[#645E6D]">
              Domain metadata, research areas, and inner specialization learning tracks.
            </p>
          </div>

          <button
            onClick={() => openAddModal()}
            className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
          >
            <Plus className="w-4 h-4 text-[#E5C378]" />
            <span>Add Core Track</span>
          </button>
        </div>

        {/* 7 Domains Grid Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {domains.map((dom) => {
            const domainTrackCount = tracks.filter((t) => t.domainId === dom.id).length;
            const domainEnrollmentCount = enrollments.filter((e) => e.domainId === dom.id).length;
            const isSelected = selectedDomainId === dom.id;

            return (
              <div
                key={dom.id}
                onClick={() => setSelectedDomainId(isSelected ? 'all' : dom.id)}
                className={`p-4 rounded-2xl border text-left cursor-pointer transition-all flex flex-col justify-between ${
                  isSelected
                    ? 'bg-[#F5EBDD] border-[#C89D3C] shadow-sm ring-1 ring-[#C89D3C]'
                    : 'bg-white border-[#E8D8C3] hover:border-[#D4AF37]/60 hover:bg-[#FAF7F2]'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold text-[#967223]">
                      DOMAIN {dom.number}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onEditDomain(dom);
                      }}
                      className="p-1 rounded-md text-[#8A8592] hover:text-[#151417] hover:bg-white"
                      title="Edit domain metadata"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#C89D3C]" />
                    </button>
                  </div>
                  <h4 className="font-bold text-sm text-[#151417]">{dom.name}</h4>
                  <p className="text-[11px] text-[#645E6D] mt-1 line-clamp-2">{dom.tagline}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-[#8C6B1B] font-semibold">
                    {dom.slug === 'awareness' ? 'News & Scam CMS' : `${domainTrackCount} Tracks`}
                  </span>
                  <span className="text-[#8A8592]">
                    {dom.slug === 'awareness' ? 'Public Initiative' : `${domainEnrollmentCount} Enrolled`}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Domain Filter Bar for Tracks */}
      <div className="flex items-center justify-between gap-4 border-b border-[#E8D8C3] pb-3">
        <div className="flex items-center gap-2 overflow-x-auto text-xs font-bold">
          <button
            onClick={() => setSelectedDomainId('all')}
            className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
              selectedDomainId === 'all'
                ? 'bg-[#151417] text-[#FAF7F2]'
                : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
            }`}
          >
            All Tracks ({tracks.length})
          </button>
          {domains.map((dom) => (
            <button
              key={dom.id}
              onClick={() => setSelectedDomainId(dom.id)}
              className={`px-3 py-1.5 rounded-xl whitespace-nowrap cursor-pointer transition-colors ${
                selectedDomainId === dom.id
                  ? 'bg-[#151417] text-[#FAF7F2]'
                  : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
              }`}
            >
              {dom.number} · {dom.name}
            </button>
          ))}
        </div>

        <span className="text-xs text-[#8A8592] font-mono shrink-0 hidden sm:inline">
          Showing {displayedTracks.length} of {tracks.length} track(s)
        </span>
      </div>

      {/* Tracks Grid */}
      {displayedTracks.length === 0 ? (
        <div className="glass-card rounded-2xl p-12 text-center text-xs text-[#8A8592] border-[#E8D8C3] space-y-3">
          <Compass className="w-8 h-8 mx-auto text-[#C89D3C] opacity-50" />
          <p className="font-bold text-sm text-[#151417]">No Core Tracks Found</p>
          <p>Click &quot;Add Core Track&quot; above to create the first specialization track for this domain.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {displayedTracks.map((t) => {
            const trackDomain = domains.find((d) => d.id === t.domainId);
            const title = t.name || t.title || 'Core Track';
            const topicsList = t.topics || t.competencies || [];
            const deliverableText = t.deliverable || (Array.isArray(t.deliverables) ? t.deliverables.join('; ') : '');
            const enrolledCount = enrollments.filter((e) => e.trackId === t.id).length;
            const isActive = t.isActive !== false;

            return (
              <div
                key={t.id}
                className={`glass-card rounded-3xl p-6 border flex flex-col justify-between transition-all space-y-4 ${
                  isActive ? 'border-[#E8D8C3] bg-white' : 'border-neutral-300 bg-neutral-50/70 opacity-75'
                }`}
              >
                <div>
                  <div className="flex items-start justify-between gap-3 mb-2">
                    <div>
                      <span className="text-[10px] font-mono font-bold uppercase text-[#967223]">
                        {trackDomain?.name || t.domainId}
                      </span>
                      <h4 className="text-base font-bold text-[#151417] leading-snug">{title}</h4>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isActive ? (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-emerald-50 text-emerald-800 border border-emerald-200">
                          Active
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-neutral-100 text-neutral-600 border border-neutral-300">
                          Inactive
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="text-xs text-[#55505C] leading-relaxed line-clamp-3 mb-3">
                    {t.description}
                  </p>

                  {/* Topics / Competencies */}
                  {topicsList.length > 0 && (
                    <div className="space-y-1 mb-3">
                      <span className="text-[10px] font-mono uppercase font-bold tracking-wider text-[#8A8592] block">
                        Core Competencies
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {topicsList.slice(0, 4).map((top, idx) => (
                          <span
                            key={idx}
                            className="px-2 py-0.5 rounded-md text-[10px] bg-[#FAF7F2] text-[#47434E] border border-[#E8D8C3]"
                          >
                            {top}
                          </span>
                        ))}
                        {topicsList.length > 4 && (
                          <span className="text-[10px] text-[#8A8592] font-mono self-center">
                            +{topicsList.length - 4} more
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Deliverables */}
                  {deliverableText && (
                    <div className="p-2.5 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3]/60 text-[11px] text-[#645E6D]">
                      <strong className="text-[#151417]">Milestone Deliverable:</strong> {deliverableText}
                    </div>
                  )}
                </div>

                <div className="pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs">
                  <span className="font-mono text-[11px] text-[#8C6B1B]">
                    {enrolledCount} Student Enrollment(s)
                  </span>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => openEditModal(t)}
                      className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#FAF7F2] text-[#151417] hover:bg-[#F5EBDD] transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <Edit3 className="w-3 h-3 text-[#C89D3C]" />
                      <span>Edit</span>
                    </button>
                    <button
                      onClick={() => handleDelete(t.id, title)}
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                      title="Delete track (checks referential integrity)"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* ADD / EDIT TRACK MODAL */}
      {trackModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl animate-in zoom-in-95 duration-200">
            <div className="flex items-start justify-between border-b border-[#E8D8C3] pb-4">
              <div>
                <h3 className="text-xl font-black text-[#151417]">
                  {trackModalMode === 'add' ? 'Add Core Learning Track' : 'Edit Core Track'}
                </h3>
                <p className="text-xs text-[#645E6D]">
                  Tracks are the inner specialization paths students enroll in under each domain.
                </p>
              </div>

              <button
                onClick={() => setTrackModalMode(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {formError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{formError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Domain Selector */}
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">
                    Cybersecurity Domain *
                  </label>
                  <select
                    value={formDomainId}
                    onChange={(e) => setFormDomainId(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-xs font-medium text-[#151417] outline-none focus:border-[#C89D3C]"
                  >
                    {domains.map((d) => (
                      <option key={d.id} value={d.id}>
                        Domain {d.number}: {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Track Name */}
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">
                    Track Title / Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Memory Forensics & Malware Triage"
                    value={formName}
                    onChange={(e) => setFormName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-xs text-[#151417] outline-none focus:border-[#C89D3C]"
                  />
                </div>
              </div>

              {/* Description */}
              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">
                  Track Description & Scope *
                </label>
                <textarea
                  rows={3}
                  required
                  placeholder="Detailed description of the track syllabus, technical objectives, and expectations..."
                  value={formDesc}
                  onChange={(e) => setFormDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-xs text-[#151417] outline-none focus:border-[#C89D3C]"
                />
              </div>

              {/* Topics / Competencies */}
              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">
                  Core Topics / Competencies (comma separated)
                </label>
                <input
                  type="text"
                  placeholder="Volatility framework, Dump analysis, Rekall, Memory injection analysis"
                  value={formTopics}
                  onChange={(e) => setFormTopics(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-xs text-[#151417] outline-none focus:border-[#C89D3C]"
                />
              </div>

              {/* Deliverable */}
              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">
                  Capstone Milestone / Deliverable
                </label>
                <input
                  type="text"
                  placeholder="Publish complete triage writeup and indicators of compromise for memory dump sample"
                  value={formDeliverable}
                  onChange={(e) => setFormDeliverable(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-xs text-[#151417] outline-none focus:border-[#C89D3C]"
                />
              </div>

              {/* Is Active Checkbox */}
              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="formIsActive"
                  checked={formIsActive}
                  onChange={(e) => setFormIsActive(e.target.checked)}
                  className="rounded border-[#E8D8C3] text-[#C89D3C] focus:ring-[#C89D3C]"
                />
                <label htmlFor="formIsActive" className="text-xs text-[#151417] font-semibold cursor-pointer">
                  Active Track (visible on domain detail page for student enrollment)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8D8C3]">
                <button
                  type="button"
                  onClick={() => setTrackModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D] hover:bg-[#F5EBDD]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Saving...' : trackModalMode === 'add' ? 'Create Track' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
