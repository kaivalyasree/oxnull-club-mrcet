export interface Domain {
  id: string;
  slug: string;
  number: string;
  name: string;
  tagline: string;
  badge: string;
  overview: string;
  focusAreas: string[];
  subTracks?: {
    name: string;
    description: string;
    items: string[];
  }[];
  appliedAreas?: {
    code: string;
    title: string;
    description: string;
  }[];
  toolsCovered?: {
    name: string;
    description: string;
  }[];
  learningPathway: {
    stage: 'Beginner' | 'Intermediate' | 'Advanced';
    title: string;
    description: string;
    deliverable: string;
  }[];
  activities: string[];
}

export interface Resource {
  id: string;
  title: string;
  domainId: string;
  domainName: string;
  category: 'Walkthrough' | 'Tool' | 'Cheat Sheet' | 'Documentation' | 'Research Paper' | 'Lab Environment';
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  url: string;
  estimatedHours: number;
}

export interface Certification {
  id: string;
  name: string;
  code: string;
  provider: string;
  domainId: string;
  domainName: string;
  level: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  url: string;
  prerequisites: string;
  careerRoles: string[];
}

export interface Project {
  id: string;
  title: string;
  domainId: string;
  domainName: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  description: string;
  techStack: string[];
  status: 'Active' | 'Recruiting' | 'Completed' | 'Research';
  githubUrl?: string;
  demoUrl?: string;
  leadMember?: string;
}

export interface Activity {
  id: string;
  number: string;
  title: string;
  type: 'Technical' | 'Non-Technical' | 'Community' | 'Career';
  level: 'All Levels' | 'Beginner' | 'Intermediate' | 'Advanced';
  cadence: 'Weekly' | 'Bi-Weekly' | 'Monthly' | 'Term-Long' | 'Recurring';
  summary: string;
  description: string;
  outcomes: string[];
}

export interface FoundationTopic {
  id: string;
  number: string;
  title: string;
  subtitle: string;
  description: string;
  keyConcepts: string[];
  handsOnLab: string;
}

export interface ChallengeResponse {
  number: string;
  challenge: string;
  challengeDescription: string;
  response: string;
  responseDescription: string;
}

export interface Announcement {
  id: string;
  title: string;
  date: string;
  tag: string;
  content: string;
  author: string;
}

