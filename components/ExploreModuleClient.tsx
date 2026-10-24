'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { EXPLORE_MODULES, ExploreModule } from '@/lib/explore-data';
import { useAuth } from '@/lib/auth-context';
import {
  ArrowLeft,
  CheckCircle2,
  Clock,
  FileCheck,
  Compass,
  MessageSquare,
  Megaphone,
  Network,
  Users2,
  CalendarCheck,
  Save
} from 'lucide-react';

interface ExploreModuleClientProps {
  module: ExploreModule;
}

export default function ExploreModuleClient({ module: mod }: ExploreModuleClientProps) {
  const { user, progress, toggleCompleteExploreTask, saveExploreTaskSubmission } = useAuth();

  // Active submission inputs per task
  const [submissions, setSubmissions] = useState<Record<string, string>>({});
  const [savingTaskId, setSavingTaskId] = useState<string | null>(null);
  const [successTaskId, setSuccessTaskId] = useState<string | null>(null);

  // Sync initial submissions from user progress
  useEffect(() => {
    const initial: Record<string, string> = {};
    if (progress?.exploreTaskSubmissions) {
      Object.entries(progress.exploreTaskSubmissions).forEach(([k, v]) => {
        if (v?.submission) initial[k] = v.submission;
      });
    }
    setSubmissions(initial);
  }, [progress?.exploreTaskSubmissions]);

  const getModuleIcon = (slug: string) => {
    switch (slug) {
      case 'communication':
        return <MessageSquare className="w-7 h-7 text-[#C89D3C]" />;
      case 'pr':
        return <Megaphone className="w-7 h-7 text-[#C89D3C]" />;
      case 'networking':
        return <Network className="w-7 h-7 text-[#C89D3C]" />;
      case 'leadership-collaboration':
        return <Users2 className="w-7 h-7 text-[#C89D3C]" />;
      case 'planning-event-ops':
        return <CalendarCheck className="w-7 h-7 text-[#C89D3C]" />;
      default:
        return <Compass className="w-7 h-7 text-[#C89D3C]" />;
    }
  };

  const completedIds = progress?.completedExploreTaskIds || [];
  const moduleTasks = mod.tasks || [];
  const completedCount = moduleTasks.filter((t) => completedIds.includes(t.id)).length;
  const progressPercent = Math.round((completedCount / (moduleTasks.length || 1)) * 100);

  const handleToggleTask = async (taskId: string) => {
    await toggleCompleteExploreTask(taskId);
  };

  const handleSaveSubmission = async (taskId: string) => {
    setSavingTaskId(taskId);
    setSuccessTaskId(null);
    const content = submissions[taskId] || '';
    await saveExploreTaskSubmission(taskId, content, 'completed');
    setSavingTaskId(null);
    setSuccessTaskId(taskId);
    setTimeout(() => setSuccessTaskId(null), 3000);
  };

  return (
    <div className="min-h-screen pb-24">
      {/* Ambient Radiance Header matching 0XNULL palette */}
      <div className="relative pt-8 pb-12 overflow-hidden border-b border-[#E8D8C3]/50">
        <div className="absolute top-0 right-10 w-80 h-80 bg-[#F7E7E9]/40 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-10 w-96 h-96 bg-[#F5EBDD]/50 rounded-full blur-3xl pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10 space-y-6">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 text-xs text-[#8A8592]">
            <Link
              href="/domains/explore"
              className="inline-flex items-center gap-1.5 font-semibold text-[#8C6B1B] hover:text-[#151417] transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back to Explore Domain</span>
            </Link>
            <span>/</span>
            <span className="text-[#151417] font-semibold">{mod.title}</span>
          </div>

          {/* Module Header Card */}
          <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6 pb-2">
            <div className="max-w-3xl space-y-4">
              <div className="flex items-center gap-3">
                <span className="font-mono text-xs font-bold px-2.5 py-1 rounded bg-[#151417] text-[#FAF7F2]">
                  MODULE {mod.number} / 05
                </span>
                <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
                  {mod.badge}
                </span>
              </div>

              <div className="flex items-center gap-4">
                <div className="p-3.5 rounded-2xl bg-white border border-[#E8D8C3] shadow-xs">
                  {getModuleIcon(mod.slug)}
                </div>
                <div>
                  <h1 className="text-3xl sm:text-5xl font-black text-[#151417] tracking-tight">
                    {mod.title}
                  </h1>
                  <p className="text-xs sm:text-sm font-semibold text-[#8C6B1B] mt-1">
                    {mod.subtitle}
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-[#55505C] leading-relaxed max-w-2xl font-medium">
                {mod.overview}
              </p>
            </div>

            {/* Student Specific Progress Widget */}
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3] bg-white/95 shrink-0 w-full lg:w-72 space-y-3">
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="text-[#151417]">Your Module Progress</span>
                <span className="text-[#967223] font-mono">{progressPercent}%</span>
              </div>
              <div className="w-full h-2 rounded-full bg-[#E8D8C3] overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-[#C89D3C] to-[#E5C378] transition-all duration-500 rounded-full"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
              <p className="text-[11px] text-[#645E6D]">
                {completedCount} of {moduleTasks.length} tasks completed
              </p>
              {!user && (
                <div className="pt-2 border-t border-[#E8D8C3]/50">
                  <Link
                    href={`/login?returnUrl=/domains/explore/${mod.slug}`}
                    className="text-[11px] font-bold text-[#8C6B1B] hover:text-[#151417] flex items-center gap-1"
                  >
                    <span>Sign in to save your task progress →</span>
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Body */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-12 space-y-12">
        {/* Core Competencies Matrix */}
        <section className="glass-card rounded-3xl p-6 sm:p-8 border-[#E8D8C3]">
          <span className="text-xs uppercase font-bold tracking-widest text-[#967223] block mb-2">
            Target Fluencies
          </span>
          <h2 className="text-xl sm:text-2xl font-black text-[#151417] mb-4">
            Core Competencies Cultivated
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
            {mod.competencies.map((comp, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-2xl bg-white border border-[#E8D8C3] flex items-center gap-2.5 shadow-2xs"
              >
                <div className="w-5 h-5 rounded-full bg-[#FAF7F2] text-[#967223] border border-[#E8D8C3] flex items-center justify-center font-mono text-[10px] font-bold shrink-0">
                  {idx + 1}
                </div>
                <span className="text-xs font-semibold text-[#151417]">{comp}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Task List Section */}
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-2">
            <div>
              <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
                Practical Milestone Tracks
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#151417]">
                Module Tasks & Starter Activities
              </h2>
            </div>
            <p className="text-xs text-[#8A8592] italic">
              Example club starter activities. Complete tasks by writing or submitting your deliverable below.
            </p>
          </div>

          <div className="space-y-6">
            {moduleTasks.map((task, idx) => {
              const isCompleted = completedIds.includes(task.id);
              const submissionObj = progress?.exploreTaskSubmissions?.[task.id];
              const taskStatus = isCompleted ? 'Completed' : submissionObj ? 'In Progress' : 'Not Started';

              return (
                <div
                  key={task.id}
                  className={`glass-card rounded-3xl p-6 sm:p-8 border transition-all duration-300 space-y-6 ${
                    isCompleted
                      ? 'border-emerald-300/80 bg-emerald-50/15'
                      : 'border-[#E8D8C3] hover:border-[#C89D3C]'
                  }`}
                >
                  {/* Task Header */}
                  <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2.5 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                          TASK 0{idx + 1}
                        </span>
                        <span className="text-xs font-semibold text-[#645E6D]">
                          {task.category}
                        </span>
                        <span
                          className={`text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full border ${
                            taskStatus === 'Completed'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : taskStatus === 'In Progress'
                              ? 'bg-amber-50 text-amber-800 border-amber-200'
                              : 'bg-gray-50 text-gray-700 border-gray-200'
                          }`}
                        >
                          {taskStatus}
                        </span>
                      </div>

                      <h3 className="text-xl sm:text-2xl font-black text-[#151417]">
                        {task.title}
                      </h3>
                    </div>

                    {/* Metadata & Quick Toggle */}
                    <div className="flex items-center gap-3 self-start sm:self-auto shrink-0">
                      <div className="text-right text-[11px] text-[#8A8592] hidden sm:block">
                        <div className="flex items-center gap-1 font-medium">
                          <Clock className="w-3 h-3 text-[#C89D3C]" />
                          <span>~{task.estimatedTime}</span>
                        </div>
                        {task.deadline && (
                          <div className="text-[10px] text-[#967223] font-semibold mt-0.5">
                            {task.deadline}
                          </div>
                        )}
                      </div>

                      <button
                        onClick={() => handleToggleTask(task.id)}
                        className={`p-2 rounded-xl transition-all flex items-center gap-1.5 text-xs font-semibold cursor-pointer ${
                          isCompleted
                            ? 'bg-emerald-600 text-white shadow-xs'
                            : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:text-[#151417] hover:border-[#C89D3C]'
                        }`}
                        title={isCompleted ? 'Mark as incomplete' : 'Mark task complete'}
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span className="hidden md:inline">{isCompleted ? 'Completed' : 'Mark Complete'}</span>
                      </button>
                    </div>
                  </div>

                  {/* Instructions */}
                  <div className="space-y-2 p-4 sm:p-5 rounded-2xl bg-white/80 border border-[#E8D8C3]/80">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-[#8C6B1B]">
                      Task Instructions & Deliverable Scope
                    </h4>
                    <ul className="space-y-1.5 text-xs text-[#55505C] leading-relaxed list-disc list-inside">
                      {task.instructions.map((inst, i) => (
                        <li key={i}>{inst}</li>
                      ))}
                    </ul>
                  </div>

                  {/* Submission Action Box */}
                  <div className="space-y-3 pt-2">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-bold text-[#151417] flex items-center gap-1.5">
                        <FileCheck className="w-4 h-4 text-[#C89D3C]" />
                        <span>{task.deliverableLabel}</span>
                      </label>
                      {successTaskId === task.id && (
                        <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-200 animate-in fade-in">
                          ✓ Deliverable Saved & Progress Updated
                        </span>
                      )}
                    </div>

                    <textarea
                      rows={4}
                      value={submissions[task.id] ?? ''}
                      onChange={(e) =>
                        setSubmissions({ ...submissions, [task.id]: e.target.value })
                      }
                      placeholder={task.starterPrompt}
                      className="w-full p-3.5 rounded-2xl bg-white border border-[#E8D8C3] text-xs text-[#151417] outline-none focus:border-[#C89D3C] transition-colors leading-relaxed font-sans"
                    />

                    <div className="flex items-center justify-between pt-1">
                      <p className="text-[10px] text-[#8A8592] italic">
                        Submissions are stored securely to your student record and persistent profile.
                      </p>
                      <button
                        onClick={() => handleSaveSubmission(task.id)}
                        disabled={savingTaskId === task.id}
                        className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#151417] text-[#FAF7F2] text-xs font-bold uppercase tracking-wider hover:bg-[#2A2830] transition-colors shadow-xs cursor-pointer disabled:opacity-50"
                      >
                        <Save className="w-3.5 h-3.5 text-[#E5C378]" />
                        <span>{savingTaskId === task.id ? 'Saving...' : 'Save & Submit'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Back Navigation Footer */}
        <div className="pt-8 border-t border-[#E8D8C3]/50 flex flex-col sm:flex-row items-center justify-between gap-4">
          <Link
            href="/domains/explore"
            className="inline-flex items-center gap-2 text-xs font-bold text-[#8C6B1B] hover:text-[#151417] transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to All Explore Development Modules</span>
          </Link>
          <div className="flex items-center gap-2">
            {EXPLORE_MODULES.map((otherMod) => (
              <Link
                key={otherMod.slug}
                href={`/domains/explore/${otherMod.slug}`}
                className={`px-3 py-1.5 rounded-full text-[11px] font-semibold transition-colors ${
                  otherMod.slug === mod.slug
                    ? 'bg-[#151417] text-white'
                    : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
                }`}
              >
                {otherMod.title.split(' ')[0]}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
