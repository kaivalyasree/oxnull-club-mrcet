'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowLeft, Radar, ShieldCheck, AlertCircle, Clock, CheckCircle2, Lock, ExternalLink, RefreshCw } from 'lucide-react';

interface ScanRecord {
  id: string;
  name: string;
  target: string;
  status: 'completed' | 'running' | 'failed' | 'scheduled';
  startedAt: string;
  completedAt?: string;
  findingsCount: number;
  summary: string;
  detailsUrl?: string;
}

export default function LatestScansPage() {
  const [scans, setScans] = useState<ScanRecord[]>([]);
  const [hasIntegration, setHasIntegration] = useState<boolean>(false);
  const [configMessage, setConfigMessage] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const fetchScans = () => {
    setIsLoading(true);
    fetch('/api/awareness/scans')
      .then((res) => res.json())
      .then((data) => {
        setHasIntegration(Boolean(data.hasActiveIntegration));
        setScans(data.scans || []);
        setConfigMessage(
          data.message ||
            'No automated network scan integration is configured. In accordance with university policy, external scanning is strictly prohibited without written authorization.'
        );
      })
      .catch((err) => {
        console.error('Failed to load scan status:', err);
        setConfigMessage('Scanner telemetry service is currently unavailable.');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchScans();
  }, []);

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Breadcrumb & Navigation */}
      <div className="flex items-center justify-between">
        <Link
          href="/domains/awareness"
          className="inline-flex items-center gap-2 text-xs font-semibold text-[#8C6B1B] hover:text-[#151417] transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Awareness Domain</span>
        </Link>
        <button
          onClick={fetchScans}
          disabled={isLoading}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium border border-[#E8D8C3] bg-white text-[#645E6D] hover:text-[#151417] transition-all cursor-pointer disabled:opacity-50"
        >
          <RefreshCw className={`w-3 h-3 ${isLoading ? 'animate-spin' : ''}`} />
          <span>Check Status</span>
        </button>
      </div>

      {/* Header Banner */}
      <div className="glass-card rounded-3xl p-8 sm:p-10 border-[#D4AF37]/35 bg-gradient-to-r from-white/95 via-[#FAF7F2] to-[#F5EBDD]/50 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#151417] text-[#FAF7F2] flex items-center justify-center border border-[#D4AF37] shadow-sm">
            <Radar className="w-6 h-6 text-[#C89D3C]" />
          </div>
          <div>
            <span className="text-[10px] font-mono font-bold tracking-[0.2em] uppercase text-[#967223]">
              Module 01 · Situational Intelligence
            </span>
            <h1 className="text-3xl sm:text-4xl font-black text-[#151417] tracking-tight">
              Latest Security Scans
            </h1>
          </div>
        </div>
        <p className="text-xs sm:text-sm text-[#55505C] max-w-3xl leading-relaxed">
          Authorized diagnostic and configuration audits for designated laboratory subnets. In strict compliance with 0XNULL ethical principles and university cybersecurity rules, all scanning requires scoped authorizations and target validation.
        </p>
      </div>

      {/* Main Content Area */}
      {isLoading ? (
        <div className="glass-card rounded-3xl p-16 text-center space-y-4 border-[#E8D8C3]">
          <Radar className="w-10 h-10 text-[#C89D3C] mx-auto animate-pulse" />
          <p className="text-xs font-semibold text-[#645E6D]">Checking scan subsystem telemetry...</p>
        </div>
      ) : hasIntegration && scans.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {scans.map((scan) => (
            <div key={scan.id} className="glass-card rounded-3xl p-6 border-[#E8D8C3] space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono font-bold text-[#967223]">{scan.target}</span>
                <span className="text-[10px] uppercase font-bold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200">
                  {scan.status}
                </span>
              </div>
              <h3 className="text-lg font-bold text-[#151417]">{scan.name}</h3>
              <p className="text-xs text-[#55505C]">{scan.summary}</p>
              <div className="pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs text-[#8A8592]">
                <span>Started: {new Date(scan.startedAt).toLocaleString()}</span>
                {scan.detailsUrl && (
                  <Link href={scan.detailsUrl} className="font-bold text-[#8C6B1B] hover:text-[#151417]">
                    View Report →
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Truthful Empty & Config State */
        <div className="glass-card rounded-3xl p-10 sm:p-14 border-[#E8D8C3] bg-white/90 text-center space-y-6 max-w-3xl mx-auto shadow-sm">
          <div className="w-16 h-16 rounded-3xl bg-[#FAF7F2] border border-[#E8D8C3] flex items-center justify-center mx-auto text-[#967223]">
            <Lock className="w-8 h-8 text-[#C89D3C]" />
          </div>

          <div className="space-y-2">
            <span className="text-[10px] font-mono font-bold uppercase tracking-[0.2em] px-3 py-1 rounded-full bg-[#FAF0F2] text-[#C78B96] border border-[#EDCED3]">
              UNCONFIGURED / RESTRICTED SCOPE
            </span>
            <h2 className="text-2xl font-black text-[#151417] pt-1">
              No Authorized Target Scans Active
            </h2>
            <p className="text-xs sm:text-sm text-[#55505C] max-w-xl mx-auto leading-relaxed">
              {configMessage}
            </p>
          </div>

          {/* Operational Policy Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left pt-4">
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-1">
              <span className="font-mono text-[10px] font-bold text-[#967223] block">PRINCIPLE 01</span>
              <h4 className="text-xs font-bold text-[#151417]">Explicit Scope Only</h4>
              <p className="text-[11px] text-[#645E6D] leading-relaxed">
                Scanning non-whitelisted external assets is strictly barred without certified authorization documents.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-1">
              <span className="font-mono text-[10px] font-bold text-[#967223] block">PRINCIPLE 02</span>
              <h4 className="text-xs font-bold text-[#151417]">Truthful Reporting</h4>
              <p className="text-[11px] text-[#645E6D] leading-relaxed">
                0XNULL never fabricates mock vulnerability counts or claims live scanning without real probe connectivity.
              </p>
            </div>
            <div className="p-4 rounded-2xl bg-[#FAF7F2] border border-[#E8D8C3] space-y-1">
              <span className="font-mono text-[10px] font-bold text-[#967223] block">PRINCIPLE 03</span>
              <h4 className="text-xs font-bold text-[#151417]">Air-Gapped Ranges</h4>
              <p className="text-[11px] text-[#645E6D] leading-relaxed">
                Live scans are reserved for student vulnerability labs hosted within isolated virtual environments.
              </p>
            </div>
          </div>

          <div className="pt-2">
            <Link
              href="/domains/awareness"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full bg-[#151417] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider hover:bg-[#2A2830] transition-colors"
            >
              <span>Return to Awareness Intelligence</span>
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