// 7 Domains from the official 0XNULL Proposal PDF
export const DOMAINS: Domain[] = [
  {
    id: 'd1',
    slug: 'red-blue-team',
    number: '01',
    name: 'Red & Blue Team',
    badge: 'Offence & Defence',
    tagline: 'Two perspectives, one discipline — attack to understand, defend to protect. Every exercise is conducted in controlled labs with documented ethical boundaries.',
    overview: 'The Red & Blue Team domain bridges adversarial attack simulations with institutional defense. Members practice both offensive penetration testing techniques to uncover attack vectors and defensive operational telemetry to isolate intrusions, engineer detection rules, and execute incident response drills.',
    focusAreas: [
      'Ethical hacking basics & scoped rules of engagement',
      'Vulnerability assessment & CVE vulnerability mapping',
      'Web application security (OWASP Top 10 vulnerabilities)',
      'Reconnaissance techniques (Passive & Active discovery)',
      'Penetration testing execution frameworks',
      'Controlled attack simulations & privilege escalation',
      'Security monitoring & perimeter telemetry analysis',
      'SIEM configuration & log analysis (Splunk, Elastic)',
      'Threat detection rules (YARA, Sigma)',
      'Incident response triage & forensic stabilization'
    ],
    subTracks: [
      {
        name: 'Red Team (Offensive Practice)',
        description: 'Thinking from the attacker position — finding architectural and implementation weaknesses before threat actors exploit them.',
        items: [
          'Ethical hacking fundamentals',
          'Vulnerability assessment',
          'Web application security',
          'Reconnaissance techniques',
          'Penetration testing methodology',
          'Controlled attack simulation'
        ]
      },
      {
        name: 'Blue Team (Defensive Operations)',
        description: 'Watching, detecting, responding — building the organizational muscle that shields mission-critical systems.',
        items: [
          'Security monitoring & alert correlation',
          'SIEM & log analysis pipelines',
          'Network perimeter defence & egress filtering',
          'Threat detection rules engineering',
          'Incident response drills & containment',
          'Forensic triage & root-cause isolation'
        ]
      }
    ],
    learningPathway: [
      {
        stage: 'Beginner',
        title: 'Foundational Reconnaissance & Lab Setup',
        description: 'Establish isolated Kali Linux & target VMs. Master Nmap, port scanning, basic HTTP inspection, and packet flows.',
        deliverable: 'Complete basic TryHackMe / HackTheBox pre-security rooms and write a reproducible lab verification memo.'
      },
      {
        stage: 'Intermediate',
        title: 'Web Application Pentesting & Perimeter Defense',
        description: 'Analyze SQL injection, cross-site scripting (XSS), authentication bypasses, and configure Suricata IDS rules.',
        deliverable: 'Publish a scoped penetration test report and matching Sigma defensive detection rules for an internal vulnerable service.'
      },
      {
        stage: 'Advanced',
        title: 'Full Attack-Defence Simulation & Active Directory',
        description: 'Participate in live team vs team scenarios, Kerberoasting, golden ticket attacks, and automated endpoint triage.',
        deliverable: 'Lead an internal 0XNULL CTF attack-defence session with automated post-incident debrief.'
      }
    ],
    activities: [
      'Collegiate CTF Competitions (Capture The Flag)',
      'Structured Attack-Defence Labs',
      'Live Fire Incident Drills',
      'Post-Mortem & Debriefing Roundtables'
    ]
  },
  {
    id: 'd2',
    slug: 'digital-forensics',
    number: '02',
    name: 'Digital Forensics',
    badge: 'Investigation & Artefacts',
    tagline: 'Reconstructing events from artefacts — disk, memory and network traces. The discipline of answering "what happened" with evidence, not assumption.',
    overview: 'Digital Forensics provides the rigorous methodology required to examine compromised storage media, memory dumps, and protocol traces. Members learn chain of custody protocols, volatile memory analysis, and filesystem timelines to piece together digital crime scenes.',
    focusAreas: [
      'Digital evidence handling & legal chain of custody',
      'Disk forensics & RAW / E01 filesystem image carving',
      'Network forensics & deep protocol trace inspection',
      'Incident investigation & post-breach reconstruction',
      'File systems analysis (NTFS $MFT, EXT4, APFS)',
      'Memory forensics & volatile payload extraction',
      'Log correlation & timeline triage synthesis'
    ],
    toolsCovered: [
      {
        name: 'Wireshark',
        description: 'Packet capture and network traffic protocol analysis to trace malicious C2 communications and payload exfiltration.'
      },
      {
        name: 'Autopsy',
        description: 'Disk, raw image, and filesystem investigation platform for automated artefact indexing, deleted file carving, and timeline analysis.'
      },
      {
        name: 'Volatility',
        description: 'Volatile memory artefact extraction and malware analysis framework for analyzing process trees, injected DLLs, and memory pools.'
      }
    ],
    learningPathway: [
      {
        stage: 'Beginner',
        title: 'Artefact Acquisition & Hex Analysis',
        description: 'Learn evidence hashing (SHA-256), write-blockers, disk cloning, and hex examination of common file signatures.',
        deliverable: 'Verify and document a cryptographic disk image integrity verification report.'
      },
      {
        stage: 'Intermediate',
        title: 'Network & Memory Incident Extraction',
        description: 'Dissect PCAP files for credentials, DNS tunneling, and inspect memory dumps using Volatility 3 to spot hidden threads.',
        deliverable: 'Deliver an incident timeline report detailing a simulated employee data-exfiltration breach.'
      },
      {
        stage: 'Advanced',
        title: 'Enterprise Incident Response & Anti-Forensics',
        description: 'Counter timestomping, rootkits, memory injection, and reconstruct lateral movement across Windows event logs.',
        deliverable: 'Publish a forensic case walkthrough with evidence artefacts presented in court-admissible format.'
      }
    ],
    activities: [
      'Forensic Mystery Challenges',
      'Memory Dump Autopsies',
      'Network Packet Sleuthing Sessions',
      'Artefact Carving Competitions'
    ]
  },
  {
    id: 'd3',
    slug: 'cryptography',
    number: '03',
    name: 'Cryptography',
    badge: 'Mathematical Trust',
    tagline: 'The mathematics that allows two parties to establish trust across an untrusted wire — turning plaintext into ciphertext impenetrable to adversaries.',
    overview: 'Cryptography forms the foundational mathematical backbone of all digital trust. Members explore symmetric and asymmetric encryption primitives, cryptographic hashing, digital signatures, public key infrastructure (PKI), and zero-knowledge proof concepts.',
    focusAreas: [
      'Encryption & decryption mathematics and modular arithmetic',
      'Asymmetric cryptography (RSA, Elliptic Curve Cryptography)',
      'Digital signatures, certificates, and Public Key Infrastructure (PKI)',
      'Symmetric ciphers (AES-GCM, ChaCha20-Poly1305)',
      'Cryptographic hashing (SHA-2, SHA-3, BLAKE3, collision resistance)',
      'Key management, exchange protocols (Diffie-Hellman), and HSM architectures',
      'Cryptanalysis, padding oracle attacks, and side-channel vulnerabilities'
    ],
    appliedAreas: [
      {
        code: 'TL-1',
        title: 'HTTPS & Secure Protocols',
        description: 'TLS 1.3 handshake, cipher suites negotiation, certificate validation chains, and forward secrecy guarantees.'
      },
      {
        code: 'TL-2',
        title: 'Authentication & MFA Systems',
        description: 'FIDO2 / WebAuthn public key authentication, HMAC-based OTP (HOTP), and time-based OTP (TOTP) protocols.'
      },
      {
        code: 'TL-3',
        title: 'Digital Payment Architectures',
        description: 'EMV tokenization, cryptographic message authentication codes (MAC), and tamper-evident ledger validation.'
      },
      {
        code: 'TL-4',
        title: 'Data at Rest & Transit Protection',
        description: 'Envelop encryption, hardware-backed KMS vaults, transparent database encryption (TDE), and end-to-end encryption.'
      }
    ],
    learningPathway: [
      {
        stage: 'Beginner',
        title: 'Classical to Modern Primitives',
        description: 'Understand modular arithmetic, XOR encryption, Caesar/Vigenère breaks, and modern AES block cipher modes.',
        deliverable: 'Implement a zero-dependency symmetric file encrypter in Python using standard libraries with HMAC verification.'
      },
      {
        stage: 'Intermediate',
        title: 'Public Key Infrastructure & Secure Handshakes',
        description: 'Derive RSA and ECC keys, simulate Diffie-Hellman key exchanges, and inspect X.509 certificate chains.',
        deliverable: 'Build a private Certificate Authority (CA) that issues, verifies, and revokes client TLS certificates.'
      },
      {
        stage: 'Advanced',
        title: 'Cryptanalysis & Quantum-Resistant Algorithms',
        description: 'Break weak PRNGs, execute padding oracle attacks, explore lattice-based post-quantum cryptography (Kyber, Dilithium).',
        deliverable: 'Publish a technical writeup solving advanced cryptanalytic CTF challenges.'
      }
    ],
    activities: [
      'CryptoHack Challenge Nights',
      'Cipher Implementation Workshops',
      'Cryptanalysis Teardowns',
      'Post-Quantum Readiness Seminars'
    ]
  },
  {
    id: 'd4',
    slug: 'cloud-security',
    number: '04',
    name: 'Cloud Security',
    badge: 'Infrastructure & Posture',
    tagline: 'Most modern systems live in cloud infrastructure. Members learn the shared responsibility model, identity perimeters, and common misconfigurations.',
    overview: 'As computing migrates to AWS, Azure, GCP, and Kubernetes clusters, the perimeter has shifted from physical firewalls to identity and software-defined networks. This domain trains students to audit cloud environments, enforce least privilege, and harden microservices.',
    focusAreas: [
      'Cloud fundamentals & service models (IaaS / PaaS / SaaS) shared responsibility',
      'Identity & Access Management (IAM roles, least-privilege, permission boundaries)',
      'Cloud networking (VPCs, private subnets, security groups, ingress filtering)',
      'Data protection (S3 bucket policies, transit encryption, KMS customer keys)',
      'Monitoring & observability (CloudTrail, GuardDuty, audit trails, anomaly detection)',
      'Misconfiguration risks (Root causes of 80%+ cloud breaches and remediations)',
      'Container security (Docker image hardening, runtime isolation, Kubernetes RBAC)',
      'Compliance posture (CIS benchmarks, automated audits, Infrastructure as Code scanning)'
    ],
    appliedAreas: [
      { code: 'CS-01', title: 'Cloud Fundamentals', description: 'Service models and boundary enforcement across shared responsibility matrices.' },
      { code: 'CS-02', title: 'Identity & Access (IAM)', description: 'Least-privilege policy engineering, ABAC, RBAC, and credential rotation.' },
      { code: 'CS-03', title: 'Cloud Networking', description: 'Virtual private clouds, peering, NAT gateways, and egress filtering rules.' },
      { code: 'CS-04', title: 'Data Protection & KMS', description: 'Server-side bucket encryption, key management hierarchies, and access logs.' },
      { code: 'CS-05', title: 'Cloud Telemetry & Audit', description: 'CloudTrail log correlation, VPC flow logs, and SIEM streaming ingestion.' },
      { code: 'CS-06', title: 'Misconfiguration Remediation', description: 'Detecting exposed storage buckets, wildcard permissions, and unencrypted volumes.' },
      { code: 'CS-07', title: 'Container & K8s Hardening', description: 'Distroless base images, rootless execution, pod security standards, and network policies.' },
      { code: 'CS-08', title: 'Compliance & CSPM', description: 'Cloud Security Posture Management with automated CIS benchmark policy checks.' }
    ],
    learningPathway: [
      {
        stage: 'Beginner',
        title: 'Cloud Foundations & Identity Governance',
        description: 'Explore AWS/GCP architecture, configure multi-factor auth, set up least-privilege IAM users, and launch secure VPCs.',
        deliverable: 'Configure an AWS lab environment with zero wildcard (*) permissions verified via IAM Access Analyzer.'
      },
      {
        stage: 'Intermediate',
        title: 'Infrastructure as Code & Container Hardening',
        description: 'Write secure Terraform modules, scan templates with Checkov / tfsec, build minimal Docker images, and configure Kube-bench.',
        deliverable: 'Deploy a CI/CD pipeline that blocks insecure cloud resources before deployment.'
      },
      {
        stage: 'Advanced',
        title: 'Cloud Attack Simulation & Detection Engineering',
        description: 'Simulate SSRF against cloud metadata instances, role chaining, privilege escalation, and write detection rules for GuardDuty alerts.',
        deliverable: 'Build a serverless automated incident remediation function that isolates compromised EC2 instances within seconds.'
      }
    ],
    activities: [
      'Cloud Misconfiguration Labs (Flaws.cloud)',
      'Terraform Security Audits',
      'Kubernetes Cluster Attack & Defend',
      'AWS / GCP Architecture Reviews'
    ]
  },
  {
    id: 'd5',
    slug: 'security-architecture',
    number: '05',
    name: 'Security Architecture',
    badge: 'Structural Defense',
    tagline: 'Designing systems where security is structural, not bolted-on — threat-modelled, layered, and resilient against evolving threats.',
    overview: 'Security Architecture approaches defense from the structural blueprint. Rather than relying on point solutions, architects design systems where every component assumes breach, enforces Zero Trust verification, and implements multi-layer defense in depth.',
    focusAreas: [
      'Secure system design principles & trust boundary mapping',
      'Zero Trust architecture (Never Trust, Always Verify)',
      'Threat modelling frameworks (STRIDE, PASTA, LINDDUN)',
      'Defence in depth across Perimeter, Network, Host, and Core Data rings',
      'Network zoning, micro-segmentation, and DMZ enclaves',
      'Identity & access governance frameworks',
      'Risk management methodologies & technical trade-offs',
      'Resilient recovery patterns, disaster recovery, and operational fault tolerance'
    ],
    appliedAreas: [
      { code: 'RING-1', title: 'Perimeter Defense', description: 'DDoS mitigation, WAF ingress, edge TLS termination, and rate-limiting gateways.' },
      { code: 'RING-2', title: 'Network Segmentation', description: 'Micro-segmented VLANs, zero-trust overlay networks, and internal mutual TLS.' },
      { code: 'RING-3', title: 'Host & Workload Hardening', description: 'OS baseline hardening (CIS), SELinux/AppArmor profiles, and endpoint detection.' },
      { code: 'RING-4', title: 'Core Data Vaulting', description: 'Hardware security modules, envelope encryption, and strict data loss prevention.' }
    ],
    learningPathway: [
      {
        stage: 'Beginner',
        title: 'Threat Modelling Fundamentals',
        description: 'Understand the CIA triad, STRIDE threat identification, and data flow diagrams (DFDs).',
        deliverable: 'Deliver a STRIDE threat model diagram for a university student registration portal.'
      },
      {
        stage: 'Intermediate',
        title: 'Zero Trust Network & Micro-segmentation',
        description: 'Design software-defined perimeters, mutual TLS authentication between microservices, and identity-aware proxies.',
        deliverable: 'Produce an end-to-end architecture diagram showing layered defense for an e-commerce platform.'
      },
      {
        stage: 'Advanced',
        title: 'Enterprise Resilience & Disaster Blueprinting',
        description: 'Design air-gapped backup topologies, disaster recovery orchestration, and regulatory compliance alignment (NIST CSF, ISO 27001).',
        deliverable: 'Defend a complete architectural blueprint in a mock executive board review.'
      }
    ],
    activities: [
      'STRIDE Threat Modeling Workshops',
      'Architecture Redline & Review Panels',
      'Zero Trust Migration Case Studies',
      'Disaster Recovery Tabletop Exercises'
    ]
  },
  {
    id: 'd6',
    slug: 'awareness',
    number: '06',
    name: 'Awareness',
    badge: 'Human & Threat Landscape',
    tagline: 'Reading the threat landscape as it actually moves — beyond sensational headlines, into the mechanics of phishing, social engineering, malware, and emerging attack vectors.',
    overview: 'The human element remains the primary attack surface across modern breaches. The Awareness domain equips members with critical intelligence to deconstruct spear-phishing campaigns, behavioral psychology, ransomware economics, and digital privacy.',
    focusAreas: [
      'Cybersecurity intelligence & active global threat campaigns',
      'Online scams, spear-phishing, business email compromise (BEC)',
      'Social engineering behavioral patterns & cognitive biases',
      'Malware families, ransomware payloads, and extortion schemes',
      'Digital privacy, consumer data rights, and surveillance technologies',
      'Emerging attack vectors (AI voice clones, deepfakes, QR code phishing)'
    ],
    activities: [
      'Weekly News Briefings (Recurring intelligence roundups on zero-days and active campaigns)',
      'Awareness Campaigns (Public-facing university drives and scam prevention workshops)',
      'Discussions & Structured Debates (Member-led arguments on digital rights, AI, and policies)',
      'Content Creation & Explainers (Publishing student-friendly infographics and threat memos)'
    ],
    learningPathway: [
      {
        stage: 'Beginner',
        title: 'Phishing Mechanics & Personal Hygiene',
        description: 'Inspect email headers (SPF, DKIM, DMARC), analyze deceptive URLs, and implement password manager & hardware MFA standards.',
        deliverable: 'Author an interactive scam-detection checklist for university freshmen.'
      },
      {
        stage: 'Intermediate',
        title: 'Threat Intelligence Synthesis & Campaign Dissection',
        description: 'Track APT groups on MITRE ATT&CK, correlate malware IoCs (Indicators of Compromise), and monitor OSINT feeds.',
        deliverable: 'Present a 15-minute weekly intelligence briefing dissecting an ongoing ransomware outbreak.'
      },
      {
        stage: 'Advanced',
        title: 'Organizational Human Defense & Policy',
        description: 'Design ethical simulated phishing programs, evaluate behavioral nudges, and analyze international cyber warfare doctrines.',
        deliverable: 'Design and execute a campus-wide Cyber Hygiene Month campaign with measurable impact metrics.'
      }
    ]
  },
  {
    id: 'd7',
    slug: 'explore',
    number: '07',
    name: 'Explore',
    badge: 'Discovery & Leadership',
    tagline: 'A platform where students try different non-technical domains, discover their interests and potential, and choose skills they want to develop further.',
    overview: 'Not all cybersecurity excellence is code. The Explore domain is 0XNULL\'s incubator for discovery, communication, and executive leadership. Students discover where their natural talents lie — bridging technical engineering with human leadership, public speaking, event production, and community partnerships.',
    focusAreas: [
      'Discover personal interests beyond conventional technical tracks',
      'Real-world creative, design, & communication projects',
      'Leadership, teamwork, & large-scale event operations',
      'Public relations, community networking, & industry outreach',
      'Interdisciplinary collaboration between technical and non-technical students'
    ],
    appliedAreas: [
      { code: 'SKILL-1', title: 'Communication & Storytelling', description: 'Translating complex CVEs and binary exploits into clear executive narratives.' },
      { code: 'SKILL-2', title: 'Public Speaking & Presentations', description: 'Delivering keynote conference talks and technical demonstrations with confidence.' },
      { code: 'SKILL-3', title: 'Teamwork & Event Management', description: 'Orchestrating hackathons, CTFs, guest seminars, and multi-track workshops.' },
      { code: 'SKILL-4', title: 'PR & Industry Outreach', description: 'Partnering with security firms, alumni practitioners, and national cybersecurity organizations.' }
    ],
    learningPathway: [
      {
        stage: 'Beginner',
        title: 'Community Contribution & Peer Collaboration',
        description: 'Join event coordination teams, co-author meeting minutes, and facilitate breakout rooms during workshops.',
        deliverable: 'Organize and host a 0XNULL peer study circle with at least 15 attendees.'
      },
      {
        stage: 'Intermediate',
        title: 'Public Presentation & Workshop Facilitation',
        description: 'Develop technical presentation decks, master stage presence, and coordinate speaker logistics for guest lecturers.',
        deliverable: 'Deliver a solo 20-minute lightning talk on a technology topic at a club general meeting.'
      },
      {
        stage: 'Advanced',
        title: 'Executive Leadership & Partnership Building',
        description: 'Lead club operational domains, manage mentorship programs, spearhead industry sponsorships, and guide junior cohorts.',
        deliverable: 'Direct the planning and execution of 0XNULL\'s flagship annual cybersecurity conference.'
      }
    ],
    activities: [
      'Public Speaking Bootcamps',
      'Hackathon Organization Sprints',
      'Industry Networking Mixers',
      'Cross-Domain Innovation Challenges'
    ]
  }
];

