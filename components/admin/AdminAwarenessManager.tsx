'use client';

import React, { useState } from 'react';
import {
  Newspaper,
  ShieldAlert,
  AlertTriangle,
  Plus,
  Edit3,
  Trash2,
  ExternalLink,
  Eye,
  EyeOff,
  CheckCircle2,
  Calendar,
  Search,
  X,
  FileText,
  AlertCircle
} from 'lucide-react';
import type { AwarenessArticle } from '@/lib/store';

interface AdminAwarenessManagerProps {
  articles: AwarenessArticle[];
  onRefresh: () => void;
  showToast: (text: string, type?: 'success' | 'error') => void;
}

export default function AdminAwarenessManager({
  articles,
  onRefresh,
  showToast
}: AdminAwarenessManagerProps) {
  const [categoryFilter, setCategoryFilter] = useState<'all' | 'tech-news' | 'cyber-news' | 'scam-alert'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [modalMode, setModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentArticleId, setCurrentArticleId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'tech-news' as 'tech-news' | 'cyber-news' | 'scam-alert',
    summary: '',
    source: '',
    sourceUrl: '',
    publishedDate: new Date().toISOString().split('T')[0],
    tag: '',
    cadenceNote: '',
    isPublished: true,
    scamType: '',
    howItWorksText: '',
    redFlagsText: '',
    safetyTipsText: '',
    whatToDoIfTargeted: '',
    reportingName: 'National Cyber Crime Reporting Portal',
    reportingHelpline: '1930',
    reportingUrl: 'https://cybercrime.gov.in'
  });

  const openAddModal = () => {
    setFormData({
      title: '',
      category: 'tech-news',
      summary: '',
      source: '',
      sourceUrl: '',
      publishedDate: new Date().toISOString().split('T')[0],
      tag: 'Weekly Tech News',
      cadenceNote: 'Published Weekly',
      isPublished: true,
      scamType: '',
      howItWorksText: '',
      redFlagsText: '',
      safetyTipsText: '',
      whatToDoIfTargeted: '',
      reportingName: 'National Cyber Crime Reporting Portal',
      reportingHelpline: '1930',
      reportingUrl: 'https://cybercrime.gov.in'
    });
    setCurrentArticleId(null);
    setModalMode('add');
  };

  const openEditModal = (art: AwarenessArticle) => {
    setCurrentArticleId(art.id);
    setFormData({
      title: art.title || '',
      category: art.category,
      summary: art.summary || '',
      source: art.source || '',
      sourceUrl: art.sourceUrl || '',
      publishedDate: art.publishedDate || new Date().toISOString().split('T')[0],
      tag: art.tag || '',
      cadenceNote: art.cadenceNote || '',
      isPublished: art.isPublished !== false,
      scamType: art.scamType || '',
      howItWorksText: Array.isArray(art.howItWorks) ? art.howItWorks.join('\n') : '',
      redFlagsText: Array.isArray(art.redFlags) ? art.redFlags.join('\n') : '',
      safetyTipsText: Array.isArray(art.safetyTips) ? art.safetyTips.join('\n') : '',
      whatToDoIfTargeted: art.whatToDoIfTargeted || '',
      reportingName: art.reportingResource?.name || 'National Cyber Crime Reporting Portal',
      reportingHelpline: art.reportingResource?.helpline || '1930',
      reportingUrl: art.reportingResource?.url || 'https://cybercrime.gov.in'
    });
    setModalMode('edit');
  };

  const handleTogglePublish = async (id: string) => {
    try {
      const res = await fetch('/api/awareness/articles', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle-publish' })
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to toggle status');
      showToast('Article publication status updated', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleDelete = async (id: string, title: string) => {
    if (!confirm(`Are you sure you want to delete "${title}"?`)) return;
    try {
      const res = await fetch(`/api/awareness/articles?id=${encodeURIComponent(id)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to delete article');
      showToast('Article deleted successfully', 'success');
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.summary.trim() || !formData.source.trim() || !formData.sourceUrl.trim()) {
      showToast('Please complete all required fields.', 'error');
      return;
    }

    setIsSubmitting(true);
    try {
      const payload: any = {
        title: formData.title.trim(),
        category: formData.category,
        summary: formData.summary.trim(),
        source: formData.source.trim(),
        sourceUrl: formData.sourceUrl.trim(),
        publishedDate: formData.publishedDate,
        tag: formData.tag.trim() || (formData.category === 'tech-news' ? 'Weekly Tech News' : formData.category === 'cyber-news' ? 'Cybersecurity Update' : 'Scam Alert'),
        cadenceNote: formData.cadenceNote.trim() || (formData.category === 'tech-news' ? 'Published Weekly' : formData.category === 'cyber-news' ? 'Fortnightly Editorial Schedule' : 'Public Scam Awareness'),
        isPublished: formData.isPublished
      };

      if (formData.category === 'scam-alert') {
        payload.scamType = formData.scamType.trim() || 'Online Scam';
        payload.howItWorks = formData.howItWorksText.split('\n').map((s) => s.trim()).filter(Boolean);
        payload.redFlags = formData.redFlagsText.split('\n').map((s) => s.trim()).filter(Boolean);
        payload.safetyTips = formData.safetyTipsText.split('\n').map((s) => s.trim()).filter(Boolean);
        payload.whatToDoIfTargeted = formData.whatToDoIfTargeted.trim();
        payload.reportingResource = {
          name: formData.reportingName.trim() || 'National Cyber Crime Reporting Portal',
          helpline: formData.reportingHelpline.trim() || '1930',
          url: formData.reportingUrl.trim() || 'https://cybercrime.gov.in'
        };
      }

      const method = modalMode === 'edit' ? 'PUT' : 'POST';
      const body = modalMode === 'edit' ? JSON.stringify({ id: currentArticleId, ...payload }) : JSON.stringify(payload);

      const res = await fetch('/api/awareness/articles', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.error || 'Failed to save article');

      showToast(modalMode === 'edit' ? 'Article updated' : 'Article created', 'success');
      setModalMode(null);
      onRefresh();
    } catch (err: any) {
      showToast(err.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredArticles = articles.filter((art) => {
    const matchesCat = categoryFilter === 'all' || art.category === categoryFilter;
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'published' && art.isPublished !== false) ||
      (statusFilter === 'draft' && art.isPublished === false);

    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      art.title.toLowerCase().includes(q) ||
      art.summary.toLowerCase().includes(q) ||
      art.source.toLowerCase().includes(q) ||
      (art.scamType && art.scamType.toLowerCase().includes(q));

    return matchesCat && matchesStatus && matchesSearch;
  });

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#967223] px-2 py-0.5 rounded bg-[#FAF7F2] border border-[#E8D8C3]">
              Domain 01 · CMS
            </span>
          </div>
          <h2 className="text-2xl font-black text-[#151417]">Awareness Articles & Scam CMS</h2>
          <p className="text-xs text-[#55505C]">
            Manage Weekly Technology News, Fortnightly Cybersecurity Updates, and Scam Awareness Guides.
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="px-4 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors flex items-center gap-2 self-start sm:self-center shadow-xs"
        >
          <Plus className="w-4 h-4" />
          <span>Add Article / Scam Alert</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="glass-card rounded-2xl p-4 border-[#E8D8C3] flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-2">
          {/* Category Tabs */}
          {[
            { id: 'all', label: 'All Articles' },
            { id: 'tech-news', label: 'Tech News (Weekly)' },
            { id: 'cyber-news', label: 'Cyber News (14-Day)' },
            { id: 'scam-alert', label: 'Scam Awareness' }
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setCategoryFilter(cat.id as any)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold transition-colors ${
                categoryFilter === cat.id
                  ? 'bg-[#151417] text-[#FAF7F2]'
                  : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
              }`}
            >
              {cat.label}
            </button>
          ))}

          {/* Status Filter */}
          <div className="h-5 w-[1px] bg-[#E8D8C3] mx-1 hidden sm:block" />
          {[
            { id: 'all', label: 'All Status' },
            { id: 'published', label: 'Published' },
            { id: 'draft', label: 'Draft' }
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-2.5 py-1 rounded-full text-[11px] font-semibold transition-colors ${
                statusFilter === st.id
                  ? 'bg-[#967223] text-white'
                  : 'bg-white/80 border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>

        {/* Search */}
        <div className="relative w-full md:w-64">
          <Search className="w-3.5 h-3.5 text-[#8A8592] absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search headlines or scams..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-8 pr-3 py-1.5 rounded-full text-xs bg-white border border-[#E8D8C3] focus:border-[#C89D3C] focus:outline-none"
          />
        </div>
      </div>

      {/* Table / Cards */}
      <div className="space-y-4">
        {filteredArticles.length > 0 ? (
          filteredArticles.map((art) => (
            <div
              key={art.id}
              className={`glass-card rounded-2xl p-5 border transition-all ${
                art.isPublished === false ? 'border-amber-200 bg-amber-50/20' : 'border-[#E8D8C3]'
              }`}
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                <div className="space-y-2 max-w-3xl">
                  <div className="flex flex-wrap items-center gap-2">
                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        art.category === 'tech-news'
                          ? 'bg-blue-50 text-blue-800 border-blue-200'
                          : art.category === 'cyber-news'
                          ? 'bg-amber-50 text-amber-800 border-amber-200'
                          : 'bg-rose-50 text-rose-800 border-rose-200'
                      }`}
                    >
                      {art.category === 'tech-news'
                        ? 'Weekly Tech News'
                        : art.category === 'cyber-news'
                        ? 'Cyber News (14 Days)'
                        : 'Scam Alert'}
                    </span>

                    <span
                      className={`text-[10px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        art.isPublished !== false
                          ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-300'
                      }`}
                    >
                      {art.isPublished !== false ? 'Published' : 'Draft / Hidden'}
                    </span>

                    <span className="text-[11px] font-mono text-[#8A8592]">
                      {art.publishedDate}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-[#151417]">
                    {art.title}
                  </h3>

                  <p className="text-xs text-[#55505C] leading-relaxed line-clamp-2">
                    {art.summary}
                  </p>

                  <div className="flex items-center gap-3 text-xs text-[#8A8592] pt-1">
                    <span>Source: <strong className="text-[#151417]">{art.source}</strong></span>
                    <span>·</span>
                    <a
                      href={art.sourceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#967223] hover:underline flex items-center gap-1"
                    >
                      <span>Link</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                  <button
                    onClick={() => handleTogglePublish(art.id)}
                    className="p-2 rounded-xl bg-white border border-[#E8D8C3] hover:border-[#967223] text-[#645E6D] hover:text-[#151417] transition-colors"
                    title={art.isPublished !== false ? 'Unpublish (Make Draft)' : 'Publish Live'}
                  >
                    {art.isPublished !== false ? <Eye className="w-4 h-4 text-emerald-600" /> : <EyeOff className="w-4 h-4 text-neutral-400" />}
                  </button>
                  <button
                    onClick={() => openEditModal(art)}
                    className="p-2 rounded-xl bg-white border border-[#E8D8C3] hover:border-[#967223] text-[#645E6D] hover:text-[#151417] transition-colors"
                    title="Edit Article"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDelete(art.id, art.title)}
                    className="p-2 rounded-xl bg-white border border-[#E8D8C3] hover:border-rose-400 text-[#645E6D] hover:text-rose-600 transition-colors"
                    title="Delete Article"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="glass-card rounded-2xl p-10 text-center border-[#E8D8C3]">
            <Newspaper className="w-8 h-8 text-[#967223] mx-auto mb-2 opacity-50" />
            <p className="text-sm font-bold text-[#151417]">No articles found.</p>
            <p className="text-xs text-[#645E6D] mt-1">Add your first article using the button above.</p>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modalMode && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 max-w-2xl w-full max-h-[90vh] overflow-y-auto bg-white border-[#E8D8C3] shadow-xl space-y-6 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-4 border-b border-[#E8D8C3]/50">
              <h3 className="text-lg font-black text-[#151417]">
                {modalMode === 'add' ? 'Publish New Awareness Article' : 'Edit Article'}
              </h3>
              <button
                onClick={() => setModalMode(null)}
                className="p-2 rounded-full hover:bg-neutral-100 text-neutral-500"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              {/* Category */}
              <div>
                <label className="font-bold text-[#151417] block mb-1">
                  Category *
                </label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-[#151417] focus:outline-none"
                >
                  <option value="tech-news">Weekly Technology News (Every Week)</option>
                  <option value="cyber-news">Cybersecurity News (Every 14 Days)</option>
                  <option value="scam-alert">Scam Awareness & Exposure</option>
                </select>
              </div>

              {/* Title */}
              <div>
                <label className="font-bold text-[#151417] block mb-1">Headline / Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Critical Apache Tomcat Race Condition (CVE-2024-50379)..."
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-[#151417] focus:outline-none"
                />
              </div>

              {/* Summary */}
              <div>
                <label className="font-bold text-[#151417] block mb-1">Concise Summary *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.summary}
                  onChange={(e) => setFormData({ ...formData, summary: e.target.value })}
                  placeholder="Plain-language explanation of the news or incident..."
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-[#151417] focus:outline-none"
                />
              </div>

              {/* Date & Source */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#151417] block mb-1">Publication Date *</label>
                  <input
                    type="date"
                    required
                    value={formData.publishedDate}
                    onChange={(e) => setFormData({ ...formData, publishedDate: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-[#151417] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#151417] block mb-1">Credible Source *</label>
                  <input
                    type="text"
                    required
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    placeholder="e.g. CERT-In / CISA / Reuters / TechCrunch"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-[#151417] focus:outline-none"
                  />
                </div>
              </div>

              {/* Link */}
              <div>
                <label className="font-bold text-[#151417] block mb-1">Source / Original Article URL *</label>
                <input
                  type="url"
                  required
                  value={formData.sourceUrl}
                  onChange={(e) => setFormData({ ...formData, sourceUrl: e.target.value })}
                  placeholder="https://..."
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-[#151417] focus:outline-none"
                />
              </div>

              {/* Specific to Scam Awareness */}
              {formData.category === 'scam-alert' && (
                <div className="p-4 rounded-2xl bg-rose-50/50 border border-rose-200 space-y-4">
                  <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
                    Scam Exposure Details
                  </span>

                  <div>
                    <label className="font-bold text-[#151417] block mb-1">Scam Type</label>
                    <input
                      type="text"
                      value={formData.scamType}
                      onChange={(e) => setFormData({ ...formData, scamType: e.target.value })}
                      placeholder="e.g. UPI QR Reverse Pay / Fake Job Offer"
                      className="w-full p-2 rounded-xl border border-[#E8D8C3] bg-white text-[#151417] focus:outline-none"
                    />
                  </div>

                  <div>
                    <label className="font-bold text-[#151417] block mb-1">
                      How It Typically Works (One step per line)
                    </label>
                    <textarea
                      rows={3}
                      value={formData.howItWorksText}
                      onChange={(e) => setFormData({ ...formData, howItWorksText: e.target.value })}
                      placeholder="Step 1...&#10;Step 2...&#10;Step 3..."
                      className="w-full p-2 rounded-xl border border-[#E8D8C3] bg-white text-[#151417] focus:outline-none font-mono text-[11px]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="font-bold text-[#151417] block mb-1">
                        Warning Signs (Red Flags - One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.redFlagsText}
                        onChange={(e) => setFormData({ ...formData, redFlagsText: e.target.value })}
                        placeholder="Red flag 1...&#10;Red flag 2..."
                        className="w-full p-2 rounded-xl border border-[#E8D8C3] bg-white text-[#151417] focus:outline-none font-mono text-[11px]"
                      />
                    </div>
                    <div>
                      <label className="font-bold text-[#151417] block mb-1">
                        Safety Tips (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={formData.safetyTipsText}
                        onChange={(e) => setFormData({ ...formData, safetyTipsText: e.target.value })}
                        placeholder="Safety tip 1...&#10;Safety tip 2..."
                        className="w-full p-2 rounded-xl border border-[#E8D8C3] bg-white text-[#151417] focus:outline-none font-mono text-[11px]"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="font-bold text-[#151417] block mb-1">
                      What to Do If Targeted (Incident Response)
                    </label>
                    <input
                      type="text"
                      value={formData.whatToDoIfTargeted}
                      onChange={(e) => setFormData({ ...formData, whatToDoIfTargeted: e.target.value })}
                      placeholder="e.g. Immediately call 1930 and freeze bank transactions..."
                      className="w-full p-2 rounded-xl border border-[#E8D8C3] bg-white text-[#151417] focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {/* Publish Toggle */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="isPublished"
                  checked={formData.isPublished}
                  onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                  className="rounded text-[#C89D3C]"
                />
                <label htmlFor="isPublished" className="font-semibold text-[#151417]">
                  Publish immediately (leave unchecked to save as draft)
                </label>
              </div>

              {/* Actions */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#E8D8C3]/50">
                <button
                  type="button"
                  onClick={() => setModalMode(null)}
                  className="px-4 py-2 rounded-full border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2] font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-full bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] font-bold uppercase tracking-wider"
                >
                  {isSubmitting ? 'Saving...' : modalMode === 'edit' ? 'Save Changes' : 'Publish Article'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
