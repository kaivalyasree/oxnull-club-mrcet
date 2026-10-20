'use client';

import React from 'react';
import { Project } from '@/lib/data';
import { FolderGit2, ExternalLink, Activity, Users, Code2 } from 'lucide-react';

interface ProjectCardProps {
  project: Project;
}

export default function ProjectCard({ project }: ProjectCardProps) {
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return 'bg-emerald-50 text-emerald-800 border-emerald-200';
      case 'Recruiting':
        return 'bg-[#F5EBDD] text-[#8C6B1B] border-[#E8D8C3]';
      case 'Completed':
        return 'bg-blue-50 text-blue-800 border-blue-200';
      case 'Research':
        return 'bg-purple-50 text-purple-800 border-purple-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="glass-card glass-card-hover rounded-2xl p-5 flex flex-col justify-between transition-all duration-300">
      <div>
        {/* Status & Domain header */}
        <div className="flex items-center justify-between gap-2 mb-2">
          <span className="text-[10px] font-bold tracking-wider uppercase text-[#8C6B1B]">
            {project.domainName}
          </span>
          <span
            className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${getStatusBadge(
              project.status
            )}`}
          >
            {project.status}
          </span>
        </div>

        {/* Project Title */}
        <h4 className="text-base font-bold text-[#151417] mb-2 leading-snug">
          {project.title}
        </h4>

        {/* Description */}
        <p className="text-xs text-[#645E6D] leading-relaxed mb-4 line-clamp-3">
          {project.description}
        </p>

        {/* Tech Stack Pills */}
        <div className="flex flex-wrap gap-1.5 mb-4">
          {(project.techStack || project.tags || []).map((tech) => (
            <span
              key={tech}
              className="text-[10px] font-mono font-medium px-2 py-0.5 rounded bg-[#FAF7F2] text-[#47434E] border border-[#E8D8C3]"
            >
              {tech}
            </span>
          ))}
        </div>
      </div>

      {/* Footer Info & Actions */}
      <div className="pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs">
        {project.leadMember && (
          <span className="text-[11px] text-[#8A8592] flex items-center gap-1">
            <Users className="w-3 h-3 text-[#C89D3C]" />
            <span className="line-clamp-1">{project.leadMember}</span>
          </span>
        )}

        <div className="flex items-center gap-3 ml-auto">
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#151417] hover:text-[#C89D3C] transition-colors"
            >
              <Code2 className="w-3.5 h-3.5 text-[#C89D3C]" />
              <span>Repository</span>
            </a>
          )}
          {project.demoUrl && (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#8C6B1B] hover:text-[#151417] transition-colors"
            >
              <span>Demo</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
