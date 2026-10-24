'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Search, ExternalLink, Calendar, RefreshCw, AlertCircle, FileText } from 'lucide-react';

interface AdvisoryItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  summary: string;
  source: string;
}

export default function SecurityAdvisoriesPage() {
  const [advisories, setAdvisories] = useState<AdvisoryItem[]>([]);
  const [sourceName, setSourceName] = useState<string>('CISA Cybersecurity Advisories');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fetchAdvisories = () => {
    setIsLoading(true);
    setErrorMsg('');
    fetch('/api/awareness/advisories')
      .then((res) => {
        if (!res.ok) throw new Error(`Advisory feed HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setAdvisories(data.data);
          setSourceName(data.source || 'CISA Cybersecurity Advisories');
        } else {
          setErrorMsg(data.error || 'No active vendor advisories found.');
        }
      })
      .catch((err) => {
        console.error('Failed to load advisories:', err);
        setErrorMsg('Advisory service is temporarily unavailable.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchAdvisories();
  }, []);

  const filtered = advisories.filter((adv) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return adv.title.toLowerCase().includes(q) || adv.summary.toLowerCase().includes(q);
  });

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Breadcrumb & Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          href="/domains/awareness"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6B1B] hover:text-[#151417] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Awareness Domain</span>
        </Link>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-[11px] font-mono font-medium text-[#8A8592]">
            Publisher: {sourceName}
          </span>
          <button
            onClick={fetchAdvisories}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#E8D8C3] bg-white text-[#645E6D] hover:text-[#151417] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border-[#D4AF37]/35 bg-gradient-to-r from-white/95 via-[#FAF7F2] to-[#F5EBDD]/50 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#151417] text-[#FAF7F2] flex items-center justify-center border border-[#D4AF37] shadow-sm">
            <FileText className="w-6 h-6 text-[#C89D3C]" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#967223]">
              OXNULL Awareness Initiative · Advisory Feed
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#151417] tracking-tight">
              Security Advisories
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#55505C] max-w-3xl leading-relaxed">
          Official vulnerability announcements, ICS industrial advisories, and defensive vendor remediation bulletins. Direct source attributions and publication chronologies are strictly preserved.
        </p>

        {/* Search */}
        <div className="relative pt-2 max-w-xl">
          <Search className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search advisories by system, vendor, protocol, or advisory ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8D8C3] text-xs text-[#151417] outline-none focus:border-[#C89D3C] transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="glass-card rounded-3xl p-16 text-center space-y-4 border-[#E8D8C3]">
          <FileText className="w-10 h-10 text-[#C89D3C] mx-auto animate-pulse" />
          <p className="text-xs font-semibold text-[#645E6D]">Retrieving accredited security advisories...</p>
        </div>
      ) : errorMsg && advisories.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border-rose-200 bg-rose-50/40 max-w-2xl mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h3 className="text-lg font-bold text-rose-900">Advisory Feed Unavailable</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto">{errorMsg}</p>
          <button
            onClick={fetchAdvisories}
            className="px-5 py-2 rounded-xl bg-[#151417] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2A2830] transition-colors"
          >
            Retry Fetch
          </button>
        </div>
      ) : filtered.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center space-y-3 border-[#E8D8C3]">
          <FileText className="w-10 h-10 text-[#8A8592] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[#151417]">No advisories match your query</h3>
          <p className="text-xs text-[#645E6D]">Try searching for general keywords or clear the search box.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-6 border-[#E8D8C3] flex flex-col justify-between hover:border-[#C89D3C] transition-all hover:shadow-md space-y-4"
            >
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-[10px] font-mono">
                  <span className="font-bold text-[#967223] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E8D8C3]">
                    {item.source}
                  </span>
                  <span className="text-[#8A8592] flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-[#C89D3C]" />
                    <span>{item.pubDate ? new Date(item.pubDate).toLocaleDateString() : 'Recent'}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-[#151417] leading-snug">
                  {item.title}
                </h3>

                <p className="text-xs text-[#55505C] leading-relaxed line-clamp-3">
                  {item.summary}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-end">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6B1B] hover:text-[#151417] transition-colors"
                >
                  <span>Official CISA Bulletin</span>
                  <ExternalLink className="w-3.5 h-3.5 text-[#C89D3C]" />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
