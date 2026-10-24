/**
 * 0XNULL Comprehensive Live Server & End-to-End Verification Suite
 * Validates all endpoints, live rendered pages, student flows, admin protection,
 * 7 domains, awareness hubs, explore module pages, and data isolation.
 */

async function runLiveVerification() {
  console.log('================================================================');
  console.log('0XNULL COMPLETE END-TO-END VERIFICATION SUITE — RUNNING');
  console.log('================================================================');

  const baseUrl = 'http://localhost:3000';
  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string, detail?: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName} ${detail ? `(${detail})` : ''}`);
      failed++;
    }
  }

  // ===========================================================================
  // GROUP 1: Homepage & Visual Hierarchy
  // ===========================================================================
  console.log('\n--- VERIFICATION GROUP 1: Homepage & Visual Architecture ---');
  const resHome = await fetch(`${baseUrl}/`);
  assert(resHome.status === 200, 'Homepage returns HTTP 200');
  const homeHtml = await resHome.text();
  assert(
    homeHtml.includes('MALLA REDDY COLLEGE OF ENGINEERING AND TECHNOLOGY'),
    'Homepage contains approved single-line College Name'
  );
  assert(
    homeHtml.includes('Seven Cybersecurity Domains'),
    'Homepage renders Seven Cybersecurity Domains section'
  );
  assert(
    homeHtml.includes('Institutional Support') &&
    homeHtml.includes('Dr. Vaka Murali Mohan') &&
    homeHtml.includes('Prof. Vazralu Munnangi'),
    'Homepage renders Institutional Support with Principal and HOD'
  );
  assert(
    homeHtml.includes('https://chat.whatsapp.com/EHqyjOz8Pa5KJXOJdkWfye') &&
    homeHtml.includes('https://www.instagram.com/oxnull_mrcet?srtk=a3V2djgyNm0xdXlk'),
    'Homepage includes approved WhatsApp and Instagram links'
  );
  assert(
    homeHtml.includes('S.Kaivalya Sri'),
    'Footer includes approved designer credit "S.Kaivalya Sri"'
  );

  // ===========================================================================
  // GROUP 2: Student Portal Routes (Dashboard & Login)
  // ===========================================================================
  console.log('\n--- VERIFICATION GROUP 2: Student Portal Routes ---');
  const resDashboard = await fetch(`${baseUrl}/dashboard`);
  assert(resDashboard.status === 200, 'Student Dashboard route returns HTTP 200');
  const dashHtml = await resDashboard.text();
  assert(
    dashHtml.includes('Authenticating student session') ||
    dashHtml.includes('Authentication Required') ||
    dashHtml.includes('Student Portal Access'),
    'Student dashboard route loads client authentication barrier'
  );

  const resLogin = await fetch(`${baseUrl}/login`);
  assert(resLogin.status === 200, 'Login page returns HTTP 200');
  const loginHtml = await resLogin.text();
  assert(
    loginHtml.includes('Loading login portal') || loginHtml.includes('Sign In'),
    'Login page renders authentication container'
  );

  const resSwitch = await fetch(`${baseUrl}/login?switch=true&returnUrl=/dashboard`);
  assert(resSwitch.status === 200, 'Switch Account page returns HTTP 200');

  // ===========================================================================
  // GROUP 3: Awareness Domain & 4 Situational Intelligence Modules
  // ===========================================================================
  console.log('\n--- VERIFICATION GROUP 3: Awareness Domain & 4 Intelligence Modules ---');
  const resAwareness = await fetch(`${baseUrl}/domains/awareness`);
  assert(resAwareness.status === 200, 'Awareness domain returns HTTP 200');
  const awarenessHtml = await resAwareness.text();
  assert(
    awarenessHtml.includes('Cybersecurity Intelligence & Threat Telemetry') ||
    awarenessHtml.includes('Situational Intelligence Modules'),
    'Awareness domain renders Situational Intelligence modules'
  );
  assert(
    awarenessHtml.includes('Latest Scans') &&
    awarenessHtml.includes('Cybersecurity Tech News') &&
    awarenessHtml.includes('Threat Watch') &&
    awarenessHtml.includes('Security Advisories'),
    'Awareness domain contains all 4 intelligence hubs'
  );
  assert(
    !awarenessHtml.includes('Domain Resources') &&
    !awarenessHtml.includes('Industry Certifications Roadmap') &&
    !awarenessHtml.includes('Member-Led Security Projects'),
    'Awareness domain strictly removes Resources, Certifications, and Projects'
  );

  // Awareness Sub-Pages
  const resScans = await fetch(`${baseUrl}/domains/awareness/scans`);
  assert(resScans.status === 200, 'Awareness /scans page returns HTTP 200');
  const scansHtml = await resScans.text();
  assert(
    scansHtml.includes('Latest Security Scans') && scansHtml.includes('Back to Awareness Domain'),
    'Latest Scans page renders telemetry header and return navigation'
  );

  const resNews = await fetch(`${baseUrl}/domains/awareness/news`);
  assert(resNews.status === 200, 'Awareness /news page returns HTTP 200');
  const newsHtml = await resNews.text();
  assert(
    newsHtml.includes('Cybersecurity Tech News') && newsHtml.includes('Back to Awareness Domain'),
    'Tech News page renders header and return navigation'
  );

  const resThreats = await fetch(`${baseUrl}/domains/awareness/threat-watch`);
  assert(resThreats.status === 200, 'Awareness /threat-watch page returns HTTP 200');
  const threatsHtml = await resThreats.text();
  assert(
    threatsHtml.includes('Threat Watch') && threatsHtml.includes('Back to Awareness Domain'),
    'Threat Watch page renders header and return navigation'
  );

  const resAdv = await fetch(`${baseUrl}/domains/awareness/advisories`);
  assert(resAdv.status === 200, 'Awareness /advisories page returns HTTP 200');
  const advHtml = await resAdv.text();
  assert(
    advHtml.includes('Security Advisories') && advHtml.includes('Back to Awareness Domain'),
    'Security Advisories page renders header and return navigation'
  );

  // Scan API & Live Intelligence
  const resApiScans = await fetch(`${baseUrl}/api/awareness/scans`);
  const scansData = await resApiScans.json();
  assert(
    scansData.success === true && scansData.hasActiveIntegration === false,
    'Scan API indicates unconfigured status in compliance with university policy'
  );

  // ===========================================================================
  // GROUP 4: Explore Domain & 5 Dedicated Non-Technical Module Pages
  // ===========================================================================
  console.log('\n--- VERIFICATION GROUP 4: Explore Domain & 5 Module Pages ---');
  const resExplore = await fetch(`${baseUrl}/domains/explore`);
  assert(resExplore.status === 200, 'Explore domain returns HTTP 200');
  const exploreHtml = await resExplore.text();
  assert(
    exploreHtml.includes('Five Professional Development Modules') ||
    exploreHtml.includes('Non-Technical & Professional Development'),
    'Explore domain renders non-technical development section'
  );
  assert(
    exploreHtml.includes('Communication') &&
    exploreHtml.includes('Public Relations (PR)') &&
    exploreHtml.includes('Networking') &&
    exploreHtml.includes('Leadership and Collaboration') &&
    exploreHtml.includes('Planning and Event Operations'),
    'Explore domain contains all 5 required modules'
  );
  assert(
    !exploreHtml.includes('Domain Resources') &&
    !exploreHtml.includes('Industry Certifications Roadmap') &&
    !exploreHtml.includes('Member-Led Security Projects'),
    'Explore domain strictly removes Resources, Certifications, and Projects'
  );

  const exploreModules = [
    { slug: 'communication', title: 'Communication' },
    { slug: 'pr', title: 'Public Relations (PR)' },
    { slug: 'networking', title: 'Networking' },
    { slug: 'leadership-collaboration', title: 'Leadership and Collaboration' },
    { slug: 'planning-event-ops', title: 'Planning and Event Operations' }
  ];

  for (const mod of exploreModules) {
    const resMod = await fetch(`${baseUrl}/domains/explore/${mod.slug}`);
    assert(resMod.status === 200, `Explore module /${mod.slug} returns HTTP 200`);
    const modHtml = await resMod.text();
    assert(
      modHtml.includes(mod.title) &&
      modHtml.includes('Starter Activity') &&
      modHtml.includes('Back to Explore Domain'),
      `Dedicated module page /${mod.slug} renders title, starter activity tags, and return navigation`
    );
  }

  // ===========================================================================
  // GROUP 5: Learn Domain & All Seven Cybersecurity Domains
  // ===========================================================================
  console.log('\n--- VERIFICATION GROUP 5: Learn Domain & All Seven Domains ---');
  const resLearn = await fetch(`${baseUrl}/learn`);
  assert(resLearn.status === 200, 'Learn page returns HTTP 200');
  const learnHtml = await resLearn.text();
  assert(
    learnHtml.includes('Linux') &&
    learnHtml.includes('Networking') &&
    learnHtml.includes('Operating System') &&
    learnHtml.includes('Security Fundamentals'),
    'Learn page includes all four visible learning subjects'
  );

  // All 4 Dedicated Learn Subject Hubs
  const subjects = ['linux', 'networking', 'operating-system', 'security-fundamentals'];
  for (const sub of subjects) {
    const resSub = await fetch(`${baseUrl}/learn/${sub}`);
    assert(resSub.status === 200, `Learn subject /learn/${sub} returns HTTP 200`);
  }

  // All Seven Domains
  const domainSlugs = [
    'awareness',
    'explore',
    'red-blue-team',
    'digital-forensics',
    'cryptography',
    'cloud-security',
    'security-architecture'
  ];
  for (const dSlug of domainSlugs) {
    const resDom = await fetch(`${baseUrl}/domains/${dSlug}`);
    assert(resDom.status === 200, `Domain /domains/${dSlug} returns HTTP 200`);
  }

  // ===========================================================================
  // GROUP 6: Student Registration & Protected Admin Portal
  // ===========================================================================
  console.log('\n--- VERIFICATION GROUP 6: Registration & Protected Admin Portal ---');

  // Student Registration API
  const testRoll = `VERIFY-${Date.now().toString().slice(-6)}`;
  const resReg = await fetch(`${baseUrl}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: `usr-reg-${Date.now()}`,
      fullName: 'Verification Candidate',
      year: '3rd Year',
      rollNumber: testRoll,
      branch: 'CSE - Cybersecurity',
      phoneNumber: '+919876543210',
      domainInterests: ['d6', 'd7']
    })
  });
  assert(resReg.status === 201, 'Student registration POST /api/applications returns 201 Created');

  // Duplicate registration blocked
  const resRegDup = await fetch(`${baseUrl}/api/applications`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: `usr-reg-dup-${Date.now()}`,
      fullName: 'Duplicate Candidate',
      year: '3rd Year',
      rollNumber: testRoll,
      branch: 'CSE - Cybersecurity',
      phoneNumber: '+919876543210',
      domainInterests: ['d6']
    })
  });
  assert(resRegDup.status === 409, 'Duplicate roll number registration returns 409 Conflict');

  // Admin Portal Protection
  const resAdminPage = await fetch(`${baseUrl}/admin`);
  assert(resAdminPage.status === 200, 'Admin page route responds with HTTP 200');

  // Server-side admin API protection (must reject unauthenticated visitor with 401)
  const resAdminStudents = await fetch(`${baseUrl}/api/admin/students`);
  assert(
    resAdminStudents.status === 401,
    'GET /api/admin/students strictly rejects unauthenticated visitor with 401'
  );

  const resAdminApps = await fetch(`${baseUrl}/api/applications`);
  assert(
    resAdminApps.status === 401,
    'GET /api/applications strictly rejects unauthenticated visitor with 401'
  );

  // ===========================================================================
  // GROUP 7: Student Data Isolation & Account Switch State
  // ===========================================================================
  console.log('\n--- VERIFICATION GROUP 7: Student Data Isolation & Persistence ---');
  const studentAlice = `usr-live-alice-${Date.now()}`;
  const studentBob = `usr-live-bob-${Date.now()}`;

  // Alice saves notes and explore tasks
  await fetch(`${baseUrl}/api/user-progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: studentAlice,
      notes: 'Alice Confidential Research Log',
      enrolledDomains: ['d6'],
      completedExploreTaskIds: ['task-comm-1'],
      exploreTaskSubmissions: {
        'task-comm-1': {
          status: 'completed',
          submission: 'Alice Executive Translation Deliverable',
          updatedAt: new Date().toISOString()
        }
      }
    })
  });

  // Bob saves notes and explore tasks
  await fetch(`${baseUrl}/api/user-progress`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      userId: studentBob,
      notes: 'Bob Incident Triage Memos',
      enrolledDomains: ['d7'],
      completedExploreTaskIds: ['task-ops-1'],
      exploreTaskSubmissions: {
        'task-ops-1': {
          status: 'completed',
          submission: 'Bob Run-of-Show Protocol',
          updatedAt: new Date().toISOString()
        }
      }
    })
  });

  // Retrieve Alice
  const aliceData = await (await fetch(`${baseUrl}/api/user-progress?userId=${studentAlice}`)).json();
  // Retrieve Bob
  const bobData = await (await fetch(`${baseUrl}/api/user-progress?userId=${studentBob}`)).json();

  assert(
    aliceData.data?.notes === 'Alice Confidential Research Log' &&
    aliceData.data?.completedExploreTaskIds?.includes('task-comm-1') &&
    !aliceData.data?.completedExploreTaskIds?.includes('task-ops-1'),
    'Alice private records retrieved accurately'
  );

  assert(
    bobData.data?.notes === 'Bob Incident Triage Memos' &&
    bobData.data?.completedExploreTaskIds?.includes('task-ops-1') &&
    !bobData.data?.completedExploreTaskIds?.includes('task-comm-1'),
    'Bob private records retrieved accurately with zero cross-account leakage'
  );

  assert(
    aliceData.data?.exploreTaskSubmissions?.['task-comm-1']?.submission === 'Alice Executive Translation Deliverable' &&
    !bobData.data?.exploreTaskSubmissions?.['task-comm-1'],
    'Explore task submissions are strictly isolated between accounts'
  );

  console.log('================================================================');
  console.log(`LIVE SERVER VERIFICATION: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) {
    process.exit(1);
  }
}

runLiveVerification().catch((err) => {
  console.error('Unhandled error during live verification:', err);
  process.exit(1);
});
