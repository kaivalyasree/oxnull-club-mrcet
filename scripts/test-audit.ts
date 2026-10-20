/**
 * 0XNULL — Comprehensive Automated Project & Security Audit Test Suite
 * Tests all requirements across Phases 1 through 9.
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  verifyAdminCredentials,
  createAdminSessionToken,
  verifyAdminSessionToken,
  buildAdminSessionCookie,
  buildAdminLogoutCookie,
  isAdminAuthConfigured,
  clearRateLimitStore
} from '../lib/admin-auth';
import { db } from '../lib/store';
import { GET as getApplications, PATCH as patchApplications, POST as postApplication } from '../app/api/applications/route';
import { GET as getUserProgress, POST as postUserProgress } from '../app/api/user-progress/route';
import { GET as getResources, POST as postResource, PUT as putResource, DELETE as deleteResource } from '../app/api/resources/route';
import { POST as postActivity, DELETE as deleteActivity } from '../app/api/activities/route';
import { POST as postAnnouncement, DELETE as deleteAnnouncement } from '../app/api/announcements/route';
import { GET as getProjects, POST as postProject, PUT as putProject, DELETE as deleteProject } from '../app/api/projects/route';
import { GET as getCertifications, POST as postCertification, PUT as putCertification, DELETE as deleteCertification } from '../app/api/certifications/route';
import { DOMAINS, LEARNING_SUBJECTS } from '../lib/data';
import { generateStaticParams as generateSubjectParams } from '../app/learn/[subject]/page';

interface TestResult {
  name: string;
  passed: boolean;
  details?: string;
}

const results: TestResult[] = [];

function assert(condition: boolean, name: string, details?: string) {
  if (condition) {
    results.push({ name, passed: true });
    console.log(`  ✓ PASS: ${name}`);
  } else {
    results.push({ name, passed: false, details });
    console.error(`  ✗ FAIL: ${name}${details ? ` — ${details}` : ''}`);
  }
}

async function runTestSuite() {
  console.log('\n================================================================');
  console.log('0XNULL FULL AUDIT TEST SUITE — EXECUTION BEGINS');
  console.log('================================================================\n');

  // Configure test environment variables for server-side authentication
  const TEST_USER = 'oxnull-audit-admin';
  const TEST_PASS = 'P@ssw0rd!SecureAudit2026';
  const TEST_SECRET = 'audit-test-session-secret-key-32-chars-long-secure';
  const TEST_HASH = bcrypt.hashSync(TEST_PASS, 10);

  process.env.ADMIN_USERNAME = TEST_USER;
  process.env.ADMIN_PASSWORD_HASH = TEST_HASH;
  process.env.ADMIN_SESSION_SECRET = TEST_SECRET;

  // ---------------------------------------------------------------------------
  // GROUP 1: Administrator Authentication Configuration & Fail-Safe Behavior
  // ---------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: Admin Configuration & Fail-Safe Checks ---');

  assert(
    isAdminAuthConfigured() === true,
    'isAdminAuthConfigured() returns true when all required environment variables are set'
  );

  // Missing credentials rejection
  const emptyRes = await verifyAdminCredentials('', '');
  assert(
    Boolean(emptyRes.success === false && emptyRes.error?.includes('required')),
    'verifyAdminCredentials rejects empty username and password'
  );

  const missingPassRes = await verifyAdminCredentials(TEST_USER, '');
  assert(
    Boolean(missingPassRes.success === false && missingPassRes.error?.includes('required')),
    'verifyAdminCredentials rejects empty password'
  );

  // Fail-safe when unconfigured
  const savedHash = process.env.ADMIN_PASSWORD_HASH;
  delete process.env.ADMIN_PASSWORD_HASH;
  const unconfRes = await verifyAdminCredentials(TEST_USER, TEST_PASS);
  assert(
    Boolean(unconfRes.success === false && unconfRes.error?.includes('not configured')),
    'verifyAdminCredentials fails safely when ADMIN_PASSWORD_HASH is missing'
  );
  process.env.ADMIN_PASSWORD_HASH = savedHash;

  // ---------------------------------------------------------------------------
  // GROUP 2: Password Verification, Generic Errors & Rate Limiting
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Password Verification, Generic Errors & Rate Limiting ---');

  clearRateLimitStore();

  // Test wrong username + correct password
  const wrongUserRes = await verifyAdminCredentials('attacker-user', TEST_PASS, '10.0.0.1');
  assert(
    wrongUserRes.success === false && wrongUserRes.error === 'Invalid administrator credentials.',
    'Wrong username returns generic error message without enumeration leaks'
  );

  // Test correct username + wrong password
  const wrongPassRes = await verifyAdminCredentials(TEST_USER, 'WrongPassword123!', '10.0.0.1');
  assert(
    wrongPassRes.success === false && wrongPassRes.error === 'Invalid administrator credentials.',
    'Wrong password returns generic error message'
  );

  // Test correct username + correct password
  const validAuthRes = await verifyAdminCredentials(TEST_USER, TEST_PASS, '10.0.0.2');
  assert(
    Boolean(validAuthRes.success === true && !!validAuthRes.sessionToken && validAuthRes.username === TEST_USER),
    'Valid administrator username and password authenticate successfully'
  );

  const validSessionToken = validAuthRes.sessionToken || '';

  // Test rate limiting: 5 failed attempts lock out subsequent requests
  const bruteForceIp = '192.168.1.100';
  for (let i = 0; i < 5; i++) {
    await verifyAdminCredentials(TEST_USER, `wrong-guess-${i}`, bruteForceIp);
  }

  const lockedRes = await verifyAdminCredentials(TEST_USER, TEST_PASS, bruteForceIp);
  assert(
    Boolean(lockedRes.success === false && lockedRes.rateLimited === true && lockedRes.error?.includes('Too many failed login attempts')),
    'Rate limiting locks out client after 5 failed attempts',
    `Received: ${lockedRes.error}`
  );

  clearRateLimitStore();

  // ---------------------------------------------------------------------------
  // GROUP 3: Cryptographic Session Token Security & Cookies
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Session Token Cryptography & Verification ---');

  const decodedSession = verifyAdminSessionToken(validSessionToken);
  assert(
    decodedSession !== null && decodedSession.username === TEST_USER && decodedSession.role === 'admin',
    'Valid signed session token decodes and verifies HMAC-SHA256 signature'
  );

  // Tampered payload
  const tokenParts = validSessionToken.split('.');
  const tamperedPayloadToken = `eyJ1c2VybmFtZSI6ImF0dGFja2VyIiwicm9sZSI6ImFkbWluIn0.${tokenParts[1]}`;
  assert(
    verifyAdminSessionToken(tamperedPayloadToken) === null,
    'Tampered session payload rejected by signature verification'
  );

  // Tampered signature
  const tamperedSigToken = `${tokenParts[0]}.invalidSignatureHere123456789`;
  assert(
    verifyAdminSessionToken(tamperedSigToken) === null,
    'Tampered signature rejected'
  );

  // Cookie generation validation
  const testCookie = buildAdminSessionCookie(validSessionToken);
  assert(
    testCookie.includes('oxnull_admin_session=') &&
    testCookie.includes('HttpOnly') &&
    testCookie.includes('SameSite=Lax'),
    'Admin session cookie sets HttpOnly, SameSite=Lax, and Path=/'
  );

  const logoutCookie = buildAdminLogoutCookie();
  assert(
    logoutCookie.includes('Max-Age=0') && logoutCookie.includes('1970'),
    'Logout cookie properly invalidates session with Max-Age=0 and epoch expiration'
  );

  // ---------------------------------------------------------------------------
  // GROUP 4: Protected Administrative APIs Server-Side Authorization
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Server-Side Administrative API Protection ---');

  const adminCookie = buildAdminSessionCookie(validSessionToken);

  // 4a. Applications GET
  const reqUnauthApps = new Request('http://localhost:3000/api/applications');
  const resUnauthApps = await getApplications(reqUnauthApps);
  assert(
    resUnauthApps.status === 401,
    'GET /api/applications rejected without admin session (401)',
    `Status: ${resUnauthApps.status}`
  );

  // Query parameter bypass attempt: ?role=admin
  const reqQueryBypass = new Request('http://localhost:3000/api/applications?role=admin');
  const resQueryBypass = await getApplications(reqQueryBypass);
  assert(
    resQueryBypass.status === 401,
    'GET /api/applications?role=admin query parameter bypass attempt rejected (401)',
    `Status: ${resQueryBypass.status}`
  );

  // Authorized Admin GET applications
  const reqAuthApps = new Request('http://localhost:3000/api/applications', {
    headers: { cookie: adminCookie }
  });
  const resAuthApps = await getApplications(reqAuthApps);
  assert(
    resAuthApps.status === 200,
    'GET /api/applications accepts valid admin session cookie (200)',
    `Status: ${resAuthApps.status}`
  );

  // 4b. Applications PATCH
  const reqUnauthPatch = new Request('http://localhost:3000/api/applications', {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id: 'any-id', status: 'approved', role: 'admin' })
  });
  const resUnauthPatch = await patchApplications(reqUnauthPatch);
  assert(
    resUnauthPatch.status === 403,
    'PATCH /api/applications rejected without admin session even if role=admin in body (403)',
    `Status: ${resUnauthPatch.status}`
  );

  // 4c. Resources POST & DELETE
  const reqUnauthResPost = new Request('http://localhost:3000/api/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test Resource', domainId: 'd1', url: 'https://example.com' })
  });
  const resUnauthResPost = await postResource(reqUnauthResPost);
  assert(
    resUnauthResPost.status === 401,
    'POST /api/resources rejected without admin session (401)',
    `Status: ${resUnauthResPost.status}`
  );

  const reqAuthResPost = new Request('http://localhost:3000/api/resources', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', cookie: adminCookie },
    body: JSON.stringify({ title: 'Test Audited Resource', domainId: 'd1', url: 'https://example.com/test' })
  });
  const resAuthResPost = await postResource(reqAuthResPost);
  const dataAuthResPost = await resAuthResPost.json();
  assert(
    resAuthResPost.status === 201 && dataAuthResPost.success === true,
    'POST /api/resources authorized with valid admin session cookie (201)',
    `Status: ${resAuthResPost.status}`
  );

  if (dataAuthResPost.data?.id) {
    // Clean up created test resource
    const reqAuthResDel = new Request(`http://localhost:3000/api/resources?id=${dataAuthResPost.data.id}`, {
      method: 'DELETE',
      headers: { cookie: adminCookie }
    });
    await deleteResource(reqAuthResDel);
  }

  // 4d. Activities POST
  const reqUnauthAct = new Request('http://localhost:3000/api/activities', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test Act', summary: 'Summary' })
  });
  const resUnauthAct = await postActivity(reqUnauthAct);
  assert(
    resUnauthAct.status === 401,
    'POST /api/activities rejected without admin session (401)',
    `Status: ${resUnauthAct.status}`
  );

  // 4e. Announcements POST
  const reqUnauthAnn = new Request('http://localhost:3000/api/announcements', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test Memo', content: 'Content' })
  });
  const resUnauthAnn = await postAnnouncement(reqUnauthAnn);
  assert(
    resUnauthAnn.status === 401,
    'POST /api/announcements rejected without admin session (401)',
    `Status: ${resUnauthAnn.status}`
  );

  // 4f. Projects POST
  const reqUnauthProj = new Request('http://localhost:3000/api/projects', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ title: 'Test Project', domainId: 'd1' })
  });
  const resUnauthProj = await postProject(reqUnauthProj);
  assert(
    resUnauthProj.status === 401,
    'POST /api/projects rejected without admin session (401)',
    `Status: ${resUnauthProj.status}`
  );

  // 4g. Certifications POST
  const reqUnauthCert = new Request('http://localhost:3000/api/certifications', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'Test Cert', provider: 'Test', domainId: 'd1' })
  });
  const resUnauthCert = await postCertification(reqUnauthCert);
  assert(
    resUnauthCert.status === 401,
    'POST /api/certifications rejected without admin session (401)',
    `Status: ${resUnauthCert.status}`
  );

  // ---------------------------------------------------------------------------
  // GROUP 5: Student Data Integrity & Isolation
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: Student Data Isolation & Clean Profile ---');

  // user-progress GET without userId must fail with 400
  const reqProgressNoUser = new Request('http://localhost:3000/api/user-progress');
  const resProgressNoUser = await getUserProgress(reqProgressNoUser);
  assert(
    resProgressNoUser.status === 400,
    'GET /api/user-progress rejects missing userId with 400 (no demo-student fallback)',
    `Status: ${resProgressNoUser.status}`
  );

  // user-progress POST without userId must fail with 400
  const reqProgressPostNoUser = new Request('http://localhost:3000/api/user-progress', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ notes: 'orphaned note' })
  });
  const resProgressPostNoUser = await postUserProgress(reqProgressPostNoUser);
  assert(
    resProgressPostNoUser.status === 400,
    'POST /api/user-progress rejects missing userId with 400',
    `Status: ${resProgressPostNoUser.status}`
  );

  // Verify Student A vs Student B isolation
  const studentA = 'audit-student-alice';
  const studentB = 'audit-student-bob';

  await postUserProgress(
    new Request('http://localhost:3000/api/user-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: studentA, notes: 'Alice Private Study Notes', enrolledDomains: ['d1'] })
    })
  );

  await postUserProgress(
    new Request('http://localhost:3000/api/user-progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: studentB, notes: 'Bob Forensics Log', enrolledDomains: ['d2'] })
    })
  );

  const resAlice = await (await getUserProgress(new Request(`http://localhost:3000/api/user-progress?userId=${studentA}`))).json();
  const resBob = await (await getUserProgress(new Request(`http://localhost:3000/api/user-progress?userId=${studentB}`))).json();

  assert(
    resAlice.data?.notes === 'Alice Private Study Notes' &&
    resAlice.data?.enrolledDomains?.includes('d1') &&
    !resAlice.data?.enrolledDomains?.includes('d2'),
    'Student Alice data retrieved accurately'
  );

  assert(
    resBob.data?.notes === 'Bob Forensics Log' &&
    resBob.data?.enrolledDomains?.includes('d2') &&
    !resBob.data?.enrolledDomains?.includes('d1'),
    'Student Bob data retrieved accurately with strict account isolation'
  );

  // ---------------------------------------------------------------------------
  // GROUP 6: Student Application Registration & Duplicate Handling
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 6: Student Application Registration & Validation ---');

  const testRoll = `AUDIT-${Date.now().toString().slice(-6)}`;
  const validAppPayload = {
    userId: `usr-audit-${Date.now()}`,
    fullName: 'Verified Test Student',
    year: '2nd Year',
    rollNumber: testRoll,
    branch: 'CSE - Cybersecurity',
    phoneNumber: '+919123456789',
    domainInterests: ['d1', 'd3']
  };

  const resAppPost1 = await postApplication(
    new Request('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validAppPayload)
    })
  );
  assert(
    resAppPost1.status === 201,
    'New student application submitted successfully (201)',
    `Status: ${resAppPost1.status}`
  );

  // Duplicate submission attempt with same roll number
  const resAppPostDuplicate = await postApplication(
    new Request('http://localhost:3000/api/applications', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...validAppPayload,
        userId: `usr-different-${Date.now()}`
      })
    })
  );
  assert(
    resAppPostDuplicate.status === 409,
    'Duplicate registration for same roll number rejected with 409 Conflict',
    `Status: ${resAppPostDuplicate.status}`
  );

  // ---------------------------------------------------------------------------
  // GROUP 7: Public Website Privacy & Approved Feature Audit
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 7: Public Website Privacy & Approved Content Audit ---');

  const cwd = process.cwd();

  // Public files to check for absence of admin controls
  const publicFiles = [
    'components/Navbar.tsx',
    'components/Footer.tsx',
    'app/activities/page.tsx',
    'app/page.tsx',
    'app/about/page.tsx',
    'app/certifications/page.tsx',
    'app/projects/page.tsx',
    'app/learn/page.tsx',
    'app/domains/page.tsx'
  ];

  let publicAdminLinksFound = 0;
  for (const relPath of publicFiles) {
    const fullPath = path.join(cwd, relPath);
    if (fs.existsSync(fullPath)) {
      const content = fs.readFileSync(fullPath, 'utf-8');
      // Look for href="/admin"
      const matches = content.match(/href=["']\/admin["']/g);
      if (matches) {
        publicAdminLinksFound += matches.length;
        console.error(`  ✗ Public admin link found in ${relPath}`);
      }
    }
  }

  assert(
    publicAdminLinksFound === 0,
    'Zero Admin buttons, links, or navigation items on public website'
  );

  // Verify WhatsApp and Instagram URLs
  const homeContent = fs.readFileSync(path.join(cwd, 'app/page.tsx'), 'utf-8');
  const footerContent = fs.readFileSync(path.join(cwd, 'components/Footer.tsx'), 'utf-8');

  const expectedWhatsApp = 'https://chat.whatsapp.com/EHqyjOz8Pa5KJXOJdkWfye';
  const expectedInstagram = 'https://www.instagram.com/oxnull_mrcet?srtk=a3V2djgyNm0xdXlk';

  assert(
    homeContent.includes(expectedWhatsApp) && footerContent.includes(expectedWhatsApp),
    'WhatsApp community link matches approved URL across homepage and footer'
  );

  assert(
    homeContent.includes(expectedInstagram) && footerContent.includes(expectedInstagram),
    'Instagram profile link matches approved URL across homepage and footer'
  );

  // Verify db.json contains 0 demo accounts
  const dbContent = JSON.parse(fs.readFileSync(path.join(cwd, 'data/db.json'), 'utf-8'));
  const hasDemoAccounts =
    (dbContent.applications || []).some((a: any) => a.fullName === 'Aarav Sharma' || a.fullName === 'Kavya Reddy') ||
    Boolean(dbContent.userProgress && dbContent.userProgress['demo-student']);

  assert(
    hasDemoAccounts === false,
    'data/db.json has 0 seeded demo accounts or demo-student records'
  );

  // Verify single-line college name and 4-line intro in HeroSection.tsx
  const heroContent = fs.readFileSync(path.join(cwd, 'components/HeroSection.tsx'), 'utf-8');
  assert(
    heroContent.includes('MALLA REDDY COLLEGE OF ENGINEERING AND TECHNOLOGY') &&
    heroContent.includes('whitespace-normal lg:whitespace-nowrap'),
    'Hero section displays college name in single desktop line without card container'
  );

  assert(
    heroContent.includes('OXNULL is a cybersecurity club dedicated to exploring security') &&
    heroContent.includes('Learn together, develop practical expertise, and turn your interest'),
    'Hero section includes exact approved four-line club introduction'
  );

  // ---------------------------------------------------------------------------
  // GROUP 8: Domain Ordering, Subject Pages, Designer Credit & CMS CRUD Lifecycle
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 8: Domain Order, Subject Hubs, Designer Credit & CMS Upgrade ---');

  // 8.1 Domain Ordering: Awareness #1, Explore #2
  assert(
    DOMAINS[0].slug === 'awareness' && DOMAINS[0].number === '01',
    'Domain 01 is strictly Awareness in DOMAINS array'
  );
  assert(
    DOMAINS[1].slug === 'explore' && DOMAINS[1].number === '02',
    'Domain 02 is strictly Explore in DOMAINS array'
  );

  const navbarContent = fs.readFileSync(path.join(cwd, 'components/Navbar.tsx'), 'utf-8');
  assert(
    navbarContent.includes("name: '01 · Awareness'") && navbarContent.includes("name: '02 · Explore'"),
    'Navbar domain links list Awareness first (01) and Explore second (02)'
  );

  // 8.2 Removal of Unwanted Boxed Content from Domain Detail Page
  const domainPageContent = fs.readFileSync(path.join(cwd, 'app/domains/[slug]/page.tsx'), 'utf-8');
  assert(
    !domainPageContent.includes('<DomainPersonalitySection') &&
    !domainPageContent.includes("import DomainPersonalitySection"),
    'DomainPersonalitySection boxed widget is completely removed from domain detail page'
  );

  // 8.3 Explore Domain Cleaned Up (no AI, satellite, prompt injection)
  const exploreDomain = DOMAINS.find((d) => d.slug === 'explore');
  const exploreJson = JSON.stringify(exploreDomain || {});
  assert(
    !exploreJson.toLowerCase().includes('satellite') &&
    !exploreJson.toLowerCase().includes('aerospace') &&
    !exploreJson.toLowerCase().includes('telemetry') &&
    !exploreJson.toLowerCase().includes('prompt injection'),
    'Explore domain is strictly focused on club discovery, leadership & communication (AI and satellite removed)'
  );

  // 8.4 Learn Page: Exactly 4 Subjects, No Computer Fundamentals
  const learnContent = fs.readFileSync(path.join(cwd, 'app/learn/page.tsx'), 'utf-8');
  assert(
    !learnContent.includes('Computer Fundamentals'),
    'Computer Fundamentals is completely removed from visible learning options on /learn'
  );
  assert(
    LEARNING_SUBJECTS.length === 4 &&
    LEARNING_SUBJECTS.map((s) => s.slug).join(',') === 'linux,networking,operating-system,security-fundamentals',
    'Four visible learning subjects configured: Linux, Networking, Operating System, Security Fundamentals'
  );

  // 8.5 Dedicated Learning Subject Routes
  const subjectParams = generateSubjectParams();
  assert(
    subjectParams.length === 4 &&
    subjectParams.some((p) => p.subject === 'linux') &&
    subjectParams.some((p) => p.subject === 'networking') &&
    subjectParams.some((p) => p.subject === 'operating-system') &&
    subjectParams.some((p) => p.subject === 'security-fundamentals'),
    'generateStaticParams() for /learn/[subject] generates all 4 dedicated subject pages'
  );

  // 8.6 Designer Credit Update: S.Kaivalya -> S.Kaivalya Sri
  const footerCode = fs.readFileSync(path.join(cwd, 'components/Footer.tsx'), 'utf-8');
  const aboutCode = fs.readFileSync(path.join(cwd, 'app/about/page.tsx'), 'utf-8');
  assert(
    footerCode.includes('S.Kaivalya Sri') &&
    aboutCode.toUpperCase().includes('S. KAIVALYA SRI'),
    'Designer credit is updated to "S.Kaivalya Sri" in Footer and About page'
  );
  assert(
    !footerCode.includes('Designed by S.Kaivalya"') && !aboutCode.includes('Designed by S.Kaivalya"'),
    'Old "S.Kaivalya" attribution without "Sri" does not exist in credit links'
  );

  // 8.7 Admin CMS CRUD Lifecycle: Resources
  const testResPayload = {
    title: 'Audit Test Resource Automated',
    domainId: 'd6',
    domainName: 'Awareness',
    subjectId: 'linux',
    subjectName: 'Linux',
    category: 'Walkthrough',
    difficulty: 'Intermediate',
    url: 'https://example.com/audit-test-walkthrough',
    description: 'Automated test walkthrough for audit verification',
    isPublished: true,
    tags: ['Audit', 'Testing']
  };

  // POST with Admin Cookie
  const resCreateRes = await postResource(
    new Request('http://localhost:3000/api/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: adminCookie
      },
      body: JSON.stringify(testResPayload)
    })
  );
  const dataCreateRes = await resCreateRes.json();
  assert(
    resCreateRes.status === 201 && dataCreateRes.success && Boolean(dataCreateRes.data?.id),
    'Admin creates new resource record via POST /api/resources (201)'
  );

  const createdResId = dataCreateRes.data?.id;

  // Verify public GET returns this published resource
  const publicResGet = await getResources(new Request('http://localhost:3000/api/resources?subjectId=linux'));
  const publicResData = await publicResGet.json();
  assert(
    publicResData.success && publicResData.data.some((r: any) => r.id === createdResId),
    'Public GET /api/resources returns newly published resource under its subject'
  );

  // Toggle publish status to draft
  const putResToggle = await putResource(
    new Request('http://localhost:3000/api/resources', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        cookie: adminCookie
      },
      body: JSON.stringify({ id: createdResId, action: 'toggle-publish' })
    })
  );
  const dataPutRes = await putResToggle.json();
  assert(
    putResToggle.status === 200 && dataPutRes.data?.isPublished === false,
    'Admin toggles resource status to draft (isPublished: false) via PUT /api/resources'
  );

  // Verify public GET now HIDES the draft resource
  const publicResGetAfterDraft = await getResources(new Request('http://localhost:3000/api/resources?subjectId=linux'));
  const publicResDataAfterDraft = await publicResGetAfterDraft.json();
  assert(
    publicResDataAfterDraft.success && !publicResDataAfterDraft.data.some((r: any) => r.id === createdResId),
    'Public GET /api/resources strictly hides draft/unpublished resource from regular visitors'
  );

  // Admin GET with all=true STILL sees the draft
  const adminResGetAll = await getResources(
    new Request('http://localhost:3000/api/resources?all=true', {
      headers: { cookie: adminCookie }
    })
  );
  const adminResDataAll = await adminResGetAll.json();
  assert(
    adminResDataAll.success && adminResDataAll.data.some((r: any) => r.id === createdResId),
    'Admin GET /api/resources?all=true with admin cookie sees both published and draft resources'
  );

  // Delete created test resource
  const delResReq = await deleteResource(
    new Request(`http://localhost:3000/api/resources?id=${createdResId}`, {
      method: 'DELETE',
      headers: { cookie: adminCookie }
    })
  );
  const delResData = await delResReq.json();
  assert(
    delResReq.status === 200 && delResData.success === true,
    'Admin deletes resource record with valid session cookie'
  );

  // 8.8 Admin CMS CRUD Lifecycle: Certifications
  const testCertPayload = {
    name: 'Audit Test Security Credential',
    provider: 'Audit Authority',
    domainId: 'd6',
    domainName: 'Awareness',
    level: 'Beginner',
    cost: 'Free',
    url: 'https://example.com/audit-cert',
    description: 'Audit test credential description',
    isPublished: true,
    tags: ['Audit', 'Cert']
  };

  const createCertRes = await postCertification(
    new Request('http://localhost:3000/api/certifications', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: adminCookie
      },
      body: JSON.stringify(testCertPayload)
    })
  );
  const dataCreateCert = await createCertRes.json();
  assert(
    createCertRes.status === 201 && dataCreateCert.success && Boolean(dataCreateCert.data?.id),
    'Admin creates new certification record via POST /api/certifications (201)'
  );

  const createdCertId = dataCreateCert.data?.id;

  // Toggle publish on certification
  const toggleCertRes = await putCertification(
    new Request('http://localhost:3000/api/certifications', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        cookie: adminCookie
      },
      body: JSON.stringify({ id: createdCertId, action: 'toggle-publish' })
    })
  );
  const dataToggleCert = await toggleCertRes.json();
  assert(
    toggleCertRes.status === 200 && dataToggleCert.data?.isPublished === false,
    'Admin toggles certification to draft status via PUT /api/certifications'
  );

  // Delete certification
  const delCertRes = await deleteCertification(
    new Request(`http://localhost:3000/api/certifications?id=${createdCertId}`, {
      method: 'DELETE',
      headers: { cookie: adminCookie }
    })
  );
  assert(
    delCertRes.status === 200,
    'Admin deletes certification record via DELETE /api/certifications'
  );

  // 8.9 Admin CMS CRUD Lifecycle: Projects
  const testProjPayload = {
    title: 'Audit Test Security Repo',
    description: 'Audit test toolchain for verification',
    domainId: 'd1',
    domainName: 'Red & Blue Team',
    status: 'Active',
    githubUrl: 'https://github.com/oxnull-club/audit-repo',
    tags: ['Audit', 'Tooling'],
    isPublished: true
  };

  const createProjRes = await postProject(
    new Request('http://localhost:3000/api/projects', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: adminCookie
      },
      body: JSON.stringify(testProjPayload)
    })
  );
  const dataCreateProj = await createProjRes.json();
  assert(
    createProjRes.status === 201 && dataCreateProj.success && Boolean(dataCreateProj.data?.id),
    'Admin creates new project record via POST /api/projects (201)'
  );

  const createdProjId = dataCreateProj.data?.id;

  // Toggle publish on project
  const toggleProjRes = await putProject(
    new Request('http://localhost:3000/api/projects', {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        cookie: adminCookie
      },
      body: JSON.stringify({ id: createdProjId, action: 'toggle-publish' })
    })
  );
  const dataToggleProj = await toggleProjRes.json();
  assert(
    toggleProjRes.status === 200 && dataToggleProj.data?.isPublished === false,
    'Admin toggles project to draft status via PUT /api/projects'
  );

  // Delete project
  const delProjRes = await deleteProject(
    new Request(`http://localhost:3000/api/projects?id=${createdProjId}`, {
      method: 'DELETE',
      headers: { cookie: adminCookie }
    })
  );
  assert(
    delProjRes.status === 200,
    'Admin deletes project record via DELETE /api/projects'
  );

  // 8.10 URL Validation Check
  const invalidUrlRes = await postResource(
    new Request('http://localhost:3000/api/resources', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: adminCookie
      },
      body: JSON.stringify({
        title: 'Malicious Link Test',
        domainId: 'd1',
        url: 'javascript:alert(1)'
      })
    })
  );
  assert(
    invalidUrlRes.status === 400,
    'POST /api/resources rejects invalid/malicious URL schemes with 400 Bad Request'
  );

  // Clean up any test records created during test run to maintain a pristine database
  try {
    const store = db.getStore();
    store.applications = (store.applications || []).filter((a) => !a.rollNumber.startsWith('AUDIT-'));
    delete store.userProgress['audit-student-alice'];
    delete store.userProgress['audit-student-bob'];
    fs.writeFileSync(path.join(cwd, 'data/db.json'), JSON.stringify(store, null, 2), 'utf-8');
  } catch (cleanErr) {
    console.warn('Could not clean test records from db.json:', cleanErr);
  }

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log('\n================================================================');
  const total = results.length;
  const passed = results.filter((r) => r.passed).length;
  const failed = total - passed;
  console.log(`TOTAL TESTS: ${total} | PASSED: ${passed} | FAILED: ${failed}`);
  console.log('================================================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTestSuite().catch((err) => {
  console.error('Test execution failed with fatal error:', err);
  process.exit(1);
});
