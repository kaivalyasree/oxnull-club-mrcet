'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { DOMAINS } from '@/lib/data';

export default function Footer() {
  return (
    <footer className="relative bg-white/40 backdrop-blur-xl text-[#151417] border-t border-[#E8D8C3]/70 overflow-hidden">
      {/* Background ambient gold & blush radiance */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D4AF37]/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-1/4 w-96 h-96 bg-[#F7C4D0]/25 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-16 pb-12 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-[#E8D8C3]/70">
          {/* Col 1: Brand & Official Identity */}
          <div className="space-y-4">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="relative w-11 h-11 rounded-full overflow-hidden border border-[#D4AF37]/50 shadow-sm bg-white p-1 flex items-center justify-center">
                <Image
                  src="/assets/0xnull-symbol.png"
                  alt="0XNULL Primary Symbol"
                  width={36}
                  height={36}
                  className="object-contain"
                />
              </div>
              <div className="flex items-center">
                <span className="font-black tracking-[0.2em] text-xl text-[#151417]">
                  0X<span className="text-[#C89D3C]">NULL</span>
                </span>
              </div>
            </Link>

            <p className="text-xs text-[#645E6D] leading-relaxed max-w-sm">
              Official Cybersecurity Club under the Department of Cybersecurity, Malla Reddy College of Engineering and Technology.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-2.5">
              <Link
                href="/join"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors shadow-2xs"
              >
                <span>Join the Club</span>
              </Link>
              <a
                href="https://chat.whatsapp.com/EHqyjOz8Pa5KJXOJdkWfye"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#25D366] text-[#25D366] hover:text-white border border-[#E8D8C3] transition-colors shadow-2xs"
                title="Join WhatsApp Community"
                aria-label="Join WhatsApp Community"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
                </svg>
              </a>
              <a
                href="https://www.instagram.com/oxnull_mrcet?srtk=a3V2djgyNm0xdXlk"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-full bg-[#FAF7F2] hover:bg-[#E1306C] text-[#E1306C] hover:text-white border border-[#E8D8C3] transition-colors shadow-2xs"
                title="Follow 0XNULL on Instagram"
                aria-label="Follow 0XNULL on Instagram"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                </svg>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#967223] mb-4">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs text-[#645E6D]">
              <li>
                <Link href="/" className="hover:text-[#151417] transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/domains" className="hover:text-[#151417] transition-colors">
                  Domains
                </Link>
              </li>
              <li>
                <Link href="/activities" className="hover:text-[#151417] transition-colors">
                  Activities
                </Link>
              </li>
              <li>
                <Link href="/learn" className="hover:text-[#151417] transition-colors">
                  Learn
                </Link>
              </li>
              <li>
                <Link href="/projects" className="hover:text-[#151417] transition-colors">
                  Projects
                </Link>
              </li>
              <li>
                <Link href="/resources" className="hover:text-[#151417] transition-colors">
                  Resources
                </Link>
              </li>
              <li>
                <Link href="/certifications" className="hover:text-[#151417] transition-colors">
                  Certifications
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Seven Domains */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#967223] mb-4">
              Seven Domains
            </h4>
            <ul className="space-y-2 text-xs text-[#645E6D]">
              {DOMAINS.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/domains/${d.slug}`}
                    className="hover:text-[#967223] transition-colors flex items-center justify-between"
                  >
                    <span>
                      {d.number} · {d.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 4: Institutional Recognition */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-[#967223] mb-4">
              Institution
            </h4>
            <div className="space-y-2 text-xs text-[#645E6D]">
              <p className="font-semibold text-[#151417]">Malla Reddy College of Engineering and Technology</p>
              <p>Department of Cybersecurity</p>
              <p className="pt-2 text-[11px] text-[#8A8592]">
                Autonomous Institution • UGC, Govt. of India
              </p>
            </div>
          </div>
        </div>

        {/* DESIGNER ATTRIBUTION BAR — EXACTLY THREE NAMES, STRICTLY ZERO ROLES */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex flex-col items-center md:items-start text-center md:text-left">
            <span className="text-[10px] font-bold tracking-[0.25em] text-[#967223] uppercase mb-1.5">
              DESIGNED BY
            </span>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-x-4 gap-y-1 text-xs font-semibold tracking-wider text-[#151417]">
              <span>M. Mani Vardhan Reddy</span>
              <span className="text-[#C89D3C]/50">•</span>
              <span>S. Kaivalya</span>
              <span className="text-[#C89D3C]/50">•</span>
              <span>D. Aravind Koushik</span>
            </div>
          </div>

          <div className="text-center md:text-right text-[11px] text-[#8A8592]">
            <p>© 2026 0XNULL. Department of Cybersecurity.</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
