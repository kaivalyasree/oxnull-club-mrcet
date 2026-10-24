'use client';

import React from 'react';
import Link from 'next/link';
import {
  Radar,
  Newspaper,
  ShieldAlert,
  FileText,
  ArrowRight,
  Lock,
  ExternalLink,
  ShieldCheck,
  Calendar,
  AlertTriangle,
  Sparkles
} from 'lucide-react';

export default function AwarenessIntelligenceSection() {
  return (
    <div className="space-y-16">
      {/* Section Header */}
      <div className="text-center max-w-3xl mx-auto space-y-2">
        <span className="text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-[#967223]">
          Situational Intelligence Modules
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-[#151417] tracking-tight">
          Cybersecurity Intelligence & Threat Telemetry
        </h2>
        <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
          Four dedicated situational intelligence hubs providing telemetry on authorized scans, live vulnerability dispatches, actively weaponized threat vectors, and accredited security bulletins.
        </p>
      </div>

      {/* Grid of 4 Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Module 1: Latest Scans */}
        <section id="scans" className="scroll-mt-28">
          <div className="glass-card rounded-3xl p-7 sm:p-8 border-[#E8D8C3] hover:border-[#C89D3C] transition-all h-full flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#151417] text-[#FAF7F2] border border-[#D4AF37]">
                  <Radar className="w-6 h-6 text-[#C89D3C]" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#FAF0F2] text-[#C78B96] border border-[#EDCED3]">
                  Status: Restricted Scope
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#967223] block mb-1">
                  Module 01
                </span>
                <h3 className="text-2xl font-black text-[#151417]">Latest Scans</h3>
              </div>

              <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                Auditing authorized targets and scheduled perimeter diagnostics. External scans are strictly blocked without signed authorization. Inspect active scope guidelines and lab configurations.
              </p>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] text-xs space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8A8592]">Authorized Targets:</span>
                  <span className="font-bold text-[#151417]">0 configured</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8A8592]">Scope Policy:</span>
                  <span className="font-semibold text-emerald-800">RFC / University Compliant</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D8C3]/50">
              <Link
                href="/domains/awareness/scans"
                className="w-full py-2.5 px-4 rounded-xl bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Inspect Scan Telemetry</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
              </Link>
            </div>
          </div>
        </section>

        {/* Module 2: Cybersecurity Tech News */}
        <section id="tech-news" className="scroll-mt-28">
          <div className="glass-card rounded-3xl p-7 sm:p-8 border-[#E8D8C3] hover:border-[#C89D3C] transition-all h-full flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#151417] text-[#FAF7F2] border border-[#D4AF37]">
                  <Newspaper className="w-6 h-6 text-[#C89D3C]" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  Live Feed Connected
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#967223] block mb-1">
                  Module 02
                </span>
                <h3 className="text-2xl font-black text-[#151417]">Cybersecurity Tech News</h3>
              </div>

              <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                Recent cybersecurity breakthroughs, vulnerability disclosures, and defensive innovations with publication chronologies and verified publisher attributions.
              </p>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] text-xs space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8A8592]">Primary Publisher:</span>
                  <span className="font-bold text-[#151417]">The Hacker News / Industry Wire</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8A8592]">Verification:</span>
                  <span className="font-semibold text-emerald-800">Direct Source Links</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D8C3]/50">
              <Link
                href="/domains/awareness/news"
                className="w-full py-2.5 px-4 rounded-xl bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Browse Latest News Feed</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
              </Link>
            </div>
          </div>
        </section>

        {/* Module 3: Threat Watch */}
        <section id="threat-watch" className="scroll-mt-28">
          <div className="glass-card rounded-3xl p-7 sm:p-8 border-[#E8D8C3] hover:border-[#C89D3C] transition-all h-full flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#151417] text-[#FAF7F2] border border-[#D4AF37]">
                  <ShieldAlert className="w-6 h-6 text-[#C89D3C]" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                  CISA KEV Integrated
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#967223] block mb-1">
                  Module 03
                </span>
                <h3 className="text-2xl font-black text-[#151417]">Threat Watch</h3>
              </div>

              <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                Tracking actively exploited CVEs, adversary tactics on MITRE ATT&CK, and emerging campaign telemetry. Verified governmental advisories are explicitly partitioned from student notes.
              </p>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] text-xs space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8A8592]">Telemetry Source:</span>
                  <span className="font-bold text-[#151417]">CISA KEV Catalog</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8A8592]">Disclosures:</span>
                  <span className="font-semibold text-rose-800">Zero-Days & Exploited CVEs</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D8C3]/50">
              <Link
                href="/domains/awareness/threat-watch"
                className="w-full py-2.5 px-4 rounded-xl bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>Open Threat Watch Radar</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
              </Link>
            </div>
          </div>
        </section>

        {/* Module 4: Security Advisories */}
        <section id="advisories" className="scroll-mt-28">
          <div className="glass-card rounded-3xl p-7 sm:p-8 border-[#E8D8C3] hover:border-[#C89D3C] transition-all h-full flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="p-3 rounded-2xl bg-[#151417] text-[#FAF7F2] border border-[#D4AF37]">
                  <FileText className="w-6 h-6 text-[#C89D3C]" />
                </div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#F5EBDD] text-[#8C6B1B] border border-[#E8D8C3]">
                  Vendor Bulletins
                </span>
              </div>

              <div>
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#967223] block mb-1">
                  Module 04
                </span>
                <h3 className="text-2xl font-black text-[#151417]">Security Advisories</h3>
              </div>

              <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                Critical vulnerability announcements, ICS industrial advisories, and defensive vendor mitigation bulletins with affected system scopes and official links.
              </p>

              <div className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] text-xs space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8A8592]">Advisory Authority:</span>
                  <span className="font-bold text-[#151417]">CISA / US-CERT / Vendors</span>
                </div>
                <div className="flex items-center justify-between font-mono text-[11px]">
                  <span className="text-[#8A8592]">Integrity:</span>
                  <span className="font-semibold text-emerald-800">Unmodified Official Records</span>
                </div>
              </div>
            </div>

            <div className="pt-4 border-t border-[#E8D8C3]/50">
              <Link
                href="/domains/awareness/advisories"
                className="w-full py-2.5 px-4 rounded-xl bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 shadow-xs cursor-pointer"
              >
                <span>View Security Advisories</span>
                <ArrowRight className="w-3.5 h-3.5 text-[#E5C378]" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
