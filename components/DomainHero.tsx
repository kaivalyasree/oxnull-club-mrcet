'use client';

import React from 'react';
import Link from 'next/link';
import { Domain } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { ShieldCheck, Plus, Check, ArrowLeft, BookOpen, Award, FolderGit2, Compass, Layers, Clock } from 'lucide-react';

interface DomainHeroProps {
  domain: Domain;
  onEnrollClick?: () => void;
  enrolledTrackName?: string;
  enrollmentStatus?: 'pending' | 'approved' | 'rejected' | null;
}

export default function DomainHero({
  domain,
  onEnrollClick,
  enrolledTrackName,
  enrollmentStatus
}: DomainHeroProps) {
  const { user, progress, toggleEnrollDomain } = useAuth();
  const isEnrolledBookmark = progress.enrolledDomains.includes(domain.id);
  const isEnrolled = Boolean(enrollmentStatus || isEnrolledBookmark);

  const handleEnrollClick = () => {
    if (onEnrollClick) {
      onEnrollClick();
    } else {
      // Fallback: smooth scroll to core tracks section
      const target = document.getElementById('core-tracks');
      if (target) {
        target.scrollIntoView({ behavior: 'smooth' });
      } else {
        toggleEnrollDomain(domain.id);
      }
    }
  };

  return (
    <section className="relative pt-8 pb-12 overflow-hidden border-b border-[#E8D8C3]/50">
      {/* Ambient background light matching Pink + Gold palette */}
      <div className="absolute top-0 right-10 w-80 h-80 bg-[#F7E7E9]/40 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#F5EBDD]/50 rounded-full blur-3xl pointer-events-none" />

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
          <span className="text-[#967223] font-semibold">{domain.name}</span>
        </div>

        {/* Header content */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6">
          <div className="max-w-3xl">
            <div className="flex items-center gap-3 mb-3">
              <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#151417] text-[#FAF7F2]">
                DOMAIN {domain.number} / 07
              </span>
              <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
                {domain.badge}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#151417] tracking-tight leading-tight mb-4">
              {domain.name}
            </h1>

            <p className="text-base sm:text-lg text-[#55505C] font-medium leading-relaxed max-w-2xl">
              {domain.tagline}
            </p>
          </div>

          {/* Action Button: Enroll in Domain Track */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={handleEnrollClick}
              className={`px-5 py-2.5 rounded-full text-xs sm:text-sm font-bold tracking-wide transition-all cursor-pointer flex items-center gap-2 shadow-sm ${
                enrollmentStatus === 'approved'
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : enrollmentStatus === 'pending'
                  ? 'bg-amber-600 text-white hover:bg-amber-700'
                  : isEnrolled
                  ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                  : 'bg-gradient-to-r from-[#C89D3C] to-[#A87D25] text-white hover:opacity-95'
              }`}
            >
              {enrollmentStatus === 'approved' ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Enrolled: {enrolledTrackName || 'Approved'}</span>
                </>
              ) : enrollmentStatus === 'pending' ? (
                <>
                  <Clock className="w-4 h-4" />
                  <span>Enrollment Pending: {enrolledTrackName || 'Review'}</span>
                </>
              ) : isEnrolled ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Enrolled in Track</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Enroll in this Track</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* In-page Anchor Navigation */}
        <div className="pt-4 border-t border-[#E8D8C3]/50 flex items-center gap-2 sm:gap-4 overflow-x-auto text-xs font-semibold text-[#645E6D]">
          <a
            href="#core-tracks"
            className="px-3 py-1.5 rounded-full bg-[#F5EBDD] text-[#967223] font-bold hover:bg-[#F5EBDD]/80 transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Core Tracks</span>
          </a>
          <a
            href="#overview"
            className="px-3 py-1.5 rounded-full hover:bg-[#F5EBDD] hover:text-[#151417] transition-colors whitespace-nowrap"
          >
            Overview
          </a>
          <a
            href="#focus-areas"
            className="px-3 py-1.5 rounded-full hover:bg-[#F5EBDD] hover:text-[#151417] transition-colors whitespace-nowrap"
          >
            Focus Areas
          </a>

          {domain.slug === 'awareness' ? (
            <>
              <a
                href="#scans"
                className="px-3 py-1.5 rounded-full hover:bg-[#F5EBDD] hover:text-[#151417] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Latest Scans</span>
              </a>
              <a
                href="#tech-news"
                className="px-3 py-1.5 rounded-full hover:bg-[#F5EBDD] hover:text-[#151417] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Tech News</span>
              </a>
              <a
                href="#threat-watch"
                className="px-3 py-1.5 rounded-full hover:bg-[#F5EBDD] hover:text-[#151417] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Threat Watch</span>
              </a>
              <a
                href="#advisories"
                className="px-3 py-1.5 rounded-full hover:bg-[#F5EBDD] hover:text-[#151417] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Advisories</span>
              </a>
            </>
          ) : domain.slug === 'explore' ? (
            <>
              <a
                href="#explore-modules"
                className="px-3 py-1.5 rounded-full hover:bg-[#F5EBDD] hover:text-[#151417] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <span>Development Modules</span>
              </a>
            </>
          ) : (
            <>
              <a
                href="#resources"
                className="px-3 py-1.5 rounded-full hover:bg-[#F5EBDD] hover:text-[#151417] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <BookOpen className="w-3.5 h-3.5 text-[#C89D3C]" />
                <span>Resources</span>
              </a>
              <a
                href="#certifications"
                className="px-3 py-1.5 rounded-full hover:bg-[#F5EBDD] hover:text-[#151417] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <Award className="w-3.5 h-3.5 text-[#C89D3C]" />
                <span>Certifications</span>
              </a>
              <a
                href="#projects"
                className="px-3 py-1.5 rounded-full hover:bg-[#F5EBDD] hover:text-[#151417] transition-colors whitespace-nowrap flex items-center gap-1.5"
              >
                <FolderGit2 className="w-3.5 h-3.5 text-[#C89D3C]" />
                <span>Projects</span>
              </a>
            </>
          )}

          <a
            href="#pathway"
            className="px-3 py-1.5 rounded-full hover:bg-[#F5EBDD] hover:text-[#151417] transition-colors whitespace-nowrap flex items-center gap-1.5"
          >
            <Compass className="w-3.5 h-3.5 text-[#C89D3C]" />
            <span>Learning Pathway</span>
          </a>
        </div>
      </div>
    </section>
  );
}
