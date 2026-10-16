'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Search, X, BookOpen, Award, FolderGit2, Compass, Sparkles, ArrowRight } from 'lucide-react';
import { DOMAINS, INITIAL_RESOURCES, INITIAL_CERTIFICATIONS, INITIAL_PROJECTS, ACTIVITIES } from '@/lib/data';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type SearchCategory = 'all' | 'domains' | 'resources' | 'certifications' | 'projects' | 'activities';

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [query, setQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<SearchCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const q = query.toLowerCase().trim();

  // Filter items
  const matchedDomains = DOMAINS.filter(
    (d) =>
      d.name.toLowerCase().includes(q) ||
      d.tagline.toLowerCase().includes(q) ||
      d.overview.toLowerCase().includes(q)
  ).map((d) => ({
    id: d.id,
    title: `${d.number} — ${d.name}`,
    subtitle: d.tagline,
    badge: 'Domain',
    href: `/domains/${d.slug}`,
    icon: Compass,
    category: 'domains' as const
  }));

  const matchedResources = INITIAL_RESOURCES.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      r.description.toLowerCase().includes(q) ||
      r.category.toLowerCase().includes(q)
  ).map((r) => ({
    id: r.id,
    title: r.title,
    subtitle: `${r.category} • ${r.domainName} (${r.difficulty})`,
    badge: 'Resource',
    href: `/resources`,
    icon: BookOpen,
    category: 'resources' as const
  }));

  const matchedCerts = INITIAL_CERTIFICATIONS.filter(
    (c) =>
      c.name.toLowerCase().includes(q) ||
      c.provider.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
  ).map((c) => ({
    id: c.id,
    title: `${c.name} (${c.code})`,
    subtitle: `${c.provider} • ${c.domainName} • ${c.level}`,
    badge: 'Certification',
    href: `/certifications`,
    icon: Award,
    category: 'certifications' as const
  }));

  const matchedProjects = INITIAL_PROJECTS.filter(
    (p) =>
      p.title.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.techStack.some((t) => t.toLowerCase().includes(q))
  ).map((p) => ({
    id: p.id,
    title: p.title,
    subtitle: `${p.domainName} • Stack: ${p.techStack.join(', ')}`,
    badge: 'Project',
    href: `/projects`,
    icon: FolderGit2,
    category: 'projects' as const
  }));

  const matchedActivities = ACTIVITIES.filter(
    (a) =>
      a.title.toLowerCase().includes(q) ||
      a.summary.toLowerCase().includes(q) ||
      a.type.toLowerCase().includes(q)
  ).map((a) => ({
    id: a.id,
    title: `${a.number} — ${a.title}`,
    subtitle: `${a.type} • ${a.cadence} • ${a.summary}`,
    badge: 'Activity',
    href: `/activities`,
    icon: Sparkles,
    category: 'activities' as const
  }));

  const allItems = [
    ...matchedDomains,
    ...matchedResources,
    ...matchedCerts,
    ...matchedProjects,
    ...matchedActivities
  ];

  const filteredItems =
    activeCategory === 'all'
      ? allItems
      : allItems.filter((item) => item.category === activeCategory);

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 sm:pt-24 px-4 bg-black/40 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#FCFBF9] border border-[#E5C378]/40 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="relative flex items-center px-4 py-3.5 border-b border-[#E8D8C3]/60 bg-white">
          <Search className="w-5 h-5 text-[#967223] mr-3 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            placeholder="Search domains, resources, certs, projects, activities..."
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            className="w-full text-base sm:text-lg bg-transparent text-[#151417] placeholder-[#8A8592] outline-none font-medium"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 text-[#8A8592] hover:text-[#151417] mr-2"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="px-2 py-1 rounded bg-[#F5EBDD] text-xs font-semibold text-[#8C6B1B] hover:bg-[#E8D8C3]"
          >
            ESC
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-1.5 px-4 py-2 bg-[#FAF7F2] border-b border-[#E8D8C3]/40 overflow-x-auto text-xs">
          {[
            { id: 'all', label: 'All' },
            { id: 'domains', label: 'Domains' },
            { id: 'resources', label: 'Resources' },
            { id: 'certifications', label: 'Certifications' },
            { id: 'projects', label: 'Projects' },
            { id: 'activities', label: 'Activities' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => {
                setActiveCategory(cat.id as SearchCategory);
                setSelectedIndex(0);
              }}
              className={`px-3 py-1 rounded-full whitespace-nowrap font-medium transition-all cursor-pointer ${
                activeCategory === cat.id
                  ? 'bg-[#151417] text-[#FAF7F2]'
                  : 'text-[#645E6D] hover:bg-[#F0E6D8]'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        {/* Results List */}
        <div className="overflow-y-auto p-2 divide-y divide-[#E8D8C3]/30">
          {filteredItems.length === 0 ? (
            <div className="py-12 text-center text-[#8A8592]">
              <Search className="w-8 h-8 mx-auto mb-3 opacity-30 text-[#967223]" />
              <p className="text-sm font-medium">No results found for &ldquo;{query}&rdquo;</p>
              <p className="text-xs text-[#8A8592] mt-1">
                Try searching for &ldquo;red team&rdquo;, &ldquo;wireshark&rdquo;, &ldquo;cloud&rdquo;, or &ldquo;workshop&rdquo;.
              </p>
            </div>
          ) : (
            filteredItems.map((item, idx) => {
              const Icon = item.icon;
              return (
                <Link
                  key={`${item.category}-${item.id}`}
                  href={item.href}
                  onClick={onClose}
                  className={`flex items-start justify-between p-3 rounded-xl transition-all ${
                    idx === selectedIndex
                      ? 'bg-[#F5EBDD]/70 border border-[#E5C378]/50'
                      : 'hover:bg-[#FAF7F2]'
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="p-2 rounded-lg bg-white border border-[#E8D8C3] text-[#967223] mt-0.5">
                      <Icon className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-semibold text-sm text-[#151417]">{item.title}</span>
                        <span className="text-[10px] px-1.5 py-0.5 rounded font-medium bg-[#F0E6D8] text-[#8C6B1B]">
                          {item.badge}
                        </span>
                      </div>
                      <p className="text-xs text-[#645E6D] mt-0.5 line-clamp-1">{item.subtitle}</p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-[#8A8592] opacity-60 self-center ml-2" />
                </Link>
              );
            })
          )}
        </div>

        {/* Footer shortcuts */}
        <div className="px-4 py-2 bg-[#FAF7F2] border-t border-[#E8D8C3]/50 flex items-center justify-between text-[11px] text-[#8A8592]">
          <span>{filteredItems.length} items found</span>
          <span>Press ESC or click outside to dismiss</span>
        </div>
      </div>
    </div>
  );
}
