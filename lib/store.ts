import fs from 'fs';
import path from 'path';
import {
  DOMAINS,
  LEARNING_SUBJECTS,
  Domain,
  DomainTrack,
  getAllTracks,
  LearningSubject,
  Resource,
  Certification,
  Project,
  Activity,
  Announcement
} from './data';

export interface ExploreTaskProgress {
  status: 'not_started' | 'in_progress' | 'completed';
  submission?: string;
  updatedAt?: string;
}

export interface UserProgressData {
  userId: string;
  enrolledDomains: string[];
  savedResourceIds: string[];
  completedResourceIds: string[];
  trackedCertificationIds: string[];
  activeProjectIds: string[];
  rsvpdActivityIds: string[];
  completedFoundationIds: string[];
  completedExploreTaskIds?: string[];
  exploreTaskSubmissions?: Record<string, ExploreTaskProgress>;
  notes: string;
}

export interface ClubApplication {
  id: string;
  userId: string;
  fullName: string;
  year: string;
  rollNumber: string;
  branch: string;
  phoneNumber: string;
  domainInterests: string[];
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
}

export interface TrackEnrollment {
  id: string;
  userId: string;
  studentName: string;
  fullName?: string;
  studentEmail: string;
  email?: string;
  rollNumber: string;
  academicYear: string;
  year?: string;
  branch: string;
  phoneNumber: string;
  domainId: string;
  domainName: string;
  trackId: string;
  trackName: string;
  trackTitle?: string;
  status: 'pending' | 'approved' | 'rejected';
  statement?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StoreSchema {
  domains: Domain[];
  customTracks?: DomainTrack[];
  learningSubjects: LearningSubject[];
  resources: Resource[];
  certifications: Certification[];
  projects: Project[];
  activities: Activity[];
  announcements: Announcement[];
  applications: ClubApplication[];
  trackEnrollments: TrackEnrollment[];
  userProgress: Record<string, UserProgressData>;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const DB_FILE = path.join(DATA_DIR, 'db.json');

function ensureDataFile(): StoreSchema {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }

  if (!fs.existsSync(DB_FILE)) {
    const initialData: StoreSchema = {
      domains: DOMAINS,
      customTracks: [],
      learningSubjects: LEARNING_SUBJECTS,
      resources: [],
      certifications: [],
      projects: [],
      activities: [],
      announcements: [],
      applications: [],
      trackEnrollments: [],
      userProgress: {}
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(fileContent) as StoreSchema;
    if (!parsed.applications) parsed.applications = [];
    if (!parsed.trackEnrollments) parsed.trackEnrollments = [];
    if (!parsed.customTracks) parsed.customTracks = [];
    if (!parsed.domains || parsed.domains.length === 0) parsed.domains = DOMAINS;
    if (!parsed.learningSubjects || parsed.learningSubjects.length === 0) parsed.learningSubjects = LEARNING_SUBJECTS;
    if (!parsed.resources) parsed.resources = [];
    if (!parsed.certifications) parsed.certifications = [];
    if (!parsed.projects) parsed.projects = [];
    if (!parsed.activities) parsed.activities = [];
    if (!parsed.announcements) parsed.announcements = [];
    if (!parsed.userProgress) parsed.userProgress = {};
    return parsed;
  } catch (error) {
    console.error('Error reading db.json, returning empty defaults', error);
    return {
      domains: DOMAINS,
      customTracks: [],
      learningSubjects: LEARNING_SUBJECTS,
      resources: [],
      certifications: [],
      projects: [],
      activities: [],
      announcements: [],
      applications: [],
      trackEnrollments: [],
      userProgress: {}
    };
  }
}

function writeDataFile(data: StoreSchema): void {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing to db.json', error);
  }
}

export const db = {
  getStore(): StoreSchema {
    return ensureDataFile();
  },

  // Domains (Required structural foundational configuration)
  getDomains(): Domain[] {
    const store = ensureDataFile();
    const list = store.domains && store.domains.length > 0 ? store.domains : DOMAINS;
    const custom = store.customTracks || [];
    return list.map((storedItem) => {
      const base = DOMAINS.find((d) => d.slug === storedItem.slug || d.id === storedItem.id);
      const merged = base ? { ...base, ...storedItem } : storedItem;
      const domainCustom = custom.filter((t) => t.domainId === merged.id || t.domainSlug === merged.slug);
      const combinedTracks = [...(merged.tracks || []), ...domainCustom];
      return { ...merged, tracks: combinedTracks };
    });
  },
  getDomainBySlug(slug: string): Domain | undefined {
    const store = ensureDataFile();
    const list = store.domains && store.domains.length > 0 ? store.domains : DOMAINS;
    const found = list.find((d) => d.slug === slug || d.id === slug);
    if (!found) return undefined;
    const base = DOMAINS.find((d) => d.slug === slug || d.id === slug);
    const merged = base ? { ...base, ...found } : found;
    const custom = (store.customTracks || []).filter((t) => t.domainId === merged.id || t.domainSlug === merged.slug);
    const combinedTracks = [...(merged.tracks || []), ...custom];
    return { ...merged, tracks: combinedTracks };
  },
  updateDomain(slug: string, updated: Partial<Domain>): Domain | null {
    const store = ensureDataFile();
    const index = store.domains.findIndex((d) => d.slug === slug || d.id === slug);
    if (index === -1) return null;
    store.domains[index] = { ...store.domains[index], ...updated };
    writeDataFile(store);
    return store.domains[index];
  },

  // Learning Subjects
  getLearningSubjects(): LearningSubject[] {
    const store = ensureDataFile();
    return store.learningSubjects && store.learningSubjects.length > 0
      ? store.learningSubjects
      : LEARNING_SUBJECTS;
  },
  getLearningSubjectBySlug(slug: string): LearningSubject | undefined {
    const store = ensureDataFile();
    const list = store.learningSubjects && store.learningSubjects.length > 0
      ? store.learningSubjects
      : LEARNING_SUBJECTS;
    return list.find((s) => s.slug === slug || s.id === slug);
  },
  updateLearningSubject(slug: string, updated: Partial<LearningSubject>): LearningSubject | null {
    const store = ensureDataFile();
    const index = store.learningSubjects.findIndex((s) => s.slug === slug || s.id === slug);
    if (index === -1) return null;
    store.learningSubjects[index] = { ...store.learningSubjects[index], ...updated };
    writeDataFile(store);
    return store.learningSubjects[index];
  },

  // Resources
  getResources(options?: { publishedOnly?: boolean; domainId?: string; subjectId?: string }): Resource[] {
    let list = ensureDataFile().resources;
    if (options?.publishedOnly) {
      list = list.filter((r) => r.isPublished !== false);
    }
    if (options?.domainId) {
      list = list.filter((r) => r.domainId === options.domainId);
    }
    if (options?.subjectId) {
      list = list.filter((r) => r.subjectId === options.subjectId);
    }
    return list;
  },
  addResource(item: Omit<Resource, 'id'>): Resource {
    const store = ensureDataFile();
    const newResource: Resource = {
      ...item,
      id: `r-${Date.now()}`,
      isPublished: item.isPublished !== false
    };
    store.resources.unshift(newResource);
    writeDataFile(store);
    return newResource;
  },
  updateResource(id: string, updated: Partial<Resource>): Resource | null {
    const store = ensureDataFile();
    const index = store.resources.findIndex((r) => r.id === id);
    if (index === -1) return null;
    store.resources[index] = { ...store.resources[index], ...updated };
    writeDataFile(store);
    return store.resources[index];
  },
  togglePublishResource(id: string): Resource | null {
    const store = ensureDataFile();
    const index = store.resources.findIndex((r) => r.id === id);
    if (index === -1) return null;
    const current = store.resources[index].isPublished !== false;
    store.resources[index].isPublished = !current;
    writeDataFile(store);
    return store.resources[index];
  },
  deleteResource(id: string): boolean {
    const store = ensureDataFile();
    const initialLen = store.resources.length;
    store.resources = store.resources.filter((r) => r.id !== id);
    if (store.resources.length !== initialLen) {
      writeDataFile(store);
      return true;
    }
    return false;
  },

  // Certifications
  getCertifications(options?: { publishedOnly?: boolean; domainId?: string }): Certification[] {
    let list = ensureDataFile().certifications;
    if (options?.publishedOnly) {
      list = list.filter((c) => c.isPublished !== false);
    }
    if (options?.domainId) {
      list = list.filter((c) => c.domainId === options.domainId);
    }
    return list;
  },
  addCertification(item: Omit<Certification, 'id'>): Certification {
    const store = ensureDataFile();
    const newCert: Certification = {
      ...item,
      id: `c-${Date.now()}`,
      isPublished: item.isPublished !== false
    };
    store.certifications.unshift(newCert);
    writeDataFile(store);
    return newCert;
  },
  updateCertification(id: string, updated: Partial<Certification>): Certification | null {
    const store = ensureDataFile();
    const index = store.certifications.findIndex((c) => c.id === id);
    if (index === -1) return null;
    store.certifications[index] = { ...store.certifications[index], ...updated };
    writeDataFile(store);
    return store.certifications[index];
  },
  togglePublishCertification(id: string): Certification | null {
    const store = ensureDataFile();
    const index = store.certifications.findIndex((c) => c.id === id);
    if (index === -1) return null;
    const current = store.certifications[index].isPublished !== false;
    store.certifications[index].isPublished = !current;
    writeDataFile(store);
    return store.certifications[index];
  },
  deleteCertification(id: string): boolean {
    const store = ensureDataFile();
    const initialLen = store.certifications.length;
    store.certifications = store.certifications.filter((c) => c.id !== id);
    if (store.certifications.length !== initialLen) {
      writeDataFile(store);
      return true;
    }
    return false;
  },

  // Projects
  getProjects(options?: { publishedOnly?: boolean; domainId?: string }): Project[] {
    let list = ensureDataFile().projects;
    if (options?.publishedOnly) {
      list = list.filter((p) => p.isPublished !== false);
    }
    if (options?.domainId) {
      list = list.filter((p) => p.domainId === options.domainId);
    }
    return list;
  },
  addProject(item: Omit<Project, 'id'>): Project {
    const store = ensureDataFile();
    const newProj: Project = {
      ...item,
      id: `p-${Date.now()}`,
      isPublished: item.isPublished !== false
    };
    store.projects.unshift(newProj);
    writeDataFile(store);
    return newProj;
  },
  updateProject(id: string, updated: Partial<Project>): Project | null {
    const store = ensureDataFile();
    const index = store.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    store.projects[index] = { ...store.projects[index], ...updated };
    writeDataFile(store);
    return store.projects[index];
  },
  togglePublishProject(id: string): Project | null {
    const store = ensureDataFile();
    const index = store.projects.findIndex((p) => p.id === id);
    if (index === -1) return null;
    const current = store.projects[index].isPublished !== false;
    store.projects[index].isPublished = !current;
    writeDataFile(store);
    return store.projects[index];
  },
  deleteProject(id: string): boolean {
    const store = ensureDataFile();
    const initialLen = store.projects.length;
    store.projects = store.projects.filter((p) => p.id !== id);
    if (store.projects.length !== initialLen) {
      writeDataFile(store);
      return true;
    }
    return false;
  },

  // Activities
  getActivities(): Activity[] {
    return ensureDataFile().activities;
  },
  addActivity(item: Omit<Activity, 'id'>): Activity {
    const store = ensureDataFile();
    const newAct: Activity = {
      ...item,
      id: `act-${Date.now()}`
    };
    store.activities.unshift(newAct);
    writeDataFile(store);
    return newAct;
  },
  updateActivity(id: string, updated: Partial<Activity>): Activity | null {
    const store = ensureDataFile();
    const index = store.activities.findIndex((a) => a.id === id);
    if (index === -1) return null;
    store.activities[index] = { ...store.activities[index], ...updated };
    writeDataFile(store);
    return store.activities[index];
  },
  deleteActivity(id: string): boolean {
    const store = ensureDataFile();
    const initialLen = store.activities.length;
    store.activities = store.activities.filter((a) => a.id !== id);
    if (store.activities.length !== initialLen) {
      writeDataFile(store);
      return true;
    }
    return false;
  },

  // Announcements
  getAnnouncements(): Announcement[] {
    return ensureDataFile().announcements;
  },
  addAnnouncement(item: Omit<Announcement, 'id'>): Announcement {
    const store = ensureDataFile();
    const newAnn: Announcement = {
      ...item,
      id: `ann-${Date.now()}`
    };
    store.announcements.unshift(newAnn);
    writeDataFile(store);
    return newAnn;
  },
  deleteAnnouncement(id: string): boolean {
    const store = ensureDataFile();
    const initialLen = store.announcements.length;
    store.announcements = store.announcements.filter((a) => a.id !== id);
    if (store.announcements.length !== initialLen) {
      writeDataFile(store);
      return true;
    }
    return false;
  },

  // Club Applications
  getApplications(): ClubApplication[] {
    return ensureDataFile().applications || [];
  },
  getApplicationsByUserId(userId: string): ClubApplication[] {
    return (ensureDataFile().applications || []).filter((app) => app.userId === userId);
  },
  getApplicationById(id: string): ClubApplication | undefined {
    return (ensureDataFile().applications || []).find((app) => app.id === id);
  },
  createApplication(data: Omit<ClubApplication, 'id' | 'status' | 'createdAt' | 'updatedAt'>): ClubApplication {
    const store = ensureDataFile();
    if (!store.applications) store.applications = [];

    const now = new Date().toISOString();
    const newApp: ClubApplication = {
      ...data,
      id: `app-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };

    store.applications.unshift(newApp);
    writeDataFile(store);
    return newApp;
  },
  updateApplicationStatus(id: string, status: ClubApplication['status']): ClubApplication | null {
    const store = ensureDataFile();
    if (!store.applications) return null;
    const index = store.applications.findIndex((app) => app.id === id);
    if (index === -1) return null;

    store.applications[index].status = status;
    store.applications[index].updatedAt = new Date().toISOString();
    writeDataFile(store);
    return store.applications[index];
  },

  // User Progress
  getUserProgress(userId: string): UserProgressData {
    const store = ensureDataFile();
    if (!store.userProgress[userId]) {
      store.userProgress[userId] = {
        userId,
        enrolledDomains: [],
        savedResourceIds: [],
        completedResourceIds: [],
        trackedCertificationIds: [],
        activeProjectIds: [],
        rsvpdActivityIds: [],
        completedFoundationIds: [],
        completedExploreTaskIds: [],
        exploreTaskSubmissions: {},
        notes: ''
      };
      writeDataFile(store);
    } else {
      if (!store.userProgress[userId].completedExploreTaskIds) {
        store.userProgress[userId].completedExploreTaskIds = [];
      }
      if (!store.userProgress[userId].exploreTaskSubmissions) {
        store.userProgress[userId].exploreTaskSubmissions = {};
      }
    }
    return store.userProgress[userId];
  },
  updateUserProgress(userId: string, data: Partial<UserProgressData>): UserProgressData {
    const store = ensureDataFile();
    const existing = store.userProgress[userId] || {
      userId,
      enrolledDomains: [],
      savedResourceIds: [],
      completedResourceIds: [],
      trackedCertificationIds: [],
      activeProjectIds: [],
      rsvpdActivityIds: [],
      completedFoundationIds: [],
      completedExploreTaskIds: [],
      exploreTaskSubmissions: {},
      notes: ''
    };
    store.userProgress[userId] = { ...existing, ...data };
    writeDataFile(store);
    return store.userProgress[userId];
  },

  // Track Enrollments
  getEnrollments(options?: { domainId?: string; trackId?: string; status?: string }): TrackEnrollment[] {
    let list = ensureDataFile().trackEnrollments || [];
    if (options?.domainId && options.domainId !== 'all') {
      list = list.filter((e) => e.domainId === options.domainId);
    }
    if (options?.trackId && options.trackId !== 'all') {
      list = list.filter((e) => e.trackId === options.trackId);
    }
    if (options?.status && options.status !== 'all') {
      list = list.filter((e) => e.status === options.status);
    }
    return list;
  },
  getEnrollmentsByUserId(userId: string): TrackEnrollment[] {
    return (ensureDataFile().trackEnrollments || []).filter((e) => e.userId === userId);
  },
  getEnrollmentsByRollNumber(rollNumber: string): TrackEnrollment[] {
    const cleanRoll = rollNumber.trim().toUpperCase();
    return (ensureDataFile().trackEnrollments || []).filter(
      (e) => e.rollNumber.trim().toUpperCase() === cleanRoll
    );
  },
  getEnrollmentById(id: string): TrackEnrollment | undefined {
    return (ensureDataFile().trackEnrollments || []).find((e) => e.id === id);
  },
  createEnrollment(data: Omit<TrackEnrollment, 'id' | 'status' | 'createdAt' | 'updatedAt'>): TrackEnrollment {
    const store = ensureDataFile();
    if (!store.trackEnrollments) store.trackEnrollments = [];

    const now = new Date().toISOString();
    const newEnrollment: TrackEnrollment = {
      ...data,
      studentName: data.studentName || data.fullName || 'Student',
      fullName: data.fullName || data.studentName || 'Student',
      studentEmail: data.studentEmail || data.email || '',
      email: data.email || data.studentEmail || '',
      academicYear: data.academicYear || data.year || '',
      year: data.year || data.academicYear || '',
      trackName: data.trackName || data.trackTitle || 'Track',
      trackTitle: data.trackTitle || data.trackName || 'Track',
      id: `enr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`,
      status: 'pending',
      createdAt: now,
      updatedAt: now
    };

    store.trackEnrollments.unshift(newEnrollment);

    // Also link domain to user progress enrolledDomains if not already present
    if (data.userId && store.userProgress[data.userId]) {
      if (!store.userProgress[data.userId].enrolledDomains.includes(data.domainId)) {
        store.userProgress[data.userId].enrolledDomains.push(data.domainId);
      }
    }

    writeDataFile(store);
    return newEnrollment;
  },
  updateEnrollmentStatus(id: string, status: TrackEnrollment['status'], reviewedBy?: string): TrackEnrollment | null {
    const store = ensureDataFile();
    if (!store.trackEnrollments) return null;
    const index = store.trackEnrollments.findIndex((e) => e.id === id);
    if (index === -1) return null;

    const now = new Date().toISOString();
    store.trackEnrollments[index].status = status;
    store.trackEnrollments[index].updatedAt = now;
    if (reviewedBy) {
      store.trackEnrollments[index].reviewedBy = reviewedBy;
      store.trackEnrollments[index].reviewedAt = now;
    }
    writeDataFile(store);
    return store.trackEnrollments[index];
  },

  // Custom Core Track Management
  getTracks(domainId?: string): DomainTrack[] {
    const store = ensureDataFile();
    const baseTracks = getAllTracks();
    const custom = store.customTracks || [];
    let all = [...baseTracks];

    // Merge or override custom tracks
    for (const c of custom) {
      const existingIdx = all.findIndex((t) => t.id === c.id);
      if (existingIdx !== -1) {
        all[existingIdx] = c;
      } else {
        all.push(c);
      }
    }

    if (domainId && domainId !== 'all') {
      all = all.filter((t) => t.domainId === domainId || t.domainSlug === domainId);
    }
    return all;
  },
  addTrack(track: Omit<DomainTrack, 'id'>): DomainTrack {
    const store = ensureDataFile();
    if (!store.customTracks) store.customTracks = [];
    const newTrack: DomainTrack = {
      ...track,
      id: `track-${Date.now()}`,
      isActive: track.isActive !== false
    };
    store.customTracks.push(newTrack);
    writeDataFile(store);
    return newTrack;
  },
  updateTrack(id: string, updated: Partial<DomainTrack>): DomainTrack | null {
    const store = ensureDataFile();
    if (!store.customTracks) store.customTracks = [];
    const customIndex = store.customTracks.findIndex((t) => t.id === id);
    if (customIndex !== -1) {
      store.customTracks[customIndex] = { ...store.customTracks[customIndex], ...updated };
      writeDataFile(store);
      return store.customTracks[customIndex];
    }
    // If it's a base track, store an override in customTracks
    const base = getAllTracks().find((t) => t.id === id);
    if (!base) return null;
    const overridden: DomainTrack = { ...base, ...updated };
    store.customTracks.push(overridden);
    writeDataFile(store);
    return overridden;
  },
  deleteTrack(id: string): { success: boolean; error?: string } {
    const store = ensureDataFile();
    // Check referential integrity: are any students enrolled in this track?
    const enrollments = store.trackEnrollments || [];
    const hasEnrollments = enrollments.some((e) => e.trackId === id);
    if (hasEnrollments) {
      return {
        success: false,
        error: 'Cannot delete track: active student enrollments exist for this track. Please deactivate it instead to protect student records.'
      };
    }
    if (store.customTracks) {
      const beforeLen = store.customTracks.length;
      store.customTracks = store.customTracks.filter((t) => t.id !== id);
      if (store.customTracks.length !== beforeLen) {
        writeDataFile(store);
        return { success: true };
      }
    }
    // If it is a predefined base track, mark as deactivated
    const base = getAllTracks().find((t) => t.id === id);
    if (base) {
      if (!store.customTracks) store.customTracks = [];
      store.customTracks.push({ ...base, isActive: false });
      writeDataFile(store);
      return { success: true };
    }
    return { success: false, error: 'Track not found.' };
  }
};
