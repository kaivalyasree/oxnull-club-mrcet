'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import ActivityCard from '@/components/ActivityCard';
import { Activity } from '@/lib/data';
import { Calendar, Filter, Plus } from 'lucide-react';
import { useAuth } from '@/lib/auth-context';

export default function ActivitiesPage() {
  const { user } = useAuth();
  const [activities, setActivities] = useState<Activity[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterLevel, setFilterLevel] = useState<string>('all');

  useEffect(() => {
    fetch('/api/activities')
      .then((res) => res.json())
      .then((data) => {
        if (data.success && Array.isArray(data.data)) {
          setActivities(data.data);
        }
      })
      .catch((err) => console.error('Failed to load activities', err))
      .finally(() => setIsLoading(false));
  }, []);

  const filtered = activities.filter((act) => {
    const actType = act.type || act.format || '';
    const actLevel = act.level || act.participants || '';
    if (filterType !== 'all' && actType.toLowerCase() !== filterType.toLowerCase()) {
      return false;
    }
    if (filterLevel !== 'all' && actLevel.toLowerCase() !== filterLevel.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
          Member Engagement
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#151417] tracking-tight mt-2 mb-4">
          Club Activities & Tactical Sessions
        </h1>
        <p className="text-sm sm:text-base text-[#55505C] leading-relaxed">
          From hands-on virtualized labs to CTF scrimmages and roundtable debates, participation scales with your interest.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="glass-card rounded-2xl p-4 flex flex-wrap items-center justify-between gap-4 border-[#E8D8C3]">
        {/* Category Types */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8592] mr-2 flex items-center gap-1">
            <Filter className="w-3 h-3 text-[#C89D3C]" />
            <span>Category:</span>
          </span>
          {['all', 'Technical', 'Non-Technical', 'Community', 'Career'].map((type) => (
            <button
              key={type}
              onClick={() => setFilterType(type)}
              className={`px-3 py-1.5 rounded-full font-medium transition-colors cursor-pointer ${
                filterType === type
                  ? 'bg-[#151417] text-white'
                  : 'text-[#645E6D] hover:bg-[#FAF7F2]'
              }`}
            >
              {type === 'all' ? 'All Formats' : type}
            </button>
          ))}
        </div>

        {/* Level Filter */}
        <div className="flex items-center gap-1.5 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-[#8A8592] mr-1">
            Level:
          </span>
          {['all', 'All Levels', 'Beginner', 'Intermediate'].map((lvl) => (
            <button
              key={lvl}
              onClick={() => setFilterLevel(lvl)}
              className={`px-2.5 py-1 rounded-full text-xs transition-colors cursor-pointer ${
                filterLevel === lvl
                  ? 'bg-[#E5C378] text-[#151417] font-bold'
                  : 'text-[#645E6D] hover:bg-[#FAF7F2]'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading ? (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl">
            <p className="text-xs font-semibold">Loading activities...</p>
          </div>
        ) : activities.length === 0 ? (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl border-[#E8D8C3]">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-50 text-[#967223]" />
            <p className="font-bold text-sm text-[#151417]">No activities scheduled yet.</p>
            <p className="text-xs text-[#8A8592] mt-1">
              Upcoming tactical drills, workshops, and scrimmages will appear here once announced.
            </p>
          </div>
        ) : filtered.length > 0 ? (
          filtered.map((activity) => <ActivityCard key={activity.id} activity={activity} />)
        ) : (
          <div className="col-span-full py-16 text-center text-[#8A8592] glass-card rounded-2xl">
            <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C89D3C]" />
            <p className="font-semibold text-sm">No activities match selected criteria</p>
          </div>
        )}
      </div>
    </div>
  );
}
