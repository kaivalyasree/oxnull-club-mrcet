/**
 * 0XNULL — Track Enrollment & Rebuilt Admin Portal Automated Verification Suite
 * Tests all requirements from Part 1, Part 2, and Part 4.
 */

import fs from 'fs';
import path from 'path';
import bcrypt from 'bcryptjs';
import {
  verifyAdminCredentials,
  buildAdminSessionCookie,
  clearRateLimitStore
} from '../lib/admin-auth';
import { db } from '../lib/store';
import { GET as getEnrollments, POST as postEnrollment, PATCH as patchEnrollment } from '../app/api/enrollments/route';
import { GET as getStudents } from '../app/api/admin/students/route';
import { GET as getTracks, POST as postTrack, PUT as putTrack, DELETE as deleteTrack } from '../app/api/tracks/route';
import { DOMAINS, getAllTracks } from '../lib/data';

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

async function runEnrollmentAndAdminTests() {
  console.log('\n================================================================');
  console.log('0XNULL ENROLLMENT & ADMIN VERIFICATION SUITE — EXECUTION BEGINS');
  console.log('================================================================\n');

  const TEST_ADMIN_USER = 'mock-audit-admin';
  const TEST_ADMIN_PASS = 'MockAuditPasswordOnly!2026';
  const TEST_SECRET = 'audit-test-session-secret-key-32-chars-long-secure';
  const TEST_HASH = bcrypt.hashSync(TEST_ADMIN_PASS, 10);

  process.env.ADMIN_USERNAME = TEST_ADMIN_USER;
  process.env.ADMIN_PASSWORD_HASH = TEST_HASH;
  process.env.ADMIN_SESSION_SECRET = TEST_SECRET;

  clearRateLimitStore();

  const authRes = await verifyAdminCredentials(TEST_ADMIN_USER, TEST_ADMIN_PASS, '127.0.0.1');
  const adminCookie = buildAdminSessionCookie(authRes.sessionToken || '');

  // ---------------------------------------------------------------------------
  // TEST GROUP 1: All 7 Domains and their Inner/Core Tracks
  // ---------------------------------------------------------------------------
  console.log('--- TEST GROUP 1: Domains & Core Tracks Data Model ---');

  assert(
    DOMAINS.length === 7,
    'Exactly seven cybersecurity domains exist in DOMAINS array'
  );

  const allTracks = getAllTracks();
  assert(
    allTracks.length >= 21,
    `All 7 domains have authentic inner core tracks (found: ${allTracks.length} tracks, >= 3 per domain)`
  );

  const domain1 = DOMAINS.find((d) => d.slug === 'awareness');
  const domain2 = DOMAINS.find((d) => d.slug === 'explore');
  assert(
    Boolean(domain1 && domain1.tracks && domain1.tracks.length >= 3),
    'Domain 01 Awareness has at least 3 core tracks'
  );
  assert(
    Boolean(domain2 && domain2.tracks && domain2.tracks.length >= 3),
    'Domain 02 Explore has at least 3 core tracks'
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: Track Enrollment Validation & Unauthenticated Access
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 2: Track Enrollment Validation & Security ---');

  // 2a. Missing fields rejected
  const resMissing = await postEnrollment(
    new Request('http://localhost:3000/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ userId: 'test' })
    })
  );
  assert(
    resMissing.status === 400,
    'POST /api/enrollments rejects missing required candidate fields with 400 Bad Request'
  );

  // 2b. Invalid trackId rejected
  const resBadTrack = await postEnrollment(
    new Request('http://localhost:3000/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: 'usr-test-1',
        studentName: 'Test Student',
        studentEmail: 'student@mrcet.ac.in',
        rollNumber: '23N31A6201',
        academicYear: '2nd Year',
        branch: 'CSE - Cybersecurity',
        phoneNumber: '+919876543210',
        domainId: 'awareness',
        trackId: 'non-existent-fake-track-id'
      })
    })
  );
  assert(
    resBadTrack.status === 400,
    'POST /api/enrollments rejects non-existent track ID with 400 Bad Request'
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: Successful Student Enrollment & Persistence
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 3: Track Enrollment Creation, Persistence & Duplicate Protection ---');

  const testRollA = `AUDIT-ENR-${Date.now().toString().slice(-5)}`;
  const testTrack = allTracks[0]; // e.g. Social Engineering Defense
  const testStudentAId = `usr-alice-${Date.now()}`;

  const validEnrollPayload = {
    userId: testStudentAId,
    studentName: 'Alice Test Candidate',
    studentEmail: 'alice.test@mrcet.ac.in',
    rollNumber: testRollA,
    academicYear: '3rd Year',
    branch: 'CSE - Cybersecurity',
    phoneNumber: '+919876543211',
    domainId: testTrack.domainId,
    trackId: testTrack.id,
    statement: 'I aim to specialize in adversarial simulations and security architecture.'
  };

  const resEnroll1 = await postEnrollment(
    new Request('http://localhost:3000/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validEnrollPayload)
    })
  );
  const dataEnroll1 = await resEnroll1.json();

  assert(
    resEnroll1.status === 201 && dataEnroll1.success && dataEnroll1.data?.status === 'pending',
    'Student Alice submits track enrollment successfully with initial status "pending" (201)'
  );

  const createdEnrollmentId = dataEnroll1.data?.id;

  // 3b. Duplicate enrollment rejection (409 Conflict)
  const resEnrollDup = await postEnrollment(
    new Request('http://localhost:3000/api/enrollments', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(validEnrollPayload)
    })
  );
  assert(
    resEnrollDup.status === 409,
    'Attempted duplicate enrollment for same student and track is prevented with 409 Conflict'
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: Student Data Privacy & Isolation
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 4: Student Data Privacy & Isolation ---');

  // Alice queries her enrollments
  const resAliceQuery = await getEnrollments(
    new Request(`http://localhost:3000/api/enrollments?userId=${testStudentAId}`)
  );
  const dataAliceQuery = await resAliceQuery.json();

  assert(
    dataAliceQuery.success &&
      dataAliceQuery.data.length === 1 &&
      dataAliceQuery.data[0].id === createdEnrollmentId,
    'Student Alice retrieves her enrolled track records'
  );

  // Unrelated Student Bob queries his enrollments
  const testStudentBId = `usr-bob-${Date.now()}`;
  const resBobQuery = await getEnrollments(
    new Request(`http://localhost:3000/api/enrollments?userId=${testStudentBId}`)
  );
  const dataBobQuery = await resBobQuery.json();

  assert(
    dataBobQuery.success && dataBobQuery.data.length === 0,
    'Unrelated student Bob cannot view Alice’s private enrollment record (Strict Isolation)'
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 5: Administrative Authorization & Status Mutations
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 5: Admin Session Verification & Status Updates ---');

  // 5a. Unauthorized PATCH rejected
  const resPatchUnauth = await patchEnrollment(
    new Request('http://localhost:3000/api/enrollments', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id: createdEnrollmentId, status: 'approved' })
    })
  );
  assert(
    resPatchUnauth.status === 401,
    'PATCH /api/enrollments rejected without verified admin session cookie (401)'
  );

  // 5b. Authorized Admin approves enrollment
  const resPatchAuth = await patchEnrollment(
    new Request('http://localhost:3000/api/enrollments', {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        cookie: adminCookie
      },
      body: JSON.stringify({ id: createdEnrollmentId, status: 'approved' })
    })
  );
  const dataPatchAuth = await resPatchAuth.json();

  assert(
    resPatchAuth.status === 200 &&
      dataPatchAuth.success &&
      dataPatchAuth.data?.status === 'approved' &&
      Boolean(dataPatchAuth.data?.reviewedBy && dataPatchAuth.data?.reviewedAt),
    'Authorized Admin approves enrollment; status updated with audit stamps (reviewedBy, reviewedAt)'
  );

  // 5c. Student Alice verifies she sees updated status
  const resAliceAfter = await getEnrollments(
    new Request(`http://localhost:3000/api/enrollments?userId=${testStudentAId}`)
  );
  const dataAliceAfter = await resAliceAfter.json();
  assert(
    dataAliceAfter.data[0]?.status === 'approved',
    'Student dashboard reflects updated "approved" status from database persistence'
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 6: Student Management Directory API
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 6: Student Management Directory API ---');

  // Unauth access rejected
  const resStudentsUnauth = await getStudents(new Request('http://localhost:3000/api/admin/students'));
  assert(
    resStudentsUnauth.status === 401,
    'GET /api/admin/students rejected without admin session (401)'
  );

  // Auth access succeeds and includes Alice with her enrollment
  const resStudentsAuth = await getStudents(
    new Request('http://localhost:3000/api/admin/students', {
      headers: { cookie: adminCookie }
    })
  );
  const dataStudentsAuth = await resStudentsAuth.json();
  assert(
    resStudentsAuth.status === 200 &&
      dataStudentsAuth.success &&
      Array.isArray(dataStudentsAuth.data) &&
      dataStudentsAuth.data.some((s: any) => s.rollNumber === testRollA),
    'Admin student directory returns aggregated profiles with enrollment history'
  );

  // ---------------------------------------------------------------------------
  // TEST GROUP 7: Domain & Track Management & Referential Integrity Protection
  // ---------------------------------------------------------------------------
  console.log('\n--- TEST GROUP 7: Domain & Core-Track Management & Referential Integrity ---');

  // 7a. GET tracks public
  const resTracksPublic = await getTracks(new Request('http://localhost:3000/api/tracks'));
  const dataTracksPublic = await resTracksPublic.json();
  assert(
    resTracksPublic.status === 200 && dataTracksPublic.success && dataTracksPublic.data.length >= 21,
    'GET /api/tracks returns core specialization tracks'
  );

  // 7b. Attempt to delete track with active student enrollment -> Blocked!
  const resDelProtected = await deleteTrack(
    new Request(`http://localhost:3000/api/tracks?id=${testTrack.id}`, {
      method: 'DELETE',
      headers: { cookie: adminCookie }
    })
  );
  const dataDelProtected = await resDelProtected.json();
  assert(
    resDelProtected.status === 400 && dataDelProtected.error?.includes('active student enrollments'),
    'Referential integrity safely blocks deleting track with active student enrollments'
  );

  // 7c. Create a test track without enrollments
  const resCreateTrack = await postTrack(
    new Request('http://localhost:3000/api/tracks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        cookie: adminCookie
      },
      body: JSON.stringify({
        name: 'Automated Ephemeral Audit Track',
        domainId: 'awareness',
        description: 'Temporary track created to verify administrative deletion lifecycle.',
        topics: ['Audit', 'Ephemeral'],
        deliverable: 'Automated test suite verification artifact',
        isActive: true
      })
    })
  );
  const dataCreateTrack = await resCreateTrack.json();
  assert(
    resCreateTrack.status === 201 && Boolean(dataCreateTrack.data?.id),
    'Admin creates new core track via POST /api/tracks (201)'
  );

  const ephemeralTrackId = dataCreateTrack.data?.id;

  // 7d. Safely delete track without enrollments
  const resDelEphemeral = await deleteTrack(
    new Request(`http://localhost:3000/api/tracks?id=${ephemeralTrackId}`, {
      method: 'DELETE',
      headers: { cookie: adminCookie }
    })
  );
  assert(
    resDelEphemeral.status === 200,
    'Admin safely deletes track without enrollments via DELETE /api/tracks (200)'
  );

  // Clean up test enrollment record
  try {
    const store = db.getStore();
    store.trackEnrollments = (store.trackEnrollments || []).filter((e) => e.rollNumber !== testRollA);
    fs.writeFileSync(path.join(process.cwd(), 'data/db.json'), JSON.stringify(store, null, 2), 'utf-8');
  } catch (cleanErr) {
    console.warn('Could not clean test enrollment:', cleanErr);
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

runEnrollmentAndAdminTests().catch((err) => {
  console.error('Fatal error during enrollment and admin tests:', err);
  process.exit(1);
});
