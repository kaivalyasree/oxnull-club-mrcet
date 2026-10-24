export interface ExploreTask {
  id: string;
  title: string;
  category: string;
  estimatedTime: string;
  deadline?: string;
  instructions: string[];
  deliverableLabel: string;
  starterPrompt: string;
}

export interface ExploreModule {
  id: string;
  slug: string;
  number: string;
  title: string;
  subtitle: string;
  badge: string;
  overview: string;
  description: string;
  competencies: string[];
  tasks: ExploreTask[];
}

export const EXPLORE_MODULES: ExploreModule[] = [
  {
    id: 'communication',
    slug: 'communication',
    number: '01',
    title: 'Communication',
    subtitle: 'Written articulation, keynote presentations, cross-team coordination, and structured feedback.',
    badge: 'Executive Influence',
    overview:
      'Cybersecurity failures in the real world are overwhelmingly communication failures. Technical experts must translate intricate vulnerabilities into persuasive executive narratives, lead open team debates, compose clear incident advisories, and foster collaborative transparency.',
    description:
      'Cultivate the ability to communicate with precision, confidence, and empathy across diverse collegiate and professional audiences.',
    competencies: [
      'Translating technical risk into executive language',
      'Keynote slide architecture and vocal projection',
      'Composing university-wide incident and event notices',
      'Conducting constructive peer code and document reviews',
      'Managing difficult conversations and team alignment'
    ],
    tasks: [
      {
        id: 'task-comm-1',
        title: 'Executive Advisory Memo Translation',
        category: 'Written Communication',
        estimatedTime: '45 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Select a real-world cybersecurity risk (e.g., credential reuse, phishing lures, or cloud misconfiguration).',
          'Draft a 1-page executive memorandum addressed to the University Academic Senate.',
          'State the business impact, risk quantification, and actionable next steps without using unnecessary acronyms or jargon.',
          'Review against the executive clarity rubric: Is it actionable within 3 minutes of reading?'
        ],
        deliverableLabel: 'Executive Memorandum Text or Document Link',
        starterPrompt: 'Memo: To University Academic Leadership — Mitigation of Campus Credential Spray Vectors...'
      },
      {
        id: 'task-comm-2',
        title: '5-Minute Keynote Presentation Outline',
        category: 'Public Speaking & Presentations',
        estimatedTime: '60 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Design a 5-slide deck structure for a club general body meeting lightning talk.',
          'Structure your narrative arc: The Hook (0:00-1:00), The Friction (1:00-2:30), The Solution (2:30-4:00), and The Call to Action (4:00-5:00).',
          'Document speaker notes for each slide focusing on audience eye contact and vocal inflection.'
        ],
        deliverableLabel: 'Lightning Talk Slide Outline & Speaker Notes',
        starterPrompt: 'Slide 1 (Hook): Why 90% of Breaches Still Start with Human Trust...'
      },
      {
        id: 'task-comm-3',
        title: 'Campus Cybersecurity Week Announcement',
        category: 'Event Announcements & Content Preparation',
        estimatedTime: '30 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Draft an engaging announcement email to all MRCET freshmen announcing 0XNULL Cyber Hygiene Week.',
          'Include essential logistics: date, venue, benefits, registration link placeholder, and FAQs.',
          'Keep tone welcoming, professional, and accessible to non-technical students.'
        ],
        deliverableLabel: 'Announcement Draft Copy',
        starterPrompt: 'Subject: Protect Your Digital Identity — 0XNULL Invites MRCET Students to Cyber Hygiene Week'
      }
    ]
  },
  {
    id: 'pr',
    slug: 'pr',
    number: '02',
    title: 'Public Relations (PR)',
    subtitle: 'Event promotion, media narratives, outreach partnerships, and multi-channel campaign strategy.',
    badge: 'Campus & Industry Outreach',
    overview:
      'The PR guild steers 0XNULL’s public voice. From managing institutional press releases and university social media campaigns to forging industry sponsorships, PR practitioners amplify club achievements and ensure club initiatives draw maximum engagement.',
    description:
      'Lead campaign strategy, brand continuity, social storytelling, and external stakeholder relationships.',
    competencies: [
      'Omnichannel social media campaign planning (LinkedIn, Instagram, WhatsApp)',
      'Drafting official club releases and press statements',
      'Corporate sponsorship pitch decks and partnership proposals',
      'Promotional graphic briefing and visual brand guardianship',
      'Analyzing community engagement metrics'
    ],
    tasks: [
      {
        id: 'task-pr-1',
        title: 'Flagship Event 14-Day Social Campaign Calendar',
        category: 'Social-Media Content Planning',
        estimatedTime: '60 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Build a 14-day promotional schedule for the upcoming 0XNULL Annual Collegiate CTF.',
          'Draft 3 distinct post copies: Teaser Post (Day -14), Speaker/Sponsor Highlight (Day -7), and Last-Chance Registration Push (Day -2).',
          'Define appropriate tone, call to actions, and hashtag groupings (#0XNULL #MRCETCyber #CaptureTheFlag).'
        ],
        deliverableLabel: 'Campaign Calendar & Multi-Platform Post Copies',
        starterPrompt: 'Post 1 (Teaser): 48 Hours. 10 Challenges. 1 Champion. 0XNULL Collegiate CTF is officially back...'
      },
      {
        id: 'task-pr-2',
        title: 'Corporate Partnership & Sponsorship Proposal',
        category: 'Outreach and Partnerships',
        estimatedTime: '90 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Draft a 1-page corporate partnership pitch letter to a regional cybersecurity enterprise.',
          'Highlight club demographic metrics: student reach, technical domain focus, and mutual branding opportunities.',
          'Clearly articulate tier options: Silver Supporter, Gold Challenge Sponsor, and Keynote Partner.'
        ],
        deliverableLabel: 'Partnership Letter & Value Proposition',
        starterPrompt: 'Dear Director of Talent & Security Relations — Invitation to Partner with 0XNULL MRCET...'
      },
      {
        id: 'task-pr-3',
        title: 'Post-Event Impact & Achievement Press Release',
        category: 'Club Announcements & Promotional Writing',
        estimatedTime: '45 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Draft an official club press release celebrating completion of a major symposium.',
          'Include quotes from the faculty advisor, student president, and high-impact attendance metrics.',
          'Format in traditional AP press release styling (FOR IMMEDIATE RELEASE).'
        ],
        deliverableLabel: 'Official Press Release Text',
        starterPrompt: 'FOR IMMEDIATE RELEASE: 0XNULL Cybersecurity Club Concludes Flagship Hackathon with Record Participation...'
      }
    ]
  },
  {
    id: 'networking',
    slug: 'networking',
    number: '03',
    title: 'Networking',
    subtitle: 'Professional introductions, alumni mentorship bridges, conference participation, and relationship capital.',
    badge: 'Relationship Capital',
    overview:
      'Technical proficiency opens doors, but professional relationships build enduring careers. The Networking module develops high-conviction interpersonal introductions, conference etiquette, alumni reconnects, and post-engagement follow-up habits that turn casual meetings into lifelong career alliances.',
    description:
      'Master professional presence, thoughtful correspondence, mentorship outreach, and active collegiate networking.',
    competencies: [
      'High-impact 60-second elevator introductions',
      'LinkedIn profile positioning and portfolio presentation',
      'Alumni relation cultivating and practitioner fireside chats',
      'Conference & symposium networking strategies',
      'Strategic follow-up correspondence and cadence'
    ],
    tasks: [
      {
        id: 'task-net-1',
        title: 'Personal 60-Second Professional Elevator Pitch',
        category: 'Professional Introductions',
        estimatedTime: '30 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Draft a concise 60-second spoken elevator introduction for career fairs and industry mixers.',
          'Address: Who you are, your core cybersecurity domain passion (e.g. Forensics or Cloud Security), notable practical projects, and what you seek to learn.',
          'Avoid sounding rehearsed; write in natural spoken cadence.'
        ],
        deliverableLabel: 'Spoken Pitch Script',
        starterPrompt: 'Hello! My name is [Name], and I specialize in digital forensics and defensive telemetry at 0XNULL MRCET...'
      },
      {
        id: 'task-net-2',
        title: 'Alumni Practitioner Mentorship Outreach Email',
        category: 'Alumni and Industry Connections',
        estimatedTime: '45 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Identify a target cybersecurity career role (e.g. SOC Analyst, Penetration Tester, Incident Responder).',
          'Draft a personalized outreach message to a university alumnus working in that role.',
          'Express genuine appreciation for their path, reference their work, and request a brief 15-minute informational interview.'
        ],
        deliverableLabel: 'Mentorship Outreach Message Draft',
        starterPrompt: 'Subject: MRCET Cybersecurity Student Seeking Career Insights — Informational Interview Request'
      },
      {
        id: 'task-net-3',
        title: 'Post-Conference Connection & Follow-Up Protocol',
        category: 'Follow-Up Messages & Relationship Building',
        estimatedTime: '30 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Draft a personalized LinkedIn connection note and email follow-up for an industry speaker after attending their technical workshop.',
          'Reference a specific insight or question from their talk to establish authentic memory recall.',
          'Keep the message value-oriented without asking for immediate favors.'
        ],
        deliverableLabel: 'Follow-Up Communication Template',
        starterPrompt: 'Dear [Speaker Name], thank you for sharing your perspectives on memory analysis during yesterday’s session...'
      }
    ]
  },
  {
    id: 'leadership-collaboration',
    slug: 'leadership-collaboration',
    number: '04',
    title: 'Leadership and Collaboration',
    subtitle: 'Team coordination, delegation frameworks, meeting facilitation, and consensus problem-solving.',
    badge: 'Team Synergy & Governance',
    overview:
      'Cyber defense is a team discipline. No individual defender can monitor enterprise telemetry alone. The Leadership and Collaboration guild instructs members on structured delegation, RACI responsibility matrices, meeting stewardship, and resolving complex team tensions during high-pressure events.',
    description:
      'Develop empathetic, organized leadership capabilities to guide cross-functional cohorts toward collective excellence.',
    competencies: [
      'Agile team standups and milestone tracking',
      'RACI responsibility assignment and transparent delegation',
      'Structured meeting agendas, timekeeping, and minutes',
      'Conflict de-escalation and consensus-building',
      'Fostering psychological safety and peer mentorship'
    ],
    tasks: [
      {
        id: 'task-lead-1',
        title: 'Sprint Planning Agenda & Working Group Minutes',
        category: 'Meeting Planning & Team Coordination',
        estimatedTime: '45 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Create a 45-minute working group meeting agenda for a team engineering a collaborative CTF challenge.',
          'Define timeline blocks: Goal review (5m), Blocker triage (15m), Deliverable commitments (20m), Action item recap (5m).',
          'Include a standardized meeting minutes format capturing decisions made and assignee owners.'
        ],
        deliverableLabel: 'Meeting Agenda & Action Minutes Template',
        starterPrompt: '0XNULL Engineering Guild — Sprint 4 Agenda & Action Minutes...'
      },
      {
        id: 'task-lead-2',
        title: 'Multi-Role Event RACI Matrix Formulation',
        category: 'Delegation & Responsibilities',
        estimatedTime: '60 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Formulate a complete RACI matrix (Responsible, Accountable, Consulted, Informed) for orchestrating a collegiate hackathon.',
          'Cover key milestones: Venue booking, Sponsor outreach, AV/Network setup, Food catering, and Registration desk.',
          'Ensure exactly one Accountable lead is assigned per milestone.'
        ],
        deliverableLabel: 'RACI Governance Matrix (Markdown Table)',
        starterPrompt: '| Milestone / Task | Responsible (R) | Accountable (A) | Consulted (C) | Informed (I) |\n|---|---|---|---|---|'
      },
      {
        id: 'task-lead-3',
        title: 'Peer Conflict Resolution & Team Consensus Case Study',
        category: 'Collaborative Problem-Solving',
        estimatedTime: '45 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Analyze a realistic team dispute: Two student leads disagree on whether to prioritize challenge difficulty vs beginner accessibility for an upcoming club scrimmage.',
          'Write a structured compromise proposal that preserves team morale, adheres to 0XNULL values, and achieves both objectives.'
        ],
        deliverableLabel: 'Conflict Resolution Briefing',
        starterPrompt: 'Resolution Proposal: Tiered Challenge Architecture Balancing Novice Onboarding and Senior CTF Scrimmage...'
      }
    ]
  },
  {
    id: 'planning-event-ops',
    slug: 'planning-event-ops',
    number: '05',
    title: 'Planning and Event Operations',
    subtitle: 'Task planning, operational timelines, contingency checklists, and volunteer orchestration.',
    badge: 'Operational Logistics',
    overview:
      'Seamless events appear effortless only because operational planners obsess over every logistical detail. From physical lab classroom allocations and high-bandwidth network drops to volunteer shift rosters and emergency contingency protocols, Operations ensures 0XNULL runs with military precision.',
    description:
      'Engineer reliable checklists, venue timelines, volunteer rosters, and risk contingency playbooks.',
    competencies: [
      'Day-of-event minute-by-minute operational run of show',
      'Logistics resource checklists and technical inventory auditing',
      'Volunteer recruitment, shift scheduling, and briefing',
      'Emergency contingency and fallback planning',
      'Post-event feedback auditing and retrospective reviews'
    ],
    tasks: [
      {
        id: 'task-ops-1',
        title: 'Comprehensive Event Run-of-Show Protocol',
        category: 'Scheduling & Task Planning',
        estimatedTime: '60 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Design an exact minute-by-minute operational schedule for a 4-hour weekend cybersecurity workshop.',
          'Detail: 08:00 AM Venue Access & Lab Network Verification, 08:30 AM Volunteer Stationing, 09:00 AM Attendee Check-In, 09:30 AM Keynote, 10:30 AM Hands-on Labs, 12:30 PM Wrap-Up & Cleanup.',
          'Highlight contingency buffers for unexpected AV failures or speaker delays.'
        ],
        deliverableLabel: 'Run-of-Show Schedule & Contingency Buffer Plan',
        starterPrompt: 'Event: Hands-on Packet Analysis Workshop | Operational Run of Show (08:00 - 13:00)...'
      },
      {
        id: 'task-ops-2',
        title: 'Volunteer Roster & Station Assignment Protocol',
        category: 'Coordinating Volunteers & Tracking Responsibilities',
        estimatedTime: '45 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Build a volunteer deployment roster for 12 student volunteers across 4 operational zones: Registration Desk, Technical Floor Support, Speaker Hospitality, and Media / Photography.',
          'Specify briefing time, primary duty instructions, relief schedule, and emergency escalation contact points.'
        ],
        deliverableLabel: 'Volunteer Station Assignment Roster',
        starterPrompt: 'Volunteer Operations Deployment: 0XNULL Symposium 2026...'
      },
      {
        id: 'task-ops-3',
        title: 'Post-Event Logistical Retrospective debrief',
        category: 'Event Checklists & Continuous Improvement',
        estimatedTime: '40 mins',
        deadline: 'Starter Activity',
        instructions: [
          'Develop a standardized 10-question post-event operational retrospective template for the club executive team.',
          'Categorize questions: What worked exceptionally? What logistical delays occurred? Was hardware sufficient? What must change for next semester?',
          'Include a numerical scoring rubric for venue, attendance, and technical stability.'
        ],
        deliverableLabel: 'Operational Retrospective Template',
        starterPrompt: '0XNULL Event Operations: Post-Mortem & Retrospective Debrief Template...'
      }
    ]
  }
];

export function getExploreModuleBySlug(slug: string): ExploreModule | undefined {
  return EXPLORE_MODULES.find((m) => m.slug === slug || m.id === slug);
}
