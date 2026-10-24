'use client';

import React from 'react';
import Link from 'next/link';
import { EXPLORE_MODULES } from '@/lib/explore-data';
import {
  MessageSquare,
  Megaphone,
  Network,
  Users2,
  CalendarCheck,
  Compass,
  ArrowRight,
  CheckCircle2,
  ListTodo
} from 'lucide-react';

export default function ExploreModulesSection() {
  const getIcon = (slug: string) => {
    switch (slug) {
      case 'communication':
        return <MessageSquare className="w-6 h-6 text-[#C89D3C]" />;
      case 'pr':
        return <Megaphone className="w-6 h-6 text-[#C89D3C]" />;
      case 'networking':
        return <Network className="w-6 h-6 text-[#C89D3C]" />;
      case 'leadership-collaboration':
        return <Users2 className="w-6 h-6 text-[#C89D3C]" />;
      case 'planning-event-ops':
        return <CalendarCheck className="w-6 h-6 text-[#C89D3C]" />;
      default:
        return <Compass className="w-6 h-6 text-[#C89D3C]" />;
    }
  };

  return (
    <div id="explore-modules" className="scroll-mt-28 space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-[#967223]">
          Non-Technical & Professional Development
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#151417] tracking-tight">
          Five Professional Development Modules
        </h2>
        <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
          Not all cybersecurity excellence is code. Explore represents the non-technical and professional development side of 0XNULL. Select any module to enter its dedicated page, review instructions, and complete practical tasks.
        </p>
      </div>

      {/* Grid of 5 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {EXPLORE_MODULES.map((mod) => (
          <div
            key={mod.id}
            className="glass-card rounded-3xl p-7 border-[#E8D8C3] hover:border-[#C89D3C] transition-all hover:shadow-md flex flex-col justify-between space-y-6"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-white border border-[#E8D8C3] shadow-2xs">
                  {getIcon(mod.slug)}
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                  MODULE {mod.number}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-[#967223] block mb-1">
                  {mod.badge}
                </span>
                <h3 className="text-xl font-black text-[#151417]">{mod.title}</h3>
                <p className="text-xs font-semibold text-[#8C6B1B] mt-1">{mod.subtitle}</p>
              </div>

              <p className="text-xs text-[#55505C] leading-relaxed line-clamp-3">
                {mod.overview}
              </p>

              {/* Task Count & Competencies preview */}
              <div className="space-y-2 pt-1 border-t border-[#E8D8C3]/50">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-[#8A8592] flex items-center gap-1">
                    <ListTodo className="w-3.5 h-3.5 text-[#C89D3C]" />
                    <span>Curriculum Tasks:</span>
                  </span>
                  <span className="font-bold text-[#151417]">
                    {mod.tasks.length} Structured Activities
                  </span>
                </div>
                <div className="flex flex-wrap gap-1 pt-1">
                  {mod.competencies.slice(0, 2).map((comp, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-[#FAF7F2] text-[#645E6D] border border-[#E8D8C3] truncate max-w-[200px]"
                    >
                      {comp}
                    </span>
                  ))}
                  {mod.competencies.length > 2 && (
                    <span className="text-[10px] px-1.5 py-0.5 text-[#967223] font-bold">
                      +{mod.competencies.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D8C3]/50">
              <Link
                href={`/domains/explore/${mod.slug}`}
                className="w-full py-2.5 px-4 rounded-xl bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Open Module & Tasks</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
