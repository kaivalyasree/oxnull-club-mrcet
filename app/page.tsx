'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass, Shield, Lock, Cloud, Cpu, Users, Eye } from 'lucide-react';
import HeroSection from '@/components/HeroSection';
import { DOMAINS } from '@/lib/data';

// Domain icon map matching each of the 7 core cybersecurity tracks
const DOMAIN_ICONS: Record<string, React.ReactNode> = {
  'red-blue-team': <Shield className="w-5 h-5 text-[#C89D3C]" />,
  'digital-forensics': <Eye className="w-5 h-5 text-[#C89D3C]" />,
  'cryptography': <Lock className="w-5 h-5 text-[#C89D3C]" />,
  'cloud-security': <Cloud className="w-5 h-5 text-[#C89D3C]" />,
  'security-architecture': <Cpu className="w-5 h-5 text-[#C89D3C]" />,
  'awareness': <Users className="w-5 h-5 text-[#C89D3C]" />,
  'explore': <Compass className="w-5 h-5 text-[#C89D3C]" />
};

export default function HomePage() {
  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* ======================================================================
          1. HERO COMPOSITION (Items 2 to 6 in Required Landing-Page Order)
          - College name on ONE SINGLE LINE on desktop, without a white box
          - Separate, centered X beneath the college name, without a connecting line
          - Original 0XNULL club logo (3D glass emblem & wordmark)
          - Four-line club introduction directly below logo
          - Primary Join the Club button directly beneath the introduction
          ====================================================================== */}
      <HeroSection />

      {/* ======================================================================
          7. EXISTING SEVEN CYBERSECURITY DOMAINS
          Continuous scrollable website. Exactly seven domain cards.
          Polished translucent glass, hover & focus states, approved taglines,
          and direct functional links to each domain hub.
          ====================================================================== */}
      <section className="py-20 px-4 sm:px-6 relative border-t border-[#E8D8C3]/50 overflow-hidden">
        {/* Section ambient background radiance */}
        <div className="absolute top-1/4 -left-20 w-80 h-80 bg-[#F7C4D0]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-[#D9C2F5]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-7xl mx-auto space-y-12 relative z-10">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-[#967223]">
              Specialization Foundations
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-[#151417] tracking-tight">
              Seven Cybersecurity Domains
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {DOMAINS.map((domain) => (
              <Link
                key={domain.slug}
                href={`/domains/${domain.slug}`}
                className="glass-card rounded-3xl p-7 flex flex-col justify-between glass-card-hover group focus:outline-none focus:ring-2 focus:ring-[#C89D3C] transition-all cursor-pointer min-h-[260px]"
              >
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-black text-[#967223]">
                      {domain.number}
                    </span>
                    <div className="p-2.5 rounded-2xl bg-white/70 border border-[#E8D8C3]/80 group-hover:border-[#C89D3C] transition-colors shadow-2xs">
                      {DOMAIN_ICONS[domain.slug] || <Shield className="w-5 h-5 text-[#C89D3C]" />}
                    </div>
                  </div>

                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8C6B1B] block mb-1">
                    {domain.badge}
                  </span>

                  <h3 className="text-xl font-bold text-[#151417] mb-2 group-hover:text-[#967223] transition-colors leading-snug">
                    {domain.name}
                  </h3>

                  <p className="text-xs text-[#55505C] leading-relaxed line-clamp-3">
                    {domain.tagline}
                  </p>
                </div>

                <div className="pt-4 mt-4 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs font-bold text-[#151417] group-hover:text-[#967223] transition-colors">
                  <span>Explore Domain</span>
                  <ArrowRight className="w-4 h-4 text-[#C89D3C] group-hover:translate-x-1 transition-transform" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================================
          8. INSTITUTIONAL SUPPORT
          Heading: Institutional Support (Strictly NOT "Leadership", NO "Behind").
          Balanced two-column layout on desktop, neatly stacked on mobile.
          Left:
            Dr. Vaka Murali Mohan
            Principal
          Right:
            Prof. Vazralu Munnangi
            Head, Department of Cyber Security
          ====================================================================== */}
      <section className="py-20 px-4 sm:px-6 relative border-t border-[#E8D8C3]/50 overflow-hidden">
        {/* Section ambient background radiance */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-72 bg-[#F5E0B8]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-5xl mx-auto space-y-12 relative z-10">
          {/* Section Heading */}
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-black text-[#151417] tracking-tight">
              Institutional Support
            </h2>
          </div>

          {/* Two Balanced Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* LEFT COLUMN: Principal */}
            <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-center text-center space-y-2">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#967223] block">
                Principal
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#151417] tracking-tight">
                Dr. Vaka Murali Mohan
              </h3>
              <p className="text-xs text-[#645E6D] font-medium pt-1">
                Malla Reddy College of Engineering and Technology
              </p>
            </div>

            {/* RIGHT COLUMN: Head of Department */}
            <div className="glass-card rounded-3xl p-8 sm:p-10 shadow-sm flex flex-col justify-center text-center space-y-2">
              <span className="text-xs uppercase font-bold tracking-[0.2em] text-[#967223] block">
                Head, Department of Cyber Security
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#151417] tracking-tight">
                Prof. Vazralu Munnangi
              </h3>
              <p className="text-xs text-[#645E6D] font-medium pt-1">
                Department of Cyber Security • MRCET
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          9. SUBSTANTIAL BUT APPROPRIATELY SIZED CYBERSECURITY CALL-TO-ACTION
          ====================================================================== */}
      <section className="py-16 px-4 sm:px-6 relative border-t border-[#E8D8C3]/50 overflow-hidden">
        {/* Section ambient background radiance */}
        <div className="absolute -top-10 right-10 w-72 h-72 bg-[#F7C4D0]/30 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="glass-card rounded-3xl p-8 sm:p-12 text-center space-y-6 relative overflow-hidden">
            <div className="space-y-3 max-w-2xl mx-auto">
              <span className="text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-[#967223] block">
                Take the Next Step
              </span>
              <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-[#151417] tracking-tight">
                Ready to Build Your Cybersecurity Capabilities?
              </h3>
              <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                Join 0XNULL to participate in hands-on labs, capture the flag scrimmages, and collaborative engineering tracks across all seven domains.
              </p>
            </div>

            <div>
              <Link
                href="/join"
                className="inline-flex items-center gap-3 px-8 py-3.5 rounded-full text-xs sm:text-sm font-bold tracking-wider uppercase bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] active:scale-[0.98] transition-all duration-300 shadow-md hover:shadow-xl hover:scale-[1.03] border border-[#D4AF37]/40 cursor-pointer"
              >
                <span>Join the Club</span>
                <ArrowRight className="w-4 h-4 text-[#E5C378]" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================================
          10. WHATSAPP COMMUNITY & INSTAGRAM PROFILE LINKS (WITH OFFICIAL ICONS)
          Placed in bottom social section, before the footer.
          ====================================================================== */}
      <section className="py-12 px-4 sm:px-6 relative border-t border-[#E8D8C3]/50 overflow-hidden">
        {/* Section ambient background radiance */}
        <div className="absolute bottom-0 left-10 w-72 h-72 bg-[#D9C2F5]/25 rounded-full blur-3xl pointer-events-none" />
        <div className="max-w-3xl mx-auto text-center space-y-6 relative z-10">
          <div className="space-y-1">
            <span className="text-[11px] font-mono font-bold tracking-[0.24em] uppercase text-[#967223] block">
              Official Channels
            </span>
            <h3 className="text-xl sm:text-2xl font-black text-[#151417] tracking-tight">
              Connect with 0XNULL
            </h3>
            <p className="text-xs text-[#645E6D]">
              Join our active community channels for real-time announcements, CTF drills, and technical workshops.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
            {/* WhatsApp Community Link */}
            <a
              href="https://chat.whatsapp.com/EHqyjOz8Pa5KJXOJdkWfye"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl glass-card hover:border-[#25D366] text-xs font-bold text-[#151417] hover:text-[#075E54] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
            >
              {/* Official WhatsApp SVG Brand Icon */}
              <div className="w-6 h-6 rounded-lg bg-[#25D366] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </div>
              <span className="tracking-wide">Join Our WhatsApp Community</span>
            </a>

            {/* Instagram Profile Link */}
            <a
              href="https://www.instagram.com/oxnull_mrcet?srtk=a3V2djgyNm0xdXlk"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-2xl glass-card hover:border-[#E1306C] text-xs font-bold text-[#151417] hover:text-[#C13584] transition-all duration-300 shadow-sm hover:shadow-md cursor-pointer group"
            >
              {/* Official Instagram SVG Brand Icon */}
              <div className="w-6 h-6 rounded-lg bg-gradient-to-tr from-[#F58529] via-[#DD2A7B] to-[#8134AF] text-white flex items-center justify-center shrink-0 shadow-2xs group-hover:scale-105 transition-transform">
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </div>
              <span className="tracking-wide">Follow 0XNULL on Instagram</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
