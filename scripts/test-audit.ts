/**
 * 0XNULL — Comprehensive Automated Project & Security Audit Test Suite
 * Tests all requirements across Phases 1 through 9.
 */

import fs from 'fs';
import path from 'path';
import {
  isAuthorizedAdminEmail,
  normalizeEmail,
  requestAdminOtp,
  verifyAdminOtp,
  createAdminSessionToken,
  verifyAdminSessionToken,
  buildAdminSessionCookie
} from '../lib/admin-auth';
import { db } from '../lib/store';
import { GET as getApplications, PATCH as patchApplications, POST as postApplication } from '../app/api/applications/route';
import { GET as getUserProgress, POST as postUserProgress } from '../app/api/user-progress/route';
import { POST as postResource, DELETE as deleteResource } from '../app/api/resources/route';
import { POST as postActivity, DELETE as deleteActivity } from '../app/api/activities/route';
import { POST as postAnnouncement, DELETE as deleteAnnouncement } from '../app/api/announcements/route';
import { POST as postProject } from '../app/api/projects/route';
import { POST as postCertification } from '../app/api/certifications/route';

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

  // ---------------------------------------------------------------------------
  // GROUP 1: Administrator Allowlist & Email Normalization
  // ---------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: Admin Allowlist & Email Normalization ---');

  assert(
    isAuthorizedAdminEmail('mvreddyinfosec@gmail.com') === true,
    'Allowlist accepts mvreddyinfosec@gmail.com'
  );

  assert(
    isAuthorizedAdminEmail('cyberwithak1@gmail.com') === true,
    'Allowlist accepts cyberwithak1@gmail.com'
  );

  assert(
    isAuthorizedAdminEmail('  MVREDDYINFOSEC@GMAIL.COM  ') === true,
    'Allowlist normalizes case and whitespace for mvreddyinfosec'
  );

  assert(
    isAuthorizedAdminEmail('CYBERWITHAK1@GMAIL.COM') === true,
    'Allowlist normalizes case for cyberwithak1'
  );

  assert(
    isAuthorizedAdminEmail('unauthorized@attacker.com') === false,
    'Allowlist rejects unauthorized address unauthorized@attacker.com'
  );

  assert(
    isAuthorizedAdminEmail('admin@mrcet.ac.in') === false,
    'Allowlist rejects legacy unverified address admin@mrcet.ac.in'
  );

  assert(
    normalizeEmail('  Test.User@Domain.COM  ') === 'test.user@domain.com',
    'normalizeEmail correctly handles casing and whitespace'
  );

  // ---------------------------------------------------------------------------
  // GROUP 2: OTP Generation, Rate Limiting & Verification Security
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: OTP Flow, Rate Limiting & Verification ---');

  // Test unauthorized address requesting OTP (must return neutral response, but no code created)
  const unauthRequest = await requestAdminOtp('attacker@fakecorp.org');
  assert(
    unauthRequest.success === true && unauthRequest.message.includes('If this email address is an authorized administrator'),
    'Unauthorized address receives neutral confirmation (anti-enumeration)',
    `Received: ${unauthRequest.message}`
  );

  const unauthVerify = await verifyAdminOtp('attacker@fakecorp.org', '123456');
  assert(
    unauthVerify.success === false && unauthVerify.message.includes('No active verification code found'),
    'Unauthorized address has no verification code generated',
    `Received: ${unauthVerify.message}`
  );

  // Test authorized address requesting OTP
  const authEmail = 'mvreddyinfosec@gmail.com';
  const otpRequest1 = await requestAdminOtp(authEmail);
  assert(
    otpRequest1.success === true && !!otpRequest1.testOtp,
    'Authorized address receives generated verification code in test mode',
    `testOtp present: ${!!otpRequest1.testOtp}`
  );

  const validOtp = otpRequest1.testOtp || '';

  // Test resend cooldown
  const otpRequestImmediate = await requestAdminOtp(authEmail);
  assert(
    otpRequestImmediate.success === false && otpRequestImmediate.rateLimited === true,
    'Resend cooldown enforced (immediate duplicate request rejected)',
    `Message: ${otpRequestImmediate.message}`
  );

  // Test incorrect OTP rejected
  const invalidOtpVerify = await verifyAdminOtp(authEmail, '000000');
  assert(
    invalidOtpVerify.success === false && typeof invalidOtpVerify.attemptsRemaining === 'number',
    'Incorrect OTP rejected with attempts remaining returned',
    `Remaining attempts: ${invalidOtpVerify.attemptsRemaining}`
  );

  // Test correct OTP verification
  const validVerify = await verifyAdminOtp(authEmail, validOtp);
  assert(
    validVerify.success === true && !!validVerify.sessionToken,
    'Correct OTP accepted and session token generated',
    `Session token present: ${!!validVerify.sessionToken}`
  );

  const validSessionToken = validVerify.sessionToken || '';

  // Test single-use (replay prevention)
  const replayVerify = await verifyAdminOtp(authEmail, validOtp);
  assert(
    replayVerify.success === false,
    'Single-use enforced: reused OTP rejected immediately',
    `Replay response: ${replayVerify.message}`
  );

  // ---------------------------------------------------------------------------
  // GROUP 3: Cryptographic Session Token Security
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Session Token Cryptography & Verification ---');

  const decodedSession = verifyAdminSessionToken(validSessionToken);
  assert(
    decodedSession !== null && decodedSession.email === authEmail && decodedSession.role === 'admin',
    'Valid signed session token decodes and verifies signature'
  );

  // Tampered payload
  const tokenParts = validSessionToken.split('.');
  const tamperedPayloadToken = `eyJlbWFpbCI6ImF0dGFja2VyQGZha2Uub3JnIiwicm9sZSI6ImFkbWluIn0.${tokenParts[1]}`;
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
