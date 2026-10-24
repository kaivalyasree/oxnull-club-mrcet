'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, ShieldAlert, Search, ExternalLink, Calendar, RefreshCw, AlertTriangle, CheckCircle2, ShieldCheck, Tag } from 'lucide-react';

interface ThreatItem {
  id: string;
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  dueDate?: string;
  notes?: string;
  verified: boolean;
}

export default function ThreatWatchPage() {
  const [threats, setThreats] = useState<ThreatItem[]>([]);
  const [sourceName, setSourceName] = useState<string>('CISA KEV Catalog');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [filterType, setFilterType] = useState<'all' | 'verified' | 'action_required'>('all');
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [errorMsg, setErrorMsg] = useState<string>('');

  const fetchThreats = () => {
    setIsLoading(true);
    setErrorMsg('');
    fetch('/api/awareness/threats')
      .then((res) => {
        if (!res.ok) throw new Error(`Threat service HTTP ${res.status}`);
        return res.json();
      })
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setThreats(data.data);
          setSourceName(data.source || 'CISA KEV Catalog');
        } else {
          setErrorMsg(data.error || 'No active threat advisories in catalog.');
        }
      })
      .catch((err) => {
        console.error('Failed to load threats:', err);
        setErrorMsg('Threat Intelligence telemetry is temporarily unreachable.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchThreats();
  }, []);

  const filteredThreats = threats.filter((item) => {
    if (filterType === 'verified' && !item.verified) return false;
    if (filterType === 'action_required' && !item.requiredAction) return false;
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase();
    return (
      item.cveID.toLowerCase().includes(q) ||
      item.vendorProject.toLowerCase().includes(q) ||
      item.product.toLowerCase().includes(q) ||
      item.shortDescription.toLowerCase().includes(q)
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
            Catalog: {sourceName}
          </span>
          <button
            onClick={fetchThreats}
            disabled={isLoading}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#E8D8C3] bg-white text-[#645E6D] hover:text-[#151417] transition-all cursor-pointer disabled:opacity-50"
          >
            <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
            <span>Refresh Feed</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border-[#D4AF37]/35 bg-gradient-to-r from-white/95 via-[#FAF7F2] to-[#F5EBDD]/50 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#151417] text-[#FAF7F2] flex items-center justify-center border border-[#D4AF37] shadow-sm">
            <ShieldAlert className="w-6 h-6 text-[#C89D3C]" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#967223]">
              Module 03 · Situational Intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#151417] tracking-tight">
              Threat Watch
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#55505C] max-w-3xl leading-relaxed">
          Tracking actively weaponized vulnerabilities, ransomware payload indicators, and emerging adversary tactics. Directly integrated with the CISA Known Exploited Vulnerabilities (KEV) register. Verified government and industry advisories are explicitly distinguished from student research memos.
        </p>

        {/* Search & Filters */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 pt-2">
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by CVE, vendor (e.g. Cisco, Apple), or keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-2xl bg-white border border-[#E8D8C3] text-xs text-[#151417] outline-none focus:border-[#C89D3C] transition-colors"
            />
          </div>

          <div className="flex items-center gap-2 text-xs">
            <button
              onClick={() => setFilterType('all')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
                filterType === 'all'
                  ? 'bg-[#151417] text-[#FAF7F2]'
                  : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
              }`}
            >
              All Records ({threats.length})
            </button>
            <button
              onClick={() => setFilterType('verified')}
              className={`px-3 py-1.5 rounded-full font-semibold transition-colors cursor-pointer ${
                filterType === 'verified'
                  ? 'bg-[#151417] text-[#FAF7F2]'
                  : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
              }`}
            >
              Verified CISA KEV
            </button>
          </div>
        </div>
      </div>

      {/* Content Area */}
      {isLoading ? (
        <div className="glass-card rounded-3xl p-16 text-center space-y-4 border-[#E8D8C3]">
          <ShieldAlert className="w-10 h-10 text-[#C89D3C] mx-auto animate-pulse" />
          <p className="text-xs font-semibold text-[#645E6D]">Correlating known exploited vulnerabilities...</p>
        </div>
      ) : errorMsg && threats.length === 0 ? (
        <div className="glass-card rounded-3xl p-12 text-center space-y-4 border-rose-200 bg-rose-50/40 max-w-2xl mx-auto">
          <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
          <h3 className="text-lg font-bold text-rose-900">Intelligence Feed Unavailable</h3>
          <p className="text-xs text-rose-700 max-w-md mx-auto">{errorMsg}</p>
          <button
            onClick={fetchThreats}
            className="px-5 py-2 rounded-xl bg-[#151417] text-white text-xs font-bold uppercase tracking-wider hover:bg-[#2A2830] transition-colors"
          >
            Retry Feed Fetch
          </button>
        </div>
      ) : filteredThreats.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center space-y-3 border-[#E8D8C3]">
          <ShieldCheck className="w-10 h-10 text-[#8A8592] mx-auto opacity-40" />
          <h3 className="text-base font-bold text-[#151417]">No threat records matched your filter</h3>
          <p className="text-xs text-[#645E6D]">Check spelling or reset the filter to view all active threats.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredThreats.map((item) => (
            <div
              key={item.id}
              className="glass-card rounded-3xl p-6 border-[#E8D8C3] hover:border-[#C89D3C] transition-all space-y-3"
            >
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="font-mono text-xs font-black px-2.5 py-1 rounded bg-[#151417] text-[#FAF7F2]">
                    {item.cveID}
                  </span>
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-[#F5EBDD] text-[#8C6B1B] border border-[#E8D8C3]">
                    {item.vendorProject} • {item.product}
                  </span>
                  {item.verified ? (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                      <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                      <span>Verified Threat Advisory</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[10px] font-bold px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200">
                      <span>Community Memo</span>
                    </span>
                  )}
                </div>

                <div className="text-[11px] font-mono text-[#8A8592] flex items-center gap-1.5 self-start sm:self-auto">
                  <Calendar className="w-3.5 h-3.5 text-[#C89D3C]" />
                  <span>Catalog Date: {item.dateAdded}</span>
                </div>
              </div>

              <h3 className="text-base font-bold text-[#151417]">{item.vulnerabilityName}</h3>
              <p className="text-xs text-[#55505C] leading-relaxed">{item.shortDescription}</p>

              <div className="pt-3 border-t border-[#E8D8C3]/50 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
                <div className="text-[#8C6B1B] font-medium">
                  <strong className="text-[#151417]">Mandated Remediation:</strong> {item.requiredAction}
                </div>

                <a
                  href={`https://nvd.nist.gov/vuln/detail/${item.cveID}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-bold text-[#151417] hover:text-[#C89D3C] transition-colors shrink-0"
                >
                  <span>NVD / NIST CVE Details</span>
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
