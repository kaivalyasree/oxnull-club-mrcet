'use client';

import React, { useState, useEffect } from 'react';
import { Domain, DomainTrack } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import TrackEnrollmentModal from '@/components/TrackEnrollmentModal';
import {
  Layers,
  ShieldCheck,
  Check,
  Clock,
  AlertCircle,
  Plus,
  ArrowRight,
  Compass,
  FileCheck
} from 'lucide-react';

interface DomainTracksSectionProps {
  domain: Domain;
  initialTrackId?: string;
}

export default function DomainTracksSection({ domain, initialTrackId }: DomainTracksSectionProps) {
  const { user } = useAuth();
  const [selectedTrack, setSelectedTrack] = useState<DomainTrack | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userEnrollments, setUserEnrollments] = useState<any[]>([]);
  const [isLoadingEnrollments, setIsLoadingEnrollments] = useState(false);

  const tracks = domain.tracks || [];

  const fetchEnrollments = () => {
    if (!user?.id) {
      setUserEnrollments([]);
      return;
    }
    setIsLoadingEnrollments(true);
    fetch(`/api/enrollments?userId=${encodeURIComponent(user.id)}`)
      .then((res) => res.json())
      .then((res) => {
        if (res.success && Array.isArray(res.data)) {
          setUserEnrollments(res.data);
        }
      })
      .catch((err) => console.warn('Could not load user enrollments', err))
      .finally(() => setIsLoadingEnrollments(false));
  };

  useEffect(() => {
    fetchEnrollments();
  }, [user]);

  // Handle URL deep-link to a specific track (?track=...)
  useEffect(() => {
    if (initialTrackId && tracks.length > 0) {
      const match = tracks.find((t) => t.id === initialTrackId);
      if (match) {
        setSelectedTrack(match);
        setIsModalOpen(true);
      }
    }
  }, [initialTrackId, tracks]);

  const handleOpenEnrollModal = (track: DomainTrack) => {
    setSelectedTrack(track);
    setIsModalOpen(true);
  };

  const getEnrollmentForTrack = (trackId: string) => {
    return userEnrollments.find(
      (e) => e.domainId === domain.id && e.trackId === trackId
    );
  };

  return (
    <section id="core-tracks" className="scroll-mt-24 space-y-6">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <Layers className="w-5 h-5 text-[#C89D3C]" />
            <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
              Specialization Pathways
            </span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-[#151417] tracking-tight">
            Inner Core Learning Tracks
          </h2>
          <p className="text-xs sm:text-sm text-[#55505C] max-w-2xl mt-1">
            Select one of the structured inner tracks below to cultivate technical depth, participate in scoped lab simulations, and submit your official enrollment.
          </p>
        </div>
      </div>

      {/* Tracks Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {tracks.map((track, idx) => {
          const enrollment = getEnrollmentForTrack(track.id);
          const isPending = enrollment?.status === 'pending';
          const isApproved = enrollment?.status === 'approved';
          const isRejected = enrollment?.status === 'rejected';

          return (
            <div
              key={track.id}
              className={`glass-card rounded-3xl p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 border ${
                isApproved
                  ? 'border-emerald-400 bg-emerald-50/20'
                  : isPending
                  ? 'border-amber-400 bg-amber-50/20'
                  : 'border-[#E8D8C3] hover:border-[#C89D3C]'
              }`}
            >
              <div>
                {/* Header: Track Number & Status Badge */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-[#151417] text-[#FAF7F2]">
                    TRACK 0{idx + 1}
                  </span>

                  {enrollment ? (
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border flex items-center gap-1 ${
                        isApproved
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-300'
                          : isRejected
                          ? 'bg-rose-50 text-rose-800 border-rose-300'
                          : 'bg-amber-50 text-amber-800 border-amber-300'
                      }`}
                    >
                      {isApproved && <Check className="w-3 h-3 text-emerald-600" />}
                      {isPending && <Clock className="w-3 h-3 text-amber-600" />}
                      {isRejected && <AlertCircle className="w-3 h-3 text-rose-600" />}
                      <span>{enrollment.status.toUpperCase()}</span>
                    </span>
                  ) : (
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#967223]">
                      Available for Enrollment
                    </span>
                  )}
                </div>

                {/* Track Title */}
                <h3 className="text-xl font-bold text-[#151417] mb-2 leading-snug">
                  {track.name}
                </h3>

                {/* Track Description */}
                <p className="text-xs sm:text-[13px] text-[#55505C] leading-relaxed mb-4">
                  {track.description}
                </p>

                {/* Key Topics Covered */}
                {track.topics && track.topics.length > 0 && (
                  <div className="space-y-1.5 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block">
                      Core Competencies
                    </span>
                    <div className="flex flex-wrap gap-1.5">
                      {track.topics.map((topic, i) => (
                        <span
                          key={i}
                          className="text-[10px] px-2.5 py-1 rounded-lg bg-[#FAF7F2] text-[#47434E] border border-[#E8D8C3]"
                        >
                          {topic}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Deliverable if present */}
                {track.deliverable && (
                  <div className="p-3 rounded-2xl bg-[#FAF7F2]/80 border border-[#E8D8C3]/70 mb-4">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#967223] block mb-0.5">
                      Target Deliverable
                    </span>
                    <p className="text-xs text-[#2A2830] font-medium leading-relaxed">
                      {track.deliverable}
                    </p>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-4 border-t border-[#E8D8C3]/50 flex items-center justify-between">
                <div className="text-xs text-[#645E6D]">
                  {enrollment ? (
                    <span className="font-medium text-[#151417]">
                      {isApproved
                        ? 'Enrolled in cohort'
                        : isPending
                        ? 'Enrollment pending approval'
                        : 'Enrollment rejected'}
                    </span>
                  ) : (
                    <span>Department of Cybersecurity</span>
                  )}
                </div>

                <button
                  onClick={() => handleOpenEnrollModal(track)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold tracking-wide uppercase transition-all cursor-pointer flex items-center gap-1.5 shadow-xs ${
                    isApproved
                      ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                      : isPending
                      ? 'bg-amber-600 text-white hover:bg-amber-700'
                      : 'bg-gradient-to-r from-[#C89D3C] to-[#A87D25] text-white hover:opacity-95'
                  }`}
                >
                  {isApproved ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Enrolled</span>
                    </>
                  ) : isPending ? (
                    <>
                      <Clock className="w-3.5 h-3.5" />
                      <span>Review Pending</span>
                    </>
                  ) : (
                    <>
                      <Plus className="w-3.5 h-3.5" />
                      <span>Enroll in this Track</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Enrollment Modal */}
      <TrackEnrollmentModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        domain={domain}
        track={selectedTrack}
        onEnrollmentSuccess={() => {
          fetchEnrollments();
        }}
      />
    </section>
  );
}
