'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, Newspaper, ShieldAlert, AlertTriangle, Sparkles, ExternalLink } from 'lucide-react';
import { Domain } from '@/lib/data';

interface AwarenessHeroProps {
  domain: Domain;
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

export default function AwarenessHero({ domain }: AwarenessHeroProps) {
  return (
    <section className="relative pt-8 pb-12 overflow-hidden border-b border-[#E8D8C3]/50 bg-gradient-to-b from-white/40 via-transparent to-[#FAF7F2]/40">
      {/* Ambient background light matching Rose + Lavender + Gold palette */}
      <div className="absolute top-0 right-10 w-96 h-96 bg-[#F7E7E9]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#F5EBDD]/50 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 right-1/3 w-80 h-80 bg-[#E8E2F4]/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center gap-2 text-xs text-[#8A8592]">
          <Link
            href="/domains"
            className="inline-flex items-center gap-1 hover:text-[#151417] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Domains</span>
          </Link>
          <span>/</span>
          <span className="text-[#967223] font-semibold">01 · Awareness</span>
        </div>

        {/* Hero Header Content */}
        <div className="max-w-4xl space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#151417] text-[#FAF7F2]">
              DOMAIN 01 / 07
            </span>
            <span className="text-xs uppercase font-mono font-bold tracking-widest text-[#967223] px-2.5 py-1 rounded-full bg-[#F5EBDD] border border-[#E8D8C3]">
              OXNULL AWARENESS INITIATIVE
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#151417] tracking-tight leading-tight">
            Stay Informed. Stay Alert. Stay Safe.
          </h1>

          <p className="text-base sm:text-lg text-[#55505C] font-normal leading-relaxed max-w-3xl pt-1">
            Discover the latest technology developments, understand important cybersecurity incidents, and learn how trending scams operate. OXNULL Awareness brings useful news and practical public-awareness information to our campus community.
          </p>

          {/* Three Concise Category Indicators (Editorial Categories, not courses or tracks) */}
          <div className="pt-6 grid grid-cols-1 sm:grid-cols-3 gap-3.5 max-w-3xl">
            <a
              href="#tech-news"
              className="glass-card rounded-2xl p-4 border border-[#E8D8C3] hover:border-[#C89D3C] hover:bg-white/80 transition-all group flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3] text-[#967223] group-hover:bg-[#151417] group-hover:text-[#FAF7F2] transition-colors shrink-0">
                <Newspaper className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#967223] block">
                  Category 01
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-[#151417] group-hover:text-[#967223] transition-colors">
                  Weekly Tech News
                </h2>
                <span className="text-[10px] text-[#645E6D] mt-0.5 block">
                  Published every 7 days
                </span>
              </div>
            </a>

            <a
              href="#cyber-news"
              className="glass-card rounded-2xl p-4 border border-[#E8D8C3] hover:border-[#C89D3C] hover:bg-white/80 transition-all group flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3] text-[#967223] group-hover:bg-[#151417] group-hover:text-[#FAF7F2] transition-colors shrink-0">
                <ShieldAlert className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#967223] block">
                  Category 02
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-[#151417] group-hover:text-[#967223] transition-colors">
                  Fortnightly Cybersecurity Updates
                </h2>
                <span className="text-[10px] text-[#645E6D] mt-0.5 block">
                  Published every 14 days
                </span>
              </div>
            </a>

            <a
              href="#scam-awareness"
              className="glass-card rounded-2xl p-4 border border-[#E8D8C3] hover:border-[#C89D3C] hover:bg-white/80 transition-all group flex items-start gap-3"
            >
              <div className="p-2 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3] text-[#967223] group-hover:bg-[#151417] group-hover:text-[#FAF7F2] transition-colors shrink-0">
                <AlertTriangle className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#967223] block">
                  Category 03
                </span>
                <h2 className="text-xs sm:text-sm font-bold text-[#151417] group-hover:text-[#967223] transition-colors">
                  Scam Awareness & Exposure
                </h2>
                <span className="text-[10px] text-[#645E6D] mt-0.5 block">
                  Tactics, red flags & defense
                </span>
              </div>
            </a>
          </div>
        </div>

        {/* Clean, Simple In-Page Navigation for the 3 Categories (Replacing Old Training Nav) */}
        <div className="pt-8 mt-6 border-t border-[#E8D8C3]/50 flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs font-semibold text-[#645E6D]">
          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#8A8592] shrink-0 mr-1">
            Jump to Section:
          </span>
          <a
            href="#tech-news"
            className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8D8C3] hover:border-[#967223] text-[#151417] hover:text-[#967223] transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <Newspaper className="w-3.5 h-3.5 text-[#967223]" />
            <span>Technology News</span>
          </a>
          <a
            href="#cyber-news"
            className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8D8C3] hover:border-[#967223] text-[#151417] hover:text-[#967223] transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-[#967223]" />
            <span>Cybersecurity News</span>
          </a>
          <a
            href="#scam-awareness"
            className="px-3.5 py-1.5 rounded-full bg-[#FAF7F2] border border-[#E8D8C3] hover:border-[#967223] text-[#151417] hover:text-[#967223] transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <AlertTriangle className="w-3.5 h-3.5 text-[#967223]" />
            <span>Scam Awareness & Exposure</span>
          </a>
        </div>
      </div>
    </section>
  );
}
