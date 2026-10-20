'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  DOMAINS,
  LEARNING_SUBJECTS,
  Domain,
  LearningSubject,
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
  Search,
  Upload,
  Copy,
  Check,
  Terminal,
  Compass,
  Shield,
  Cloud,
  Cpu
} from 'lucide-react';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<
    | 'overview'
    | 'resources'
    | 'certifications'
    | 'projects'
    | 'subjects'
    | 'domains'
    | 'uploads'
    | 'activities'
    | 'announcements'
    | 'applications'
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
  const [subjects, setSubjects] = useState<LearningSubject[]>(LEARNING_SUBJECTS);
  const [domainsList, setDomainsList] = useState<Domain[]>(DOMAINS);
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter States
  const [appFilter, setAppFilter] = useState<'all' | 'pending' | 'approved' | 'rejected'>('all');
  const [resStatusFilter, setResStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [resDomainFilter, setResDomainFilter] = useState('all');
  const [resSubjectFilter, setResSubjectFilter] = useState('all');
  const [resSearchQuery, setResSearchQuery] = useState('');
  const [certStatusFilter, setCertStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [certDomainFilter, setCertDomainFilter] = useState('all');
  const [projStatusFilter, setProjStatusFilter] = useState<'all' | 'published' | 'draft'>('all');
  const [projDomainFilter, setProjDomainFilter] = useState('all');

  // Delete Confirmation Modal State
  const [deleteConfirmation, setDeleteConfirmation] = useState<{
    isOpen: boolean;
    type: 'resource' | 'certification' | 'project' | 'announcement' | 'activity';
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
  const [projFormDifficulty, setProjFormDifficulty] = useState<any>('Intermediate');
  const [projFormGithub, setProjFormGithub] = useState('');
  const [projFormDemo, setProjFormDemo] = useState('');
  const [projFormThumbnail, setProjFormThumbnail] = useState('');
  const [projFormDesc, setProjFormDesc] = useState('');
  const [projFormTags, setProjFormTags] = useState('');
  const [projFormStars, setProjFormStars] = useState(0);
  const [projFormIsPublished, setProjFormIsPublished] = useState(true);
  const [projFormError, setProjFormError] = useState<string | null>(null);

  // Subject Edit Form State
  const [subjectEditModal, setSubjectEditModal] = useState<LearningSubject | null>(null);
  const [subFormTitle, setSubFormTitle] = useState('');
  const [subFormSubtitle, setSubFormSubtitle] = useState('');
  const [subFormDesc, setSubFormDesc] = useState('');
  const [subFormKeyConcepts, setSubFormKeyConcepts] = useState('');
  const [subFormLab, setSubFormLab] = useState('');
  const [subFormError, setSubFormError] = useState<string | null>(null);

  // Domain Edit Form State
  const [domainEditModal, setDomainEditModal] = useState<Domain | null>(null);
  const [domFormName, setDomFormName] = useState('');
  const [domFormBadge, setDomFormBadge] = useState('');
  const [domFormTagline, setDomFormTagline] = useState('');
  const [domFormOverview, setDomFormOverview] = useState('');
  const [domFormFocusAreas, setDomFormFocusAreas] = useState('');
  const [domFormError, setDomFormError] = useState<string | null>(null);

  // Activity Add/Edit Form State
  const [activityModalMode, setActivityModalMode] = useState<'add' | 'edit' | null>(null);
  const [currentActivityId, setCurrentActivityId] = useState<string | null>(null);
  const [actFormTitle, setActFormTitle] = useState('');
  const [actFormSubtitle, setActFormSubtitle] = useState('');
  const [actFormType, setActFormType] = useState('Technical');
  const [actFormFrequency, setActFormFrequency] = useState('Weekly');
  const [actFormDesc, setActFormDesc] = useState('');
  const [actFormParticipants, setActFormParticipants] = useState('All Members');
  const [actFormDomain, setActFormDomain] = useState('d1');
  const [actFormError, setActFormError] = useState<string | null>(null);

  // Storage / Upload States
  const [uploadedFiles, setUploadedFiles] = useState<
    Array<{ url: string; fileName: string; originalName: string; sizeBytes: number; uploadedAt: string }>
  >([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  // Announcements State
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
      const [resApps, resR, resP, resC, resA, resAnn, resSubs, resDoms] = await Promise.all([
        fetch('/api/applications').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/resources?all=true').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/projects?all=true').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/certifications?all=true').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/activities').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/announcements').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/learning-subjects').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/domains').then((r) => r.json()).catch(() => ({ success: false, data: [] }))
      ]);
      if (resApps.success) setApplications(resApps.data);
      if (resR.success) setResources(resR.data);
      if (resP.success) setProjects(resP.data);
      if (resC.success) setCertifications(resC.data);
      if (resA.success) setActivities(resA.data);
      if (resAnn.success) setAnnouncements(resAnn.data);
      if (resSubs.success && Array.isArray(resSubs.data) && resSubs.data.length > 0) {
        setSubjects(resSubs.data);
      }
      if (resDoms.success && Array.isArray(resDoms.data) && resDoms.data.length > 0) {
        setDomainsList(resDoms.data);
      }
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
  const openAddResourceModal = (prefill?: { domainId?: string; subjectId?: string }) => {
    setCurrentResourceId(null);
    setResFormTitle('');
    setResFormDomain(prefill?.domainId || 'd6');
    setResFormSubject(prefill?.subjectId || '');
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

    const domainObj = domainsList.find((d) => d.id === resFormDomain);
    const subjectObj = subjects.find((s) => s.id === resFormSubject || s.slug === resFormSubject);

    const tagsArray = resFormTags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const payload = {
      title: resFormTitle.trim(),
      domainId: resFormDomain || undefined,
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
        showToast(data.error || 'Failed to toggle publication', 'error');
      }
    } catch {
      showToast('Network error updating status', 'error');
    }
  };

  // Certification Operations
  const openAddCertModal = (prefillDomainId?: string) => {
    setCurrentCertId(null);
    setCertFormName('');
    setCertFormProvider('');
    setCertFormDomain(prefillDomainId || 'd6');
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
      setCertFormError('Certification title and issuing organization are required.');
      return;
    }

    const domainObj = domainsList.find((d) => d.id === certFormDomain);
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
      cost: certFormCost,
      url: certFormUrl.trim() || '#',
      description: certFormDesc.trim(),
      tags: tagsArray,
      isPublished: certFormIsPublished
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
      setCertFormError('Network error saving certification.');
    }
  };

  const handleTogglePublishCert = async (id: string, currentStatus: boolean, title: string) => {
    try {
      const res = await fetch('/api/certifications', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, action: 'toggle-publish' })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Certification "${title}" is now ${currentStatus ? 'Unpublished (Draft)' : 'Published'}.`);
        loadAllData();
      } else {
        showToast(data.error || 'Failed to toggle publication', 'error');
      }
    } catch {
      showToast('Network error updating status', 'error');
    }
  };

  // Project Operations
  const openAddProjectModal = (prefillDomainId?: string) => {
    setCurrentProjId(null);
    setProjFormTitle('');
    setProjFormDomain(prefillDomainId || 'd1');
    setProjFormStatus('Active');
    setProjFormDifficulty('Intermediate');
    setProjFormGithub('');
    setProjFormDemo('');
    setProjFormThumbnail('');
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
    setProjFormStatus(proj.status);
    setProjFormDifficulty(proj.difficulty || 'Intermediate');
    setProjFormGithub(proj.githubUrl || '');
    setProjFormDemo(proj.demoUrl || '');
    setProjFormThumbnail(proj.thumbnail || proj.imageUrl || '');
    setProjFormDesc(proj.description);
    setProjFormTags(Array.isArray(proj.techStack) ? proj.techStack.join(', ') : (Array.isArray(proj.tags) ? proj.tags.join(', ') : ''));
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

    const domainObj = domainsList.find((d) => d.id === projFormDomain);
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
      difficulty: projFormDifficulty,
      githubUrl: projFormGithub.trim() || undefined,
      demoUrl: projFormDemo.trim() || undefined,
      thumbnail: projFormThumbnail.trim() || undefined,
      tags: tagsArray,
      techStack: tagsArray,
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

  // Subject Edit Operations
  const openEditSubjectModal = (subj: LearningSubject) => {
    setSubjectEditModal(subj);
    setSubFormTitle(subj.title);
    setSubFormSubtitle(subj.subtitle);
    setSubFormDesc(subj.description);
    setSubFormKeyConcepts(subj.keyConcepts.join('\n'));
    setSubFormLab(subj.handsOnLab);
    setSubFormError(null);
  };

  const handleSaveSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subjectEditModal) return;
    setSubFormError(null);

    const concepts = subFormKeyConcepts
      .split('\n')
      .map((c) => c.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/learning-subjects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: subjectEditModal.slug,
          title: subFormTitle.trim(),
          subtitle: subFormSubtitle.trim(),
          description: subFormDesc.trim(),
          keyConcepts: concepts,
          handsOnLab: subFormLab.trim()
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Subject "${subFormTitle}" updated successfully.`);
        setSubjectEditModal(null);
        loadAllData();
      } else {
        setSubFormError(data.error || 'Failed to update subject.');
      }
    } catch {
      setSubFormError('Network error updating subject.');
    }
  };

  // Domain Edit Operations
  const openEditDomainModal = (dom: Domain) => {
    setDomainEditModal(dom);
    setDomFormName(dom.name);
    setDomFormBadge(dom.badge);
    setDomFormTagline(dom.tagline);
    setDomFormOverview(dom.overview || '');
    setDomFormFocusAreas((dom.focusAreas || []).join('\n'));
    setDomFormError(null);
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainEditModal) return;
    setDomFormError(null);

    const areas = domFormFocusAreas
      .split('\n')
      .map((a) => a.trim())
      .filter(Boolean);

    try {
      const res = await fetch('/api/domains', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: domainEditModal.slug,
          name: domFormName.trim(),
          badge: domFormBadge.trim(),
          tagline: domFormTagline.trim(),
          overview: domFormOverview.trim(),
          focusAreas: areas
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Domain "${domFormName}" updated successfully.`);
        setDomainEditModal(null);
        loadAllData();
      } else {
        setDomFormError(data.error || 'Failed to update domain.');
      }
    } catch {
      setDomFormError('Network error updating domain.');
    }
  };

  // Activity Operations
  const openAddActivityModal = () => {
    setCurrentActivityId(null);
    setActFormTitle('');
    setActFormSubtitle('');
    setActFormType('Technical');
    setActFormFrequency('Weekly');
    setActFormDesc('');
    setActFormParticipants('All Members');
    setActFormDomain('d1');
    setActFormError(null);
    setActivityModalMode('add');
  };

  const openEditActivityModal = (act: Activity) => {
    setCurrentActivityId(act.id);
    setActFormTitle(act.title);
    setActFormSubtitle(act.subtitle || '');
    setActFormType(act.type || 'Technical');
    setActFormFrequency(act.frequency || 'Weekly');
    setActFormDesc(act.summary || act.description || '');
    setActFormParticipants(act.participants || 'All Members');
    setActFormDomain(act.domainId || 'd1');
    setActFormError(null);
    setActivityModalMode('edit');
  };

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setActFormError(null);

    if (!actFormTitle.trim() || !actFormDesc.trim()) {
      setActFormError('Title and description are required.');
      return;
    }

    const payload = {
      title: actFormTitle.trim(),
      subtitle: actFormSubtitle.trim(),
      type: actFormType,
      frequency: actFormFrequency,
      summary: actFormDesc.trim(),
      description: actFormDesc.trim(),
      participants: actFormParticipants.trim(),
      domainId: actFormDomain
    };

    try {
      if (activityModalMode === 'add') {
        const res = await fetch('/api/activities', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Activity "${payload.title}" created successfully.`);
          setActivityModalMode(null);
          loadAllData();
        } else {
          setActFormError(data.error || 'Failed to create activity.');
        }
      } else if (activityModalMode === 'edit' && currentActivityId) {
        const res = await fetch('/api/activities', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id: currentActivityId, ...payload })
        });
        const data = await res.json();
        if (res.ok && data.success) {
          showToast(`Activity "${payload.title}" updated successfully.`);
          setActivityModalMode(null);
          loadAllData();
        } else {
          setActFormError(data.error || 'Failed to update activity.');
        }
      }
    } catch {
      setActFormError('Network error saving activity.');
    }
  };

  // Upload Handler
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadError(null);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setUploadedFiles((prev) => [
          {
            url: data.url,
            fileName: data.fileName,
            originalName: data.originalName,
            sizeBytes: data.sizeBytes,
            uploadedAt: new Date().toLocaleTimeString()
          },
          ...prev
        ]);
        showToast(`File "${data.originalName}" uploaded successfully.`);
      } else {
        setUploadError(data.error || 'Upload failed.');
      }
    } catch {
      setUploadError('Network error uploading file.');
    } finally {
      setIsUploading(false);
      e.target.value = '';
    }
  };

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
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
      else if (type === 'activity') endpoint = `/api/activities?id=${id}`;

      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Successfully deleted ${type} "${title}".`);
        setDeleteConfirmation(null);
        loadAllData();
      } else {
        showToast(data.error || `Failed to delete ${type}`, 'error');
      }
    } catch {
      showToast('Network error during deletion', 'error');
    }
  };

  // Application Status Change
  const handleUpdateAppStatus = async (appId: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ applicationId: appId, status })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Application marked as ${status}.`);
        loadAllData();
      } else {
        showToast(data.error || 'Failed to update application status', 'error');
      }
    } catch {
      showToast('Network error updating application', 'error');
    }
  };

  // Announcement Creation
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAnnTitle.trim(),
          tag: newAnnTag.trim(),
          content: newAnnContent.trim(),
          author: adminSession?.username || 'Executive Admin'
        })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Announcement broadcasted successfully.');
        setNewAnnTitle('');
        setNewAnnContent('');
        setShowAddAnn(false);
        loadAllData();
      } else {
        showToast(data.error || 'Failed to publish announcement', 'error');
      }
    } catch {
      showToast('Network error publishing announcement', 'error');
    }
  };

  if (isCheckingSession) {
    return (
      <div className="min-h-[70vh] flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <RefreshCw className="w-8 h-8 animate-spin text-[#C89D3C]" />
          <p className="text-xs font-semibold text-[#8C6B1B]">Verifying administrative gateway...</p>
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
          { id: 'subjects', label: `Learn Subjects (${subjects.length})`, icon: Terminal },
          { id: 'domains', label: `Domains (${domainsList.length})`, icon: Compass },
          { id: 'uploads', label: 'Storage & Assets', icon: Upload },
          { id: 'activities', label: `Activities (${activities.length})`, icon: Calendar },
          { id: 'announcements', label: `Announcements (${announcements.length})`, icon: Megaphone },
          { id: 'applications', label: `Applications (${applications.length})`, icon: Users }
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
          <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8592] block">Resources</span>
              <div className="text-3xl font-black text-[#151417] mt-1">{resources.length}</div>
              <div className="text-[11px] text-[#8C6B1B] font-semibold mt-1">
                {resources.filter((r) => r.isPublished !== false).length} published • {resources.filter((r) => r.isPublished === false).length} drafts
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8592] block">Certifications</span>
              <div className="text-3xl font-black text-[#151417] mt-1">{certifications.length}</div>
              <div className="text-[11px] text-[#8C6B1B] font-semibold mt-1">
                {certifications.filter((c) => c.isPublished !== false).length} published
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8592] block">Projects</span>
              <div className="text-3xl font-black text-[#151417] mt-1">{projects.length}</div>
              <div className="text-[11px] text-[#8C6B1B] font-semibold mt-1">
                {projects.filter((p) => p.isPublished !== false).length} published
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8592] block">Domains & Subjects</span>
              <div className="text-3xl font-black text-[#151417] mt-1">{domainsList.length + subjects.length}</div>
              <div className="text-[11px] text-[#8C6B1B] font-semibold mt-1">
                7 Domains • 4 Learn Subjects
              </div>
            </div>

            <div className="glass-card rounded-2xl p-5 border-[#E8D8C3]">
              <span className="text-[10px] uppercase font-bold tracking-wider text-[#8A8592] block">Applications</span>
              <div className="text-3xl font-black text-[#151417] mt-1">{applications.length}</div>
              <div className="text-[11px] text-[#8C6B1B] font-semibold mt-1">
                {applications.filter((a) => a.status === 'pending').length} pending review
              </div>
            </div>
          </div>

          {/* Quick Action Hub */}
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#E8D8C3] space-y-4">
            <h3 className="text-lg font-black text-[#151417]">CMS Quick Management Hub</h3>
            <p className="text-xs text-[#55505C]">
              Publish new resources, assign credentials to domains, update curriculum syllabi, or upload diagrams directly into Supabase.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <button
                onClick={() => openAddResourceModal()}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Plus className="w-4 h-4 text-[#E5C378]" />
                <span>Add Resource</span>
              </button>
              <button
                onClick={() => openAddCertModal()}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-[#E8D8C3] text-[#151417] hover:bg-[#FAF7F2] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Award className="w-4 h-4 text-[#C89D3C]" />
                <span>Add Certification</span>
              </button>
              <button
                onClick={() => openAddProjectModal()}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-[#E8D8C3] text-[#151417] hover:bg-[#FAF7F2] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <FolderGit2 className="w-4 h-4 text-[#C89D3C]" />
                <span>Add Project</span>
              </button>
              <button
                onClick={() => setActiveTab('subjects')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-[#E8D8C3] text-[#151417] hover:bg-[#FAF7F2] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Terminal className="w-4 h-4 text-[#C89D3C]" />
                <span>Manage Learn Curriculum</span>
              </button>
              <button
                onClick={() => setActiveTab('domains')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-white border border-[#E8D8C3] text-[#151417] hover:bg-[#FAF7F2] transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Compass className="w-4 h-4 text-[#C89D3C]" />
                <span>Manage 7 Domains</span>
              </button>
              <button
                onClick={() => setActiveTab('uploads')}
                className="px-4 py-2.5 rounded-xl text-xs font-bold bg-[#FAF7F2] border border-[#D4AF37] text-[#8C6B1B] hover:bg-white transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Upload className="w-4 h-4 text-[#C89D3C]" />
                <span>Upload Document / Diagram</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: RESOURCES CMS */}
      {activeTab === 'resources' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Resources Library CMS</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Curated whitepapers, tools, walkthroughs, and cheat sheets assigned to domains and learning subjects.
              </p>
            </div>
            <button
              onClick={() => openAddResourceModal()}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#E5C378]" />
              <span>Add Resource</span>
            </button>
          </div>

          {/* Filters Bar */}
          <div className="glass-card rounded-2xl p-4 border-[#E8D8C3] flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-[#8A8592] absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search resources by title, domain, or subject..."
                value={resSearchQuery}
                onChange={(e) => setResSearchQuery(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 rounded-xl border border-[#E8D8C3] bg-white text-xs outline-none focus:border-[#C89D3C]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-2 w-full md:w-auto text-xs">
              {/* Domain Filter */}
              <select
                value={resDomainFilter}
                onChange={(e) => setResDomainFilter(e.target.value)}
                className="p-1.5 rounded-xl border border-[#E8D8C3] bg-white text-xs outline-none"
              >
                <option value="all">All Domains</option>
                {domainsList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.number} · {d.name}
                  </option>
                ))}
              </select>

              {/* Subject Filter */}
              <select
                value={resSubjectFilter}
                onChange={(e) => setResSubjectFilter(e.target.value)}
                className="p-1.5 rounded-xl border border-[#E8D8C3] bg-white text-xs outline-none"
              >
                <option value="all">All Subjects</option>
                {subjects.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.number} · {s.title}
                  </option>
                ))}
              </select>

              {/* Status Filter */}
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
                    if (resDomainFilter !== 'all' && res.domainId !== resDomainFilter) return false;
                    if (resSubjectFilter !== 'all' && res.subjectId !== resSubjectFilter) return false;
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
                          <div className="font-semibold text-[#151417]">{res.domainName || 'General'}</div>
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
                          <button
                            onClick={() => openEditResourceModal(res)}
                            className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white text-[#151417] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                            title="Edit resource"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirmation({
                                isOpen: true,
                                type: 'resource',
                                id: res.id,
                                title: res.title
                              })
                            }
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
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

      {/* TAB 3: CERTIFICATIONS CMS */}
      {activeTab === 'certifications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Certifications Roadmap CMS</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Industry credentials mapped to student capability stages and cybersecurity domains.
              </p>
            </div>
            <button
              onClick={() => openAddCertModal()}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#E5C378]" />
              <span>Add Certification</span>
            </button>
          </div>

          {/* Filters */}
          <div className="glass-card rounded-2xl p-4 border-[#E8D8C3] flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[#8A8592]">Filter Domain:</span>
              <select
                value={certDomainFilter}
                onChange={(e) => setCertDomainFilter(e.target.value)}
                className="p-1.5 rounded-xl border border-[#E8D8C3] bg-white text-xs outline-none"
              >
                <option value="all">All Domains</option>
                {domainsList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.number} · {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[#8A8592]">Status:</span>
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
          </div>

          {/* Certifications Table */}
          <div className="glass-card rounded-2xl overflow-hidden border-[#E8D8C3]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EBDD] text-[#8C6B1B] font-bold uppercase tracking-wider border-b border-[#E8D8C3]">
                <tr>
                  <th className="p-3.5">Name</th>
                  <th className="p-3.5">Provider</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Level</th>
                  <th className="p-3.5">Cost</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C3]/50">
                {certifications
                  .filter((cert) => {
                    if (certStatusFilter === 'published' && cert.isPublished === false) return false;
                    if (certStatusFilter === 'draft' && cert.isPublished !== false) return false;
                    if (certDomainFilter !== 'all' && cert.domainId !== certDomainFilter) return false;
                    return true;
                  })
                  .map((cert) => {
                    const isPub = cert.isPublished !== false;
                    return (
                      <tr key={cert.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                        <td className="p-3.5">
                          <div className="font-bold text-[#151417]">{cert.name}</div>
                          <div className="text-[11px] text-[#8A8592] truncate max-w-xs">{cert.description}</div>
                        </td>
                        <td className="p-3.5 font-semibold text-[#151417]">{cert.provider}</td>
                        <td className="p-3.5 text-[#55505C]">{cert.domainName || 'General'}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                            {cert.level}
                          </span>
                        </td>
                        <td className="p-3.5 text-[#55505C]">{cert.cost || 'Paid'}</td>
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
                          <button
                            onClick={() => handleTogglePublishCert(cert.id, isPub, cert.name)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isPub
                                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                            }`}
                            title={isPub ? 'Unpublish' : 'Publish'}
                          >
                            {isPub ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => openEditCertModal(cert)}
                            className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white text-[#151417] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirmation({
                                isOpen: true,
                                type: 'certification',
                                id: cert.id,
                                title: cert.name
                              })
                            }
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
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

      {/* TAB 4: PROJECTS CMS */}
      {activeTab === 'projects' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Member Security Projects CMS</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Open-source toolchains, forensic parsers, and honeypots authored by club working groups.
              </p>
            </div>
            <button
              onClick={() => openAddProjectModal()}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <Plus className="w-4 h-4 text-[#E5C378]" />
              <span>Add Project</span>
            </button>
          </div>

          {/* Filters */}
          <div className="glass-card rounded-2xl p-4 border-[#E8D8C3] flex flex-col md:flex-row gap-3 items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[#8A8592]">Filter Domain:</span>
              <select
                value={projDomainFilter}
                onChange={(e) => setProjDomainFilter(e.target.value)}
                className="p-1.5 rounded-xl border border-[#E8D8C3] bg-white text-xs outline-none"
              >
                <option value="all">All Domains</option>
                {domainsList.map((d) => (
                  <option key={d.id} value={d.id}>
                    {d.number} · {d.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-[#8A8592]">Status:</span>
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
          </div>

          {/* Projects Table */}
          <div className="glass-card rounded-2xl overflow-hidden border-[#E8D8C3]">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F5EBDD] text-[#8C6B1B] font-bold uppercase tracking-wider border-b border-[#E8D8C3]">
                <tr>
                  <th className="p-3.5">Project Title</th>
                  <th className="p-3.5">Domain</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5">Tech Stack</th>
                  <th className="p-3.5">Publication</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E8D8C3]/50">
                {projects
                  .filter((p) => {
                    if (projStatusFilter === 'published' && p.isPublished === false) return false;
                    if (projStatusFilter === 'draft' && p.isPublished !== false) return false;
                    if (projDomainFilter !== 'all' && p.domainId !== projDomainFilter) return false;
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
                        <td className="p-3.5 font-semibold text-[#151417]">{proj.domainName || 'General'}</td>
                        <td className="p-3.5">
                          <span className="px-2 py-0.5 rounded font-bold text-[10px] bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                            {proj.status}
                          </span>
                        </td>
                        <td className="p-3.5 text-[#55505C]">
                          {(proj.techStack || proj.tags || []).slice(0, 3).join(', ')}
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
                          <button
                            onClick={() => handleTogglePublishProject(proj.id, isPub, proj.title)}
                            className={`p-1.5 rounded-lg border transition-colors cursor-pointer ${
                              isPub
                                ? 'bg-amber-50 border-amber-200 text-amber-800 hover:bg-amber-100'
                                : 'bg-emerald-50 border-emerald-200 text-emerald-800 hover:bg-emerald-100'
                            }`}
                            title={isPub ? 'Unpublish' : 'Publish'}
                          >
                            {isPub ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                          </button>
                          <button
                            onClick={() => openEditProjectModal(proj)}
                            className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white text-[#151417] hover:bg-[#FAF7F2] transition-colors cursor-pointer"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() =>
                              setDeleteConfirmation({
                                isOpen: true,
                                type: 'project',
                                id: proj.id,
                                title: proj.title
                              })
                            }
                            className="p-1.5 rounded-lg border border-rose-200 bg-rose-50 text-rose-700 hover:bg-rose-100 transition-colors cursor-pointer"
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

      {/* TAB 5: LEARNING SUBJECTS CMS */}
      {activeTab === 'subjects' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Four Foundational Learning Subjects</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Curriculum, key concepts, hands-on labs, and subject-assigned resources for the /learn portal.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {subjects.map((subj) => {
              const subjResources = resources.filter(
                (r) => r.subjectId === subj.id || r.subjectId === subj.slug
              );

              return (
                <div
                  key={subj.id}
                  className="glass-card rounded-3xl p-6 border-[#E8D8C3] flex flex-col justify-between space-y-4"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-black text-[#967223]">
                        SUBJECT {subj.number}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                        {subjResources.length} Resources Attached
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-[#151417]">{subj.title}</h4>
                    <p className="text-xs font-semibold text-[#8C6B1B]">{subj.subtitle}</p>
                    <p className="text-xs text-[#55505C] leading-relaxed">{subj.description}</p>

                    <div>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                        Key Concepts ({subj.keyConcepts.length})
                      </span>
                      <ul className="space-y-1 text-xs text-[#151417]">
                        {subj.keyConcepts.map((kc, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-[#C89D3C]">✓</span>
                            <span>{kc}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3]">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#967223] block mb-1">
                        Hands-On Lab
                      </span>
                      <p className="text-xs text-[#151417] font-medium">{subj.handsOnLab}</p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-[#E8D8C3] flex items-center justify-between gap-2">
                    <Link
                      href={`/learn/${subj.slug}`}
                      target="_blank"
                      className="text-xs font-bold text-[#8C6B1B] hover:text-[#151417] flex items-center gap-1"
                    >
                      <span>Preview Hub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => openAddResourceModal({ subjectId: subj.id })}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3] hover:bg-white flex items-center gap-1 cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Add Resource</span>
                      </button>
                      <button
                        onClick={() => openEditSubjectModal(subj)}
                        className="px-3 py-1.5 rounded-xl text-xs font-bold bg-[#151417] text-white hover:bg-[#2A2830] flex items-center gap-1 cursor-pointer"
                      >
                        <Edit3 className="w-3.5 h-3.5 text-[#E5C378]" />
                        <span>Edit Syllabus</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 6: DOMAINS CMS */}
      {activeTab === 'domains' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Seven Cybersecurity Domains CMS</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Overview text, focus areas, badges, and learning pathway stages for each of the 7 tracks.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {domainsList.map((dom) => {
              const domResCount = resources.filter((r) => r.domainId === dom.id).length;
              const domCertCount = certifications.filter((c) => c.domainId === dom.id).length;
              const domProjCount = projects.filter((p) => p.domainId === dom.id).length;

              return (
                <div
                  key={dom.id}
                  className="glass-card rounded-3xl p-6 border-[#E8D8C3] flex flex-col lg:flex-row lg:items-start justify-between gap-6"
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-xs font-black text-[#967223]">
                        DOMAIN {dom.number}
                      </span>
                      <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                        {dom.badge}
                      </span>
                    </div>

                    <h4 className="text-xl font-black text-[#151417]">{dom.name}</h4>
                    <p className="text-xs font-semibold text-[#8C6B1B]">{dom.tagline}</p>
                    <p className="text-xs text-[#55505C] leading-relaxed">{dom.overview}</p>

                    <div className="pt-2">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-[#8A8592] block mb-1">
                        Focus Areas ({(dom.focusAreas || []).length})
                      </span>
                      <div className="flex flex-wrap gap-1.5">
                        {(dom.focusAreas || []).map((fa, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded text-[11px] bg-white border border-[#E8D8C3] text-[#151417]"
                          >
                            {fa}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold text-[#8A8592] pt-2">
                      <span>{domResCount} Resources</span>
                      <span>•</span>
                      <span>{domCertCount} Certifications</span>
                      <span>•</span>
                      <span>{domProjCount} Projects</span>
                    </div>
                  </div>

                  <div className="flex flex-col sm:flex-row lg:flex-col gap-2 shrink-0">
                    <Link
                      href={`/domains/${dom.slug}`}
                      target="_blank"
                      className="px-4 py-2 rounded-xl text-xs font-bold text-center bg-white border border-[#E8D8C3] text-[#8C6B1B] hover:bg-[#FAF7F2] flex items-center justify-center gap-1.5"
                    >
                      <span>View Hub</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                    <button
                      onClick={() => openAddResourceModal({ domainId: dom.id })}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-center bg-[#FAF7F2] border border-[#E8D8C3] text-[#151417] hover:bg-white flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Plus className="w-3.5 h-3.5 text-[#C89D3C]" />
                      <span>Add Resource</span>
                    </button>
                    <button
                      onClick={() => openEditDomainModal(dom)}
                      className="px-4 py-2 rounded-xl text-xs font-bold text-center bg-[#151417] text-white hover:bg-[#2A2830] flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <Edit3 className="w-3.5 h-3.5 text-[#E5C378]" />
                      <span>Edit Domain</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 7: STORAGE & ASSETS CMS */}
      {activeTab === 'uploads' && (
        <div className="space-y-6">
          <div>
            <h3 className="text-xl font-bold text-[#151417]">Storage & Club Assets</h3>
            <p className="text-xs text-[#645E6D] mt-0.5">
              Securely upload diagrams, thumbnails, cheat sheets, and PDF whitepapers directly into the Supabase &lsquo;club-assets&rsquo; storage bucket.
            </p>
          </div>

          {/* Upload Area */}
          <div className="glass-card rounded-3xl p-8 border-dashed border-2 border-[#D4AF37] text-center space-y-4 bg-[#FAF7F2]/50">
            <div className="w-14 h-14 rounded-2xl bg-white border border-[#E8D8C3] flex items-center justify-center mx-auto text-[#C89D3C] shadow-sm">
              <Upload className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h4 className="text-base font-bold text-[#151417]">Upload New Document or Diagram</h4>
              <p className="text-xs text-[#55505C]">
                Supported: PNG, JPEG, WebP, SVG, and PDF documents. Maximum file size: 10 MB.
              </p>
            </div>

            {uploadError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold max-w-md mx-auto">
                {uploadError}
              </div>
            )}

            <div>
              <label className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-[#151417] text-[#FAF7F2] font-bold text-xs uppercase tracking-wider hover:bg-[#2A2830] transition-colors cursor-pointer shadow-md">
                <Upload className="w-4 h-4 text-[#E5C378]" />
                <span>{isUploading ? 'Uploading to Bucket...' : 'Select File to Upload'}</span>
                <input
                  type="file"
                  disabled={isUploading}
                  onChange={handleFileUpload}
                  accept=".png,.jpg,.jpeg,.webp,.svg,.pdf"
                  className="hidden"
                />
              </label>
            </div>
          </div>

          {/* Uploaded Files Table */}
          {uploadedFiles.length > 0 && (
            <div className="space-y-3">
              <h4 className="text-sm font-bold text-[#151417]">Recently Uploaded Assets</h4>
              <div className="glass-card rounded-2xl overflow-hidden border-[#E8D8C3]">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#F5EBDD] text-[#8C6B1B] font-bold uppercase tracking-wider border-b border-[#E8D8C3]">
                    <tr>
                      <th className="p-3.5">Asset File</th>
                      <th className="p-3.5">Size</th>
                      <th className="p-3.5">Uploaded</th>
                      <th className="p-3.5 text-right">Direct Public URL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#E8D8C3]/50">
                    {uploadedFiles.map((f, i) => (
                      <tr key={i} className="hover:bg-[#FAF7F2]/60">
                        <td className="p-3.5 font-bold text-[#151417]">{f.originalName}</td>
                        <td className="p-3.5 text-[#55505C]">{(f.sizeBytes / 1024).toFixed(1)} KB</td>
                        <td className="p-3.5 text-[#8A8592]">{f.uploadedAt}</td>
                        <td className="p-3.5 text-right">
                          <button
                            onClick={() => copyToClipboard(f.url)}
                            className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3] hover:bg-white inline-flex items-center gap-1 cursor-pointer"
                          >
                            {copiedUrl === f.url ? (
                              <>
                                <Check className="w-3.5 h-3.5 text-emerald-600" />
                                <span className="text-emerald-700">Copied!</span>
                              </>
                            ) : (
                              <>
                                <Copy className="w-3.5 h-3.5" />
                                <span>Copy Link</span>
                              </>
                            )}
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 8: ACTIVITIES CMS */}
      {activeTab === 'activities' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Activities & Tactical Sessions CMS</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Manage club workshops, CTF scrimmages, labs, and peer roundtable sessions.
              </p>
            </div>
            <button
              onClick={() => openAddActivityModal()}
              className="px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830] transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4 text-[#E5C378]" />
              <span>Add Activity</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {activities.map((act) => (
              <div
                key={act.id}
                className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#F5EBDD] text-[#8C6B1B]">
                      {act.type} • {act.frequency}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => openEditActivityModal(act)}
                        className="p-1.5 text-[#645E6D] hover:text-[#151417] cursor-pointer"
                        title="Edit activity"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() =>
                          setDeleteConfirmation({
                            isOpen: true,
                            type: 'activity',
                            id: act.id,
                            title: act.title
                          })
                        }
                        className="p-1.5 text-rose-600 hover:text-rose-800 cursor-pointer"
                        title="Delete activity"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <h4 className="text-base font-bold text-[#151417]">{act.title}</h4>
                  {act.subtitle && <p className="text-xs font-semibold text-[#8C6B1B]">{act.subtitle}</p>}
                  <p className="text-xs text-[#55505C] mt-1 leading-relaxed">
                    {act.summary || act.description}
                  </p>
                </div>

                <div className="pt-2 border-t border-[#E8D8C3]/50 text-[11px] text-[#8A8592] flex items-center justify-between">
                  <span>Participants: {act.participants || 'All Members'}</span>
                  <span>ID: {act.id}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 9: ANNOUNCEMENTS BROADCAST */}
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

      {/* TAB 10: CLUB APPLICATIONS */}
      {activeTab === 'applications' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-[#151417]">Student Membership Applications</h3>
              <p className="text-xs text-[#645E6D] mt-0.5">
                Review official club candidate submissions, academic roll numbers, and domain preferences.
              </p>
            </div>

            <div className="flex items-center gap-1.5 text-xs font-bold">
              {(['all', 'pending', 'approved', 'rejected'] as const).map((filter) => (
                <button
                  key={filter}
                  onClick={() => setAppFilter(filter)}
                  className={`px-3 py-1.5 rounded-xl capitalize transition-colors cursor-pointer ${
                    appFilter === filter
                      ? 'bg-[#151417] text-[#FAF7F2]'
                      : 'bg-white border border-[#E8D8C3] text-[#645E6D] hover:bg-[#FAF7F2]'
                  }`}
                >
                  {filter}
                </button>
              ))}
            </div>
          </div>

          {applications.length === 0 ? (
            <div className="glass-card rounded-2xl p-8 text-center text-xs text-[#8A8592] border-[#E8D8C3]">
              No membership applications received yet.
            </div>
          ) : (
            <div className="space-y-4">
              {applications
                .filter((app) => (appFilter === 'all' ? true : app.status === appFilter))
                .map((app) => {
                  const domainNames = (app.domainInterests || []).map(
                    (dId) => domainsList.find((d) => d.id === dId)?.name || dId
                  );

                  return (
                    <div
                      key={app.id}
                      className="glass-card rounded-2xl p-5 border-[#E8D8C3] space-y-3 hover:border-[#D4AF37]/50 transition-colors"
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-base font-bold text-[#151417]">{app.fullName}</h4>
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
                  <label className="font-bold text-[#8C6B1B] block mb-1">Domain Track</label>
                  <select
                    value={resFormDomain}
                    onChange={(e) => setResFormDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    <option value="">General Track (No Domain)</option>
                    {domainsList.map((d) => (
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
                    {subjects.map((s) => (
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
                    External URL or Attachment Link *
                  </label>
                  <input
                    type="text"
                    required
                    value={resFormUrl}
                    onChange={(e) => setResFormUrl(e.target.value)}
                    placeholder="https://example.com/guide or /uploads/cheatsheet.pdf"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                  <span className="text-[10px] text-[#8A8592] block mt-1">
                    Tip: You can upload PDFs or diagrams in the Storage tab and paste the link here.
                  </span>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Description / Summary</label>
                  <textarea
                    rows={3}
                    value={resFormDesc}
                    onChange={(e) => setResFormDesc(e.target.value)}
                    placeholder="Detailed explanation of what this resource covers..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={resFormTags}
                    onChange={(e) => setResFormTags(e.target.value)}
                    placeholder="Linux, Security, Shell, Memory"
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
                  <span className="text-[11px] text-[#8A8592]">
                    (Unpublished items remain visible only to admins in this portal)
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
                  {certModalMode === 'add' ? 'Add Certification Track' : 'Edit Certification'}
                </h3>
                <p className="text-xs text-[#645E6D]">
                  Manage mapped professional credentials displayed on /certifications.
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
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Credential Name *</label>
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
                  <label className="font-bold text-[#8C6B1B] block mb-1">Issuing Body / Provider *</label>
                  <input
                    type="text"
                    required
                    value={certFormProvider}
                    onChange={(e) => setCertFormProvider(e.target.value)}
                    placeholder="e.g. CompTIA, OffSec, AWS, ISC2"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Associated Domain *</label>
                  <select
                    value={certFormDomain}
                    onChange={(e) => setCertFormDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    {domainsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.number} · {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Target Capability Level *</label>
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
                  <label className="font-bold text-[#8C6B1B] block mb-1">Exam Cost / Pricing</label>
                  <select
                    value={certFormCost}
                    onChange={(e) => setCertFormCost(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    <option value="Paid">Paid</option>
                    <option value="Free">Free</option>
                    <option value="Student Discount">Student Discount</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Official Syllabus URL</label>
                  <input
                    type="text"
                    value={certFormUrl}
                    onChange={(e) => setCertFormUrl(e.target.value)}
                    placeholder="https://www.comptia.org/certifications/security"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Description & Focus</label>
                  <textarea
                    rows={3}
                    value={certFormDesc}
                    onChange={(e) => setCertFormDesc(e.target.value)}
                    placeholder="Summary of exam blueprint, target roles, and preparation pathway..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Tags (Comma-separated)</label>
                  <input
                    type="text"
                    value={certFormTags}
                    onChange={(e) => setCertFormTags(e.target.value)}
                    placeholder="Security+, CompTIA, Entry Level"
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
                  {projModalMode === 'add' ? 'Add Member Project' : 'Edit Project Details'}
                </h3>
                <p className="text-xs text-[#645E6D]">
                  Showcase member-authored toolchains and research codebases on /projects.
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
                  <label className="font-bold text-[#8C6B1B] block mb-1">Project Name / Title *</label>
                  <input
                    type="text"
                    required
                    value={projFormTitle}
                    onChange={(e) => setProjFormTitle(e.target.value)}
                    placeholder="e.g. Memory Forensic Analyzer (MFA-Core)"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Primary Domain *</label>
                  <select
                    value={projFormDomain}
                    onChange={(e) => setProjFormDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    {domainsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.number} · {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Lifecycle Status *</label>
                  <select
                    value={projFormStatus}
                    onChange={(e) => setProjFormStatus(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    <option value="Active">Active Lab</option>
                    <option value="In Research">In Research</option>
                    <option value="Production Ready">Production Ready</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Difficulty Level *</label>
                  <select
                    value={projFormDifficulty}
                    onChange={(e) => setProjFormDifficulty(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">GitHub Star Count</label>
                  <input
                    type="number"
                    min="0"
                    value={projFormStars}
                    onChange={(e) => setProjFormStars(Number(e.target.value))}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">GitHub Repository URL</label>
                  <input
                    type="text"
                    value={projFormGithub}
                    onChange={(e) => setProjFormGithub(e.target.value)}
                    placeholder="https://github.com/oxnull/project-repo"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Live Demo / Dashboard URL</label>
                  <input
                    type="text"
                    value={projFormDemo}
                    onChange={(e) => setProjFormDemo(e.target.value)}
                    placeholder="https://demo.oxnull.club"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none focus:border-[#C89D3C]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Thumbnail / Diagram URL</label>
                  <input
                    type="text"
                    value={projFormThumbnail}
                    onChange={(e) => setProjFormThumbnail(e.target.value)}
                    placeholder="/uploads/diagram.png or storage URL"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Description & Engineering Output</label>
                  <textarea
                    rows={3}
                    value={projFormDesc}
                    onChange={(e) => setProjFormDesc(e.target.value)}
                    placeholder="Technical overview of what this project does and problems it solves..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Technologies (Comma-separated)</label>
                  <input
                    type="text"
                    value={projFormTags}
                    onChange={(e) => setProjFormTags(e.target.value)}
                    placeholder="Python, C++, Volatility, Scapy, Docker"
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

      {/* SUBJECT EDIT MODAL */}
      {subjectEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8D8C3] pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#151417]">
                  Edit Learning Subject: {subjectEditModal.title}
                </h3>
                <p className="text-xs text-[#645E6D]">
                  Updates will immediately reflect on /learn and /learn/{subjectEditModal.slug}.
                </p>
              </div>
              <button
                onClick={() => setSubjectEditModal(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {subFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {subFormError}
              </div>
            )}

            <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">Subject Title *</label>
                <input
                  type="text"
                  required
                  value={subFormTitle}
                  onChange={(e) => setSubFormTitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">Subtitle / Core Focus</label>
                <input
                  type="text"
                  value={subFormSubtitle}
                  onChange={(e) => setSubFormSubtitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">Description</label>
                <textarea
                  rows={3}
                  value={subFormDesc}
                  onChange={(e) => setSubFormDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">
                  Key Concepts (One per line)
                </label>
                <textarea
                  rows={4}
                  value={subFormKeyConcepts}
                  onChange={(e) => setSubFormKeyConcepts(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">Hands-On Lab Challenge</label>
                <textarea
                  rows={3}
                  value={subFormLab}
                  onChange={(e) => setSubFormLab(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                />
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8D8C3]">
                <button
                  type="button"
                  onClick={() => setSubjectEditModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830]"
                >
                  Save Subject
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DOMAIN EDIT MODAL */}
      {domainEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8D8C3] pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#151417]">
                  Edit Domain: {domainEditModal.name}
                </h3>
                <p className="text-xs text-[#645E6D]">
                  Updates will immediately reflect on homepage, /domains, and /domains/{domainEditModal.slug}.
                </p>
              </div>
              <button
                onClick={() => setDomainEditModal(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {domFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {domFormError}
              </div>
            )}

            <form onSubmit={handleSaveDomain} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Domain Name *</label>
                  <input
                    type="text"
                    required
                    value={domFormName}
                    onChange={(e) => setDomFormName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Badge Tag *</label>
                  <input
                    type="text"
                    required
                    value={domFormBadge}
                    onChange={(e) => setDomFormBadge(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Tagline</label>
                  <textarea
                    rows={2}
                    value={domFormTagline}
                    onChange={(e) => setDomFormTagline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Overview & Methodology</label>
                  <textarea
                    rows={4}
                    value={domFormOverview}
                    onChange={(e) => setDomFormOverview(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Focus Areas (One per line)</label>
                  <textarea
                    rows={4}
                    value={domFormFocusAreas}
                    onChange={(e) => setDomFormFocusAreas(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] font-mono text-xs"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8D8C3]">
                <button
                  type="button"
                  onClick={() => setDomainEditModal(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830]"
                >
                  Save Domain
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACTIVITY ADD / EDIT MODAL */}
      {activityModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8D8C3] pb-4">
              <div>
                <h3 className="text-lg sm:text-xl font-black text-[#151417]">
                  {activityModalMode === 'add' ? 'Add Tactical Activity' : 'Edit Activity'}
                </h3>
                <p className="text-xs text-[#645E6D]">
                  Manage workshops, CTF drills, and lab sessions on /activities.
                </p>
              </div>
              <button
                onClick={() => setActivityModalMode(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold">
                {actFormError}
              </div>
            )}

            <form onSubmit={handleSaveActivity} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Activity Title *</label>
                  <input
                    type="text"
                    required
                    value={actFormTitle}
                    onChange={(e) => setActFormTitle(e.target.value)}
                    placeholder="e.g. Memory Forensic Triage Lab"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Subtitle / Format</label>
                  <input
                    type="text"
                    value={actFormSubtitle}
                    onChange={(e) => setActFormSubtitle(e.target.value)}
                    placeholder="e.g. Hands-on CTF Scrimmage"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Category Type *</label>
                  <select
                    value={actFormType}
                    onChange={(e) => setActFormType(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    <option value="Technical">Technical</option>
                    <option value="Non-Technical">Non-Technical</option>
                    <option value="Community">Community</option>
                    <option value="Career">Career</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Frequency</label>
                  <select
                    value={actFormFrequency}
                    onChange={(e) => setActFormFrequency(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    <option value="Weekly">Weekly</option>
                    <option value="Bi-Weekly">Bi-Weekly</option>
                    <option value="Monthly">Monthly</option>
                    <option value="Per Semester">Per Semester</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Target Participants</label>
                  <input
                    type="text"
                    value={actFormParticipants}
                    onChange={(e) => setActFormParticipants(e.target.value)}
                    placeholder="All Members or Advanced Working Guild"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Detailed Description *</label>
                  <textarea
                    rows={3}
                    required
                    value={actFormDesc}
                    onChange={(e) => setActFormDesc(e.target.value)}
                    placeholder="Description of the activity, tools used, and deliverables..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8D8C3]">
                <button
                  type="button"
                  onClick={() => setActivityModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830]"
                >
                  {activityModalMode === 'add' ? 'Create Activity' : 'Save Changes'}
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
