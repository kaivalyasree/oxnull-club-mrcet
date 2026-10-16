'use client';

import React from 'react';
import Link from 'next/link';
import { STUDENT_JOURNEY_STAGES } from '@/lib/data';
import { ArrowRight, Compass, ShieldCheck, Sparkles } from 'lucide-react';

export default function JourneyPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-5xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
          Evolutionary Trajectory
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#151417] tracking-tight mt-2 mb-4">
          The 0XNULL Student Journey
        </h1>
        <p className="text-sm sm:text-base text-[#55505C] leading-relaxed">
          From first-year curiosity to executive technical leadership. An intentional, staged pathway engineered to develop demonstrable cybersecurity capability.
        </p>
      </div>

      {/* Timeline Progression */}
      <div className="relative border-l-2 border-[#D4AF37]/40 ml-4 sm:ml-32 pl-6 sm:pl-10 space-y-12">
        {STUDENT_JOURNEY_STAGES.map((stage, idx) => (
          <div key={stage.step} className="relative group">
            {/* Timeline Circle Marker */}
            <div className="absolute -left-[35px] sm:-left-[51px] top-1.5 w-6 h-6 rounded-full bg-[#151417] border-2 border-[#D4AF37] flex items-center justify-center text-[10px] font-mono font-bold text-[#E5C378] shadow-sm">
              {stage.step}
            </div>

            {/* Left Stage Indicator on Desktop */}
            <div className="hidden sm:block absolute -left-36 top-1.5 text-right w-24">
              <span className="text-xs font-mono font-black text-[#967223]">
                PHASE {stage.step}
              </span>
            </div>

            {/* Card */}
            <div className="glass-card glass-card-hover rounded-3xl p-6 sm:p-8 border-[#E8D8C3]">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8C6B1B] block sm:hidden">
                    PHASE {stage.step}
                  </span>
                  <h3 className="text-2xl font-black text-[#151417] tracking-tight">
                    {stage.title}
                  </h3>
                  <p className="text-xs font-semibold text-[#8C6B1B]">{stage.subtitle}</p>
                </div>

                <span className="text-xs px-3 py-1 rounded-full bg-[#F5EBDD] text-[#8C6B1B] font-semibold border border-[#E8D8C3] self-start sm:self-auto">
                  {stage.action}
                </span>
              </div>

              <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed mb-4">
                {stage.description}
              </p>

              <div className="pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs">
                <span className="text-[#8A8592]">Milestone {stage.step} / 08</span>
                {idx === 0 ? (
                  <Link
                    href="/domains"
                    className="font-bold text-[#8C6B1B] hover:text-[#151417] inline-flex items-center gap-1"
                  >
                    <span>Begin Phase 1</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : idx === 1 ? (
                  <Link
                    href="/learn"
                    className="font-bold text-[#8C6B1B] hover:text-[#151417] inline-flex items-center gap-1"
                  >
                    <span>Start Fundamentals</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                ) : (
                  <span className="text-[#8C6B1B] font-medium">Included in curriculum</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Footer Banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 text-center border-[#D4AF37]/40 bg-gradient-to-r from-[#FAF7F2] to-[#F5EBDD]/50">
        <h3 className="text-2xl font-black text-[#151417] mb-2">
          Your Journey Starts With Curiosity
        </h3>
        <p className="text-xs sm:text-sm text-[#55505C] max-w-lg mx-auto mb-6">
          No prior hacking or systems experience is required to begin. Our foundation track and peer mentorship cohorts support you from day one.
        </p>
        <Link
          href="/login"
          className="inline-flex items-center gap-2 px-8 py-3 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors shadow-md"
        >
          <span>Enroll in 0XNULL</span>
          <ArrowRight className="w-4 h-4 text-[#E5C378]" />
        </Link>
      </div>
    </div>
  );
}
