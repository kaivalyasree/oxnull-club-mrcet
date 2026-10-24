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
import type { ClubApplication, TrackEnrollment, AwarenessArticle } from '@/lib/store';
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

import AdminSidebar, { AdminTab } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminDashboardOverview from '@/components/admin/AdminDashboardOverview';
import AdminEnrollmentManager from '@/components/admin/AdminEnrollmentManager';
import AdminStudentManager from '@/components/admin/AdminStudentManager';
import AdminTrackManager from '@/components/admin/AdminTrackManager';
import AdminAwarenessManager from '@/components/admin/AdminAwarenessManager';

export default function AdminPage() {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  // Server-Verified Administrator Session State
  const [adminSession, setAdminSession] = useState<{ username?: string; email?: string; role: 'admin' } | null>(null);
  const [isCheckingSession, setIsCheckingSession] = useState(true);

  // Username & Password Gateway State
  const [adminUsername, setAdminUsername] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);

  // High-Priority Enrollment & Student Data States
  const [enrollments, setEnrollments] = useState<TrackEnrollment[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [tracksList, setTracksList] = useState<any[]>([]);

  // Core CMS Data States
  const [applications, setApplications] = useState<ClubApplication[]>([]);
  const [resources, setResources] = useState<Resource[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [certifications, setCertifications] = useState<Certification[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [subjects, setSubjects] = useState<LearningSubject[]>(LEARNING_SUBJECTS);
  const [domainsList, setDomainsList] = useState<Domain[]>(DOMAINS);
  const [awarenessArticles, setAwarenessArticles] = useState<AwarenessArticle[]>([]);
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
      const [
        resApps,
        resR,
        resP,
        resC,
        resA,
        resAnn,
        resSubs,
        resDoms,
        resEnrs,
        resStuds,
        resTracks,
        resAwArticles
      ] = await Promise.all([
        fetch('/api/applications').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/resources?all=true').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/projects?all=true').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/certifications?all=true').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/activities').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/announcements').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/learning-subjects').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/domains').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/enrollments').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/admin/students').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/tracks').then((r) => r.json()).catch(() => ({ success: false, data: [] })),
        fetch('/api/awareness/articles?all=true').then((r) => r.json()).catch(() => ({ success: false, data: [] }))
      ]);

      if (resApps.success) setApplications(resApps.data);
      if (resR.success) setResources(resR.data);
      if (resP.success) setProjects(resP.data);
      if (resAwArticles?.success && Array.isArray(resAwArticles.data)) {
        setAwarenessArticles(resAwArticles.data);
      }
      if (resC.success) setCertifications(resC.data);
      if (resA.success) setActivities(resA.data);
      if (resAnn.success) setAnnouncements(resAnn.data);
      if (resSubs.success && Array.isArray(resSubs.data) && resSubs.data.length > 0) {
        setSubjects(resSubs.data);
      }
      if (resDoms.success && Array.isArray(resDoms.data) && resDoms.data.length > 0) {
        setDomainsList(resDoms.data);
      }
      if (resEnrs.success && Array.isArray(resEnrs.data)) {
        setEnrollments(resEnrs.data);
      }
      if (resStuds.success && Array.isArray(resStuds.data)) {
        setStudents(resStuds.data);
      }
      if (resTracks.success && Array.isArray(resTracks.data)) {
        setTracksList(resTracks.data);
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

  // High-Priority Enrollment Mutations
  const handleUpdateEnrollmentStatus = async (id: string, status: 'approved' | 'rejected') => {
    try {
      const res = await fetch('/api/enrollments', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Enrollment status updated to ${status}.`);
        setEnrollments((prev) =>
          prev.map((e) =>
            e.id === id
              ? {
                  ...e,
                  status,
                  reviewedBy: adminSession?.username || 'Executive Admin',
                  reviewedAt: new Date().toISOString()
                }
              : e
          )
        );
      } else {
        showToast(data.error || 'Failed to update enrollment status', 'error');
      }
    } catch {
      showToast('Network error updating enrollment status', 'error');
    }
  };

  // Track Mutations (with referential integrity support)
  const handleSaveTrack = async (trackData: any, mode: 'add' | 'edit'): Promise<boolean> => {
    try {
      const method = mode === 'add' ? 'POST' : 'PUT';
      const res = await fetch('/api/tracks', {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(trackData)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Track "${trackData.name}" saved successfully.`);
        loadAllData();
        return true;
      } else {
        showToast(data.error || 'Failed to save track', 'error');
        return false;
      }
    } catch {
      showToast('Network error saving track', 'error');
      return false;
    }
  };

  const handleDeleteTrack = async (trackId: string): Promise<boolean> => {
    try {
      const res = await fetch(`/api/tracks?id=${encodeURIComponent(trackId)}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast('Track deleted successfully.');
        loadAllData();
        return true;
      } else {
        showToast(data.error || 'Failed to delete track', 'error');
        return false;
      }
    } catch {
      showToast('Network error deleting track', 'error');
      return false;
    }
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
    setCertFormUrl(cert.url || '');
    setCertFormLevel(cert.level);
    setCertFormCost(cert.cost || 'Paid');
    setCertFormDesc(cert.description);
    setCertFormTags(Array.isArray(cert.tags) ? cert.tags.join(', ') : '');
    setCertFormIsPublished(cert.isPublished !== false);
    setCertFormError(null);
    setCertModalMode('edit');
  };

  const handleSaveCert = async (e: React.FormEvent) => {
    e.preventDefault();
    setCertFormError(null);

    if (!certFormName.trim() || !certFormProvider.trim()) {
      setCertFormError('Credential name and issuing provider are required.');
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
      url: certFormUrl.trim() || undefined,
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
          showToast(`Certification "${payload.name}" created successfully.`);
          setCertModalMode(null);
          loadAllData();
        } else {
          setCertFormError(data.error || 'Failed to create certification.');
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
          showToast(`Project "${payload.title}" created successfully.`);
          setProjModalMode(null);
          loadAllData();
        } else {
          setProjFormError(data.error || 'Failed to create project.');
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
        showToast(data.error || 'Failed to toggle project publication', 'error');
      }
    } catch {
      showToast('Network error updating status', 'error');
    }
  };

  // Learning Subject Operations
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

    const keyConceptsList = subFormKeyConcepts
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      slug: subjectEditModal.slug,
      title: subFormTitle.trim(),
      subtitle: subFormSubtitle.trim(),
      description: subFormDesc.trim(),
      keyConcepts: keyConceptsList,
      handsOnLab: subFormLab.trim()
    };

    try {
      const res = await fetch('/api/learning-subjects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Curriculum for "${payload.title}" updated.`);
        setSubjectEditModal(null);
        loadAllData();
      } else {
        setSubFormError(data.error || 'Failed to update learning subject.');
      }
    } catch {
      setSubFormError('Network communication error updating syllabus.');
    }
  };

  // Domain Metadata Operations
  const openEditDomainModal = (dom: Domain) => {
    setDomainEditModal(dom);
    setDomFormName(dom.name);
    setDomFormBadge(dom.badge);
    setDomFormTagline(dom.tagline);
    setDomFormOverview(dom.overview);
    setDomFormFocusAreas(Array.isArray(dom.focusAreas) ? dom.focusAreas.join(', ') : '');
    setDomFormError(null);
  };

  const handleSaveDomain = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!domainEditModal) return;
    setDomFormError(null);

    const focusAreasList = domFormFocusAreas
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    const payload = {
      slug: domainEditModal.slug,
      name: domFormName.trim(),
      badge: domFormBadge.trim(),
      tagline: domFormTagline.trim(),
      overview: domFormOverview.trim(),
      focusAreas: focusAreasList
    };

    try {
      const res = await fetch('/api/domains', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Domain "${payload.name}" metadata updated.`);
        setDomainEditModal(null);
        loadAllData();
      } else {
        setDomFormError(data.error || 'Failed to update domain.');
      }
    } catch {
      setDomFormError('Network error updating domain metadata.');
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

  const handleSaveActivity = async (e: React.FormEvent) => {
    e.preventDefault();
    setActFormError(null);

    if (!actFormTitle.trim() || !actFormDesc.trim()) {
      setActFormError('Activity title and description are required.');
      return;
    }

    const payload = {
      title: actFormTitle.trim(),
      subtitle: actFormSubtitle.trim(),
      type: actFormType,
      frequency: actFormFrequency,
      description: actFormDesc.trim(),
      participants: actFormParticipants.trim(),
      domainId: actFormDomain
    };

    try {
      const res = await fetch('/api/activities', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Activity "${payload.title}" created.`);
        setActivityModalMode(null);
        loadAllData();
      } else {
        setActFormError(data.error || 'Failed to create activity.');
      }
    } catch {
      setActFormError('Network error creating activity.');
    }
  };

  // Announcement Operations
  const handleCreateAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle.trim() || !newAnnContent.trim()) {
      showToast('Title and content are required for announcements.', 'error');
      return;
    }

    try {
      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: newAnnTitle.trim(),
          tag: newAnnTag,
          content: newAnnContent.trim()
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
        showToast(data.error || 'Failed to post announcement.', 'error');
      }
    } catch {
      showToast('Network error posting announcement.', 'error');
    }
  };

  // Application Status Review
  const handleUpdateAppStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    try {
      const res = await fetch('/api/applications', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, status })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Application status updated to ${status}.`);
        loadAllData();
      } else {
        showToast(data.error || 'Failed to update application.', 'error');
      }
    } catch {
      showToast('Network error updating application.', 'error');
    }
  };

  // Upload Asset
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadError(null);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`Asset "${file.name}" uploaded successfully.`);
        setUploadedFiles((prev) => [data.data, ...prev]);
        e.target.value = '';
      } else {
        setUploadError(data.error || 'Failed to upload asset.');
      }
    } catch {
      setUploadError('Network error uploading file.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleCopyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2500);
  };

  // Generic Delete Execution
  const handleExecuteDelete = async () => {
    if (!deleteConfirmation) return;
    const { type, id, title } = deleteConfirmation;

    let endpoint = '';
    if (type === 'resource') endpoint = `/api/resources?id=${id}`;
    if (type === 'certification') endpoint = `/api/certifications?id=${id}`;
    if (type === 'project') endpoint = `/api/projects?id=${id}`;
    if (type === 'announcement') endpoint = `/api/announcements?id=${id}`;
    if (type === 'activity') endpoint = `/api/activities?id=${id}`;

    try {
      const res = await fetch(endpoint, { method: 'DELETE' });
      const data = await res.json();
      if (res.ok && data.success) {
        showToast(`${type} "${title}" deleted.`);
        setDeleteConfirmation(null);
        loadAllData();
      } else {
        showToast(data.error || `Failed to delete ${type}`, 'error');
      }
    } catch {
      showToast(`Network error deleting ${type}`, 'error');
    }
  };

  // LOADING CHECK ON MOUNT
  if (isCheckingSession) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <div className="glass-card rounded-3xl p-8 max-w-sm w-full text-center space-y-4 border-[#D4AF37]/40">
          <div className="w-12 h-12 rounded-2xl bg-[#151417] text-[#FAF7F2] flex items-center justify-center mx-auto border border-[#D4AF37]">
            <RefreshCw className="w-6 h-6 animate-spin text-[#E5C378]" />
          </div>
          <h2 className="text-sm font-bold text-[#151417] uppercase tracking-wider">
            Verifying Admin Session...
          </h2>
        </div>
      </div>
    );
  }

  // LOGIN SCREEN IF UNAUTHENTICATED
  if (!adminSession) {
    return (
      <div className="min-h-screen py-16 px-4 sm:px-6 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-[#151417] text-[#FAF7F2] flex items-center justify-center font-bold text-2xl border border-[#D4AF37] mx-auto shadow-md">
              <Lock className="w-8 h-8 text-[#E5C378]" />
            </div>
            <h1 className="text-2xl font-black text-[#151417] tracking-tight">0XNULL Administration</h1>
            <p className="text-xs text-[#645E6D]">
              Authorized executive access. All actions are logged and audit-stamped.
            </p>
          </div>

          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/40 bg-white/90 shadow-xl space-y-6">
            {authError && (
              <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4 text-xs">
              <div className="space-y-1.5">
                <label className="font-bold text-[#151417] block">Administrator Username</label>
                <input
                  type="text"
                  required
                  value={adminUsername}
                  onChange={(e) => setAdminUsername(e.target.value)}
                  placeholder="e.g. Kaivalya sri"
                  autoComplete="username"
                  className="w-full px-3.5 py-2.5 rounded-xl border border-[#E8D8C3] bg-white text-xs text-[#151417] outline-none focus:border-[#C89D3C]"
                />
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
                    className="w-full pl-3.5 pr-10 py-2.5 rounded-xl border border-[#E8D8C3] bg-white text-xs text-[#151417] outline-none focus:border-[#C89D3C]"
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

  // MAIN REBUILT ADMIN INTERFACE
  return (
    <div className="min-h-screen flex bg-[#FAF7F2]">
      {/* Desktop Persistent Sidebar + Mobile Drawer */}
      <AdminSidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        mobileOpen={mobileSidebarOpen}
        setMobileOpen={setMobileSidebarOpen}
        adminUsername={adminSession.username || adminSession.email}
        pendingEnrollmentsCount={enrollments.filter((e) => e.status === 'pending').length}
        totalEnrollmentsCount={enrollments.length}
        pendingApplicationsCount={applications.filter((a) => a.status === 'pending').length}
        resourcesCount={resources.length}
        certificationsCount={certifications.length}
        projectsCount={projects.length}
        onLogout={handleAdminLogout}
      />

      {/* Main Content Pane */}
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader
          activeTab={activeTab}
          onOpenMobileSidebar={() => setMobileSidebarOpen(true)}
          onRefreshData={loadAllData}
          isLoading={isLoading}
          onLogout={handleAdminLogout}
          adminUsername={adminSession.username || adminSession.email}
        />

        <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-6">
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

          {/* SECTION 1: OVERVIEW METRICS DASHBOARD */}
          {activeTab === 'overview' && (
            <AdminDashboardOverview
              enrollments={enrollments}
              studentsCount={students.length || applications.length}
              domainsCount={domainsList.length}
              tracksCount={tracksList.length || 21}
              resourcesCount={resources.length}
              certificationsCount={certifications.length}
              projectsCount={projects.length}
              setActiveTab={setActiveTab}
              onOpenAddResource={() => openAddResourceModal()}
              onOpenAddCert={() => openAddCertModal()}
              onOpenAddProject={() => openAddProjectModal()}
            />
          )}

          {/* SECTION 2: TRACK ENROLLMENT MANAGEMENT (HIGHEST PRIORITY) */}
          {activeTab === 'enrollments' && (
            <AdminEnrollmentManager
              enrollments={enrollments}
              onUpdateStatus={handleUpdateEnrollmentStatus}
              isLoading={isLoading}
            />
          )}

          {/* SECTION 3: STUDENT DIRECTORY */}
          {activeTab === 'students' && (
            <AdminStudentManager
              students={students}
              isLoading={isLoading}
            />
          )}

          {/* SECTION 4: DOMAINS & CORE TRACKS MANAGEMENT */}
          {activeTab === 'domains-tracks' && (
            <AdminTrackManager
              domains={domainsList}
              tracks={tracksList.length > 0 ? tracksList : DOMAINS.flatMap((d) => d.tracks || [])}
              enrollments={enrollments}
              onSaveTrack={handleSaveTrack}
              onDeleteTrack={handleDeleteTrack}
              onEditDomain={(dom) => openEditDomainModal(dom)}
              showToast={showToast}
            />
          )}

          {/* SECTION: AWARENESS ARTICLES & SCAM CMS */}
          {activeTab === 'awareness' && (
            <AdminAwarenessManager
              articles={awarenessArticles}
              onRefresh={loadAllData}
              showToast={showToast}
            />
          )}

          {/* SECTION 5: LEARNING SUBJECTS CMS */}
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

          {/* SECTION 6: RESOURCES CMS */}
          {activeTab === 'resources' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#151417]">Learning Resources Library</h3>
                  <p className="text-xs text-[#645E6D] mt-0.5">
                    Curate articles, documentation, labs, and tools across domains and subjects.
                  </p>
                </div>
                <button
                  onClick={() => openAddResourceModal()}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#E5C378]" />
                  <span>Add Resource</span>
                </button>
              </div>

              {/* Resource Filter Bar */}
              <div className="glass-card rounded-2xl p-4 border-[#E8D8C3] flex flex-wrap items-center justify-between gap-3 text-xs">
                <div className="flex flex-wrap items-center gap-2">
                  <div className="relative">
                    <Search className="w-3.5 h-3.5 text-[#8A8592] absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      placeholder="Search title/tags..."
                      value={resSearchQuery}
                      onChange={(e) => setResSearchQuery(e.target.value)}
                      className="pl-8 pr-3 py-1.5 rounded-xl border border-[#E8D8C3] bg-white text-xs outline-none focus:border-[#C89D3C]"
                    />
                  </div>

                  <select
                    value={resStatusFilter}
                    onChange={(e) => setResStatusFilter(e.target.value as any)}
                    className="px-3 py-1.5 rounded-xl border border-[#E8D8C3] bg-white text-xs outline-none focus:border-[#C89D3C] cursor-pointer"
                  >
                    <option value="all">All Statuses</option>
                    <option value="published">Published</option>
                    <option value="draft">Drafts</option>
                  </select>

                  <select
                    value={resDomainFilter}
                    onChange={(e) => setResDomainFilter(e.target.value)}
                    className="px-3 py-1.5 rounded-xl border border-[#E8D8C3] bg-white text-xs outline-none focus:border-[#C89D3C] cursor-pointer"
                  >
                    <option value="all">All Domains</option>
                    {domainsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <span className="text-[11px] text-[#8A8592] font-mono">
                  {resources.length} Total Resources
                </span>
              </div>

              {/* Resources Table */}
              <div className="glass-card rounded-3xl p-6 border-[#E8D8C3] overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead>
                      <tr className="border-b border-[#E8D8C3] text-[10px] uppercase font-bold text-[#8A8592]">
                        <th className="pb-3 pr-3 font-mono">Title / Description</th>
                        <th className="pb-3 pr-3">Domain / Subject</th>
                        <th className="pb-3 pr-3">Category</th>
                        <th className="pb-3 pr-3">Status</th>
                        <th className="pb-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#E8D8C3]/50">
                      {resources
                        .filter((r) => {
                          if (resStatusFilter === 'published' && r.isPublished === false) return false;
                          if (resStatusFilter === 'draft' && r.isPublished !== false) return false;
                          if (resDomainFilter !== 'all' && r.domainId !== resDomainFilter) return false;
                          if (
                            resSearchQuery &&
                            !r.title.toLowerCase().includes(resSearchQuery.toLowerCase()) &&
                            !r.description.toLowerCase().includes(resSearchQuery.toLowerCase())
                          )
                            return false;
                          return true;
                        })
                        .map((res) => (
                          <tr key={res.id} className="hover:bg-[#FAF7F2]/60 transition-colors">
                            <td className="py-3 pr-3 max-w-sm">
                              <div className="font-bold text-[#151417] leading-snug">{res.title}</div>
                              <p className="text-[11px] text-[#645E6D] line-clamp-1 mt-0.5">{res.description}</p>
                            </td>

                            <td className="py-3 pr-3 whitespace-nowrap">
                              <div className="text-[#151417] font-semibold">{res.domainName || 'General'}</div>
                              {res.subjectName && (
                                <div className="text-[10px] text-[#8C6B1B]">Subject: {res.subjectName}</div>
                              )}
                            </td>

                            <td className="py-3 pr-3">
                              <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                                {res.category}
                              </span>
                            </td>

                            <td className="py-3 pr-3">
                              <button
                                onClick={() =>
                                  handleTogglePublishResource(res.id, res.isPublished !== false, res.title)
                                }
                                className={`px-2 py-0.5 rounded-full text-[10px] font-bold uppercase transition-colors cursor-pointer ${
                                  res.isPublished !== false
                                    ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                                    : 'bg-amber-50 text-amber-800 border border-amber-200'
                                }`}
                              >
                                {res.isPublished !== false ? 'Published' : 'Draft'}
                              </button>
                            </td>

                            <td className="py-3 text-right whitespace-nowrap">
                              <div className="inline-flex items-center gap-1.5">
                                <button
                                  onClick={() => openEditResourceModal(res)}
                                  className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white text-[#151417] hover:bg-[#FAF7F2]"
                                  title="Edit resource"
                                >
                                  <Edit3 className="w-3.5 h-3.5 text-[#C89D3C]" />
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
                                  className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                                  title="Delete resource"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 7: CERTIFICATIONS CMS */}
          {activeTab === 'certifications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#151417]">Certification Roadmap</h3>
                  <p className="text-xs text-[#645E6D] mt-0.5">
                    Credentials, vendor accreditations, and exam tracks.
                  </p>
                </div>
                <button
                  onClick={() => openAddCertModal()}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#E5C378]" />
                  <span>Add Certification</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {certifications.map((c) => (
                  <div
                    key={c.id}
                    className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#967223]">
                          {c.provider}
                        </span>
                        <button
                          onClick={() => handleTogglePublishCert(c.id, c.isPublished !== false, c.name)}
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            c.isPublished !== false
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {c.isPublished !== false ? 'Published' : 'Draft'}
                        </button>
                      </div>
                      <h4 className="font-bold text-sm text-[#151417] leading-snug">{c.name}</h4>
                      <p className="text-xs text-[#55505C] line-clamp-2 mt-1">{c.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs">
                      <span className="text-[#8C6B1B] font-semibold">{c.level}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditCertModal(c)}
                          className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white hover:bg-[#FAF7F2]"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#C89D3C]" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              isOpen: true,
                              type: 'certification',
                              id: c.id,
                              title: c.name
                            })
                          }
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 8: PROJECTS CMS */}
          {activeTab === 'projects' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#151417]">Student & Club Projects</h3>
                  <p className="text-xs text-[#645E6D] mt-0.5">
                    Showcase open-source tools, CTF challenge writeups, and security automation repositories.
                  </p>
                </div>
                <button
                  onClick={() => openAddProjectModal()}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#E5C378]" />
                  <span>Add Project</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((p) => (
                  <div
                    key={p.id}
                    className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex flex-col justify-between space-y-3"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[10px] font-mono font-bold uppercase text-[#967223]">
                          {p.domainName || 'General Track'}
                        </span>
                        <button
                          onClick={() => handleTogglePublishProject(p.id, p.isPublished !== false, p.title)}
                          className={`text-[9px] font-bold uppercase px-2 py-0.5 rounded-full ${
                            p.isPublished !== false
                              ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border border-amber-200'
                          }`}
                        >
                          {p.isPublished !== false ? 'Published' : 'Draft'}
                        </button>
                      </div>
                      <h4 className="font-bold text-sm text-[#151417] leading-snug">{p.title}</h4>
                      <p className="text-xs text-[#55505C] line-clamp-2 mt-1">{p.description}</p>
                    </div>

                    <div className="pt-3 border-t border-[#E8D8C3]/50 flex items-center justify-between text-xs">
                      <span className="text-[#8C6B1B] font-semibold">{p.status}</span>
                      <div className="flex items-center gap-1.5">
                        <button
                          onClick={() => openEditProjectModal(p)}
                          className="p-1.5 rounded-lg border border-[#E8D8C3] bg-white hover:bg-[#FAF7F2]"
                        >
                          <Edit3 className="w-3.5 h-3.5 text-[#C89D3C]" />
                        </button>
                        <button
                          onClick={() =>
                            setDeleteConfirmation({
                              isOpen: true,
                              type: 'project',
                              id: p.id,
                              title: p.title
                            })
                          }
                          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 9: ACTIVITIES CMS */}
          {activeTab === 'activities' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#151417]">Club Activities & Formats</h3>
                  <p className="text-xs text-[#645E6D] mt-0.5">
                    Schedule weekly CTF scrimmages, threat intelligence debriefs, and workshops.
                  </p>
                </div>
                <button
                  onClick={openAddActivityModal}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#E5C378]" />
                  <span>Create Activity</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activities.map((a) => (
                  <div
                    key={a.id}
                    className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-[#967223]">{a.number}</span>
                        <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-[#FAF7F2] text-[#8C6B1B] border border-[#E8D8C3]">
                          {a.type}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#151417] mt-1">{a.title}</h4>
                      <p className="text-xs text-[#55505C] mt-1">{a.summary}</p>
                      <span className="text-[10px] text-[#8A8592] mt-2 block">Cadence: {a.cadence}</span>
                    </div>

                    <button
                      onClick={() =>
                        setDeleteConfirmation({
                          isOpen: true,
                          type: 'activity',
                          id: a.id,
                          title: a.title
                        })
                      }
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 10: ANNOUNCEMENTS CMS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#151417]">Executive Announcements</h3>
                  <p className="text-xs text-[#645E6D] mt-0.5">
                    Broadcast directives and notices to club members.
                  </p>
                </div>
                <button
                  onClick={() => setShowAddAnn(!showAddAnn)}
                  className="px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors flex items-center gap-2 cursor-pointer shadow-xs shrink-0"
                >
                  <Plus className="w-4 h-4 text-[#E5C378]" />
                  <span>{showAddAnn ? 'Cancel' : 'New Announcement'}</span>
                </button>
              </div>

              {showAddAnn && (
                <form
                  onSubmit={handleCreateAnnouncement}
                  className="glass-card rounded-3xl p-6 border-[#D4AF37] bg-white space-y-4"
                >
                  <h4 className="font-bold text-sm text-[#151417]">Post Executive Directive</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="sm:col-span-2">
                      <label className="text-[10px] font-bold text-[#8C6B1B] uppercase block mb-1">
                        Headline / Title *
                      </label>
                      <input
                        type="text"
                        required
                        value={newAnnTitle}
                        onChange={(e) => setNewAnnTitle(e.target.value)}
                        placeholder="e.g. Lab Schedule: Friday CTF Scrimmage"
                        className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-xs outline-none focus:border-[#C89D3C]"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-bold text-[#8C6B1B] uppercase block mb-1">
                        Category Tag
                      </label>
                      <select
                        value={newAnnTag}
                        onChange={(e) => setNewAnnTag(e.target.value)}
                        className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-xs outline-none focus:border-[#C89D3C]"
                      >
                        <option value="Official">Official</option>
                        <option value="Event">Event</option>
                        <option value="Urgent">Urgent</option>
                        <option value="Competition">Competition</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="text-[10px] font-bold text-[#8C6B1B] uppercase block mb-1">
                      Announcement Content *
                    </label>
                    <textarea
                      rows={3}
                      required
                      value={newAnnContent}
                      onChange={(e) => setNewAnnContent(e.target.value)}
                      placeholder="Enter directive details, dates, and instructions for club members..."
                      className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2] text-xs outline-none focus:border-[#C89D3C]"
                    />
                  </div>

                  <div className="flex justify-end gap-2">
                    <button
                      type="submit"
                      className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830]"
                    >
                      Broadcast Announcement
                    </button>
                  </div>
                </form>
              )}

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className="glass-card rounded-2xl p-5 border-[#E8D8C3] flex items-start justify-between gap-4"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-50 text-amber-800 border border-amber-200">
                          {ann.tag}
                        </span>
                        <span className="text-[10px] text-[#8A8592]">
                          {new Date(ann.date).toLocaleDateString()}
                        </span>
                      </div>
                      <h4 className="font-bold text-sm text-[#151417] mt-1">{ann.title}</h4>
                      <p className="text-xs text-[#55505C] mt-1">{ann.content}</p>
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
                      className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 shrink-0"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* SECTION 11: CLUB MEMBERSHIP APPLICATIONS */}
          {activeTab === 'applications' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#151417]">Student Membership Registrations</h3>
                  <p className="text-xs text-[#645E6D] mt-0.5">
                    Official club candidate submissions, academic roll numbers, and domain preferences.
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
                                  className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full border ${
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

          {/* SECTION 12: STORAGE & UPLOADS */}
          {activeTab === 'uploads' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h3 className="text-xl font-bold text-[#151417]">Storage & Asset Repository</h3>
                  <p className="text-xs text-[#645E6D] mt-0.5">
                    Direct uploads for network diagrams, lab cheatsheets, and architectural blueprints.
                  </p>
                </div>
              </div>

              <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37]/50 bg-white space-y-4">
                <div className="border-2 border-dashed border-[#D4AF37]/60 rounded-2xl p-8 text-center space-y-3 bg-[#FAF7F2]/60 hover:bg-[#FAF7F2] transition-colors">
                  <Upload className="w-10 h-10 mx-auto text-[#C89D3C]" />
                  <div>
                    <h4 className="text-sm font-bold text-[#151417]">Upload Multimedia Asset or Document</h4>
                    <p className="text-xs text-[#645E6D] mt-0.5">
                      Accepted: PNG, JPEG, WEBP, SVG, PDF (Max 10MB)
                    </p>
                  </div>
                  <label className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider bg-[#151417] text-[#FAF7F2] hover:bg-[#2A2830] transition-colors cursor-pointer shadow-xs">
                    <span>{isUploading ? 'Uploading to Server...' : 'Select File from Device'}</span>
                    <input
                      type="file"
                      disabled={isUploading}
                      onChange={handleFileUpload}
                      className="hidden"
                      accept="image/*,application/pdf"
                    />
                  </label>
                </div>

                {uploadError && (
                  <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                )}
              </div>

              {uploadedFiles.length > 0 && (
                <div className="glass-card rounded-3xl p-6 border-[#E8D8C3] space-y-3">
                  <h4 className="font-bold text-sm text-[#151417]">Uploaded Assets This Session</h4>
                  <div className="space-y-2">
                    {uploadedFiles.map((file, i) => (
                      <div
                        key={i}
                        className="p-3 rounded-xl bg-[#FAF7F2] border border-[#E8D8C3] flex items-center justify-between gap-3 text-xs"
                      >
                        <div className="truncate">
                          <span className="font-bold text-[#151417] block truncate">{file.originalName}</span>
                          <span className="font-mono text-[10px] text-[#8A8592] block truncate">{file.url}</span>
                        </div>
                        <button
                          onClick={() => handleCopyUrl(file.url)}
                          className="px-3 py-1 rounded-lg text-[11px] font-bold bg-[#151417] text-white hover:bg-[#2A2830] shrink-0"
                        >
                          {copiedUrl === file.url ? '✓ Copied' : 'Copy URL'}
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </main>
      </div>

      {/* RESOURCE ADD / EDIT MODAL */}
      {resourceModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl animate-in zoom-in-95 duration-200">
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
                    placeholder="e.g. Memory Analysis with Volatility Framework"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Domain Assignment</label>
                  <select
                    value={resFormDomain}
                    onChange={(e) => setResFormDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    {domainsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Learning Subject (Optional)</label>
                  <select
                    value={resFormSubject}
                    onChange={(e) => setResFormSubject(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    <option value="">None (Domain only)</option>
                    {subjects.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.title}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Category</label>
                  <select
                    value={resFormCategory}
                    onChange={(e) => setResFormCategory(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    <option value="Documentation">Documentation</option>
                    <option value="Cheat Sheet">Cheat Sheet</option>
                    <option value="Tool">Tool</option>
                    <option value="Walkthrough">Walkthrough</option>
                    <option value="Paper">Research Paper</option>
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Difficulty</label>
                  <select
                    value={resFormDifficulty}
                    onChange={(e) => setResFormDifficulty(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">URL / Link *</label>
                  <input
                    type="url"
                    required
                    value={resFormUrl}
                    onChange={(e) => setResFormUrl(e.target.value)}
                    placeholder="https://example.com/guide or /uploads/..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={resFormDesc}
                    onChange={(e) => setResFormDesc(e.target.value)}
                    placeholder="Brief description of this resource..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Tags (Comma Separated)</label>
                  <input
                    type="text"
                    value={resFormTags}
                    onChange={(e) => setResFormTags(e.target.value)}
                    placeholder="Forensics, RAM, Incident Response"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="resFormIsPublished"
                  checked={resFormIsPublished}
                  onChange={(e) => setResFormIsPublished(e.target.checked)}
                  className="rounded border-[#E8D8C3] text-[#C89D3C]"
                />
                <label htmlFor="resFormIsPublished" className="text-xs font-semibold cursor-pointer">
                  Publish immediately (if unchecked, resource is saved as draft)
                </label>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8D8C3]">
                <button
                  type="button"
                  onClick={() => setResourceModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830]"
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
                  {certModalMode === 'add' ? 'Add New Certification' : 'Edit Certification Record'}
                </h3>
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

            <form onSubmit={handleSaveCert} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Certification Name *</label>
                  <input
                    type="text"
                    required
                    value={certFormName}
                    onChange={(e) => setCertFormName(e.target.value)}
                    placeholder="e.g. Certified Information Systems Security Professional"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Provider / Vendor *</label>
                  <input
                    type="text"
                    required
                    value={certFormProvider}
                    onChange={(e) => setCertFormProvider(e.target.value)}
                    placeholder="e.g. (ISC)², CompTIA, Offensive Security"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Domain</label>
                  <select
                    value={certFormDomain}
                    onChange={(e) => setCertFormDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    {domainsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Level</label>
                  <select
                    value={certFormLevel}
                    onChange={(e) => setCertFormLevel(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={certFormDesc}
                    onChange={(e) => setCertFormDesc(e.target.value)}
                    placeholder="Overview of credential requirements..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8D8C3]">
                <button
                  type="button"
                  onClick={() => setCertModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830]"
                >
                  {certModalMode === 'add' ? 'Create Credential' : 'Save Changes'}
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
                    placeholder="e.g. Memory Forensics Parser CLI"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Domain</label>
                  <select
                    value={projFormDomain}
                    onChange={(e) => setProjFormDomain(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    {domainsList.map((d) => (
                      <option key={d.id} value={d.id}>
                        {d.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Status</label>
                  <select
                    value={projFormStatus}
                    onChange={(e) => setProjFormStatus(e.target.value as any)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  >
                    <option value="Active">Active</option>
                    <option value="Completed">Completed</option>
                    <option value="In Progress">In Progress</option>
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">GitHub Repository URL</label>
                  <input
                    type="url"
                    value={projFormGithub}
                    onChange={(e) => setProjFormGithub(e.target.value)}
                    placeholder="https://github.com/..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Description *</label>
                  <textarea
                    rows={2}
                    required
                    value={projFormDesc}
                    onChange={(e) => setProjFormDesc(e.target.value)}
                    placeholder="Overview of the repository and tooling..."
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-4 border-t border-[#E8D8C3]">
                <button
                  type="button"
                  onClick={() => setProjModalMode(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold bg-[#FAF7F2] text-[#645E6D]"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-xs font-bold uppercase tracking-wider bg-[#151417] text-white hover:bg-[#2A2830]"
                >
                  {projModalMode === 'add' ? 'Create Project' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* LEARNING SUBJECT EDIT MODAL */}
      {subjectEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8D8C3] pb-4">
              <div>
                <h3 className="text-xl font-black text-[#151417]">
                  Edit Learning Subject: {subjectEditModal.title}
                </h3>
              </div>
              <button
                onClick={() => setSubjectEditModal(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {subFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{subFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveSubject} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">Subtitle</label>
                <input
                  type="text"
                  required
                  value={subFormSubtitle}
                  onChange={(e) => setSubFormSubtitle(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">Description</label>
                <textarea
                  rows={2}
                  required
                  value={subFormDesc}
                  onChange={(e) => setSubFormDesc(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">Key Concepts (One per line)</label>
                <textarea
                  rows={4}
                  required
                  value={subFormKeyConcepts}
                  onChange={(e) => setSubFormKeyConcepts(e.target.value)}
                  className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                />
              </div>

              <div>
                <label className="font-bold text-[#8C6B1B] block mb-1">Hands-on Lab Exercise</label>
                <textarea
                  rows={2}
                  required
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

      {/* DOMAIN METADATA EDIT MODAL */}
      {domainEditModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8D8C3] pb-4">
              <div>
                <h3 className="text-xl font-black text-[#151417]">
                  Edit Domain: {domainEditModal.name}
                </h3>
              </div>
              <button
                onClick={() => setDomainEditModal(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {domFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{domFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveDomain} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Domain Name</label>
                  <input
                    type="text"
                    required
                    value={domFormName}
                    onChange={(e) => setDomFormName(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Badge Subtitle</label>
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
                  <input
                    type="text"
                    required
                    value={domFormTagline}
                    onChange={(e) => setDomFormTagline(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Overview Description</label>
                  <textarea
                    rows={3}
                    required
                    value={domFormOverview}
                    onChange={(e) => setDomFormOverview(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="font-bold text-[#8C6B1B] block mb-1">Focus Areas (Comma separated)</label>
                  <input
                    type="text"
                    value={domFormFocusAreas}
                    onChange={(e) => setDomFormFocusAreas(e.target.value)}
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
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

      {/* ACTIVITY ADD MODAL */}
      {activityModalMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs overflow-y-auto">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-[#D4AF37] max-w-2xl w-full bg-white space-y-6 my-8 shadow-2xl">
            <div className="flex items-center justify-between border-b border-[#E8D8C3] pb-4">
              <div>
                <h3 className="text-xl font-black text-[#151417]">Create Club Activity</h3>
              </div>
              <button
                onClick={() => setActivityModalMode(null)}
                className="p-1.5 rounded-lg text-[#8A8592] hover:text-[#151417] hover:bg-[#FAF7F2]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {actFormError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs font-semibold flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{actFormError}</span>
              </div>
            )}

            <form onSubmit={handleSaveActivity} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Activity Title *</label>
                  <input
                    type="text"
                    required
                    value={actFormTitle}
                    onChange={(e) => setActFormTitle(e.target.value)}
                    placeholder="e.g. Memory Forensics Lab"
                    className="w-full p-2.5 rounded-xl border border-[#E8D8C3] bg-[#FAF7F2]"
                  />
                </div>

                <div>
                  <label className="font-bold text-[#8C6B1B] block mb-1">Cadence / Frequency</label>
                  <input
                    type="text"
                    required
                    value={actFormFrequency}
                    onChange={(e) => setActFormFrequency(e.target.value)}
                    placeholder="e.g. Weekly on Fridays"
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
                  Create Activity
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION MODAL */}
      {deleteConfirmation && deleteConfirmation.isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="glass-card rounded-3xl p-6 sm:p-8 border-rose-300 max-w-md w-full bg-white space-y-5 shadow-2xl animate-in zoom-in-95 duration-200">
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
