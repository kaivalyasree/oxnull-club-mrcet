'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, Cpu, BookOpen, ExternalLink, ArrowRight } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-20">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
          Platform Architecture & Charter
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#151417] tracking-tight mt-2 mb-4">
          About 0XNULL
        </h1>
        <p className="text-sm sm:text-base text-[#55505C] leading-relaxed">
          An academic technology initiative and research platform establishing structured learning, virtualized adversarial ranges, and demonstrable engineering under the Department of Cybersecurity.
        </p>


      </div>

      {/* Brand Identity & Architecture */}
      <section className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
        <div className="lg:col-span-6 space-y-4">
          <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
            Systemic Principles
          </span>
          <h2 className="text-3xl font-black text-[#151417] tracking-tight">
            Built for Capability, Not Credentials Alone
          </h2>
          <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
            University curricula provide critical theoretical foundations, yet modern adversarial defense requires immediate, virtualized muscle memory. 0XNULL bridges this gap through seven research domains and member-led software tooling.
          </p>
          <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
            Every track connects curated whitepapers directly to containerized ranges and open-source GitHub repositories.
          </p>

          <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-1">
            <span className="text-[10px] font-bold uppercase tracking-widest text-[#967223]">
              Institutional Affiliation
            </span>
            <p className="text-xs font-semibold text-[#151417]">Department of Cybersecurity</p>
            <p className="text-[11px] text-[#8A8592]">
              Official Academic Platform & Student Organization Charter
            </p>
          </div>
        </div>

        {/* Official Pink & Gold Visual Identity Showcase */}
        <div className="lg:col-span-6 flex justify-center">
          <div className="relative w-80 h-80 sm:w-96 sm:h-96 rounded-3xl overflow-hidden border border-[#D4AF37]/40 shadow-xl bg-white p-6 flex flex-col items-center justify-center text-center">
            <div className="relative w-52 h-52 sm:w-60 sm:h-60">
              <Image
                src="/assets/0xnull-symbol.png"
                alt="0XNULL Primary Pink and Gold 3D Glass Symbol"
                fill
                className="object-contain"
                priority
              />
            </div>
            <div className="mt-2">
              <div className="text-2xl font-black tracking-[0.2em] text-[#151417]">
                0X<span className="text-[#C89D3C]">NULL</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Platform Pillars */}
      <section className="space-y-6">
        <div className="text-center max-w-2xl mx-auto">
          <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
            Operating Infrastructure
          </span>
          <h2 className="text-3xl font-black text-[#151417] mt-1">
            Three Core Functional Pillars
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-card rounded-3xl p-6 border-[#E8D8C3] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#FAF0F2] text-[#C78B96] flex items-center justify-center font-bold">
              01
            </div>
            <h4 className="font-bold text-lg text-[#151417]">Seven Research Guilds</h4>
            <p className="text-xs text-[#55505C] leading-relaxed">
              Specialized cohorts spanning offensive exploitation, digital forensics, post-quantum ciphers, and cloud perimeters.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border-[#E8D8C3] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F5EBDD] text-[#8C6B1B] flex items-center justify-center font-bold">
              02
            </div>
            <h4 className="font-bold text-lg text-[#151417]">Continuous Virtualized Labs</h4>
            <p className="text-xs text-[#55505C] leading-relaxed">
              Isolated sandboxes designed to test tactics, techniques, and procedures (TTPs) against live telemetry pipelines.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 border-[#E8D8C3] space-y-3">
            <div className="w-10 h-10 rounded-xl bg-[#F4EEF7] text-[#C2A9D4] flex items-center justify-center font-bold">
              03
            </div>
            <h4 className="font-bold text-lg text-[#151417]">Open-Source Security Toolchains</h4>
            <p className="text-xs text-[#55505C] leading-relaxed">
              Members write production-grade packet parsers, cloud posture auditors, and forensic memory tools committed directly to Git.
            </p>
          </div>
        </div>
      </section>

      {/* DESIGNED BY SECTION — EXACTLY THREE NAMES, STRICTLY ZERO ROLES */}
      <section className="glass-card rounded-3xl p-8 sm:p-12 border-[#D4AF37]/40 bg-gradient-to-r from-[#FAF7F2] to-[#F5EBDD]/50 text-center">
        <span className="text-[10px] font-bold tracking-[0.3em] text-[#967223] uppercase block mb-3">
          DESIGNED BY
        </span>
        <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-base font-bold tracking-wider text-[#151417] max-w-2xl mx-auto">
          <span>M. MANI VARDHAN REDDY</span>
          <span className="text-[#D4AF37]/50">•</span>
          <span>S. KAIVALYA SRI</span>
          <span className="text-[#D4AF37]/50">•</span>
          <span>D. ARAVIND KOUSHIK</span>
        </div>
        <p className="text-xs text-[#8A8592] mt-4">
          Department of Cybersecurity
        </p>
      </section>
    </div>
  );
}
