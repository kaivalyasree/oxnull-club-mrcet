import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import DomainHero from '@/components/DomainHero';
import DomainTracksSection from '@/components/DomainTracksSection';
import ResourceCard from '@/components/ResourceCard';
import CertificationCard from '@/components/CertificationCard';
import ProjectCard from '@/components/ProjectCard';
import { DOMAINS, Domain } from '@/lib/data';
import { db } from '@/lib/store';
import AwarenessIntelligenceSection from '@/components/AwarenessIntelligenceSection';
import ExploreModulesSection from '@/components/ExploreModulesSection';
import {
  BookOpen,
  Award,
  FolderGit2,
  ArrowRight
} from 'lucide-react';

export function generateStaticParams() {
  return DOMAINS.map((domain) => ({
    slug: domain.slug
  }));
}

export async function generateMetadata({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const domain = db.getDomainBySlug(slug) || DOMAINS.find((d) => d.slug === slug);
  if (!domain) return { title: 'Domain Not Found | 0XNULL' };

  return {
    title: `${domain.number} · ${domain.name} | 0XNULL`,
    description: domain.tagline
  };
}

export default async function DomainDetailPage({
  params
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const domain = db.getDomainBySlug(slug) || DOMAINS.find((d) => d.slug === slug);

  if (!domain) {
    notFound();
  }

  // Filter domain-specific published items from backend database store
  const domainResources = db.getResources().filter(
    (r) => r.domainId === domain.id && r.isPublished !== false
  );
  const domainCertifications = db.getCertifications().filter(
    (c) => c.domainId === domain.id && c.isPublished !== false
  );
  const domainProjects = db.getProjects().filter(
    (p) => p.domainId === domain.id && p.isPublished !== false
  );

  return (
    <div className="min-h-screen pb-24">
      {/* A. Premium Domain Hero */}
      <DomainHero domain={domain} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-20">
        {/* Core Learning Tracks Section */}
        <DomainTracksSection domain={domain} />
        {/* B. What this domain covers */}
        <section id="overview" className="scroll-mt-24">
          <div className="glass-card rounded-3xl p-8 sm:p-10 border-[#E8D8C3]">
            <span className="text-xs uppercase font-bold tracking-widest text-[#967223] block mb-2">
              Domain Scope & Methodology
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#151417] mb-4">
              What This Domain Covers
            </h2>
            <p className="text-sm sm:text-base text-[#55505C] leading-relaxed max-w-4xl">
              {domain.overview}
            </p>
          </div>
        </section>

        {/* C. Focus Areas */}
        <section id="focus-areas" className="scroll-mt-24">
          <div className="flex items-center justify-between mb-6">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
                Syllabus Breakdown
              </span>
              <h3 className="text-2xl font-black text-[#151417]">Focus Areas</h3>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(domain.focusAreas || []).map((area, idx) => (
              <div
                key={idx}
                className="glass-card rounded-2xl p-4 flex items-start gap-3 border-[#E8D8C3]"
              >
                <div className="w-6 h-6 rounded-lg bg-[#FAF7F2] text-[#967223] border border-[#E8D8C3] flex items-center justify-center shrink-0 font-mono text-[10px] font-bold">
                  {idx + 1 < 10 ? `0${idx + 1}` : idx + 1}
                </div>
                <p className="text-xs font-semibold text-[#151417] leading-relaxed">{area}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Domain Custom Modules / Living Library */}
        {domain.slug === 'awareness' ? (
          /* Awareness Intelligence Modules: Latest Scans, Tech News, Threat Watch, Security Advisories */
          <AwarenessIntelligenceSection />
        ) : domain.slug === 'explore' ? (
          /* Explore Non-Technical Development Modules: Communication, PR, Networking, Leadership & Collaboration, Planning & Operations */
          <ExploreModulesSection />
        ) : (
          /* 5 Core Technical Domains: Resources, Certifications, Projects */
          <>
            {/* E. RESOURCES — Structural Section with Clean Empty State */}
            <section id="resources" className="scroll-mt-24 pt-4 border-t border-[#E8D8C3]/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2">
                    <BookOpen className="w-5 h-5 text-[#C89D3C]" />
                    <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
                      Living Library
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#151417] mt-1">
                    Domain Resources
                  </h3>
                  <p className="text-xs text-[#645E6D] mt-1">
                    Vetted papers, walkthroughs, and tools for this domain.
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

              {domainResources.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {domainResources.map((res) => (
                    <ResourceCard key={res.id} resource={res} />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-10 text-center border-[#E8D8C3]">
                  <BookOpen className="w-8 h-8 text-[#967223] mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-[#151417]">No resources available yet.</p>
                  <p className="text-xs text-[#645E6D] mt-1">
                    Curated research papers, tutorials, and domain tools will be listed here as cohorts initiate.
                  </p>
                </div>
              )}
            </section>

            {/* F. CERTIFICATIONS — Structural Section with Clean Empty State */}
            <section id="certifications" className="scroll-mt-24 pt-4 border-t border-[#E8D8C3]/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2">
                    <Award className="w-5 h-5 text-[#C89D3C]" />
                    <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
                      Industry Alignment
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#151417] mt-1">
                    Domain Certifications
                  </h3>
                  <p className="text-xs text-[#645E6D] mt-1">
                    Industry-recognized credentials mapped to this domain.
                  </p>
                </div>
                <Link
                  href="/certifications"
                  className="text-xs font-bold uppercase tracking-wider text-[#8C6B1B] hover:text-[#151417] flex items-center gap-1"
                >
                  <span>Full Roadmap</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {domainCertifications.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {domainCertifications.map((c) => (
                    <CertificationCard key={c.id} certification={c} />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-10 text-center border-[#E8D8C3]">
                  <Award className="w-8 h-8 text-[#967223] mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-[#151417]">No certifications added yet.</p>
                  <p className="text-xs text-[#645E6D] mt-1">
                    Curated industry credentials, pathways, and recommended exam tracks will appear here.
                  </p>
                </div>
              )}
            </section>

            {/* G. PROJECTS — Structural Section with Clean Empty State */}
            <section id="projects" className="scroll-mt-24 pt-4 border-t border-[#E8D8C3]/50">
              <div className="flex items-center justify-between mb-8">
                <div>
                  <div className="flex items-center gap-2">
                    <FolderGit2 className="w-5 h-5 text-[#C89D3C]" />
                    <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
                      Code & Tooling
                    </span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#151417] mt-1">
                    Domain Projects
                  </h3>
                  <p className="text-xs text-[#645E6D] mt-1">
                    Collaborative repositories built by club working groups.
                  </p>
                </div>
                <Link
                  href="/projects"
                  className="text-xs font-bold uppercase tracking-wider text-[#8C6B1B] hover:text-[#151417] flex items-center gap-1"
                >
                  <span>All Projects</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>

              {domainProjects.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {domainProjects.map((p) => (
                    <ProjectCard key={p.id} project={p} />
                  ))}
                </div>
              ) : (
                <div className="glass-card rounded-2xl p-10 text-center border-[#E8D8C3]">
                  <FolderGit2 className="w-8 h-8 text-[#967223] mx-auto mb-2 opacity-50" />
                  <p className="text-sm font-bold text-[#151417]">No projects published yet.</p>
                  <p className="text-xs text-[#645E6D] mt-1">
                    Working groups will publish verified collaborative tools and repositories here.
                  </p>
                </div>
              )}
            </section>
          </>
        )}

        {/* H. LEARNING PATHWAY — Beginner → Intermediate → Advanced */}
        <section id="pathway" className="scroll-mt-24 pt-4 border-t border-[#E8D8C3]/50">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
              Structured Progression
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-[#151417] mt-1">
              Recommended Learning Pathway
            </h3>
            <p className="text-xs sm:text-sm text-[#645E6D] mt-2">
              Progress from novice exploration to advanced adversarial mastery.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {(domain.learningPathway || []).map((step, idx) => (
              <div
                key={idx}
                className="glass-card rounded-3xl p-6 flex flex-col justify-between border-[#E8D8C3]"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-mono text-xs font-black text-[#967223]">
                      STAGE 0{idx + 1}
                    </span>
                    <span
                      className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        step.stage === 'Beginner'
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : step.stage === 'Intermediate'
                          ? 'bg-[#F5EBDD] text-[#8C6B1B] border-[#E8D8C3]'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {step.stage}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#151417] mb-2">{step.title}</h4>
                  <p className="text-xs text-[#55505C] leading-relaxed mb-4">
                    {step.description}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#E8D8C3]/50">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                    Required Deliverable
                  </span>
                  <p className="text-xs font-semibold text-[#151417]">{step.deliverable}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* J. CTA */}
        <section className="glass-card rounded-3xl p-8 sm:p-12 text-center border-[#D4AF37]/40 bg-gradient-to-b from-[#FAF7F2] to-[#F5EBDD]/50">
          <h3 className="text-2xl sm:text-3xl font-black text-[#151417] mb-3">
            Join the {domain.name} Working Guild
          </h3>
          <p className="text-xs sm:text-sm text-[#55505C] max-w-xl mx-auto mb-6">
            Collaborate with peers, attend domain workshops, build production-grade tools, and prepare for competitions.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <a
              href="#core-tracks"
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors"
            >
              Enroll in Core Tracks
            </a>
            <Link
              href="/domains"
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-white border border-[#E8D8C3] text-[#8C6B1B] hover:bg-[#FAF7F2] transition-colors"
            >
              Browse Other Domains
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
