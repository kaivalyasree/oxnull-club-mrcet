'use client';

import React from 'react';
import { Certification } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { Award, CheckCircle, ExternalLink, ShieldCheck, Briefcase } from 'lucide-react';

interface CertificationCardProps {
  certification: Certification;
}

export default function CertificationCard({ certification }: CertificationCardProps) {
  const { progress, toggleTrackCertification } = useAuth();
  const isTracked = progress.trackedCertificationIds.includes(certification.id);

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Intermediate':
        return 'bg-[#F5EBDD] text-[#8C6B1B] border-[#E8D8C3]';
      case 'Advanced':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      className={`glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${
        isTracked ? 'border-[#C89D3C] ring-1 ring-[#C89D3C]/30 bg-[#FFFDF9]' : ''
      }`}
    >
      <div>
        {/* Header */}
        <div className="flex items-start justify-between gap-3 mb-2">
          <div>
            <span className="text-[10px] font-bold tracking-wider uppercase text-[#8C6B1B]">
              {certification.provider}
            </span>
            <h4 className="text-base font-bold text-[#151417] leading-snug">
              {certification.name}
            </h4>
            <span className="inline-block text-xs font-mono font-medium text-[#8A8592]">
              Exam: {certification.code}
            </span>
          </div>

          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border shrink-0 ${getLevelBadge(
              certification.level
            )}`}
          >
            {certification.level}
          </span>
        </div>

        {/* Description */}
        <p className="text-xs text-[#645E6D] leading-relaxed mb-3 line-clamp-3">
          {certification.description}
        </p>

        {/* Target Career Roles */}
        {certification.careerRoles && certification.careerRoles.length > 0 && (
          <div className="mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1.5 flex items-center gap-1">
              <Briefcase className="w-3 h-3 text-[#C89D3C]" />
              <span>Target Roles</span>
            </span>
            <div className="flex flex-wrap gap-1">
              {certification.careerRoles.map((role) => (
                <span
                  key={role}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] text-[#55505C] border border-[#E8D8C3]"
                >
                  {role}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer Actions */}
      <div className="pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs">
        <button
          onClick={() => toggleTrackCertification(certification.id)}
          className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            isTracked
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-[#F5EBDD] text-[#8C6B1B] hover:bg-[#E8D8C3]'
          }`}
        >
          {isTracked ? (
            <>
              <CheckCircle className="w-3.5 h-3.5" />
              <span>Tracking</span>
            </>
          ) : (
            <>
              <Award className="w-3.5 h-3.5" />
              <span>Track in Roadmap</span>
            </>
          )}
        </button>

        <a
          href={certification.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#8C6B1B] hover:text-[#151417] transition-colors"
        >
          <span>Official Syllabus</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