// Activities collection (starts with zero records per Section 7, populated via Admin/Backend)
export const ACTIVITIES: Activity[] = [];

// Foundation Modules from PDF page 3
export const FOUNDATION_TOPICS: FoundationTopic[] = [
  {
    id: 'f-1',
    number: '01',
    title: 'Computer Fundamentals',
    subtitle: 'Hardware, Processors, Memory & Binary Computation',
    description: 'Before analyzing an exploit or payload, members must understand how silicon executes instructions, registers store data, and binary bits represent operations.',
    keyConcepts: [
      'Von Neumann architecture & CPU execution cycles',
      'Binary, hexadecimal, and bitwise operations (AND, OR, XOR, SHL)',
      'x86_64 vs ARM64 CPU register models (RAX, RSP, RBP, RIP)',
      'Stack vs Heap memory management in system programming'
    ],
    handsOnLab: 'Inspect compiled C binaries in GDB to watch CPU registers mutate step-by-step during instruction execution.'
  },
  {
    id: 'f-2',
    number: '02',
    title: 'Networking',
    subtitle: 'TCP/IP, Routing, DNS & Layered Traffic',
    description: 'Network communication is the circulatory system of modern technology. Students master packet encapsulation, protocol headers, and DNS resolution.',
    keyConcepts: [
      'OSI 7-Layer model & TCP/IP stack mapping',
      'Three-way handshake (SYN, SYN-ACK, ACK) and teardown',
      'Subnetting, CIDR notation, and IP routing tables',
      'DNS recursive resolution hierarchy and TLS handshake basics'
    ],
    handsOnLab: 'Capture live HTTP vs HTTPS handshakes in Wireshark and trace every protocol header byte across layers 2 through 7.'
  },
  {
    id: 'f-3',
    number: '03',
    title: 'Operating Systems',
    subtitle: 'Processes, Memory Models, Filesystems & Kernel Basics',
    description: 'The operating system governs all program execution. Understanding process privilege rings, system calls, and virtual memory is crucial for both attack and defense.',
    keyConcepts: [
      'Ring 0 (Kernel) vs Ring 3 (User space) separation',
      'Process trees, thread scheduling, and PID lifecycles',
      'Virtual memory, page tables, and memory protection (DEP/NX, ASLR)',
      'Filesystem structures: Inodes, metadata, and access permissions'
    ],
    handsOnLab: 'Write a small program that inspects its own memory mappings via /proc/self/maps on Linux.'
  },
  {
    id: 'f-4',
    number: '04',
    title: 'Linux',
    subtitle: 'Command Line, Scripting, Permissions & Toolchains',
    description: 'Linux is the de facto operating system of cloud infrastructure, security tools, and forensic environments. Command line fluency is non-negotiable.',
    keyConcepts: [
      'BASH command line navigation, pipes, grep, sed, and awk',
      'POSIX user, group, and other permissions (chmod, chown, SUID/SGID)',
      'Systemd services, journalctl logs, and background daemons',
      'Automating recon and triage tasks using Bash & Python scripts'
    ],
    handsOnLab: 'Harden an Ubuntu server by locking down SSH, configuring UFW firewall rules, and auditing SUID binaries.'
  },
  {
    id: 'f-5',
    number: '05',
    title: 'Security Fundamentals',
    subtitle: 'Threat Models, Defence Vocabulary, CIA Triad & Attack Surfaces',
    description: 'The universal conceptual lens through which all security decisions are evaluated, balancing confidentiality, integrity, and availability.',
    keyConcepts: [
      'Confidentiality, Integrity, Availability (CIA Triad)',
      'Threat actors, vulnerability vs exploit vs risk definition',
      'Attack surface analysis and principle of least privilege',
      'Authentication, Authorization, and Non-repudiation (AAA)'
    ],
    handsOnLab: 'Perform a comprehensive attack surface audit of an open-source web application and catalog its attack vectors.'
  }
];

