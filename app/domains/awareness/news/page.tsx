'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Newspaper, Search, ExternalLink, Calendar, RefreshCw, AlertCircle, ShieldAlert } from 'lucide-react';

interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet: string;
}

export default function CybersecurityTechNewsPage() {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [sourceName, setSourceName] = useState<string>('Live Intelligence Feed');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fetchNews = () => {
    setIsLoading(true);
    setErrorMsg('');
    fetch('/api/awareness/news')
      .then((res) => {
        if (!res.ok) throw new Error(`Feed HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setNews(data.data);
          setSourceName(data.source || 'The Hacker News');
        } else {
          setErrorMsg(data.error || 'No news articles available in feed.');
        }
      })
      .catch((err) => {
        console.error('Failed to load news:', err);
        setErrorMsg('External security news feed is currently unreachable. Please check network connectivity.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchNews();
  }, []);

  const filteredNews = news.filter((item) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.title.toLowerCase().includes(q) ||
      item.snippet.toLowerCase().includes(q) ||
      item.source.toLowerCase().includes(q)
    );
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
            Source: {sourceName}
          </span>
          <button
            onClick={fetchNews}
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
            <Newspaper className="w-6 h-6 text-[#C89D3C]" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#967223]">
              OXNULL Awareness Initiative · Intelligence Feed
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#151417] tracking-tight">
              Cybersecurity Tech News
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#55505C] max-w-3xl leading-relaxed">
          Curated intelligence on emerging zero-days, active ransomware syndicates, vulnerability disclosures, and defensive engineering. Sourced from accredited security publications with full dates and origin links.
        </p>

        {/* Search Bar */}
        <div className="relative pt-2 max-w-xl">
          <Search className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search news by headline, CVE, threat actor, or technique..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white border border-[#E8D8C3] text-xs text-[#151417] outline-none focus:border-[#C89D3C] transition-colors shadow-2xs"
          />
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="glass-card rounded-3xl p-16 text-center space-y-4 border-[#E8D8C3]">
          <Newspaper className="w-10 h-10 text-[#C89D3C] mx-auto animate-pulse" />
          <p className="text-xs font-semibold text-[#645E6D]">Fetching verified security dispatches...</p>
        </div>
      ) : errorMsg && news.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border-rose-200 bg-rose-50/40 max-w-2xl mx-auto">
          <AlertCircle className="w-10 h-10 text-rose-600 mx-auto" />
          <h3 className="text-lg font-bold text-rose-900">Feed Temporarily Unavailable</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto">{errorMsg}</p>
          <button
            onClick={fetchNews}
            className="px-5 py-2 rounded-xl bg-[#151417] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2A2830] transition-colors"
          >
            Retry Connection
          </button>
        </div>
      ) : filteredNews.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center space-y-3 border-[#E8D8C3]">
          <Newspaper className="w-10 h-10 text-[#8A8592] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[#151417]">No articles matched your search</h3>
          <p className="text-xs text-[#645E6D]">Try searching for broader keywords like &quot;ransomware&quot;, &quot;zero-day&quot;, or clear the search bar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNews.map((item) => (
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

                <h3 className="text-base font-bold text-[#151417] leading-snug line-clamp-3">
                  {item.title}
                </h3>

                <p className="text-xs text-[#55505C] leading-relaxed line-clamp-4">
                  {item.snippet}
                </p>
              </div>

              <div className="pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-end">
                <a
                  href={item.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-[#8C6B1B] hover:text-[#151417] transition-colors"
                >
                  <span>Read Full Article</span>
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
