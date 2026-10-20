'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ResourceCard from '@/components/ResourceCard';
import { DOMAINS, Resource } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { BookOpen, Filter, Search, Plus } from 'lucide-react';

export default function ResourcesPage() {
  const { user } = useAuth();
  const [resources, setResources] = useState<Resource[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedDifficulty, setSelectedDifficulty] = useState('all');
  const [selectedDomain, setSelectedDomain] = useState('all');

  useEffect(() => {
    fetch('/api/resources')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setResources(data.data);
        }
      })
      .catch((err) => console.error('Failed to load resources', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = resources.filter((res) => {
    if (selectedCategory !== 'all' && res.category !== selectedCategory) return false;
    if (selectedDifficulty !== 'all' && res.difficulty !== selectedDifficulty) return false;
    if (selectedDomain !== 'all' && res.domainId !== selectedDomain) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const match =
        res.title.toLowerCase().includes(q) ||
        res.description.toLowerCase().includes(q) ||
        (res.domainName ? res.domainName.toLowerCase().includes(q) : false);
      if (!match) return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
          Curated Repository
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#151417] tracking-tight mt-2 mb-4">
          Resources Library
        </h1>
        <p className="text-sm sm:text-base text-[#55505C] leading-relaxed">
          A maintained living digital library rather than an untracked link list. Vetted papers, technical walkthroughs, forensic cheat sheets, and official documentation.
        </p>
      </div>

      {/* Search & Filters */}
      <div className="glass-card rounded-2xl p-4 sm:p-5 border-[#E8D8C3] space-y-4">
        {/* Search Bar */}
        <div className="relative">
          <Search className="w-4 h-4 text-[#8A8592] absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search papers, tools, walkthroughs, frameworks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-[#E8D8C3] text-xs text-[#151417] outline-none focus:border-[#C89D3C] transition-colors"
          />
        </div>

        {/* Categories Bar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pt-1 border-t border-[#E8D8C3]/40">
          <div className="flex items-center gap-1.5 overflow-x-auto text-xs py-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8592] mr-2 flex items-center gap-1">
              <Filter className="w-3 h-3 text-[#C89D3C]" />
              <span>Category:</span>
            </span>
            {['all', 'Walkthrough', 'Tool', 'Cheat Sheet', 'Documentation', 'Research Paper'].map(
              (cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full font-medium transition-colors cursor-pointer whitespace-nowrap ${
                    selectedCategory === cat
                      ? 'bg-[#151417] text-white'
                      : 'text-[#645E6D] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {cat === 'all' ? 'All' : cat}
                </button>
              )
            )}
          </div>

          {/* Difficulty & Domain dropdowns */}
          <div className="flex items-center gap-2">
            <select
              value={selectedDifficulty}
              onChange={(e) => setSelectedDifficulty(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-white border border-[#E8D8C3] text-xs text-[#151417] outline-none font-medium"
            >
              <option value="all">All Difficulties</option>
              <option value="Beginner">Beginner</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Advanced">Advanced</option>
            </select>

            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-2.5 py-1 rounded-xl bg-white border border-[#E8D8C3] text-xs text-[#151417] outline-none font-medium"
            >
              <option value="all">All Domains</option>
              {DOMAINS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.number} · {d.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Resources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl">
            <p className="text-xs font-semibold">Loading resources...</p>
          </div>
        ) : resources.length === 0 ? (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl border-[#E8D8C3]">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#967223]" />
            <p className="font-bold text-sm text-[#151417]">No resources available yet.</p>
            <p className="text-xs text-[#8A8592] mt-1">
              Curated domain roadmaps and vetted materials will be published here as tracks begin.
            </p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((res) => <ResourceCard key={res.id} resource={res} />)
        ) : (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl">
            <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C89D3C]" />
            <p className="font-semibold text-sm">No resources found matching criteria</p>
            <p className="text-xs text-[#8A8592] mt-1">Try relaxing your search terms or filters.</p>
          </div>
        )}
      </div>
    </div>
  );
}