// Curated Initial Resources (zero predefined content per Section 7, managed via Admin)
export const INITIAL_RESOURCES: Resource[] = [];

// Curated Initial Certifications (zero predefined content per Section 7, managed via Admin)
export const INITIAL_CERTIFICATIONS: Certification[] = [];

// Curated Initial Projects (zero predefined content per Section 7, managed via Admin)
export const INITIAL_PROJECTS: Project[] = [];

// Five Challenges & Responses from PDF page 14
export const CHALLENGES_RESPONSES: ChallengeResponse[] = [
  {
    number: '01',
    challenge: 'Different Skill Levels',
    challengeDescription: 'Members join with widely varying technical backgrounds, from absolute beginners to experienced programmers.',
    response: 'Faculty Guidance & Foundation Stage',
    responseDescription: 'A shared starting floor establishes core fundamentals in systems, networking, and Linux before advanced domain tracks diverge.'
  },
  {
    number: '02',
    challenge: 'Maintaining Participation',
    challengeDescription: 'Engagement wanes over time without clear, predictable, and recurring community structure.',
    response: 'Defined Member Responsibilities',
    responseDescription: 'Member-owned roles with visible commitments, project milestones, and hands-on deliverables ensure continuous ownership.'
  },
  {
    number: '03',
    challenge: 'Quality Control',
    challengeDescription: 'Student-led sessions and learning resources vary in technical rigor and instructional accuracy.',
    response: 'Content Review & Peer Mentorship',
    responseDescription: 'Senior members and faculty advisors rigorously vet published club materials, lab walkthroughs, and challenge guides.'
  },
  {
    number: '04',
    challenge: 'Resource Management',
    challengeDescription: 'Tools, lab virtual machines, cloud instances, and environments take continuous effort to maintain.',
    response: 'Structured, Curated Repository',
    responseDescription: 'A maintained living digital library and reproducible containerized labs replace untracked, dead link dumps.'
  },
  {
    number: '05',
    challenge: 'Continuity Across Cohorts',
    challengeDescription: 'Student organizations risk losing momentum, knowledge, and institutional memory when founding classes graduate.',
    response: 'Documented Handover Processes',
    responseDescription: 'Standard operational playbooks, archival git repositories, and junior co-leads ensure incoming cohorts step into seamless leadership.'
  }
];

