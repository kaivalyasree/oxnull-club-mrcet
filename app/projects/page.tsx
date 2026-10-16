'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ProjectCard from '@/components/ProjectCard';
import { DOMAINS, Project } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { FolderGit2, Filter, Plus } from 'lucide-react';

export default function ProjectsPage() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedDomain, setSelectedDomain] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  useEffect(() => {
    fetch('/api/projects')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setProjects(data.data);
        }
      })
      .catch((err) => console.error('Failed to load projects', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = projects.filter((proj) => {
    if (selectedDomain !== 'all' && proj.domainId !== selectedDomain) {
      return false;
    }
    if (selectedStatus !== 'all' && proj.status.toLowerCase() !== selectedStatus.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
          Engineering Output
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#151417] tracking-tight mt-2 mb-4">
          Member-Led Security Projects
        </h1>
        <p className="text-sm sm:text-base text-[#55505C] leading-relaxed">
          Open-source security tools, forensic parsers, honeypots, and defense automation utilities engineered by 0XNULL student teams spanning academic terms.
        </p>
      </div>

      {/* Filters */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border-[#E8D8C3]">
        {/* Status Filter */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8592] mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#C89D3C]" />
            <span>Status:</span>
          </span>
          {['all', 'Active', 'Recruiting', 'Completed', 'Research'].map((status) => (
            <button
              key={status}
              onClick={() => setSelectedStatus(status)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                selectedStatus === status
                  ? 'bg-[#151417] text-white'
                  : 'text-[#645E6D] hover:bg-[#FAF7F2]'
              }`}
            >
              {status === 'all' ? 'All Projects' : status}
            </button>
          ))}
        </div>

        {/* Domain Filter */}
        <div className="flex items-center gap-2 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8592]">
            Domain:
          </span>
          <select
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E8D8C3] text-xs text-[#151417] outline-none font-medium"
          >
            <option value="all">All Seven Domains</option>
            {DOMAINS.map((d) => (
              <option key={d.id} value={d.id}>
                {d.number} · {d.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl">
            <p className="text-xs font-semibold">Loading projects...</p>
          </div>
        ) : projects.length === 0 ? (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl border-[#E8D8C3]">
            <FolderGit2 className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#967223]" />
            <p className="font-bold text-sm text-[#151417]">No projects published yet.</p>
            <p className="text-xs text-[#8A8592] mt-1">
              Working groups will publish verified collaborative tools and repositories here.
            </p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((proj) => <ProjectCard key={proj.id} project={proj} />)
        ) : (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl">
            <FolderGit2 className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C89D3C]" />
            <p className="font-semibold text-sm">No projects matching selected filters</p>
            <p className="text-xs text-[#8A8592] mt-1">Try resetting the status or domain filters.</p>
          </div>
        )}
      </div>

      {/* Propose a Project Banner */}
      <div className="glass-card rounded-3xl p-8 text-center border-[#D4AF37]/30 bg-gradient-to-r from-[#FAF7F2] to-[#F5EBDD]/60 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="text-left">
          <h3 className="text-xl font-bold text-[#151417]">Have an Open-Source Security Project Idea?</h3>
          <p className="text-xs text-[#55505C] mt-1">
            0XNULL provides git infrastructure, peer contributors, and faculty guidance for student builds.
          </p>
        </div>
        <Link
          href="/join"
          className="px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors shrink-0"
        >
          Join a Working Track
        </Link>
      </div>
    </div>
  );
}
