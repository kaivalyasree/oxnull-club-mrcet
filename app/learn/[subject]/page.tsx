import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { LEARNING_SUBJECTS, LearningSubject } from '@/lib/data';
import { db } from '@/lib/store';
import ResourceCard from '@/components/ResourceCard';
import {
  ArrowLeft,
  BookOpen,
  Terminal,
  Network,
  Layers,
  ShieldAlert,
  CheckCircle2,
  FlaskConical,
  Compass,
  ArrowRight
} from 'lucide-react';

export function generateStaticParams() {
  return LEARNING_SUBJECTS.map((subject) => ({
    subject: subject.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: slug } = await params;
  const subject = db.getLearningSubjectBySlug(slug) || LEARNING_SUBJECTS.find((s) => s.slug === slug || s.id === slug);
  if (!subject) {
    return { title: 'Subject Not Found | 0XNULL' };
  }

  return {
    title: `${subject.title} Learning Hub | 0XNULL`,
    description: subject.description
  };
}

const getSubjectIcon = (slug: string) => {
  switch (slug) {
    case 'linux':
      return <Terminal className="w-8 h-8 text-[#C89D3C]" />;
    case 'networking':
      return <Network className="w-8 h-8 text-[#C89D3C]" />;
    case 'operating-system':
      return <Layers className="w-8 h-8 text-[#C89D3C]" />;
    case 'security-fundamentals':
      return <ShieldAlert className="w-8 h-8 text-[#C89D3C]" />;
    default:
      return <BookOpen className="w-8 h-8 text-[#C89D3C]" />;
  }
};

export default async function SubjectLearningPage({
  params
}: {
  params: Promise<{ subject: string }>;
}) {
  const { subject: slug } = await params;
  const subject = db.getLearningSubjectBySlug(slug) || LEARNING_SUBJECTS.find((s) => s.slug === slug || s.id === slug);

  if (!subject) {
    notFound();
  }

  // Fetch verified published resources for this subject
  const subjectResources = db.getResources({
    publishedOnly: true
  }).filter(
    (r) =>
      r.subjectId === subject.id ||
      r.subjectId === subject.slug ||
      (r.subjectName && r.subjectName.toLowerCase() === subject.title.toLowerCase())
  );

  return (
    <div className="min-h-screen pb-24">
      {/* Ambient glow */}
      <div className="relative pt-8 pb-12 overflow-hidden border-b border-[#E8D8C3]/50">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#F7E7E9]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#F5EBDD]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
          {/* Back to Learn Navigation */}
          <div className="mb-6 flex items-center gap-2 text-xs text-[#8A8592]">
            <Link
              href="/learn"
              className="inline-flex items-center gap-1.5 font-semibold text-[#8C6B1B] hover:text-[#151417] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Foundation Curriculum</span>
            </Link>
            <span>/</span>
            <span className="text-[#151417] font-semibold">{subject.title}</span>
          </div>

          {/* Subject Header */}
          <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-4">
            <div className="max-w-3xl">
              <div className="flex items-center gap-3 mb-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#151417] text-[#FAF7F2]">
                  SUBJECT {subject.number} / 04
                </span>
                <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
                  Core Foundation
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="p-3 rounded-2xl bg-white border border-[#E8D8C3] shadow-xs">
                  {getSubjectIcon(subject.slug)}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black text-[#151417] tracking-tight">
                    {subject.title}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-[#8C6B1B] mt-1">
                    {subject.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#55505C] font-medium leading-relaxed max-w-2xl">
                {subject.description}
              </p>
            </div>

            <div className="shrink-0 flex flex-col gap-2">
              <Link
                href="/learn"
                className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-white border border-[#E8D8C3] text-[#8C6B1B] hover:bg-[#FAF7F2] transition-colors text-center shadow-xs"
              >
                All 4 Subjects
              </Link>
              <Link
                href="/domains"
                className="px-5 py-2.5 rounded-full text-xs font-bold tracking-wider uppercase bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors text-center shadow-xs"
              >
                Next: Choose Domain
              </Link>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-16">
        {/* Core Concepts */}
        <section id="concepts" className="scroll-mt-24">
          <div className="flex items-center gap-2 mb-6">
            <CheckCircle2 className="w-5 h-5 text-[#C89D3C]" />
            <h2 className="text-2xl font-black text-[#151417]">Key Concepts & Fluency Goals</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {subject.keyConcepts.map((concept, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex items-start gap-3"
              >
                <div className="w-6 h-6 rounded-lg bg-[#FAF7F2] text-[#967223] border border-[#E8D8C3] flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </div>
                <div>
                  <h3 className="text-sm font-bold text-[#151417]">{concept}</h3>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Hands-On Verification Lab */}
        <section id="lab" className="scroll-mt-24">
          <div className="glass-card rounded-3xl p-8 sm:p-10 border-[#D4AF37]/40 bg-gradient-to-r from-white via-[#FAF7F2] to-[#F5EBDD]/50">
            <div className="flex items-center gap-3 mb-3">
              <div className="p-2 rounded-xl bg-[#151417] text-[#E5C378]">
                <FlaskConical className="w-5 h-5" />
              </div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
                Practical Milestone
              </span>
            </div>
            <h2 className="text-2xl font-black text-[#151417] mb-3">
              Hands-On Verification Lab
            </h2>
            <p className="text-sm text-[#55505C] leading-relaxed max-w-3xl">
              {subject.handsOnLab}
            </p>
          </div>
        </section>

        {/* Subject Resources (Published Only) */}
        <section id="resources" className="scroll-mt-24 pt-4 border-t border-[#E8D8C3]/50">
          <div className="flex items-center justify-between mb-8">
            <div>
              <div className="flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-[#C89D3C]" />
                <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
                  Living Library
                </span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#151417] mt-1">
                {subject.title} Resources
              </h2>
              <p className="text-xs text-[#645E6D] mt-1">
                Curated tutorials, official documentation, cheat sheets, and practical walkthroughs.
              </p>
            </div>

            <Link
              href="/resources"
              className="text-xs font-bold uppercase tracking-wider text-[#8C6B1B] hover:text-[#151417] flex items-center gap-1"
            >
              <span>All Resources</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {subjectResources.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {subjectResources.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-12 text-center border-[#E8D8C3] max-w-2xl mx-auto space-y-4">
              <BookOpen className="w-10 h-10 text-[#C89D3C] mx-auto opacity-50" />
              <div>
                <h3 className="text-base font-bold text-[#151417]">
                  No resources added yet for {subject.title}
                </h3>
                <p className="text-xs text-[#645E6D] mt-1.5 max-w-md mx-auto leading-relaxed">
                  Curated study materials, technical walkthroughs, and official documentation added by club administrators will appear here.
                </p>
              </div>
              <div className="pt-2 flex flex-wrap items-center justify-center gap-3">
                <Link
                  href="/learn"
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors"
                >
                  Return to Learn
                </Link>
                <Link
                  href="/resources"
                  className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-white border border-[#E8D8C3] text-[#8C6B1B] hover:bg-[#FAF7F2] transition-colors"
                >
                  Browse Global Resources
                </Link>
              </div>
            </div>
          )}
        </section>

        {/* Bottom Navigation */}
        <section className="glass-card rounded-3xl p-8 text-center border-[#E8D8C3] bg-[#FAF7F2]/60">
          <h3 className="text-xl font-bold text-[#151417] mb-2">
            Completed {subject.title}?
          </h3>
          <p className="text-xs text-[#55505C] max-w-lg mx-auto mb-6">
            Continue across the other foundational modules or explore our seven specialized cybersecurity domains.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/learn"
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-[#E8D8C3] text-[#8C6B1B] hover:bg-[#FAF7F2] transition-colors"
            >
              ← Back to All Subjects
            </Link>
            <Link
              href="/domains"
              className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors"
            >
              Explore 7 Domains →
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
