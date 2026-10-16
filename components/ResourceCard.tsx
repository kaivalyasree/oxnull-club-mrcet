'use client';

import React from 'react';
import { Resource } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import { Bookmark, CheckCircle2, ExternalLink, Clock, BookOpen } from 'lucide-react';

interface ResourceCardProps {
  resource: Resource;
}

export default function ResourceCard({ resource }: ResourceCardProps) {
  const { progress, toggleSaveResource, toggleCompleteResource } = useAuth();
  const isSaved = progress.savedResourceIds.includes(resource.id);
  const isCompleted = progress.completedResourceIds.includes(resource.id);

  const getDifficultyColor = (diff: string) => {
    switch (diff) {
      case 'Beginner':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intermediate':
        return 'bg-[#F5EBDD] text-[#8C6B1B] border-[#E8D8C3]';
      case 'Advanced':
        return 'bg-rose-50 text-rose-700 border-rose-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div
      className={`glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between transition-all duration-300 ${
        isCompleted ? 'border-emerald-300/80 bg-emerald-50/15' : ''
      }`}
    >
      <div>
        {/* Top Badges & Actions */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${getDifficultyColor(
                resource.difficulty
              )}`}
            >
              {resource.difficulty}
            </span>
            <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#645E6D] border border-[#E8D8C3]">
              {resource.category}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => toggleCompleteResource(resource.id)}
              title={isCompleted ? 'Mark as incomplete' : 'Mark as complete'}
              className={`p-1.5 rounded-lg transition-colors ${
                isCompleted
                  ? 'text-emerald-600 bg-emerald-100 hover:bg-emerald-200'
                  : 'text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]'
              }`}
            >
              <CheckCircle2 className="w-4 h-4" />
            </button>
            <button
              onClick={() => toggleSaveResource(resource.id)}
              title={isSaved ? 'Remove from saved' : 'Save resource'}
              className={`p-1.5 rounded-lg transition-colors ${
                isSaved
                  ? 'text-[#C89D3C] bg-[#F5EBDD] hover:bg-[#E8D8C3]'
                  : 'text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]'
              }`}
            >
              <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Title */}
        <h4 className="text-base font-bold text-[#151417] mb-2 leading-snug">
          {resource.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-[#645E6D] leading-relaxed mb-4 line-clamp-3">
          {resource.description}
        </p>
      </div>

      {/* Footer Info & External Link */}
      <div className="pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs text-[#8A8592]">
        <span className="inline-flex items-center gap-1">
          <Clock className="w-3.5 h-3.5 text-[#C89D3C]" />
          <span>~{resource.estimatedHours} hrs study</span>
        </span>

        <a
          href={resource.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 font-semibold text-[#8C6B1B] hover:text-[#151417] transition-colors"
        >
          <span>Access Material</span>
          <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
}
