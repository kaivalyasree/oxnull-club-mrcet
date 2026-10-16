'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import CertificationCard from '@/components/CertificationCard';
import { Certification } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { Award, Filter, Plus } from 'lucide-react';

export default function CertificationsPage() {
  const { user } = useAuth();
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLevel, setSelectedLevel] = useState('all');

  useEffect(() => {
    fetch('/api/certifications')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setCertifications(data.data);
        }
      })
      .catch((err) => console.error('Failed to load certifications', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = certifications.filter((cert) => {
    if (selectedLevel !== 'all' && cert.level !== selectedLevel) return false;
    return true;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
          Professional Credentials
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#151417] tracking-tight mt-2 mb-4">
          Industry Certifications Roadmap
        </h1>
        <p className="text-sm sm:text-base text-[#55505C] leading-relaxed">
          Structured credential targets mapped to student capability stages. Track preparation milestones, target career roles, and review official exam syllabi.
        </p>
      </div>

      {/* Filter Row */}
      <div className="glass-card rounded-2xl p-4 flex items-center justify-between border-[#E8D8C3]">
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8592] mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#C89D3C]" />
            <span>Target Level:</span>
          </span>
          {['all', 'Beginner', 'Intermediate', 'Advanced'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setSelectedLevel(lvl)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                selectedLevel === lvl
                  ? 'bg-[#151417] text-white'
                  : 'text-[#645E6D] hover:bg-[#FAF7F2]'
              }`}
            >
              {lvl === 'all' ? 'All Credentials' : lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl">
            <p className="text-xs font-semibold">Loading certifications...</p>
          </div>
        ) : certifications.length === 0 ? (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl border-[#E8D8C3]">
            <Award className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#967223]" />
            <p className="font-bold text-sm text-[#151417]">No certifications added yet.</p>
            <p className="text-xs text-[#8A8592] mt-1">
              Curated certification roadmaps and exam preparation tracks will be listed here.
            </p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((cert) => <CertificationCard key={cert.id} certification={cert} />)
        ) : (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl">
            <Award className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C89D3C]" />
            <p className="font-semibold text-sm">No certifications match selected level</p>
          </div>
        )}
      </div>
    </div>
  );
}
