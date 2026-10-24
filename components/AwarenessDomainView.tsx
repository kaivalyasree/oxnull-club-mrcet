'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Newspaper,
  ShieldAlert,
  AlertTriangle,
  Calendar,
  ExternalLink,
  ShieldCheck,
  Search,
  PhoneCall,
  FileText,
  CheckCircle2,
  AlertCircle,
  ChevronDown,
  ChevronUp,
  RefreshCw,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import AwarenessHero from './AwarenessHero';
import { Domain } from '@/lib/data';
import type { AwarenessArticle } from '@/lib/store';

interface AwarenessDomainViewProps {
  domain: Domain;
  initialArticles?: AwarenessArticle[];
}

export default function AwarenessDomainView({ domain, initialArticles = [] }: AwarenessDomainViewProps) {
  const [articles, setArticles] = useState<AwarenessArticle[]>(initialArticles);
  const [searchQuery, setSearchQuery] = useState('');
  const [techNewsTagFilter, setTechNewsTagFilter] = useState('all');
  const [expandedScams, setExpandedScams] = useState<Record<string, boolean>>({
    'art-scam-1': true,
    'art-scam-2': true
  });
  const [isLoading, setIsLoading] = useState(initialArticles.length === 0);

  // Fetch verified published articles from database/API
  const fetchArticles = () => {
    setIsLoading(true);
    fetch('/api/awareness/articles')
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setArticles(data.data);
        }
      })
      .catch((err) => console.warn('Using server-provided awareness articles', err))
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    if (initialArticles.length === 0) {
      fetchArticles();
    }
  }, []);

  const toggleScamExpand = (id: string) => {
    setExpandedScams((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  // Group by the three required categories
  const techNewsArticles = articles.filter((a) => a.category === 'tech-news');
  const cyberNewsArticles = articles.filter((a) => a.category === 'cyber-news');
  const scamArticles = articles.filter((a) => a.category === 'scam-alert');

  // Filter Tech News by search query and tag
  const filteredTechNews = techNewsArticles.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q) ||
      (item.tag && item.tag.toLowerCase().includes(q));

    const matchesTag =
      techNewsTagFilter === 'all' ||
      (item.tag && item.tag.toLowerCase().includes(techNewsTagFilter.toLowerCase()));

    return matchesSearch && matchesTag;
  });

  // Filter Cybersecurity News by search query
  const filteredCyberNews = cyberNewsArticles.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q) ||
      (item.tag && item.tag.toLowerCase().includes(q))
    );
  });

  // Filter Scam Articles by search query
  const filteredScams = scamArticles.filter((item) => {
    const q = searchQuery.toLowerCase().trim();
    return (
      !q ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      (item.scamType && item.scamType.toLowerCase().includes(q)) ||
      (item.redFlags && item.redFlags.some((rf) => rf.toLowerCase().includes(q)))
    );
  });

  return (
    <div className="min-h-screen pb-24">
      {/* 1. Redesigned Awareness Hero (No enrollments, no tracks, no course navigation) */}
      <AwarenessHero domain={domain} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-20">
        {/* Global Search Bar for Awareness Articles */}
        <div className="max-w-xl mx-auto">
          <div className="relative">
            <Search className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search weekly tech news, security bulletins, or scam tactics..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-full text-xs bg-white/80 border border-[#E8D8C3] focus:border-[#C89D3C] focus:outline-none focus:ring-1 focus:ring-[#C89D3C] text-[#151417] placeholder:text-[#8A8592] transition-colors"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] uppercase font-bold text-[#8A8592] hover:text-[#151417]"
              >
                Clear
              </button>
            )}
          </div>
        </div>

        {/* ======================================================================
            SECTION A: TECHNOLOGY NEWS — PUBLISHED WEEKLY
            ====================================================================== */}
        <section id="tech-news" className="scroll-mt-24">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#967223] border border-[#E8D8C3]">
                  Published Weekly
                </span>
                <span className="text-xs text-[#8A8592]">· Category 01</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-[#151417] tracking-tight">
                Technology News
              </h2>
              <p className="text-xs sm:text-sm text-[#55505C] mt-1 max-w-2xl leading-relaxed">
                Regular weekly developments across the technology industry, artificial intelligence, operating systems, hardware engineering, and digital privacy relevant to our student body.
              </p>
            </div>

            {/* Topic Filter Pills */}
            <div className="flex flex-wrap items-center gap-1.5 shrink-0">
              {['all', 'AI & Computing', 'Operating Systems', 'Software'].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTechNewsTagFilter(tag)}
                  className={`text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full transition-colors ${
                    techNewsTagFilter === tag
                      ? 'bg-[#151417] text-[#FAF7F2]'
                      : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {tag === 'all' ? 'All Topics' : tag}
                </button>
              ))}
            </div>
          </div>

          {filteredTechNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredTechNews.map((article) => (
                <div
                  key={article.id}
                  className="glass-card rounded-3xl p-6 flex flex-col justify-between border-[#E8D8C3] hover:border-[#C89D3C] transition-all duration-300 group shadow-2xs hover:shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#FAF7F2] text-[#967223] border border-[#E8D8C3]">
                        {article.tag || 'Tech News'}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#8A8592]">
                        <Calendar className="w-3 h-3 text-[#C89D3C]" />
                        <span>{article.publishedDate}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#151417] leading-snug group-hover:text-[#967223] transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-xs text-[#55505C] leading-relaxed line-clamp-4">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-[#8A8592] truncate max-w-[140px]" title={article.source}>
                      {article.source}
                    </span>
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#967223] hover:text-[#151417] flex items-center gap-1 group/link"
                    >
                      <span>Read Story</span>
                      <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 text-center border-[#E8D8C3]">
              <Newspaper className="w-8 h-8 text-[#967223] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-[#151417]">No technology news stories match your query.</p>
              <p className="text-xs text-[#645E6D] mt-1">Check back weekly for new curated technical briefs.</p>
            </div>
          )}
        </section>

        {/* ======================================================================
            SECTION B: CYBERSECURITY NEWS — EVERY 14 DAYS
            ====================================================================== */}
        <section id="cyber-news" className="scroll-mt-24 pt-4 border-t border-[#E8D8C3]/50">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#F5EBDD] text-[#8C6B1B] border border-[#E8D8C3]">
                Editorial Cadence: Every 14 Days
              </span>
              <span className="text-xs text-[#8A8592]">· Category 02</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#151417] tracking-tight">
              Cybersecurity News
            </h2>
            <p className="text-xs sm:text-sm text-[#55505C] mt-1 max-w-2xl leading-relaxed">
              OXNULL publishes a major cybersecurity incident and vulnerability roundup every 14 days, compiling vetted reports from official advisories (CERT-In, CISA, NIST) and peer-reviewed industry disclosures.
            </p>
          </div>

          {filteredCyberNews.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredCyberNews.map((article) => (
                <div
                  key={article.id}
                  className="glass-card rounded-3xl p-6 flex flex-col justify-between border-[#E8D8C3] hover:border-[#967223] transition-all duration-300 group shadow-2xs hover:shadow-sm"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-amber-50 text-amber-900 border border-amber-200">
                        {article.tag || 'Security Advisory'}
                      </span>
                      <div className="flex items-center gap-1 text-[11px] font-mono text-[#8A8592]">
                        <Calendar className="w-3 h-3 text-[#C89D3C]" />
                        <span>{article.publishedDate}</span>
                      </div>
                    </div>

                    <h3 className="text-base font-bold text-[#151417] leading-snug group-hover:text-[#967223] transition-colors">
                      {article.title}
                    </h3>

                    <p className="text-xs text-[#55505C] leading-relaxed line-clamp-4">
                      {article.summary}
                    </p>
                  </div>

                  <div className="pt-4 mt-4 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs">
                    <span className="text-[11px] font-semibold text-[#8A8592] truncate max-w-[140px]" title={article.source}>
                      {article.source}
                    </span>
                    <a
                      href={article.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-[#967223] hover:text-[#151417] flex items-center gap-1 group/link"
                    >
                      <span>Primary Source</span>
                      <ExternalLink className="w-3 h-3 group-hover/link:translate-x-0.5 transition-transform" />
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-8 text-center border-[#E8D8C3]">
              <ShieldAlert className="w-8 h-8 text-[#967223] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-[#151417]">No cybersecurity updates matching your criteria.</p>
              <p className="text-xs text-[#645E6D] mt-1">Our fortnightly security bulletin updates every 14 days.</p>
            </div>
          )}

          {/* Dedicated Sub-Page Access Links */}
          <div className="mt-8 p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-white text-[#967223] border border-[#E8D8C3]">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-[#151417]">Deep Intelligence Archives & Live Feeds</p>
                <p className="text-[11px] text-[#645E6D]">Explore our live telemetry feeds, vulnerability catalogs, and advisories.</p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2 text-xs font-bold">
              <Link
                href="/domains/awareness/news"
                className="px-3 py-1.5 rounded-full bg-white border border-[#E8D8C3] hover:border-[#967223] text-[#151417] hover:text-[#967223] transition-colors"
              >
                Full News Archive →
              </Link>
              <Link
                href="/domains/awareness/advisories"
                className="px-3 py-1.5 rounded-full bg-white border border-[#E8D8C3] hover:border-[#967223] text-[#151417] hover:text-[#967223] transition-colors"
              >
                CISA Advisories →
              </Link>
              <Link
                href="/domains/awareness/threat-watch"
                className="px-3 py-1.5 rounded-full bg-white border border-[#E8D8C3] hover:border-[#967223] text-[#151417] hover:text-[#967223] transition-colors"
              >
                Threat Watch (KEV) →
              </Link>
            </div>
          </div>
        </section>

        {/* ======================================================================
            SECTION C: SCAM AWARENESS & EXPOSURE
            ====================================================================== */}
        <section id="scam-awareness" className="scroll-mt-24 pt-4 border-t border-[#E8D8C3]/50">
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200">
                Public Protection & Defense
              </span>
              <span className="text-xs text-[#8A8592]">· Category 03</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-[#151417] tracking-tight">
              Scam Awareness & Exposure
            </h2>
            <p className="text-xs sm:text-sm text-[#55505C] mt-1 max-w-3xl leading-relaxed">
              Exposing the deceptive mechanics and psychological manipulation tactics of trending fraudulent schemes. Learn to spot the red flags, protect your finances and personal credentials, and take immediate recovery actions if targeted.
            </p>
          </div>

          {/* Emergency Assistance Banner */}
          <div className="mb-10 glass-card rounded-3xl p-6 sm:p-8 border-rose-200 bg-gradient-to-r from-rose-50/70 via-[#FAF7F2] to-amber-50/50 shadow-xs">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="p-2 rounded-xl bg-rose-600 text-white shrink-0">
                    <PhoneCall className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-800">
                    Targeted by Online Fraud? Take Immediate Action
                  </span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-[#151417]">
                  National Cyber Crime Helpline: <span className="text-rose-600">Dial 1930</span>
                </h3>
                <p className="text-xs text-[#55505C] max-w-2xl leading-relaxed">
                  If money has been debited fraudulently, call <strong>1930</strong> immediately within the <em>Golden Hour</em> to request an emergency banking transaction freeze, and register your complaint on the official portal.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>cybercrime.gov.in</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                <a
                  href="https://sancharsaathi.gov.in/sfc/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-[#E8D8C3] text-[#8C6B1B] hover:bg-[#FAF7F2] transition-colors flex items-center gap-1.5 shadow-xs"
                >
                  <span>Chakshu (Report Numbers)</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* Scam Awareness Detailed Breakdown Cards */}
          <div className="space-y-6">
            {filteredScams.map((scam) => {
              const isExpanded = expandedScams[scam.id] ?? false;

              return (
                <div
                  key={scam.id}
                  className="glass-card rounded-3xl p-6 sm:p-8 border-[#E8D8C3] hover:border-[#967223] transition-all duration-300"
                >
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-4 border-b border-[#E8D8C3]/50">
                    <div className="space-y-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-rose-50 text-rose-800 border border-rose-200 flex items-center gap-1">
                          <AlertTriangle className="w-3 h-3 text-rose-600" />
                          <span>Scam Alert</span>
                        </span>
                        {scam.scamType && (
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#967223] border border-[#E8D8C3]">
                            {scam.scamType}
                          </span>
                        )}
                        <span className="text-[11px] font-mono text-[#8A8592]">
                          Updated: {scam.publishedDate}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-[#151417]">
                        {scam.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed max-w-4xl">
                        {scam.summary}
                      </p>
                    </div>

                    <button
                      onClick={() => toggleScamExpand(scam.id)}
                      className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-white border border-[#E8D8C3] hover:border-[#967223] text-[#151417] flex items-center gap-1.5 shrink-0 self-start sm:self-center transition-colors"
                    >
                      <span>{isExpanded ? 'Hide Analysis' : 'Deconstruct Scam'}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </button>
                  </div>

                  {/* Expanded Scam Deconstruction (Mechanism, Red Flags, Safety, Recovery) */}
                  {isExpanded && (
                    <div className="pt-6 space-y-6 animate-in fade-in duration-300">
                      {/* 1. How It Typically Works */}
                      {scam.howItWorks && scam.howItWorks.length > 0 && (
                        <div>
                          <div className="flex items-center gap-2 mb-3">
                            <FileText className="w-4 h-4 text-[#C89D3C]" />
                            <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-[#967223]">
                              1. How the Scam Typically Works
                            </h4>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-3">
                            {scam.howItWorks.map((step, idx) => (
                              <div
                                key={idx}
                                className="p-3.5 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-1.5"
                              >
                                <span className="font-mono text-[10px] font-black text-[#967223] block">
                                  STEP 0{idx + 1}
                                </span>
                                <p className="text-xs text-[#55505C] leading-relaxed">{step}</p>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* 2 Columns: Red Flags & Safety Tips */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Red Flags */}
                        {scam.redFlags && scam.redFlags.length > 0 && (
                          <div className="p-5 rounded-2xl bg-rose-50/40 border border-rose-200 space-y-3">
                            <div className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4 text-rose-600" />
                              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-rose-800">
                                Warning Signs (Red Flags)
                              </h4>
                            </div>
                            <ul className="space-y-2 text-xs text-[#47434E]">
                              {scam.redFlags.map((flag, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <span className="text-rose-600 font-bold shrink-0">✕</span>
                                  <span className="leading-relaxed">{flag}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {/* Safety Tips */}
                        {scam.safetyTips && scam.safetyTips.length > 0 && (
                          <div className="p-5 rounded-2xl bg-emerald-50/40 border border-emerald-200 space-y-3">
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-emerald-700" />
                              <h4 className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-800">
                                Safety Tips (How to Protect Yourself)
                              </h4>
                            </div>
                            <ul className="space-y-2 text-xs text-[#47434E]">
                              {scam.safetyTips.map((tip, idx) => (
                                <li key={idx} className="flex items-start gap-2">
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                                  <span className="leading-relaxed">{tip}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* 3. What to Do If Targeted & Reporting Link */}
                      <div className="p-5 rounded-2xl bg-white border border-[#E8D8C3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#967223] block">
                            What to Do If Targeted (Incident Response)
                          </span>
                          <p className="text-xs font-semibold text-[#151417] leading-relaxed max-w-2xl">
                            {scam.whatToDoIfTargeted || 'Preserve chat screenshots, freeze bank transactions, and report immediately on 1930.'}
                          </p>
                        </div>

                        {scam.reportingResource && (
                          <a
                            href={scam.reportingResource.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="px-4 py-2 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 shrink-0 self-start sm:self-center"
                          >
                            <span>Report via {scam.reportingResource.name}</span>
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>

        {/* Public Information Sharing Callout */}
        <section className="glass-card rounded-3xl p-8 sm:p-12 text-center border-[#D4AF37]/40 bg-gradient-to-b from-[#FAF7F2] to-[#F5EBDD]/50 space-y-4">
          <span className="text-xs font-mono font-bold uppercase tracking-widest text-[#967223]">
            Campus Cyber Defense
          </span>
          <h3 className="text-2xl sm:text-3xl font-black text-[#151417]">
            Have You Encountered a Suspicious Scam or Incident?
          </h3>
          <p className="text-xs sm:text-sm text-[#55505C] max-w-2xl mx-auto leading-relaxed">
            Help safeguard our university community. If you notice a fraudulent job lure, suspicious QR code payment request, or spear-phishing email targeting college students, document the details and alert the OXNULL team or report it directly to cyber police.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            <a
              href="https://cybercrime.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors flex items-center gap-1.5"
            >
              <span>National Cyber Crime Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
            <Link
              href="/domains"
              className="px-6 py-2.5 rounded-full text-xs sm:text-sm font-bold uppercase tracking-wider bg-white border border-[#E8D8C3] text-[#8C6B1B] hover:bg-[#FAF7F2] transition-colors"
            >
              Explore Other Domains
            </Link>
          </div>
        </section>
      </div>
    </div>
  );
}
