'use client';

import React from 'react';
import Link from 'next/link';
import { FOUNDATION_TOPICS } from '@/lib/data';
import { useAuth } from '@/lib/auth-context';
import {
  CheckCircle,
  Circle,
  Cpu,
  Layers,
  Terminal,
  Network,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  BookOpen
} from 'lucide-react';

export default function LearnPage() {
  const { progress, toggleCompleteFoundation } = useAuth();

  const workflowSteps = [
    { step: '01', title: 'START HERE', subtitle: 'Join 0XNULL cohort and assess systems baseline' },
    { step: '02', title: 'BUILD FUNDAMENTALS', subtitle: 'Complete all 5 foundational modules below' },
    { step: '03', title: 'CHOOSE DOMAIN', subtitle: 'Select 1 or 2 focus tracks across the 7 domains' },
    { step: '04', title: 'LEARN', subtitle: 'Study curated whitepapers and vendor blueprints' },
    { step: '05', title: 'PRACTICE', subtitle: 'Conduct hands-on virtualized labs & CTF puzzles' },
    { step: '06', title: 'BUILD PROJECTS', subtitle: 'Engineer semester-long team software codebases' },
    { step: '07', title: 'GET CERTIFIED', subtitle: 'Achieve recognized credentials (CompTIA, AWS, etc.)' },
    { step: '08', title: 'CONTRIBUTE', subtitle: 'Lead peer workshops, mentor juniors & publish' }
  ];

  const getTopicIcon = (num: string) => {
    switch (num) {
      case '01':
        return Cpu;
      case '02':
        return Network;
      case '03':
        return Layers;
      case '04':
        return Terminal;
      case '05':
        return ShieldAlert;
      default:
        return BookOpen;
    }
  };

  const completedCount = progress.completedFoundationIds.length;
  const progressPercent = Math.round((completedCount / FOUNDATION_TOPICS.length) * 100);

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 max-w-7xl mx-auto space-y-16">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto">
        <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
          Foundation Curriculum
        </span>
        <h1 className="text-4xl sm:text-5xl font-black text-[#151417] tracking-tight mt-2 mb-4">
          Shared Fundamentals, Built Before Specialisation
        </h1>
        <p className="text-sm sm:text-base text-[#55505C] leading-relaxed">
          Whether a student arrives with strong systems knowledge or none, foundation provides a common starting floor so peer sessions stay focused and productive.
        </p>

        {/* Foundation Progress Meter */}
        <div className="mt-6 max-w-md mx-auto p-4 rounded-2xl glass-card border-[#E8D8C3]">
          <div className="flex items-center justify-between text-xs font-semibold mb-2">
            <span className="text-[#151417]">Your Foundation Mastery</span>
            <span className="text-[#967223]">
              {completedCount} of {FOUNDATION_TOPICS.length} Complete ({progressPercent}%)
            </span>
          </div>
          <div className="w-full h-2.5 rounded-full bg-[#E8D8C3]/50 overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C89D3C] to-[#E5C378] transition-all duration-500 rounded-full"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Interactive Visual Learning Workflow */}
      <section className="glass-card rounded-3xl p-8 sm:p-10 border-[#E8D8C3]">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
            The Systematic Progression
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#151417] mt-1">
            Visual Learning Journey
          </h2>
          <p className="text-xs text-[#645E6D] mt-1">
            How every beginner transforms into an elite practitioner inside 0XNULL.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {workflowSteps.map((step, idx) => (
            <div
              key={step.step}
              className="relative p-5 rounded-2xl bg-white border border-[#E8D8C3] flex flex-col justify-between group hover:border-[#C89D3C] transition-all"
            >
              <div>
                <span className="font-mono text-xs font-black text-[#967223] block mb-1">
                  STEP {step.step}
                </span>
                <h4 className="font-bold text-sm text-[#151417] mb-1.5">{step.title}</h4>
                <p className="text-xs text-[#55505C] leading-relaxed">{step.subtitle}</p>
              </div>

              {idx < workflowSteps.length - 1 && (
                <div className="hidden lg:block absolute -right-3 top-1/2 -translate-y-1/2 z-10 text-[#C89D3C]">
                  →
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* The 5 Foundation Modules (PDF Page 3) */}
      <section className="space-y-6">
        <div>
          <span className="text-xs uppercase font-bold tracking-widest text-[#967223]">
            Five Pillars
          </span>
          <h2 className="text-3xl font-black text-[#151417]">The Five Foundational Modules</h2>
          <p className="text-xs sm:text-sm text-[#645E6D] mt-1">
            Click &ldquo;Mark as Complete&rdquo; as you master each module to track your foundation progress.
          </p>
        </div>

        <div className="space-y-6">
          {FOUNDATION_TOPICS.map((topic) => {
            const Icon = getTopicIcon(topic.number);
            const isCompleted = progress.completedFoundationIds.includes(topic.id);

            return (
              <div
                key={topic.id}
                className={`glass-card rounded-3xl p-6 sm:p-8 transition-all duration-300 border ${
                  isCompleted
                    ? 'border-emerald-300 bg-emerald-50/15'
                    : 'border-[#E8D8C3]'
                }`}
              >
                <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-6">
                  {/* Left: Icon, Number, Title & Concepts */}
                  <div className="space-y-4 max-w-3xl">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[#F5EBDD] flex items-center justify-center text-[#967223]">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-[#8C6B1B]">
                            MODULE {topic.number}
                          </span>
                          {isCompleted && (
                            <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800">
                              Completed
                            </span>
                          )}
                        </div>
                        <h3 className="text-xl sm:text-2xl font-black text-[#151417]">
                          {topic.title}
                        </h3>
                        <p className="text-xs font-semibold text-[#8C6B1B]">
                          {topic.subtitle}
                        </p>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-[#55505C] leading-relaxed">
                      {topic.description}
                    </p>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-2">
                        Key Concepts Covered
                      </span>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                        {topic.keyConcepts.map((concept, i) => (
                          <div
                            key={i}
                            className="p-2.5 rounded-xl bg-white border border-[#E8D8C3] text-xs font-medium text-[#151417] flex items-center gap-2"
                          >
                            <span className="text-[#C89D3C]">✓</span>
                            <span>{concept}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="p-3.5 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3] text-xs">
                      <span className="font-bold text-[#967223] block mb-0.5">
                        Hands-On Verification Lab:
                      </span>
                      <span className="text-[#55505C]">{topic.handsOnLab}</span>
                    </div>
                  </div>

                  {/* Right: Check action */}
                  <div className="shrink-0 flex flex-col items-end justify-between">
                    <button
                      onClick={() => toggleCompleteFoundation(topic.id)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
                        isCompleted
                          ? 'bg-emerald-600 text-white shadow-xs'
                          : 'bg-[#F5EBDD] text-[#8C6B1B] hover:bg-[#E8D8C3]'
                      }`}
                    >
                      {isCompleted ? (
                        <>
                          <CheckCircle className="w-4 h-4" />
                          <span>Module Completed</span>
                        </>
                      ) : (
                        <>
                          <Circle className="w-4 h-4" />
                          <span>Mark as Complete</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bottom CTA to choose domain */}
      <div className="glass-card rounded-3xl p-8 text-center border-[#D4AF37]/30 bg-gradient-to-r from-[#FAF7F2] to-[#F5EBDD]/60">
        <h3 className="text-2xl font-bold text-[#151417] mb-2">
          Ready to Choose Your Specialized Domain?
        </h3>
        <p className="text-xs sm:text-sm text-[#55505C] max-w-lg mx-auto mb-6">
          Once your fundamentals are locked, explore our seven specialized domains from Red/Blue Team to Cloud Security and Cryptography.
        </p>
        <Link
          href="/domains"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors"
        >
          <span>Choose Your Domain Track</span>
          <ArrowRight className="w-4 h-4 text-[#E5C378]" />
        </Link>
      </div>
    </div>
  );
}
