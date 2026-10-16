import fs from 'fs';
import path from 'path';
import {
  DOMAINS,
  Domain,
  Resource,
  Certification,
  Project,
  Activity,
  Announcement
} from './data';

export interface UserProgressData {
  userId: string;
  enrolledDomains: string[];
  savedResourceIds: string[];
  completedResourceIds: string[];
  trackedCertificationIds: string[];
  activeProjectIds: string[];
  rsvpdActivityIds: string[];
  completedFoundationIds: string[];
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

export interface StoreSchema {
  domains: Domain[];
  resources: Resource[];
  certifications: Certification[];
  projects: Project[];
  activities: Activity[];
  announcements: Announcement[];
  applications: ClubApplication[];
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
      resources: [],
      certifications: [],
      projects: [],
      activities: [],
      announcements: [],
      applications: [],
      userProgress: {}
    };
    fs.writeFileSync(DB_FILE, JSON.stringify(initialData, null, 2), 'utf-8');
    return initialData;
  }

  try {
    const fileContent = fs.readFileSync(DB_FILE, 'utf-8');
    const parsed = JSON.parse(fileContent) as StoreSchema;
    if (!parsed.applications) parsed.applications = [];
    if (!parsed.domains || parsed.domains.length === 0) parsed.domains = DOMAINS;
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
      resources: [],
      certifications: [],
      projects: [],
      activities: [],
      announcements: [],
      applications: [],
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
    return ensureDataFile().domains;
  },
  getDomainBySlug(slug: string): Domain | undefined {
    return ensureDataFile().domains.find((d) => d.slug === slug);
  },
  updateDomain(slug: string, updated: Partial<Domain>): Domain | null {
    const store = ensureDataFile();
    const index = store.domains.findIndex((d) => d.slug === slug);
    if (index === -1) return null;
    store.domains[index] = { ...store.domains[index], ...updated };
    writeDataFile(store);
    return store.domains[index];
  },

  // Resources (Published content only)
  getResources(): Resource[] {
    return ensureDataFile().resources;
  },
  addResource(item: Omit<Resource, 'id'>): Resource {
    const store = ensureDataFile();
    const newResource: Resource = {
      ...item,
      id: `r-${Date.now()}`
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
  getCertifications(): Certification[] {
    return ensureDataFile().certifications;
  },
  addCertification(item: Omit<Certification, 'id'>): Certification {
    const store = ensureDataFile();
    const newCert: Certification = {
      ...item,
      id: `c-${Date.now()}`
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
  getProjects(): Project[] {
    return ensureDataFile().projects;
  },
  addProject(item: Omit<Project, 'id'>): Project {
    const store = ensureDataFile();
    const newProj: Project = {
      ...item,
      id: `p-${Date.now()}`
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
        notes: ''
      };
      writeDataFile(store);
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
      notes: ''
    };
    store.userProgress[userId] = { ...existing, ...data };
    writeDataFile(store);
    return store.userProgress[userId];
  }
};
