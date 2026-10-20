import React from 'react';
import Link from 'next/link';
import { db } from '@/lib/store';
import { ArrowRight, Compass, Shield, ChevronRight } from 'lucide-react';

export const metadata = {
  title: 'Seven Cybersecurity Domains | 0XNULL',
  description: 'Explore the seven specialized cybersecurity domains at 0XNULL: Awareness, Explore, Red & Blue Team, Digital Forensics, Cryptography, Cloud Security, and Security Architecture.'
};

export default function DomainsIndexPage() {
  const domains = db.getDomains();

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-16">
        <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
          Specialization Tracks
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#151417] tracking-tight mt-2 mb-4">
          Seven Cybersecurity Domains
        </h1>
        <p className="text-sm sm:text-base text-[#55505C] leading-relaxed">
          After completing shared fundamentals, members choose specialized domains to cultivate deep technical fluency, conduct adversarial simulations, and build demonstrable project proof.
        </p>
      </div>

      {/* Grid of all 7 Domains */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {(domains || []).map((domain) => {
          const focusAreasList = Array.isArray(domain.focusAreas) ? domain.focusAreas : [];

          return (
            <Link
              key={domain.slug}
              href={`/domains/${domain.slug}`}
              className="glass-card glass-card-hover rounded-3xl p-8 flex flex-col justify-between group transition-all duration-300"
            >
              <div>
                {/* Badge & Number */}
                <div className="flex items-center justify-between mb-4">
                  <span className="font-mono text-sm font-black px-3 py-1 rounded bg-[#151417] text-[#FAF7F2]">
                    DOMAIN {domain.number}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6B1B]">
                    {domain.badge}
                  </span>
                </div>

                {/* Title */}
                <h2 className="text-2xl font-bold text-[#151417] group-hover:text-[#967223] transition-colors mb-3">
                  {domain.name}
                </h2>

                {/* Tagline */}
                <p className="text-xs text-[#55505C] leading-relaxed mb-6">
                  {domain.tagline}
                </p>

                {/* Highlights */}
                <div className="space-y-1.5 mb-6">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block">
                    Core Topics
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {focusAreasList.slice(0, 3).map((f, i) => (
                      <span
                        key={i}
                        className="text-[10px] px-2 py-0.5 rounded bg-[#FAF7F2] text-[#47434E] border border-[#E8D8C3]"
                      >
                        {f}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* CTA */}
              <div className="pt-4 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs font-bold text-[#8C6B1B]">
                <span>Enter Domain Hub</span>
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
