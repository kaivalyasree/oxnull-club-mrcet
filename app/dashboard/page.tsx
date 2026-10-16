'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import {
  DOMAINS,
  FOUNDATION_TOPICS,
  INITIAL_RESOURCES,
  INITIAL_CERTIFICATIONS,
  INITIAL_PROJECTS,
  ACTIVITIES
} from '@/lib/data';
import ResourceCard from '@/components/ResourceCard';
import CertificationCard from '@/components/CertificationCard';
import ProjectCard from '@/components/ProjectCard';
import {
  User,
  Shield,
  BookOpen,
  Award,
  FolderGit2,
  Calendar,
  CheckCircle2,
  Clock,
  ArrowRight,
  ExternalLink,
  Save,
  Sparkles,
  Compass,
  FileText
} from 'lucide-react';

export default function StudentDashboardPage() {
  const { user, progress, updateUserNotes } = useAuth();
  const [activeTab, setActiveTab] = useState<'overview' | 'resources' | 'certifications' | 'activities' | 'notes'>('overview');
  const [notesInput, setNotesInput] = useState(progress.notes || '');
  const [isSavingNotes, setIsSavingNotes] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);

  // Derive user specific items
  const enrolledDomainsList = DOMAINS.filter((d) => progress.enrolledDomains.includes(d.id));
  const savedResourcesList = INITIAL_RESOURCES.filter((r) => progress.savedResourceIds.includes(r.id));
  const trackedCertsList = INITIAL_CERTIFICATIONS.filter((c) => progress.trackedCertificationIds.includes(c.id));
  const rsvpdActivitiesList = ACTIVITIES.filter((a) => progress.rsvpdActivityIds.includes(a.id));

  const foundationPercent = Math.round(
    (progress.completedFoundationIds.length / FOUNDATION_TOPICS.length) * 100
  );

  const handleSaveNotes = async () => {
    setIsSavingNotes(true);
    setSaveSuccess(false);
    await updateUserNotes(notesInput);
    setIsSavingNotes(false);
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2500);
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-10">
      {/* Profile Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/35 bg-gradient-to-r from-white/90 via-[#FAF7F2] to-[#F5EBDD]/50 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#151417] text-[#FAF7F2] flex items-center justify-center font-bold text-xl border border-[#D4AF37]">
            {user?.name ? user.name[0].toUpperCase() : 'M'}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-[#151417]">{user?.name || 'Member'}</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-[#F5EBDD] text-[#8C6B1B] border border-[#E8D8C3]">
                {user?.role || 'Student'}
              </span>
            </div>
            {user?.email && (
              <p className="text-xs text-[#645E6D] mt-0.5">{user.email}</p>
            )}
            <p className="text-[11px] font-semibold text-[#967223] mt-0.5">
              {user?.department || 'Department of Cybersecurity'} • Active Member Cohort
            </p>
          </div>
        </div>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Foundation Progress */}
        <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
            Foundation Mastery
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#151417]">{foundationPercent}%</span>
            <span className="text-xs text-[#645E6D]">
              ({progress.completedFoundationIds.length}/{FOUNDATION_TOPICS.length})
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-[#E8D8C3] overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#C89D3C] to-[#E5C378]"
              style={{ width: `${foundationPercent}%` }}
            />
          </div>
        </div>

        {/* Metric 2: Enrolled Domains */}
        <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
            Enrolled Domains
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#151417]">
              {progress.enrolledDomains.length}
            </span>
            <span className="text-xs text-[#645E6D]">of 7 tracks</span>
          </div>
          <p className="text-[11px] text-[#8C6B1B] font-medium line-clamp-1">
            {enrolledDomainsList.map((d) => d.name).join(', ') || 'None selected yet'}
          </p>
        </div>

        {/* Metric 3: Saved & Completed Resources */}
        <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
            Resource Library
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#151417]">
              {progress.completedResourceIds.length}
            </span>
            <span className="text-xs text-[#645E6D]">
              completed ({progress.savedResourceIds.length} saved)
            </span>
          </div>
          <p className="text-[11px] text-[#8C6B1B] font-medium">Curated living library</p>
        </div>

        {/* Metric 4: RSVPs */}
        <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
            Club Engagement
          </span>
          <div className="flex items-baseline gap-2 mb-2">
            <span className="text-3xl font-black text-[#151417]">
              {progress.rsvpdActivityIds.length}
            </span>
            <span className="text-xs text-[#645E6D]">RSVPs booked</span>
          </div>
          <p className="text-[11px] text-[#8C6B1B] font-medium">Weekly labs & seminars</p>
        </div>
      </div>

      {/* Tabs Navigation */}
      <div className="flex items-center gap-2 border-b border-[#E8D8C3] pb-3 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Overview & Guidance', icon: Sparkles },
          { id: 'resources', label: `Saved Resources (${savedResourcesList.length})`, icon: BookOpen },
          { id: 'certifications', label: `Certifications (${trackedCertsList.length})`, icon: Award },
          { id: 'activities', label: `My Activities (${rsvpdActivitiesList.length})`, icon: Calendar },
          { id: 'notes', label: 'Lab Notes & Plan', icon: FileText }
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2 rounded-xl flex items-center gap-2 transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab.id
                  ? 'bg-[#151417] text-[#FAF7F2]'
                  : 'text-[#645E6D] hover:bg-[#FAF7F2] hover:text-[#151417]'
              }`}
            >
              <Icon className="w-3.5 h-3.5 text-[#C89D3C]" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: Overview & Recommended Next Steps */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          {/* Recommended Next Steps */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/30">
            <span className="text-xs uppercase font-bold tracking-widest text-[#967223] block mb-2">
              Personalized Guidance
            </span>
            <h3 className="text-xl font-bold text-[#151417] mb-4">Recommended Next Steps</h3>
            <div className="space-y-3">
              <div className="p-4 rounded-2xl bg-white border border-[#E8D8C3] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F5EBDD] text-[#8C6B1B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  1
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#151417]">
                    Complete Operating Systems & Memory Models
                  </h4>
                  <p className="text-xs text-[#55505C] mt-0.5">
                    Finish module 03 of the shared foundation before diving into volatile memory forensics.
                  </p>
                </div>
                <Link
                  href="/learn"
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#FAF7F2] text-[#8C6B1B] hover:bg-[#F5EBDD] shrink-0"
                >
                  Go to Learn →
                </Link>
              </div>

              <div className="p-4 rounded-2xl bg-white border border-[#E8D8C3] flex items-start gap-3">
                <span className="w-6 h-6 rounded-full bg-[#F5EBDD] text-[#8C6B1B] flex items-center justify-center font-bold text-xs shrink-0 mt-0.5">
                  2
                </span>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-[#151417]">
                    Attend Friday CTF Practice Session
                  </h4>
                  <p className="text-xs text-[#55505C] mt-0.5">
                    Hands-on Wireshark packet capture analysis with senior mentors in Cyber Lab 402.
                  </p>
                </div>
                <Link
                  href="/activities"
                  className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#FAF7F2] text-[#8C6B1B] hover:bg-[#F5EBDD] shrink-0"
                >
                  View Details →
                </Link>
              </div>
            </div>
          </div>

          {/* Enrolled Domains Overview */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xl font-bold text-[#151417]">Your Enrolled Domains</h3>
              <Link
                href="/domains"
                className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
              >
                Manage Tracks →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {enrolledDomainsList.map((domain) => (
                <div
                  key={domain.id}
                  className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex items-start justify-between gap-4"
                >
                  <div>
                    <span className="font-mono text-xs font-bold text-[#967223]">
                      DOMAIN {domain.number}
                    </span>
                    <h4 className="text-base font-bold text-[#151417] mt-0.5">{domain.name}</h4>
                    <p className="text-xs text-[#645E6D] mt-1 line-clamp-2">{domain.tagline}</p>
                  </div>
                  <Link
                    href={`/domains/${domain.slug}`}
                    className="p-2 rounded-xl bg-[#FAF7F2] text-[#8C6B1B] hover:bg-[#F5EBDD] shrink-0"
                  >
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Saved Resources */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#151417]">Your Saved Reading List</h3>
            <Link
              href="/resources"
              className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
            >
              Browse More Resources →
            </Link>
          </div>

          {savedResourcesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedResourcesList.map((res) => (
                <ResourceCard key={res.id} resource={res} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#8A8592] glass-card rounded-2xl">
              <BookOpen className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C89D3C]" />
              <p className="font-semibold text-sm">You haven&apos;t bookmarked any resources yet</p>
              <Link
                href="/resources"
                className="mt-2 inline-block text-xs font-bold text-[#8C6B1B]"
              >
                Browse Curated Library →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 3: Tracked Certifications */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#151417]">Active Credential Targets</h3>
            <Link
              href="/certifications"
              className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
            >
              Explore Certifications Roadmap →
            </Link>
          </div>

          {trackedCertsList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {trackedCertsList.map((cert) => (
                <CertificationCard key={cert.id} certification={cert} />
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#8A8592] glass-card rounded-2xl">
              <Award className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C89D3C]" />
              <p className="font-semibold text-sm">No certifications actively tracked</p>
              <Link
                href="/certifications"
                className="mt-2 inline-block text-xs font-bold text-[#8C6B1B]"
              >
                Add Certification to Roadmap →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Activities & RSVPs */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#151417]">Your Confirmed Activity RSVPs</h3>
            <Link
              href="/activities"
              className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
            >
              Browse 12 Formats →
            </Link>
          </div>

          {rsvpdActivitiesList.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {rsvpdActivitiesList.map((act) => (
                <div
                  key={act.id}
                  className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex items-start justify-between gap-4"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-bold text-[#967223]">
                        {act.number}
                      </span>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                        {act.type}
                      </span>
                    </div>
                    <h4 className="text-base font-bold text-[#151417] mt-1">{act.title}</h4>
                    <p className="text-xs text-[#55505C] mt-1">{act.summary}</p>
                    <p className="text-[11px] text-[#8A8592] mt-2 flex items-center gap-1">
                      <Clock className="w-3 h-3 text-[#C89D3C]" />
                      <span>Cadence: {act.cadence}</span>
                    </p>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 shrink-0">
                    Confirmed
                  </span>
                </div>
              ))}
            </div>
          ) : (
            <div className="py-16 text-center text-[#8A8592] glass-card rounded-2xl">
              <Calendar className="w-8 h-8 mx-auto mb-2 opacity-40 text-[#C89D3C]" />
              <p className="font-semibold text-sm">No activity RSVPs booked</p>
              <Link
                href="/activities"
                className="mt-2 inline-block text-xs font-bold text-[#8C6B1B]"
              >
                View Club Calendar →
              </Link>
            </div>
          )}
        </div>
      )}

      {/* Tab 5: Lab Notes & Study Plan */}
      {activeTab === 'notes' && (
        <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#E8D8C3] space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Personal Study & Lab Notes</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Saved securely to your 0XNULL student profile and persistent database.
              </p>
            </div>
            {saveSuccess && (
              <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                ✓ Saved Successfully
              </span>
            )}
          </div>

          <textarea
            rows={8}
            value={notesInput}
            onChange={(e) => setNotesInput(e.target.value)}
            placeholder="Document lab VM IP addresses, active CTF notes, or exam study milestones..."
            className="w-full p-4 rounded-2xl bg-white border border-[#E8D8C3] text-xs sm:text-sm text-[#151417] outline-none focus:border-[#C89D3C] font-mono leading-relaxed"
          />

          <div className="flex justify-end">
            <button
              onClick={handleSaveNotes}
              disabled={isSavingNotes}
              className="px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4 text-[#E5C378]" />
              <span>{isSavingNotes ? 'Saving...' : 'Save Notes'}</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
