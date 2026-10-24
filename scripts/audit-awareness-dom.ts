async function verifyAwarenessDom() {
  const baseUrl = 'http://localhost:3000';
  
  console.log('================================================================');
  console.log('0XNULL AWARENESS DOMAIN LIVE AUDIT');
  console.log('================================================================');

  const res = await fetch(`${baseUrl}/domains/awareness`);
  const html = await res.text();

  const checks: [string, boolean][] = [
    ['Hero Eyebrow: OXNULL AWARENESS INITIATIVE', html.includes('OXNULL AWARENESS INITIATIVE')],
    ['Hero Heading: Stay Informed. Stay Alert. Stay Safe.', html.includes('Stay Informed. Stay Alert. Stay Safe.')],
    ['Hero Description', html.includes('Discover the latest technology developments')],
    ['Indicator 1: Weekly Tech News', html.includes('Weekly Tech News')],
    ['Indicator 2: Fortnightly Cybersecurity Updates', html.includes('Fortnightly Cybersecurity Updates')],
    ['Indicator 3: Scam Awareness & Exposure', html.includes('Scam Awareness') && (html.includes('&amp; Exposure') || html.includes('& Exposure'))],
    ['Section A Heading: Technology News', html.includes('Technology News')],
    ['Section A Cadence: Published Weekly', html.includes('weekly') || html.includes('Weekly')],
    ['Section B Heading: Cybersecurity News', html.includes('Cybersecurity News')],
    ['Section B Cadence: Fortnightly Editorial Schedule', html.includes('14 days') || html.includes('Fortnightly') || html.includes('fortnightly')],
    ['Section C Heading: Scam Awareness & Exposure', html.includes('Scam Awareness')],
    ['National Cyber Crime Helpline 1930', html.includes('1930')],
    ['Official Portal cybercrime.gov.in', html.includes('cybercrime.gov.in')],
    ['Verified Story: Claude 3.5 Sonnet Computer Use', html.includes('Anthropic Releases Upgraded Claude 3.5 Sonnet')],
    ['Verified Story: Linux Kernel 6.12 PREEMPT_RT', html.includes('Linux Kernel 6.12 Officially Merges PREEMPT_RT')],
    ['Verified Incident: Apache Tomcat (CVE-2024-50379)', html.includes('CVE-2024-50379')],
    ['Verified Incident: CERT-In Advisory CIVN-2025-0012', html.includes('CERT-In Issues High Severity Advisory')],
    ['Scam Exposure: Student Part-Time Task Scam', html.includes('Part-Time') && html.includes('Scam Targeting University Students')],
    ['Scam Exposure: UPI QR-Code Fraud', html.includes('UPI') && html.includes('Scan QR Code to Receive Money')],
    ['Scam Exposure: Digital Arrest Scheme', html.includes('Digital Arrest')],
    ['Scam Exposure: Red Flags, Safety Tips, What to do', html.includes('Red Flags') && html.includes('Safety Tips') && html.includes('What to Do If Targeted')],
    ['NO "Enroll in this Track" CTA', !html.includes('Enroll in this Track')],
    ['NO "Enroll in Core Tracks" button', !html.includes('Enroll in Core Tracks')],
    ['NO Track Enrollment Modal', !html.includes('TrackEnrollmentModal')],
    ['NO Learning Pathway', !html.includes('Learning Pathway')],
    ['NO Focus Areas Navigation', !html.includes('Focus Areas')]
  ];

  let passed = 0;
  let failed = 0;
  for (const [title, ok] of checks) {
    if (ok) {
      console.log(`  ✓ PASS: ${title}`);
      passed++;
    } else {
      console.log(`  ✗ FAIL: ${title}`);
      failed++;
    }
  }

  console.log('\n--- VERIFYING OTHER DOMAINS PRESERVED ---');
  const otherDomains = ['explore', 'red-blue-team', 'digital-forensics', 'cryptography', 'cloud-security', 'security-architecture'];
  for (const slug of otherDomains) {
    const resDom = await fetch(`${baseUrl}/domains/${slug}`);
    const domHtml = await resDom.text();
    const hasTracks = domHtml.includes('Domain Tracks') || domHtml.includes('Core Tracks');
    const ok = resDom.status === 200 && hasTracks;
    if (ok) {
      console.log(`  ✓ PASS: /domains/${slug} returns 200 with intact specialization tracks`);
      passed++;
    } else {
      console.log(`  ✗ FAIL: /domains/${slug} (status: ${resDom.status}, hasTracks: ${hasTracks})`);
      failed++;
    }
  }

  console.log('================================================================');
  console.log(`FINAL RESULT: ${passed} PASSED | ${failed} FAILED`);
  console.log('================================================================');

  if (failed > 0) process.exit(1);
}

verifyAwarenessDom().catch(err => {
  console.error(err);
  process.exit(1);
});
