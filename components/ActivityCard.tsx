'use client';

import React from 'react';
import { Activity } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { Calendar, Check, Clock, Sparkles } from 'lucide-react';

interface ActivityCardProps {
  activity: Activity;
}

export default function ActivityCard({ activity }: ActivityCardProps) {
  const { progress, toggleRsvpActivity } = useAuth();
  const isRsvpd = progress.rsvpdActivityIds.includes(activity.id);

  const actType = activity.type || activity.format || 'Technical';
  const cadenceText = activity.cadence || activity.frequency || 'Weekly';
  const levelText = activity.level || activity.participants || 'All Levels';

  const getTypeBadge = (type: string) => {
    switch (type) {
      case 'Technical':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      case 'Non-Technical':
        return 'bg-amber-50 text-amber-800 border-amber-200';
      case 'Community':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Career':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      className={`glass-card glass-card-hover rounded-2xl p-6 flex flex-col justify-between transition-all duration-300 ${
        isRsvpd ? 'border-[#C89D3C] bg-[#FFFDF9]' : ''
      }`}
    >
      <div>
        {/* Top Badges & Number */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-mono text-sm font-black text-[#967223]">
              {activity.number}
            </span>
            <span
              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getTypeBadge(
                actType
              )}`}
            >
              {actType}
            </span>
          </div>

          <div className="flex items-center gap-1.5 text-[11px] text-[#8A8592]">
            <Clock className="w-3 h-3 text-[#C89D3C]" />
            <span>{cadenceText}</span>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-lg font-bold text-[#151417] mb-2 leading-snug">
          {activity.title}
        </h4>

        {/* Summary */}
        <p className="text-xs font-medium text-[#8C6B1B] mb-2 leading-relaxed">
          {activity.summary}
        </p>

        {/* Description */}
        <p className="text-xs text-[#645E6D] leading-relaxed mb-4">
          {activity.description}
        </p>

        {/* Outcomes */}
        {activity.outcomes && (
          <div className="space-y-1.5 mb-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block">
              Key Member Outcomes
            </span>
            <div className="flex flex-wrap gap-1.5">
              {activity.outcomes.map((outcome, idx) => (
                <span
                  key={idx}
                  className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] text-[#47434E] border border-[#E8D8C3]"
                >
                  ✓ {outcome}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* RSVP Action */}
      <div className="pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs">
        <span className="text-[11px] text-[#8A8592]">Open to {levelText}</span>

        <button
          onClick={() => toggleRsvpActivity(activity.id)}
          className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 ${
            isRsvpd
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830]'
          }`}
        >
          {isRsvpd ? (
            <>
              <Check className="w-3.5 h-3.5" />
              <span>RSVP Confirmed</span>
            </>
          ) : (
            <>
              <Calendar className="w-3.5 h-3.5 text-[#E5C378]" />
              <span>Participate / RSVP</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