// Initial Announcements (zero predefined content per Section 7, managed via Admin)
export const INITIAL_ANNOUNCEMENTS: Announcement[] = [];

// Student Journey Milestones
export const STUDENT_JOURNEY_STAGES = [
  {
    step: '01',
    title: 'DISCOVER',
    subtitle: 'Where curiosity ignites',
    description: 'Attend a general body meeting, explore the 7 cybersecurity domains, and find where your curiosity and ambitions align.',
    action: 'Attend Orientation & Explore Domains'
  },
  {
    step: '02',
    title: 'LEARN',
    subtitle: 'Anchor in fundamentals',
    description: 'Master the 5 foundation modules: Computer Fundamentals, Networking, Operating Systems, Linux, and Security Core.',
    action: 'Complete Foundation Roadmap'
  },
  {
    step: '03',
    title: 'PRACTICE',
    subtitle: 'Theory becomes reflex',
    description: 'Join hands-on workshops, dissect packet dumps in Wireshark, solve TryHackMe rooms, and set up isolated virtual labs.',
    action: 'Participate in Weekly Labs'
  },
  {
    step: '04',
    title: 'EXPLORE',
    subtitle: 'Branch into domains',
    description: 'Rotate across the 7 specialized domains, participate in open debates, and discover technical and non-technical strengths.',
    action: 'Select Focus Domain Track'
  },
  {
    step: '05',
    title: 'SPECIALIZE',
    subtitle: 'Deep technical rigor',
    description: 'Commit to a primary domain (e.g., Digital Forensics or Cloud Security), studying advanced primitives and real-world breach cases.',
    action: 'Join Domain Working Guild'
  },
  {
    step: '06',
    title: 'BUILD',
    subtitle: 'Create demonstrable proof',
    description: 'Collaborate on semester-long engineering projects, author forensic tooling, build SIEM parsers, or publish open-source security code.',
    action: 'Ship Term-Long Project'
  },
  {
    step: '07',
    title: 'SHARE',
    subtitle: 'Students teaching students',
    description: 'Lead a peer-to-peer technical session, publish a research writeup, or coordinate campus-wide scam awareness drives.',
    action: 'Deliver Peer Workshop'
  },
  {
    step: '08',
    title: 'LEAD',
    subtitle: 'Executive stewardship',
    description: 'Step into domain leadership, mentor freshman cohorts, represent the university in national CTFs, and shape club legacy.',
    action: 'Assume Guild or Executive Role'
  }
];
