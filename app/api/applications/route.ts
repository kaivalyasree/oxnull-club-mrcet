import { NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';
import { DOMAINS } from '@/lib/data';
import { verifyAdminSession } from '@/lib/admin-auth';

const VALID_YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];
const VALID_BRANCHES = [
  'CSE - Cybersecurity',
  'Computer Science & Engineering',
  'CSE - Artificial Intelligence & Machine Learning',
  'CSE - Data Science',
  'Information Technology',
  'Electronics & Communication Engineering'
];
const VALID_DOMAIN_IDS = DOMAINS.map((d) => d.id);

/**
 * GET /api/applications
 * Retrieves applications.
 * - If userId param is provided, returns that user's application.
 * - Otherwise requires verified administrator session or returns 401.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (userId) {
      // Candidate retrieving their own application
      const userApps = db.getApplicationsByUserId(userId);
      return NextResponse.json({ success: true, data: userApps });
    }

    // Only authenticated administrators can list all applications
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrative session required.' },
        { status: 401 }
      );
    }

    const allApps = db.getApplications();
    return NextResponse.json({ success: true, data: allApps });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch applications' }, { status: 500 });
  }
}

/**
 * POST /api/applications
 * Submits a new club application with full backend validation & transactional persistence.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, fullName, year, rollNumber, branch, phoneNumber, domainInterests } = body;

    // 1. Full Name Validation
    if (!fullName || typeof fullName !== 'string' || fullName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full name is required and cannot be empty.' },
        { status: 400 }
      );
    }

    // 2. Academic Year Validation
    if (!year || !VALID_YEARS.includes(year)) {
      return NextResponse.json(
        { success: false, error: 'Please select a valid academic year from confirmed options.' },
        { status: 400 }
      );
    }

    // 3. Roll Number Validation
    if (!rollNumber || typeof rollNumber !== 'string' || rollNumber.trim().length < 3) {
      return NextResponse.json(
        { success: false, error: 'A valid college roll number is required.' },
        { status: 400 }
      );
    }

    // 4. Branch Validation
    if (!branch || !VALID_BRANCHES.includes(branch)) {
      return NextResponse.json(
        { success: false, error: 'Please select an officially approved college branch.' },
        { status: 400 }
      );
    }

    // 5. Phone Number Validation
    const cleanPhone = (phoneNumber || '').toString().trim().replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 8 || !/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid contact telephone number.' },
        { status: 400 }
      );
    }

    // 6. Domain Interests Validation (Must select at least 1 from the 7 domains)
    if (!Array.isArray(domainInterests) || domainInterests.length === 0) {
      return NextResponse.json(
        { success: false, error: 'You must select at least one cybersecurity domain interest.' },
        { status: 400 }
      );
    }

    const invalidDomains = domainInterests.filter((dId) => !VALID_DOMAIN_IDS.includes(dId));
    if (invalidDomains.length > 0) {
      return NextResponse.json(
        { success: false, error: 'Invalid domain interests submitted.' },
        { status: 400 }
      );
    }

    const sanitizedUserId = userId || `usr-${Date.now()}`;
    const sanitizedFullName = fullName.trim();
    const sanitizedRoll = rollNumber.trim().toUpperCase();

    // 7. Check for duplicate application
    const existingApps = db.getApplications();
    const alreadyApplied = existingApps.find(
      (app) => (app.userId && app.userId === sanitizedUserId) || app.rollNumber.toUpperCase() === sanitizedRoll
    );

    if (alreadyApplied) {
      return NextResponse.json(
        {
          success: false,
          error: `An application has already been submitted for Roll Number ${sanitizedRoll}. Status: ${alreadyApplied.status}.`,
          data: alreadyApplied
        },
        { status: 409 }
      );
    }

    // 8. Transactional persistence to Supabase (if configured)
    if (isSupabaseConfigured) {
      try {
        const { data: insertedApp, error: appErr } = await supabase
          .from('club_applications')
          .insert({
            user_id: sanitizedUserId.startsWith('usr-') ? null : sanitizedUserId,
            full_name: sanitizedFullName,
            year,
            roll_number: sanitizedRoll,
            branch,
            phone_number: cleanPhone,
            status: 'pending'
          })
          .select()
          .single();

        if (appErr) throw appErr;

        if (insertedApp && domainInterests.length > 0) {
          const domainRows = domainInterests.map((dId) => ({
            application_id: insertedApp.id,
            domain_id: dId
          }));
          await supabase.from('application_domain_interests').insert(domainRows);
        }
      } catch (sbErr) {
        console.warn('Supabase insertion fallback to local persistent store', sbErr);
      }
    }

    // 9. Persist to local JSON database store
    const created = db.createApplication({
      userId: sanitizedUserId,
      fullName: sanitizedFullName,
      year,
      rollNumber: sanitizedRoll,
      branch,
      phoneNumber: cleanPhone,
      domainInterests
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to submit application' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/applications
 * Updates an application status ('pending' | 'approved' | 'rejected' | 'withdrawn').
 * Requires admin authorization.
 */
export async function PATCH(request: Request) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Only authenticated administrators may modify application status.' },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { id, status } = body;

    if (!id || !['pending', 'approved', 'rejected', 'withdrawn'].includes(status)) {
      return NextResponse.json({ success: false, error: 'Valid application ID and status required.' }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      try {
        await supabase
          .from('club_applications')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', id);
      } catch (sbErr) {
        console.warn('Supabase status update fallback', sbErr);
      }
    }

    const updated = db.updateApplicationStatus(id, status);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Application not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update application status.' }, { status: 500 });
  }
}
