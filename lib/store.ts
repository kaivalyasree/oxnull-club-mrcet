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

export interface AwarenessArticle {
  id: string;
  category: 'tech-news' | 'cyber-news' | 'scam-alert';
  title: string;
  summary: string;
  content?: string;
  publishedDate: string;
  source: string;
  sourceUrl: string;
  tag?: string;
  scamType?: string;
  howItWorks?: string[];
  redFlags?: string[];
  safetyTips?: string[];
  whatToDoIfTargeted?: string;
  reportingResource?: {
    name: string;
    helpline?: string;
    url: string;
  };
  isPublished: boolean;
  cadenceNote?: string;
  createdAt: string;
  updatedAt: string;
}

export const DEFAULT_AWARENESS_ARTICLES: AwarenessArticle[] = [
  // 1. Weekly Technology News
  {
    id: 'art-tech-1',
    category: 'tech-news',
    title: 'Anthropic Releases Upgraded Claude 3.5 Sonnet with Computer Use API',
    summary: 'Anthropic introduced an upgraded Claude 3.5 Sonnet model and a breakthrough experimental API feature allowing AI models to interact with desktop computer interfaces, moving cursors, clicking buttons, and typing text autonomously.',
    publishedDate: '2024-10-22',
    source: 'TechCrunch / Anthropic',
    sourceUrl: 'https://techcrunch.com/2024/10/22/anthropics-claude-can-now-use-a-computer-on-its-own/',
    tag: 'AI & Computing',
    cadenceNote: 'Published Weekly',
    isPublished: true,
    createdAt: '2024-10-22T08:00:00.000Z',
    updatedAt: '2024-10-22T08:00:00.000Z'
  },
  {
    id: 'art-tech-2',
    category: 'tech-news',
    title: 'Linux Kernel 6.12 Officially Merges PREEMPT_RT Real-Time Support',
    summary: 'Following more than two decades of collaborative open-source engineering, real-time Linux support (PREEMPT_RT) has been officially integrated into the mainline Linux kernel 6.12, providing deterministic latency for robotics and mission-critical systems.',
    publishedDate: '2024-11-17',
    source: 'Phoronix / LWN.net',
    sourceUrl: 'https://www.phoronix.com/news/Linux-6.12-Released',
    tag: 'Operating Systems & Open Source',
    cadenceNote: 'Published Weekly',
    isPublished: true,
    createdAt: '2024-11-17T08:00:00.000Z',
    updatedAt: '2024-11-17T08:00:00.000Z'
  },
  {
    id: 'art-tech-3',
    category: 'tech-news',
    title: 'Python 3.13 Ships with Experimental Free-Threaded Mode Disabling the GIL',
    summary: 'The Python Software Foundation has officially released Python 3.13 featuring an experimental build that disables the Global Interpreter Lock (GIL), enabling multi-threaded Python code to run in true multi-core parallel execution.',
    publishedDate: '2024-10-07',
    source: 'InfoWorld / Python.org',
    sourceUrl: 'https://www.infoworld.com/article/3571217/python-3-13-whats-new-and-why-it-matters.html',
    tag: 'Software & Systems',
    cadenceNote: 'Published Weekly',
    isPublished: true,
    createdAt: '2024-10-07T08:00:00.000Z',
    updatedAt: '2024-10-07T08:00:00.000Z'
  },
  {
    id: 'art-tech-4',
    category: 'tech-news',
    title: 'NASA Deep Space Optical Communications Transmits High-Definition Signal Across 31 Million Kilometers',
    summary: 'NASA demonstrated deep space optical communication using near-infrared laser signals to transmit ultra-high definition streaming video from millions of kilometers in space back to Earth at broadband data rates.',
    publishedDate: '2024-12-11',
    source: 'NASA Jet Propulsion Laboratory',
    sourceUrl: 'https://www.jpl.nasa.gov/news/nasas-tech-demo-streams-first-video-from-deep-space-via-laser',
    tag: 'Hardware & Telecom',
    cadenceNote: 'Published Weekly',
    isPublished: true,
    createdAt: '2024-12-11T08:00:00.000Z',
    updatedAt: '2024-12-11T08:00:00.000Z'
  },

  // 2. Fortnightly Cybersecurity News (Every 14 Days)
  {
    id: 'art-cyber-1',
    category: 'cyber-news',
    title: 'Critical Apache Tomcat Race Condition (CVE-2024-50379) Allows Remote Code Execution',
    summary: 'A critical vulnerability with CVSS 9.8 in Apache Tomcat allows unauthenticated remote adversaries to execute arbitrary JSP code on case-insensitive filesystems due to a race condition between concurrent upload requests.',
    publishedDate: '2024-12-19',
    source: 'Apache Security Advisory / CISA',
    sourceUrl: 'https://nvd.nist.gov/vuln/detail/CVE-2024-50379',
    tag: 'Critical Vulnerability',
    cadenceNote: 'Fortnightly Editorial Schedule',
    isPublished: true,
    createdAt: '2024-12-19T08:00:00.000Z',
    updatedAt: '2024-12-19T08:00:00.000Z'
  },
  {
    id: 'art-cyber-2',
    category: 'cyber-news',
    title: 'CERT-In Issues High Severity Advisory for Critical Vulnerabilities in Google Chrome and Android',
    summary: 'The Indian Computer Emergency Response Team (CERT-In) published advisory CIVN-2025-0012 warning of multiple vulnerabilities in Google Chrome and Android that could allow remote adversaries to execute code and access system memory.',
    publishedDate: '2025-01-14',
    source: 'CERT-In (Indian Computer Emergency Response Team)',
    sourceUrl: 'https://www.cert-in.org.in/',
    tag: 'Government Advisory',
    cadenceNote: 'Fortnightly Editorial Schedule',
    isPublished: true,
    createdAt: '2025-01-14T08:00:00.000Z',
    updatedAt: '2025-01-14T08:00:00.000Z'
  },
  {
    id: 'art-cyber-3',
    category: 'cyber-news',
    title: 'CISA and FBI Issue Joint Advisory on Salt Typhoon Telecom Cyber Espionage Operations',
    summary: 'U.S. cybersecurity agencies confirmed threat group Salt Typhoon compromised commercial telecommunications providers, gaining unauthorized access to customer call record metadata and lawful interception systems.',
    publishedDate: '2024-11-13',
    source: 'CISA / FBI Joint Bulletin',
    sourceUrl: 'https://www.cisa.gov/news-events/cybersecurity-advisories/aa24-318a',
    tag: 'Nation-State Threat',
    cadenceNote: 'Fortnightly Editorial Schedule',
    isPublished: true,
    createdAt: '2024-11-13T08:00:00.000Z',
    updatedAt: '2024-11-13T08:00:00.000Z'
  },
  {
    id: 'art-cyber-4',
    category: 'cyber-news',
    title: 'CISA Adds Actively Exploited Palo Alto Networks Expedition Flaws to KEV Catalog',
    summary: 'CISA added CVE-2024-5910 and CVE-2024-5911 to its Known Exploited Vulnerabilities catalog following confirmed active exploitation allowing attackers to reset administrative credentials on firewall migration systems.',
    publishedDate: '2024-11-07',
    source: 'CISA Known Exploited Vulnerabilities',
    sourceUrl: 'https://www.cisa.gov/known-exploited-vulnerabilities-catalog',
    tag: 'Active Exploitation',
    cadenceNote: 'Fortnightly Editorial Schedule',
    isPublished: true,
    createdAt: '2024-11-07T08:00:00.000Z',
    updatedAt: '2024-11-07T08:00:00.000Z'
  },

  // 3. Scam Awareness & Exposure
  {
    id: 'art-scam-1',
    category: 'scam-alert',
    title: 'Part-Time "Task & YouTube Like" Scam Targeting University Students',
    summary: 'Fraudsters lure students through unsolicited WhatsApp and Telegram messages promising high daily payouts for simple video-liking tasks, then coerce them into transferring large deposits for "prepaid tasks".',
    publishedDate: '2025-01-10',
    source: 'National Cyber Crime Reporting Portal Analysis',
    sourceUrl: 'https://cybercrime.gov.in',
    tag: 'Student Scam Alert',
    cadenceNote: 'Public Scam Awareness',
    isPublished: true,
    scamType: 'Fake Part-Time Job & Task Scam',
    howItWorks: [
      'Victim receives an unsolicited WhatsApp or Telegram message offering ₹1,000 to ₹5,000 per day for liking YouTube videos or leaving 5-star Google reviews.',
      'Scammers pay initial small amounts (₹150 to ₹500) via UPI to build trust and prove legitimacy.',
      'Victim is added to a private Telegram channel displaying fake payment receipts and members celebrating profits.',
      'Scammers introduce "Prepaid Merchant Tasks" requiring the student to deposit ₹5,000 to ₹50,000 to unlock higher commission balances.',
      'When the victim attempts to withdraw funds, fraudsters demand additional "tax clearance" or "system unlock" fees until the victim realizes they have been defrauded.'
    ],
    redFlags: [
      'Unsolicited job offers received via WhatsApp or Telegram without prior application.',
      'Guaranteed high daily earnings for trivial online actions.',
      'Any requirement to pay money or deposit security funds in order to receive your earned salary.',
      'Recruiters operating exclusively through Telegram channels rather than verified corporate email domains.'
    ],
    safetyTips: [
      'Never deposit money to secure employment, interviews, or release earned commissions.',
      'Verify recruiter credentials on official corporate career portals or through college placement cells.',
      'Block and report phone numbers and Telegram groups offering unverified work-from-home tasks.',
      'Warn classmates and roommates about task schemes operating across campus social networks.'
    ],
    whatToDoIfTargeted: 'Cease all communication immediately. Do not transfer further money to "unfreeze" your funds. Preserve chat screenshots, phone numbers, and UPI transaction reference numbers. Immediately call the National Cyber Crime Helpline at 1930 and register a formal complaint on cybercrime.gov.in.',
    reportingResource: {
      name: 'National Cyber Crime Reporting Portal',
      helpline: '1930',
      url: 'https://cybercrime.gov.in'
    },
    createdAt: '2025-01-10T08:00:00.000Z',
    updatedAt: '2025-01-10T08:00:00.000Z'
  },
  {
    id: 'art-scam-2',
    category: 'scam-alert',
    title: 'UPI "Scan QR Code to Receive Money" Reverse Pay Fraud',
    summary: 'Scammers posing as buyers on marketplace apps send a QR code claiming it will deposit money into the seller\'s account, tricking victims into entering their UPI PIN and authorizing an outgoing transfer.',
    publishedDate: '2025-01-05',
    source: 'NPCI / RBI Cyber Safety Alert',
    sourceUrl: 'https://sachet.rbi.org.in/',
    tag: 'Financial Fraud',
    cadenceNote: 'Public Scam Awareness',
    isPublished: true,
    scamType: 'UPI Reverse Payment & QR Scam',
    howItWorks: [
      'Scammer contacts a student or seller on OLX, Quickr, or social marketplace agreeing to purchase an item without haggling.',
      'Scammer claims they can only transfer funds via UPI and sends a QR code image over chat.',
      'Scammer falsely insists: "Scan this QR code and enter your 4-digit or 6-digit UPI PIN to claim your payment into your bank account."',
      'The moment the victim scans the QR and enters their PIN, the payment app debits money from the victim\'s bank account instead of crediting it.'
    ],
    redFlags: [
      'Any instruction to enter your UPI PIN to receive money — UPI PIN is strictly for DEBITING funds.',
      'Buyer demands an immediate transaction via custom QR code rather than using standard bank transfer.',
      'Deceptive text overlays on QR images saying "Scan to Receive Payment".'
    ],
    safetyTips: [
      'Golden Rule: You NEVER need to enter your UPI PIN to receive money into your bank account.',
      'Never scan a QR code sent by a third party claiming it will deposit funds into your wallet.',
      'Only provide your UPI ID (VPA) or registered phone number to receive payments safely.'
    ],
    whatToDoIfTargeted: 'Immediately block your UPI ID and payment app. Call your bank\'s 24x7 fraud hotline within the "golden hour" to request a transaction freeze. Dial 1930 to notify cyber police.',
    reportingResource: {
      name: 'National Cyber Crime Reporting Helpline',
      helpline: '1930',
      url: 'https://cybercrime.gov.in'
    },
    createdAt: '2025-01-05T08:00:00.000Z',
    updatedAt: '2025-01-05T08:00:00.000Z'
  },
  {
    id: 'art-scam-3',
    category: 'scam-alert',
    title: '"Digital Arrest" & Fake Law Enforcement Video Call Scheme',
    summary: 'Sophisticated criminal syndicates impersonate Police, CBI, or Customs officers over Skype or WhatsApp video calls, alleging illegal contraband was intercepted in the victim\'s name and demanding money transfers under threat of immediate arrest.',
    publishedDate: '2024-12-15',
    source: 'Ministry of Home Affairs (I4C) Advisory',
    sourceUrl: 'https://cybercrime.gov.in',
    tag: 'Impersonation Alert',
    cadenceNote: 'Public Scam Awareness',
    isPublished: true,
    scamType: 'Digital Arrest & Police Impersonation',
    howItWorks: [
      'Victim receives an automated IVR call stating their parcel containing passports, narcotics, or illegal goods has been seized by Customs at Mumbai or Delhi airport.',
      'Call is transferred to a fraudster impersonating a police or CBI investigator wearing uniforms against a staged police station backdrop on Skype.',
      'Scammers claim the victim\'s Aadhaar is linked to money laundering and place them under "Digital Arrest", ordering them not to leave their room.',
      'Victim is threatened with prosecution unless they transfer their bank savings to a "Supreme Court Verification Account" for security clearance.'
    ],
    redFlags: [
      'There is NO provision for "Digital Arrest" under Indian criminal law or police procedure.',
      'Police or investigative agencies NEVER conduct interrogation or arrest citizens over Skype or WhatsApp video calls.',
      'No legitimate government agency will EVER ask you to transfer personal funds to a bank account for verification.'
    ],
    safetyTips: [
      'Disconnect the call immediately if anyone mentions "digital arrest" or threatens arrest via phone or video.',
      'Do not share your Aadhaar number, banking details, or OTPs with unknown callers.',
      'Report fraudulent caller numbers on the Department of Telecommunications Chakshu portal.'
    ],
    whatToDoIfTargeted: 'Hang up immediately. Do not transfer funds. Report the incident to 1930 and file a complaint on cybercrime.gov.in. Report the phone number on Sanchar Saathi (Chakshu).',
    reportingResource: {
      name: 'Chakshu (DoT Fraud Communications Portal)',
      helpline: '1930',
      url: 'https://sancharsaathi.gov.in/sfc/'
    },
    createdAt: '2024-12-15T08:00:00.000Z',
    updatedAt: '2024-12-15T08:00:00.000Z'
  },
  {
    id: 'art-scam-4',
    category: 'scam-alert',
    title: 'Fake Campus Placement & Job Portal Spoofing',
    summary: 'Scammers send counterfeit recruitment letters mimicking top tier IT companies demanding ₹1,500 to ₹3,500 "document verification and gate pass fees" before campus interview dates.',
    publishedDate: '2024-11-28',
    source: 'University Placement Security Advisory',
    sourceUrl: 'https://cybercrime.gov.in',
    tag: 'Campus Recruitment Alert',
    cadenceNote: 'Public Scam Awareness',
    isPublished: true,
    scamType: 'Recruitment & Placement Fee Fraud',
    howItWorks: [
      'Students receive emails displaying corporate logos offering direct interview slots or provisional offer letters.',
      'Email demands payment of a "refundable training kit fee" or "background verification charge" via UPI within 24 hours.',
      'Once payment is completed, candidate receives fake receipts and the scammers\' communication lines go dead.'
    ],
    redFlags: [
      'Emails originating from free webmail accounts like @gmail.com or @outlook.com claiming to represent major IT employers.',
      'Any fee requirement for interviews, test scheduling, or offer letter issuance.',
      'Grammatical mistakes, mismatched sender domains, or urgent payment deadlines.'
    ],
    safetyTips: [
      'Top technology firms (TCS, Infosys, Cognizant, Wipro, Accenture) NEVER charge candidate recruitment fees.',
      'Cross-check all placement drives directly with the college Training & Placement Cell (T&P).',
      'Inspect the sender\'s full email address and headers before opening attachments.'
    ],
    whatToDoIfTargeted: 'Alert your college Placement Officer and Department Head immediately to protect fellow classmates. File an incident report on cybercrime.gov.in with transaction details.',
    reportingResource: {
      name: 'National Cyber Crime Reporting Portal',
      helpline: '1930',
      url: 'https://cybercrime.gov.in'
    },
    createdAt: '2024-11-28T08:00:00.000Z',
    updatedAt: '2024-11-28T08:00:00.000Z'
  },
  {
    id: 'art-scam-5',
    category: 'scam-alert',
    title: 'AI Voice Cloning & Family Emergency Extortion',
    summary: 'Cybercriminals harvest audio snippets from social media reels and videos to clone a student\'s voice using AI, calling parents in distress to demand immediate ransom or medical fee transfers.',
    publishedDate: '2024-11-15',
    source: 'I4C Cyber Awareness Directorate',
    sourceUrl: 'https://cybercrime.gov.in',
    tag: 'Emerging Cyber Threats',
    cadenceNote: 'Public Scam Awareness',
    isPublished: true,
    scamType: 'AI Voice Cloning & Impersonation',
    howItWorks: [
      'Scammers scrape short audio clips of a student from public Instagram reels, YouTube videos, or podcasts.',
      'Generative AI voice models clone the student\'s exact pitch, cadence, and vocal quirks.',
      'Scammers place an urgent call to the parents, playing the cloned voice crying for help after a fabricated car accident or police detention.',
      'An accomplice demands an immediate UPI transfer of ₹50,000 to settle the hospital or police matter, warning not to hang up.'
    ],
    redFlags: [
      'Intense emotional pressure, panic, and demand for immediate funds transfer.',
      'Caller refuses to let you hang up or contact the student\'s personal phone number.',
      'Payment requested through personal UPI IDs rather than hospital or institutional bank accounts.'
    ],
    safetyTips: [
      'Establish a confidential "Family Safe Word" known only to close family members to verify authentic distress.',
      'Always pause and call the student directly on their regular phone number or call their college roommate or hostel warden.',
      'Keep personal social media accounts private to limit public voice harvesting.'
    ],
    whatToDoIfTargeted: 'Disconnect the call immediately and call the student directly. If funds were transferred, immediately call 1930 and report to the local police cyber cell.',
    reportingResource: {
      name: 'National Cyber Crime Reporting Helpline',
      helpline: '1930',
      url: 'https://cybercrime.gov.in'
    },
    createdAt: '2024-11-15T08:00:00.000Z',
    updatedAt: '2024-11-15T08:00:00.000Z'
  }
];

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
  awarenessArticles?: AwarenessArticle[];
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
      awarenessArticles: DEFAULT_AWARENESS_ARTICLES,
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
    if (!parsed.awarenessArticles || parsed.awarenessArticles.length === 0) {
      parsed.awarenessArticles = DEFAULT_AWARENESS_ARTICLES;
    }
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
  },

  // Awareness Articles CMS
  getAwarenessArticles(options?: { publishedOnly?: boolean; category?: string }): AwarenessArticle[] {
    let list = ensureDataFile().awarenessArticles || [];
    if (options?.publishedOnly) {
      list = list.filter((a) => a.isPublished !== false);
    }
    if (options?.category && options.category !== 'all') {
      list = list.filter((a) => a.category === options.category);
    }
    return list;
  },
  addAwarenessArticle(item: Omit<AwarenessArticle, 'id' | 'createdAt' | 'updatedAt'>): AwarenessArticle {
    const store = ensureDataFile();
    if (!store.awarenessArticles) store.awarenessArticles = [];
    const now = new Date().toISOString();
    const newArticle: AwarenessArticle = {
      ...item,
      id: `art-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
      isPublished: item.isPublished !== false,
      createdAt: now,
      updatedAt: now
    };
    store.awarenessArticles.unshift(newArticle);
    writeDataFile(store);
    return newArticle;
  },
  updateAwarenessArticle(id: string, updated: Partial<AwarenessArticle>): AwarenessArticle | null {
    const store = ensureDataFile();
    if (!store.awarenessArticles) store.awarenessArticles = [];
    const index = store.awarenessArticles.findIndex((a) => a.id === id);
    if (index === -1) return null;
    store.awarenessArticles[index] = {
      ...store.awarenessArticles[index],
      ...updated,
      updatedAt: new Date().toISOString()
    };
    writeDataFile(store);
    return store.awarenessArticles[index];
  },
  togglePublishAwarenessArticle(id: string): AwarenessArticle | null {
    const store = ensureDataFile();
    if (!store.awarenessArticles) store.awarenessArticles = [];
    const index = store.awarenessArticles.findIndex((a) => a.id === id);
    if (index === -1) return null;
    const current = store.awarenessArticles[index].isPublished !== false;
    store.awarenessArticles[index].isPublished = !current;
    store.awarenessArticles[index].updatedAt = new Date().toISOString();
    writeDataFile(store);
    return store.awarenessArticles[index];
  },
  deleteAwarenessArticle(id: string): boolean {
    const store = ensureDataFile();
    if (!store.awarenessArticles) return false;
    const initialLen = store.awarenessArticles.length;
    store.awarenessArticles = store.awarenessArticles.filter((a) => a.id !== id);
    if (store.awarenessArticles.length !== initialLen) {
      writeDataFile(store);
      return true;
    }
    return false;
  }
};
