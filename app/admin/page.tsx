'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DOMAINS,
  LEARNING_SUBJECTS,
  Resource,
  Certification,
  Project,
  Activity,
  Announcement
} from '@/lib/data';
import type { ClubApplication } from '@/lib/store';
import {
  ShieldCheck,
  Plus,
  Trash2,
  Edit3,
  BookOpen,
  Award,
  FolderGit2,
  Calendar,
  Megaphone,
  Layers,
  Users,
  RefreshCw,
  ExternalLink,
  Lock,
  UserCheck,
  UserX,
  Phone,
  FileCheck,
  LogOut,
  KeyRound,
  Eye,
  EyeOff,
  CheckCircle,
  AlertTriangle,
  X,
  Search
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    'overview' | 'resources' | 'certifications' | 'projects' | 'applications' | 'announcements'
  >('overview');

  // Server-Verified Administrator Session State
  const [adminSession, setAdminSession] = useState<{ username?: string; email?: string; role: 'admin' } | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Username & Password Gateway State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // Core CMS Data States
  const [applications, setApplications] = useState<ClubApplication[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter States
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [resStatusFilter, setResStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [resSearchQuery, setResSearchQuery] = useState('');
  const [certStatusFilter, setCertStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [projStatusFilter, setProjStatusFilter] = useState<'all' | 'published' | 'draft'>('all');

  // Delete Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'resource' | 'certification' | 'project' | 'announcement';
    id: string;
    title: string;
  } | null>(null);

  // Resource Add/Edit Form State
  const [resourceModalMode, setResourceModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentResourceId, setCurrentResourceId] = useState<string | null>(null);
  const [resFormTitle, setResFormTitle] = useState('');
  const [resFormDomain, setResFormDomain] = useState('d6');
  const [resFormSubject, setResFormSubject] = useState('');
  const [resFormCategory, setResFormCategory] = useState<any>('Documentation');
  const [resFormDifficulty, setResFormDifficulty] = useState<any>('Beginner');
  const [resFormUrl, setResFormUrl] = useState('');
  const [resFormDesc, setResFormDesc] = useState('');
  const [resFormTags, setResFormTags] = useState('');
  const [resFormIsPublished, setResFormIsPublished] = useState(true);
  const [resFormError, setResFormError] = useState<string | null>(null);

  // Certification Add/Edit Form State
  const [certModalMode, setCertModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentCertId, setCurrentCertId] = useState<string | null>(null);
  const [certFormName, setCertFormName] = useState('');
  const [certFormProvider, setCertFormProvider] = useState('');
  const [certFormDomain, setCertFormDomain] = useState('d6');
  const [certFormUrl, setCertFormUrl] = useState('');
  const [certFormLevel, setCertFormLevel] = useState<any>('Beginner');
  const [certFormCost, setCertFormCost] = useState('Paid');
  const [certFormDesc, setCertFormDesc] = useState('');
  const [certFormTags, setCertFormTags] = useState('');
  const [certFormIsPublished, setCertFormIsPublished] = useState(true);
  const [certFormError, setCertFormError] = useState<string | null>(null);

  // Project Add/Edit Form State
  const [projModalMode, setProjModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentProjId, setCurrentProjId] = useState<string | null>(null);
  const [projFormTitle, setProjFormTitle] = useState('');
  const [projFormDomain, setProjFormDomain] = useState('d1');
  const [projFormStatus, setProjFormStatus] = useState<any>('Active');
  const [projFormGithub, setProjFormGithub] = useState('');
  const [projFormDemo, setProjFormDemo] = useState('');
  const [projFormDesc, setProjFormDesc] = useState('');
  const [projFormTags, setProjFormTags] = useState('');
  const [projFormStars, setProjFormStars] = useState(0);
  const [projFormIsPublished, setProjFormIsPublished] = useState(true);
  const [projFormError, setProjFormError] = useState<string | null>(null);

  // Announcement Form State
  const [showAddAnn, setShowAddAnn] = useState(false);
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnTag, setNewAnnTag] = useState('Official');
  const [newAnnContent, setNewAnnContent] = useState('');

  // Check active server-side session on mount
  useEffect(() => {
    fetch('/api/admin/auth/session')
      .then((res) => res.json())
      .then((data) => {
        if (data.authenticated && data.admin) {
          setAdminSession(data.admin);
          loadAllData();
        }
      })
      .catch((err) => console.error('Failed to verify admin session', err))
      .finally(() => setIsCheckingSession(false));
  }, []);

  const showToast = (text: string, type: 'success' | 'error' = 'success') => {
    setStatusMessage({ type, text });
    setTimeout(() => setStatusMessage(null), 4000);
  };

  const loadAllData = async () => {
    setIsLoading(true);
    try {
      const [resApps, resR, resP, resC, resA, resAnn] = await Promise.all([
        fetch('/api/applications').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/resources?all=true').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/projects?all=true').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/certifications?all=true').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/activities').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/announcements').then((r) => r.json()).catch(() => ({ success: false, data: [] }))
      ]);
      if (resApps.success) setApplications(resApps.data);
      if (resR.success) setResources(resR.data);
      if (resP.success) setProjects(resP.data);
      if (resC.success) setCertifications(resC.data);
      if (resA.success) setActivities(resA.data);
      if (resAnn.success) setAnnouncements(resAnn.data);
    } catch (e) {
      console.error(e);
      showToast('Error refreshing data from server', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Auth Handlers
  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);

    const user = adminUsername.trim();
    const pass = adminPassword;

    if (!user || !pass) {
      setAuthError('Please enter both administrator username and password.');
      return;
    }

    setIsAuthenticating(true);
    try {
      const res = await fetch('/api/admin/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: user, password: pass })
      });
      const data = await res.json();
      if (res.ok && data.success && data.admin) {
        setAdminSession(data.admin);
        setAdminPassword('');
        setAuthError(null);
        loadAllData();
      } else {
        setAuthError(data.error || 'Invalid administrator credentials.');
      }
    } catch {
      setAuthError('Network error during authentication. Please check connectivity.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleAdminLogout = async () => {
    try {
      await fetch('/api/admin/auth/logout', { method: 'POST' });
    } catch (e) {
      console.error(e);
    }
    setAdminSession(null);
    setAdminUsername('');
    setAdminPassword('');
    setAuthError(null);
  };

  // Resource Operations
  const openAddResourceModal = () => {
    setCurrentResourceId(null);
    setResFormTitle('');
    setResFormDomain('d6');
    setResFormSubject('');
    setResFormCategory('Documentation');
    setResFormDifficulty('Beginner');
    setResFormUrl('');
    setResFormDesc('');
    setResFormTags('');
    setResFormIsPublished(true);
    setResFormError(null);
    setResourceModalMode('add');
  };

  const openEditResourceModal = (res: Resource) => {
    setCurrentResourceId(res.id);
    setResFormTitle(res.title);
    setResFormDomain(res.domainId || 'd6');
    setResFormSubject(res.subjectId || '');
    setResFormCategory(res.category);
    setResFormDifficulty(res.difficulty);
    setResFormUrl(res.url);
    setResFormDesc(res.description);
    setResFormTags(Array.isArray(res.tags) ? res.tags.join(', ') : '');
    setResFormIsPublished(res.isPublished !== false);
    setResFormError(null);
    setResourceModalMode('edit');
  };

  const handleSaveResource = async (e: React.FormEvent) => {
    e.preventDefault();
    setResFormError(null);

    if (!resFormTitle.trim() || !resFormUrl.trim()) {
      setResFormError('Title and external URL/attachment path are required.');
      return;
    }

    const domainObj = DOMAINS.find((d) => d.id === resFormDomain);
    const subjectObj = LEARNING_SUBJECTS.find((s) => s.id === resFormSubject || s.slug === resFormSubject);

    const tagsArray = resFormTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: resFormTitle.trim(),
      domainId: resFormDomain,
      domainName: domainObj?.name || 'General Track',
      subjectId: subjectObj ? subjectObj.id : undefined,
      subjectName: subjectObj ? subjectObj.title : undefined,
      category: resFormCategory,
      difficulty: resFormDifficulty,
      description: resFormDesc.trim(),
      url: resFormUrl.trim(),
      isPublished: resFormIsPublished,
      tags: tagsArray
    };

    try {
      if (resourceModalMode === 'add') {
        const res = await fetch('/api/resources', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Resource "${payload.title}" created successfully.`);
          setResourceModalMode(null);
          loadAllData();
        } else {
          setResFormError(data.error || 'Failed to create resource.');
        }
      } else if (resourceModalMode === 'edit' && currentResourceId) {
        const res = await fetch('/api/resources', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentResourceId, ...payload })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Resource "${payload.title}" updated successfully.`);
          setResourceModalMode(null);
          loadAllData();
        } else {
          setResFormError(data.error || 'Failed to update resource.');
        }
      }
    } catch {
      setResFormError('Network communication error saving resource.');
    }
  };

  const handleTogglePublishResource = async (id: string, currentStatus: boolean, title: string) => {
    try {
      const res = await fetch('/api/resources', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle-publish' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Resource "${title}" is now ${currentStatus ? 'Unpublished (Draft)' : 'Published'}.`);
        loadAllData();
      } else {
        showToast(data.error || 'Failed to update publication status', 'error');
      }
    } catch {
      showToast('Network error updating status', 'error');
    }
  };

  // Certification Operations
  const openAddCertModal = () => {
    setCurrentCertId(null);
    setCertFormName('');
    setCertFormProvider('');
    setCertFormDomain('d6');
    setCertFormUrl('');
    setCertFormLevel('Beginner');
    setCertFormCost('Paid');
    setCertFormDesc('');
    setCertFormTags('');
    setCertFormIsPublished(true);
    setCertFormError(null);
    setCertModalMode('add');
  };

  const openEditCertModal = (cert: Certification) => {
    setCurrentCertId(cert.id);
    setCertFormName(cert.name);
    setCertFormProvider(cert.provider);
    setCertFormDomain(cert.domainId || 'd6');
    setCertFormUrl(cert.url);
    setCertFormLevel(cert.level);
    setCertFormCost(cert.cost || 'Paid');
    setCertFormDesc(cert.description);
    setCertFormTags(Array.isArray(cert.tags) ? cert.tags.join(', ') : '');
    setCertFormIsPublished(cert.isPublished !== false);
    setCertFormError(null);
    setCertModalMode('edit');
  };

  const handleSaveCertification = async (e: React.FormEvent) => {
    e.preventDefault();
    setCertFormError(null);

    if (!certFormName.trim() || !certFormProvider.trim()) {
      setCertFormError('Certification name and issuing organization are required.');
      return;
    }

    const domainObj = DOMAINS.find((d) => d.id === certFormDomain);
    const tagsArray = certFormTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      name: certFormName.trim(),
      provider: certFormProvider.trim(),
      domainId: certFormDomain,
      domainName: domainObj?.name || 'General Track',
      level: certFormLevel,
      cost: certFormCost.trim() || 'Paid',
      url: certFormUrl.trim() || '#',
      description: certFormDesc.trim(),
      isPublished: certFormIsPublished,
      tags: tagsArray
    };

    try {
      if (certModalMode === 'add') {
        const res = await fetch('/api/certifications', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Certification "${payload.name}" added successfully.`);
          setCertModalMode(null);
          loadAllData();
        } else {
          setCertFormError(data.error || 'Failed to add certification.');
        }
      } else if (certModalMode === 'edit' && currentCertId) {
        const res = await fetch('/api/certifications', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentCertId, ...payload })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Certification "${payload.name}" updated successfully.`);
          setCertModalMode(null);
          loadAllData();
        } else {
          setCertFormError(data.error || 'Failed to update certification.');
        }
      }
    } catch {
      setCertFormError('Network communication error saving certification.');
    }
  };

  const handleTogglePublishCertification = async (id: string, currentStatus: boolean, name: string) => {
    try {
      const res = await fetch('/api/certifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle-publish' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Certification "${name}" is now ${currentStatus ? 'Unpublished (Draft)' : 'Published'}.`);
        loadAllData();
      } else {
        showToast(data.error || 'Failed to toggle publication', 'error');
      }
    } catch {
      showToast('Network error updating status', 'error');
    }
  };

  // Project Operations
  const openAddProjectModal = () => {
    setCurrentProjId(null);
    setProjFormTitle('');
    setProjFormDomain('d1');
    setProjFormStatus('Active');
    setProjFormGithub('');
    setProjFormDemo('');
    setProjFormDesc('');
    setProjFormTags('');
    setProjFormStars(0);
    setProjFormIsPublished(true);
    setProjFormError(null);
    setProjModalMode('add');
  };

  const openEditProjectModal = (proj: Project) => {
    setCurrentProjId(proj.id);
    setProjFormTitle(proj.title);
    setProjFormDomain(proj.domainId || 'd1');
    setProjFormStatus(proj.status || 'Active');
    setProjFormGithub(proj.githubUrl || '');
    setProjFormDemo(proj.demoUrl || '');
    setProjFormDesc(proj.description);
    setProjFormTags(Array.isArray(proj.tags) ? proj.tags.join(', ') : '');
    setProjFormStars(proj.stars || 0);
    setProjFormIsPublished(proj.isPublished !== false);
    setProjFormError(null);
    setProjModalMode('edit');
  };

  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    setProjFormError(null);

    if (!projFormTitle.trim()) {
      setProjFormError('Project title is required.');
      return;
    }

    const domainObj = DOMAINS.find((d) => d.id === projFormDomain);
    const tagsArray = projFormTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: projFormTitle.trim(),
      description: projFormDesc.trim(),
      domainId: projFormDomain,
      domainName: domainObj?.name || 'General Track',
      status: projFormStatus,
      githubUrl: projFormGithub.trim() || undefined,
      demoUrl: projFormDemo.trim() || undefined,
      tags: tagsArray,
      stars: Number(projFormStars) || 0,
      isPublished: projFormIsPublished
    };

    try {
      if (projModalMode === 'add') {
        const res = await fetch('/api/projects', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Project "${payload.title}" added successfully.`);
          setProjModalMode(null);
          loadAllData();
        } else {
          setProjFormError(data.error || 'Failed to add project.');
        }
      } else if (projModalMode === 'edit' && currentProjId) {
        const res = await fetch('/api/projects', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentProjId, ...payload })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Project "${payload.title}" updated successfully.`);
          setProjModalMode(null);
          loadAllData();
        } else {
          setProjFormError(data.error || 'Failed to update project.');
        }
      }
    } catch {
      setProjFormError('Network error saving project.');
    }
  };

  const handleTogglePublishProject = async (id: string, currentStatus: boolean, title: string) => {
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle-publish' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Project "${title}" is now ${currentStatus ? 'Unpublished (Draft)' : 'Published'}.`);
        loadAllData();
      } else {
        showToast(data.error || 'Failed to toggle publication', 'error');
      }
    } catch {
      showToast('Network error updating status', 'error');
    }
  };

  // Delete Execution Handler (Modal Confirmed)
  const handleExecuteDelete = async () => {
    if (!deleteConfirmation) return;
    const { type, id, title } = deleteConfirmation;

    try {
      let endpoint = '';
      if (type === 'resource') endpoint = `/api/resources?id=${id}`;
      else if (type === 'certification') endpoint = `/api/certifications?id=${id}`;
      else if (type === 'project') endpoint = `/api/projects?id=${id}`;
      else if (type === 'announcement') endpoint = `/api/announcements?id=${id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();

      if (res.ok && data.success) {
        showToast(`${type.charAt(0).toUpperCase() + type.slice(1)} "${title}" deleted.`);
        setDeleteConfirmation(null);
        loadAllData();
      } else {
        showToast(data.error || `Failed to delete ${type}`, 'error');
      }
    } catch {
      showToast(`Network error deleting ${type}`, 'error');
    }
  };

  // Application Status Handler
  const handleUpdateAppStatus = async (id: string, status: 'pending' | 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(`Application ${id.slice(-6)} set to ${status}.`);
        loadAllData();
      } else {
        showToast(data.error || 'Failed to update application', 'error');
      }
    } catch {
      showToast('Status update network error', 'error');
    }
  };

  // Announcement Handlers
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      title: newAnnTitle,
      date: 'Just Now',
      tag: newAnnTag,
      content: newAnnContent,
      author: adminSession?.username || adminSession?.email || 'Administrator'
    };
    const res = await fetch('/api/announcements', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    if (res.ok) {
      setShowAddAnn(false);
      setNewAnnTitle('');
      setNewAnnContent('');
      showToast(`Announcement "${payload.title}" published.`);
      loadAllData();
    }
  };

  // Initial session check loading indicator
  if (isCheckingSession) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center py-16 px-4">
        <div className="text-center space-y-4">
          <RefreshCw className="w-8 h-8 text-[#967223] animate-spin mx-auto" />
          <p className="text-sm font-semibold text-[#55505C]">Verifying administrator credentials...</p>
        </div>
      </div>
    );
  }

  // LOGIN FORM: If unauthenticated, show username & password gateway
  if (!adminSession) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center py-16 px-4 sm:px-6">
        <div className="w-full max-w-md">
          <div className="glass-card rounded-3xl p-8 sm:p-10 border-[#D4AF37]/40 shadow-xl space-y-8 bg-gradient-to-b from-white via-[#FAF7F2] to-[#F5EBDD]/50 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-[#D4AF37]/10 rounded-full blur-2xl pointer-events-none" />

            <div className="text-center space-y-3 relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-[#151417] text-[#FAF7F2] flex items-center justify-center mx-auto border border-[#D4AF37]/50 shadow-md">
                <Lock className="w-7 h-7 text-[#E5C378]" />
              </div>
              <span className="text-[10px] font-mono font-bold tracking-[0.25em] uppercase text-[#967223] block">
                Executive Portal
              </span>
              <h1 className="text-2xl sm:text-3xl font-black text-[#151417] tracking-tight">
                0XNULL Admin Login
              </h1>
              <p className="text-xs text-[#55505C] leading-relaxed">
                Enter your authorized administrator credentials to manage club resources, certifications, projects, and admissions.
              </p>
            </div>

            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 relative z-10 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#151417] block">Administrator Username</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={adminUsername}
                    onChange={(e) => setAdminUsername(e.target.value)}
                    placeholder="e.g. Kaivalya sri"
                    autoComplete="username"
                    className="w-full pl-3.5 pr-4 py-2.5 rounded-xl border border-[#E8D8C3] bg-white text-xs text-[#151417] outline-none focus:border-[#C89D3C] transition-colors"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="font-bold text-[#151417] block">Master Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={adminPassword}
                    onChange={(e) => setAdminPassword(e.target.value)}
                    placeholder="••••••••••••"
                    autoComplete="current-password"
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E8D8C3] bg-white text-xs text-[#151417] outline-none focus:border-[#C89D3C] transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8A8592] hover:text-[#151417]"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-3 rounded-xl bg-[#151417] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 hover:bg-[#2A2830] transition-colors cursor-pointer shadow-md disabled:opacity-50 mt-6"
              >
                {isAuthenticating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin text-[#E5C378]" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4 text-[#E5C378]" />
                    <span>Access Admin Portal</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 text-center">
              <Link href="/" className="text-xs font-semibold text-[#8C6B1B] hover:text-[#151417] transition-colors">
                ← Return to Public Website
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // MAIN ADMIN DASHBOARD
  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 max-w-7xl mx-auto space-y-8">
      {/* Admin Header */}
      <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/40 bg-gradient-to-r from-white via-[#FAF7F2] to-[#F5EBDD]/60 flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-[#151417] text-[#E5C378] flex items-center justify-center font-bold text-2xl border border-[#D4AF37]">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-black text-[#151417]">Admin CMS Portal</h1>
              <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                Authorized Executive
              </span>
            </div>
            <p className="text-xs text-[#645E6D] mt-0.5">
              Active Administrator: <strong className="text-[#151417]">{adminSession.username || adminSession.email}</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={loadAllData}
            disabled={isLoading}
            className="p-2.5 rounded-xl bg-white border border-[#E8D8C3] text-[#8C6B1B] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
            title="Refresh database records"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>
          <Link
            href="/"
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-white border border-[#E8D8C3] text-[#151417] hover:bg-[#FAF7F2] transition-colors"
          >
            Public Site
          </Link>
          <button
            onClick={handleAdminLogout}
            className="px-4 py-2 rounded-xl text-xs font-semibold bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 transition-colors flex items-center gap-1.5 cursor-pointer"
            title="Terminate administrator session"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Toast Alert Banner */}
      {statusMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-semibold flex items-center justify-between border ${
            statusMessage.type === 'error'
              ? 'bg-rose-50 border-rose-200 text-rose-800'
              : 'bg-emerald-50 border-emerald-200 text-emerald-800'
          }`}
        >
          <div className="flex items-center gap-2">
            {statusMessage.type === 'error' ? (
              <AlertTriangle className="w-4 h-4 text-rose-600" />
            ) : (
              <CheckCircle className="w-4 h-4 text-emerald-600" />
            )}
            <span>{statusMessage.text}</span>
          </div>
          <button onClick={() => setStatusMessage(null)} className="hover:opacity-75">
            ✕
          </button>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-[#E8D8C3] pb-3 overflow-x-auto text-xs font-bold uppercase tracking-wider">
        {[
          { id: 'overview', label: 'Overview Metrics', icon: Layers },
          { id: 'resources', label: `Resources (${resources.length})`, icon: BookOpen },
          { id: 'certifications', label: `Certifications (${certifications.length})`, icon: Award },
          { id: 'projects', label: `Projects (${projects.length})`, icon: FolderGit2 },
          { id: 'applications', label: `Applications (${applications.length})`, icon: Users },
          { id: 'announcements', label: `Announcements (${announcements.length})`, icon: Megaphone }
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

      {/* TAB 1: OVERVIEW METRICS */}
      {activeTab === 'overview' && (
        <div className="space-y-8">
          <div className="grid grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Resources
              </span>
              <span className="text-3xl font-black text-[#151417]">{resources.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">
                {resources.filter((r) => r.isPublished !== false).length} published
              </p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Certifications
              </span>
              <span className="text-3xl font-black text-[#151417]">{certifications.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">
                {certifications.filter((c) => c.isPublished !== false).length} published
              </p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Projects
              </span>
              <span className="text-3xl font-black text-[#151417]">{projects.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">
                {projects.filter((p) => p.isPublished !== false).length} published
              </p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Applications
              </span>
              <span className="text-3xl font-black text-[#151417]">{applications.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">
                {applications.filter((a) => a.status === 'pending').length} pending review
              </p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Managed Domains
              </span>
              <span className="text-3xl font-black text-[#151417]">{DOMAINS.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">Awareness #1, Explore #2</p>
            </div>
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                Learning Subjects
              </span>
              <span className="text-3xl font-black text-[#151417]">{LEARNING_SUBJECTS.length}</span>
              <p className="text-[11px] text-[#8C6B1B] font-medium mt-1">Dedicated hubs</p>
            </div>
          </div>

          {/* Quick Domain Matrix */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/30">
            <h3 className="text-xl font-bold text-[#151417] mb-2">Seven Managed Domains</h3>
            <p className="text-xs text-[#645E6D] mb-4">
              Resources, projects, and certifications assigned to each domain appear automatically in their public hubs.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {DOMAINS.map((d) => {
                const count = resources.filter((r) => r.domainId === d.id).length;
                return (
                  <div
                    key={d.id}
                    className="p-3.5 rounded-xl bg-white border border-[#E8D8C3] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-[#967223]">
                        DOMAIN {d.number}
                      </span>
                      <h4 className="text-sm font-bold text-[#151417]">{d.name}</h4>
                      <p className="text-[11px] text-[#8A8592]">{count} resources attached</p>
                    </div>
                    <Link
                      href={`/domains/${d.slug}`}
                      className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
                    >
                      View Hub →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Dedicated Learning Subjects Matrix */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/30">
            <h3 className="text-xl font-bold text-[#151417] mb-2">Four Dedicated Learning Subjects</h3>
            <p className="text-xs text-[#645E6D] mb-4">
              Resources assigned to any of these subjects appear directly on their dedicated learning hub.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
              {LEARNING_SUBJECTS.map((s) => {
                const count = resources.filter(
                  (r) => r.subjectId === s.id || r.subjectId === s.slug
                ).length;
                return (
                  <div
                    key={s.id}
                    className="p-3.5 rounded-xl bg-white border border-[#E8D8C3] flex items-center justify-between"
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-[#967223]">
                        SUBJECT {s.number}
                      </span>
                      <h4 className="text-sm font-bold text-[#151417]">{s.title}</h4>
                      <p className="text-[11px] text-[#8A8592]">{count} resources</p>
                    </div>
                    <Link
                      href={`/learn/${s.slug}`}
                      className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417]"
                    >
                      Open →
                    </Link>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESOURCES MANAGEMENT CMS */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Resources Living Library CMS</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Manage study materials, walkthroughs, whitepapers, and cheat sheets across domains and subjects.
              </p>
            </div>
            <button
              onClick={openAddResourceModal}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#E5C378]" />
              <span>Add Resource</span>
            </button>
          </div>

          {/* Search & Filter Bar */}
          <div className="glass-card rounded-2xl p-4 border-[#E8D8C3] flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-[#8A8592] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resources by title or domain..."
                value={resSearchQuery}
                onChange={(e) => setResSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8D8C3] bg-white text-xs outline-none focus:border-[#C89D3C]"
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs font-bold text-[#8A8592]">Status:</span>
              {(['all', 'published', 'draft'] as const).map((st) => (
                <button
                  key={st}
                  onClick={() => setResStatusFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                    resStatusFilter === st
                      ? 'bg-[#151417] text-[#FAF7F2]'
                      : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Resources Table */}
          <div className="glass-card rounded-2xl overflow-hidden border-[#E8D8C3]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EBDD] text-[#8C6B1B] font-bold uppercase tracking-wider border-b border-[#E8D8C3]">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Domain / Subject</th>
                  <th className="p-3.5">Category</th>
                  <th className="p-3.5">Difficulty</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C3]/50">
                {resources
                  .filter((res) => {
                    if (resStatusFilter === 'published' && res.isPublished === false) return false;
                    if (resStatusFilter === 'draft' && res.isPublished !== false) return false;
                    if (resSearchQuery.trim()) {
                      const q = resSearchQuery.toLowerCase();
                      const match =
                        res.title.toLowerCase().includes(q) ||
                        (res.domainName && res.domainName.toLowerCase().includes(q)) ||
                        (res.subjectName && res.subjectName.toLowerCase().includes(q));
                      if (!match) return false;
                    }
                    return true;
                  })
                  .map((res) => {
                    const isPub = res.isPublished !== false;
                    return (
                      <tr key={res.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-[#151417]">{res.title}</div>
                          <div className="text-[11px] text-[#8A8592] truncate max-w-xs">{res.description}</div>
                        </td>
                        <td className="p-3.5">
                          <div className="font-semibold text-[#151417]">{res.domainName}</div>
                          {res.subjectName && (
                            <span className="inline-block mt-0.5 px-2 py-0.5 rounded text-[10px] font-bold bg-[#E8D8C3]/60 text-[#8C6B1B]">
                              Subject: {res.subjectName}
                            </span>
                          )}
                        </td>
                        <td className="p-3.5 text-[#55505C]">{res.category}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                            {res.difficulty}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border ${
                              isPub
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {isPub ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {/* Toggle Publish */}
                          <button
                            onClick={() => handleTogglePublishResource(res.id, isPub, res.title)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isPub
                                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                            }`}
                            title={isPub ? 'Unpublish (Make Draft)' : 'Publish to website'}
                          >
                            {isPub ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEditResourceModal(res)}
                            className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white text-[#151417] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                            title="Edit resource"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#8C6B1B]" />
                          </button>

                          {/* View Link */}
                          <a
                            href={res.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white text-[#8A8592] hover:text-[#151417] inline-block transition-colors"
                            title="Open external link"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </a>

                          {/* Delete with Confirmation */}
                          <button
                            onClick={() =>
                              setDeleteConfirmation({
                                isOpen: true,
                                type: 'resource',
                                id: res.id,
                                title: res.title
                              })
                            }
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer transition-colors"
                            title="Delete resource"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 3: CERTIFICATIONS MANAGEMENT CMS */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Certifications Management CMS</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Curate verified industry credentials, exam tracks, and vendor certifications.
              </p>
            </div>
            <button
              onClick={openAddCertModal}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#E5C378]" />
              <span>Add Certification</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8A8592]">Status:</span>
            {(['all', 'published', 'draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setCertStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                  certStatusFilter === st
                    ? 'bg-[#151417] text-[#FAF7F2]'
                    : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Certifications Table */}
          <div className="glass-card rounded-2xl overflow-hidden border-[#E8D8C3]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EBDD] text-[#8C6B1B] font-bold uppercase tracking-wider border-b border-[#E8D8C3]">
                <tr>
                  <th className="p-3.5">Certification Name</th>
                  <th className="p-3.5">Provider / Org</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Level & Cost</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C3]/50">
                {certifications
                  .filter((c) => {
                    if (certStatusFilter === 'published' && c.isPublished === false) return false;
                    if (certStatusFilter === 'draft' && c.isPublished !== false) return false;
                    return true;
                  })
                  .map((cert) => {
                    const isPub = cert.isPublished !== false;
                    return (
                      <tr key={cert.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="p-3.5 font-bold text-[#151417]">{cert.name}</td>
                        <td className="p-3.5 text-[#55505C] font-semibold">{cert.provider}</td>
                        <td className="p-3.5 text-[#55505C]">{cert.domainName}</td>
                        <td className="p-3.5 space-x-1">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                            {cert.level}
                          </span>
                          <span className="text-[11px] text-[#8A8592]">{cert.cost}</span>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border ${
                              isPub
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {isPub ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {/* Toggle Publish */}
                          <button
                            onClick={() => handleTogglePublishCertification(cert.id, isPub, cert.name)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isPub
                                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                            }`}
                            title={isPub ? 'Make Draft' : 'Publish to website'}
                          >
                            {isPub ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEditCertModal(cert)}
                            className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white text-[#151417] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                            title="Edit certification"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#8C6B1B]" />
                          </button>

                          {/* Official URL */}
                          {cert.url && cert.url !== '#' && (
                            <a
                              href={cert.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white text-[#8A8592] hover:text-[#151417] inline-block transition-colors"
                              title="Official website"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Delete with Confirmation */}
                          <button
                            onClick={() =>
                              setDeleteConfirmation({
                                isOpen: true,
                                type: 'certification',
                                id: cert.id,
                                title: cert.name
                              })
                            }
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer transition-colors"
                            title="Delete certification"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 4: PROJECTS MANAGEMENT CMS */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Projects Management CMS</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Manage student software codebases, tooling repositories, and collaborative engineering tracks.
              </p>
            </div>
            <button
              onClick={openAddProjectModal}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 cursor-pointer shadow-xs self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#E5C378]" />
              <span>Add Project</span>
            </button>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-[#8A8592]">Status:</span>
            {(['all', 'published', 'draft'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setProjStatusFilter(st)}
                className={`px-3 py-1 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                  projStatusFilter === st
                    ? 'bg-[#151417] text-[#FAF7F2]'
                    : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Projects Table */}
          <div className="glass-card rounded-2xl overflow-hidden border-[#E8D8C3]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EBDD] text-[#8C6B1B] font-bold uppercase tracking-wider border-b border-[#E8D8C3]">
                <tr>
                  <th className="p-3.5">Project Title</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Tech Tags</th>
                  <th className="p-3.5">Publication</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C3]/50">
                {projects
                  .filter((p) => {
                    if (projStatusFilter === 'published' && p.isPublished === false) return false;
                    if (projStatusFilter === 'draft' && p.isPublished !== false) return false;
                    return true;
                  })
                  .map((proj) => {
                    const isPub = proj.isPublished !== false;
                    return (
                      <tr key={proj.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-[#151417]">{proj.title}</div>
                          <div className="text-[11px] text-[#8A8592] truncate max-w-xs">{proj.description}</div>
                        </td>
                        <td className="p-3.5 text-[#55505C] font-semibold">{proj.domainName}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                            {proj.status || 'Active'}
                          </span>
                        </td>
                        <td className="p-3.5">
                          <div className="flex flex-wrap gap-1 max-w-xs">
                            {(proj.tags || []).map((t: string, idx: number) => (
                              <span key={idx} className="px-1.5 py-0.5 rounded bg-white border border-[#E8D8C3] text-[10px]">
                                {t}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="p-3.5">
                          <span
                            className={`px-2 py-0.5 rounded-full font-bold text-[10px] uppercase tracking-wider border ${
                              isPub
                                ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                : 'bg-amber-50 text-amber-800 border-amber-200'
                            }`}
                          >
                            {isPub ? 'Published' : 'Draft'}
                          </span>
                        </td>
                        <td className="p-3.5 text-right space-x-1.5 whitespace-nowrap">
                          {/* Toggle Publish */}
                          <button
                            onClick={() => handleTogglePublishProject(proj.id, isPub, proj.title)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isPub
                                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                            }`}
                            title={isPub ? 'Make Draft' : 'Publish to website'}
                          >
                            {isPub ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>

                          {/* Edit */}
                          <button
                            onClick={() => openEditProjectModal(proj)}
                            className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white text-[#151417] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                            title="Edit project"
                          >
                            <Edit3 className="w-3.5 h-3.5 text-[#8C6B1B]" />
                          </button>

                          {/* GitHub Link */}
                          {proj.githubUrl && (
                            <a
                              href={proj.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white text-[#8A8592] hover:text-[#151417] inline-block transition-colors"
                              title="Open GitHub repository"
                            >
                              <FolderGit2 className="w-3.5 h-3.5" />
                            </a>
                          )}

                          {/* Delete with Confirmation */}
                          <button
                            onClick={() =>
                              setDeleteConfirmation({
                                isOpen: true,
                                type: 'project',
                                id: proj.id,
                                title: proj.title
                              })
                            }
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 cursor-pointer transition-colors"
                            title="Delete project"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 5: APPLICATIONS MANAGEMENT */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Club Membership Applications</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Review submitted candidate details, domain track interests, and decide admissions.
              </p>
            </div>

            <div className="flex items-center gap-2">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((status) => (
                <button
                  key={status}
                  onClick={() => setAppFilter(status)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold capitalize transition-colors cursor-pointer ${
                    appFilter === status
                      ? 'bg-[#151417] text-[#FAF7F2]'
                      : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {status} ({status === 'all' ? applications.length : applications.filter((a) => a.status === status).length})
                </button>
              ))}
            </div>
          </div>

          {applications.filter((a) => appFilter === 'all' || a.status === appFilter).length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center border-[#E8D8C3]">
              <FileCheck className="w-10 h-10 text-[#C89D3C] mx-auto mb-2 opacity-50" />
              <p className="text-sm font-bold text-[#151417]">No applications matching filter</p>
              <p className="text-xs text-[#645E6D] mt-1">
                Student submissions via /join will appear here in real-time.
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {applications
                .filter((a) => appFilter === 'all' || a.status === appFilter)
                .map((app) => {
                  const domainNames = (app.domainInterests || []).map(
                    (id) => DOMAINS.find((d) => d.id === id)?.name || id
                  );
                  return (
                    <div
                      key={app.id}
                      className="glass-card rounded-2xl p-6 border-[#E8D8C3] space-y-4 transition-all"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg font-black text-[#151417]">{app.fullName}</h4>
                            <span
                              className={`text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                                app.status === 'approved'
                                  ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                                  : app.status === 'rejected'
                                  ? 'bg-rose-50 text-rose-800 border-rose-200'
                                  : 'bg-amber-50 text-amber-800 border-amber-200'
                              }`}
                            >
                              {app.status}
                            </span>
                          </div>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-[#55505C]">
                            <span>Roll: <strong className="text-[#151417]">{app.rollNumber}</strong></span>
                            <span>•</span>
                            <span>Branch: <strong className="text-[#151417]">{app.branch}</strong></span>
                            <span>•</span>
                            <span>Year: <strong className="text-[#151417]">{app.year}</strong></span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Phone className="w-3 h-3 text-[#967223]" />
                              <strong>{app.phoneNumber}</strong>
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          {app.status !== 'approved' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'approved')}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-600 text-white hover:bg-emerald-700 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <UserCheck className="w-3.5 h-3.5" />
                              <span>Approve</span>
                            </button>
                          )}
                          {app.status !== 'rejected' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'rejected')}
                              className="px-3 py-1.5 rounded-xl text-xs font-bold bg-rose-600 text-white hover:bg-rose-700 transition-colors flex items-center gap-1 cursor-pointer"
                            >
                              <UserX className="w-3.5 h-3.5" />
                              <span>Reject</span>
                            </button>
                          )}
                          {app.status !== 'pending' && (
                            <button
                              onClick={() => handleUpdateAppStatus(app.id, 'pending')}
                              className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D] hover:bg-[#F5EBDD] transition-colors cursor-pointer"
                            >
                              Reset
                            </button>
                          )}
                        </div>
                      </div>

                      {/* Domain Interests */}
                      <div className="pt-2 border-t border-[#E8D8C3]/50">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1.5">
                          Selected Domain Interests ({domainNames.length})
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {domainNames.map((name, i) => (
                            <span
                              key={i}
                              className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]"
                            >
                              {name}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="text-[10px] text-[#8A8592] flex items-center justify-between">
                        <span>Application ID: {app.id}</span>
                        <span>Submitted: {new Date(app.createdAt).toLocaleString()}</span>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* TAB 6: ANNOUNCEMENTS BROADCAST */}
      {activeTab === 'announcements' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold text-[#151417]">Broadcast Announcements</h3>
            <button
              onClick={() => setShowAddAnn(!showAddAnn)}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#E5C378]" />
              <span>Publish Announcement</span>
            </button>
          </div>

          {showAddAnn && (
            <form
              onSubmit={handleCreateAnnouncement}
              className="glass-card rounded-3xl p-6 border-[#D4AF37] space-y-4 bg-white"
            >
              <h4 className="text-base font-bold text-[#151417]">Publish Club Bulletin</h4>
              <div className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Headline</label>
                  <input
                    type="text"
                    required
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    placeholder="e.g. Next CTF Tournament Date Confirmed"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Tag</label>
                  <input
                    type="text"
                    required
                    value={newAnnTag}
                    onChange={(e) => setNewAnnTag(e.target.value)}
                    placeholder="e.g. Official, Competition, Workshop"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Content</label>
                  <textarea
                    rows={3}
                    required
                    value={newAnnContent}
                    onChange={(e) => setNewAnnContent(e.target.value)}
                    placeholder="Announcement details..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddAnn(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830]"
                >
                  Publish Broadcast
                </button>
              </div>
            </form>
          )}

          <div className="space-y-4">
            {announcements.map((ann) => (
              <div
                key={ann.id}
                className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex items-start justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5EBDD] text-[#8C6B1B]">
                      {ann.tag}
                    </span>
                    <span className="text-[11px] text-[#8A8592]">{ann.date}</span>
                  </div>
                  <h4 className="text-base font-bold text-[#151417] mt-1">{ann.title}</h4>
                  <p className="text-xs text-[#55505C] mt-1">{ann.content}</p>
                  <p className="text-[10px] text-[#8A8592] mt-2">Posted by {ann.author}</p>
                </div>
                <button
                  onClick={() =>
                    setDeleteConfirmation({
                      isOpen: true,
                      type: 'announcement',
                      id: ann.id,
                      title: ann.title
                    })
                  }
                  className="p-1.5 text-rose-600 hover:text-rose-800 cursor-pointer"
                  title="Delete announcement"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* RESOURCE ADD / EDIT MODAL */}
      {resourceModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8D8C3] pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#151417]">
                  {resourceModalMode === 'add' ? 'Add New Resource' : 'Edit Resource Record'}
                </h3>
                <p className="text-xs text-[#645E6D]">
                  Resources appear under their assigned domain and/or learning subject.
                </p>
              </div>
              <button
                onClick={() => setResourceModalMode(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {resFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{resFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveResource} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Resource Title *</label>
                  <input
                    type="text"
                    required
                    value={resFormTitle}
                    onChange={(e) => setResFormTitle(e.target.value)}
                    placeholder="e.g. Linux Kernel Memory Maps & Exploit Mitigation"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Domain Track *</label>
                  <select
                    value={resFormDomain}
                    onChange={(e) => setResFormDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.number} · {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">
                    Learning Subject (For /learn pages)
                  </label>
                  <select
                    value={resFormSubject}
                    onChange={(e) => setResFormSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    <option value="">None (Domain only)</option>
                    {LEARNING_SUBJECTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.number} · {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Resource Category *</label>
                  <select
                    value={resFormCategory}
                    onChange={(e) => setResFormCategory(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    <option value="Walkthrough">Walkthrough</option>
                    <option value="Tool">Tool</option>
                    <option value="Cheat Sheet">Cheat Sheet</option>
                    <option value="Documentation">Documentation</option>
                    <option value="Research Paper">Research Paper</option>
                    <option value="Video">Video</option>
                    <option value="Website">Website</option>
                    <option value="Downloadable">Downloadable</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Difficulty Level *</label>
                  <select
                    value={resFormDifficulty}
                    onChange={(e) => setResFormDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">
                    External URL or File Link *
                  </label>
                  <input
                    type="text"
                    required
                    value={resFormUrl}
                    onChange={(e) => setResFormUrl(e.target.value)}
                    placeholder="https://example.com/guide or /assets/docs/cheatsheet.pdf"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                  <p className="text-[10px] text-[#8A8592] mt-0.5">
                    Must be a valid HTTP/HTTPS URL or secure internal asset path.
                  </p>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={resFormDesc}
                    onChange={(e) => setResFormDesc(e.target.value)}
                    placeholder="Concise, informative explanation of this resource..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={resFormTags}
                    onChange={(e) => setResFormTags(e.target.value)}
                    placeholder="e.g. Memory, Linux, Kernel, Forensics"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={resFormIsPublished}
                      onChange={(e) => setResFormIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-[#151417] accent-[#151417] cursor-pointer"
                    />
                    <span className="font-bold text-[#151417]">
                      Publish immediately to public website
                    </span>
                  </label>
                  <span className="text-[10px] text-[#8A8592]">
                    (If unchecked, saved as draft; hidden from normal visitors)
                  </span>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8D8C3]">
                <button
                  type="button"
                  onClick={() => setResourceModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D] hover:bg-[#F5EBDD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors cursor-pointer"
                >
                  {resourceModalMode === 'add' ? 'Create Resource' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CERTIFICATION ADD / EDIT MODAL */}
      {certModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8D8C3] pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#151417]">
                  {certModalMode === 'add' ? 'Add Certification' : 'Edit Certification Record'}
                </h3>
                <p className="text-xs text-[#645E6D]">
                  Display industry credentials mapped to club specializations.
                </p>
              </div>
              <button
                onClick={() => setCertModalMode(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {certFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{certFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveCertification} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Certification Name *</label>
                  <input
                    type="text"
                    required
                    value={certFormName}
                    onChange={(e) => setCertFormName(e.target.value)}
                    placeholder="e.g. CompTIA Security+ (SY0-701)"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">
                    Issuing Organization / Provider *
                  </label>
                  <input
                    type="text"
                    required
                    value={certFormProvider}
                    onChange={(e) => setCertFormProvider(e.target.value)}
                    placeholder="e.g. CompTIA, Cisco, AWS, Linux Foundation"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Domain Track *</label>
                  <select
                    value={certFormDomain}
                    onChange={(e) => setCertFormDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.number} · {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Difficulty Level</label>
                  <select
                    value={certFormLevel}
                    onChange={(e) => setCertFormLevel(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Cost / Fee</label>
                  <input
                    type="text"
                    value={certFormCost}
                    onChange={(e) => setCertFormCost(e.target.value)}
                    placeholder="e.g. Paid ($392) or Free"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Official Exam / Info URL</label>
                  <input
                    type="text"
                    value={certFormUrl}
                    onChange={(e) => setCertFormUrl(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Description</label>
                  <textarea
                    rows={2}
                    value={certFormDesc}
                    onChange={(e) => setCertFormDesc(e.target.value)}
                    placeholder="Overview of syllabus, recommended prep, and industry role alignment..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">
                    Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={certFormTags}
                    onChange={(e) => setCertFormTags(e.target.value)}
                    placeholder="e.g. SOC Analyst, Security+, Fundamentals"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={certFormIsPublished}
                      onChange={(e) => setCertFormIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-[#151417] accent-[#151417] cursor-pointer"
                    />
                    <span className="font-bold text-[#151417]">
                      Publish immediately to public website
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8D8C3]">
                <button
                  type="button"
                  onClick={() => setCertModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D] hover:bg-[#F5EBDD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors cursor-pointer"
                >
                  {certModalMode === 'add' ? 'Create Certification' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* PROJECT ADD / EDIT MODAL */}
      {projModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8D8C3] pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#151417]">
                  {projModalMode === 'add' ? 'Add New Project' : 'Edit Project Record'}
                </h3>
                <p className="text-xs text-[#645E6D]">
                  Showcase collaborative student repositories and active tooling.
                </p>
              </div>
              <button
                onClick={() => setProjModalMode(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {projFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{projFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveProject} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Project Title *</label>
                  <input
                    type="text"
                    required
                    value={projFormTitle}
                    onChange={(e) => setProjFormTitle(e.target.value)}
                    placeholder="e.g. 0X-PacketTracer"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Domain Track *</label>
                  <select
                    value={projFormDomain}
                    onChange={(e) => setProjFormDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    {DOMAINS.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.number} · {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Project Status</label>
                  <select
                    value={projFormStatus}
                    onChange={(e) => setProjFormStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    <option value="Active">Active</option>
                    <option value="Incubating">Incubating</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={projFormGithub}
                    onChange={(e) => setProjFormGithub(e.target.value)}
                    placeholder="https://github.com/oxnull-club/..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Live Demo URL</label>
                  <input
                    type="text"
                    value={projFormDemo}
                    onChange={(e) => setProjFormDemo(e.target.value)}
                    placeholder="https://..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={projFormDesc}
                    onChange={(e) => setProjFormDesc(e.target.value)}
                    placeholder="Brief description of the tool or software codebase..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">
                    Technology Tags (Comma-separated)
                  </label>
                  <input
                    type="text"
                    value={projFormTags}
                    onChange={(e) => setProjFormTags(e.target.value)}
                    placeholder="e.g. Python, Scapy, Packet Analysis, Wireshark"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div className="sm:col-span-2 flex items-center gap-3 pt-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={projFormIsPublished}
                      onChange={(e) => setProjFormIsPublished(e.target.checked)}
                      className="w-4 h-4 rounded text-[#151417] accent-[#151417] cursor-pointer"
                    />
                    <span className="font-bold text-[#151417]">
                      Publish immediately to public website
                    </span>
                  </label>
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8D8C3]">
                <button
                  type="button"
                  onClick={() => setProjModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D] hover:bg-[#F5EBDD] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors cursor-pointer"
                >
                  {projModalMode === 'add' ? 'Create Project' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmation && deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-rose-300 max-w-md w-full bg-white space-y-5 shadow-2xl">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-lg font-black text-[#151417]">Confirm Permanent Deletion</h3>
              <p className="text-xs text-[#55505C] leading-relaxed">
                Are you sure you want to permanently delete the {deleteConfirmation.type}{' '}
                <strong className="text-[#151417]">&ldquo;{deleteConfirmation.title}&rdquo;</strong>?
              </p>
              <p className="text-[11px] text-rose-700 font-semibold">
                This record will be permanently removed from public view and backend databases.
              </p>
            </div>

            <div className="flex items-center justify-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D] hover:bg-[#F5EBDD] cursor-pointer"
              >
                Cancel, Keep Record
              </button>
              <button
                type="button"
                onClick={handleExecuteDelete}
                className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-rose-600 text-white hover:bg-rose-700 transition-colors cursor-pointer shadow-xs"
              >
                Yes, Delete Record
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
