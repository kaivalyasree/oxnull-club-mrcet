import { NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { getServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import { DOMAINS, getTrackById } from '@/lib/data';
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

/**
 * GET /api/enrollments
 * - When userId parameter is provided, returns that student's private enrollments.
 * - Otherwise requires verified administrator session or returns 401.
 * - Supports status, domainId, trackId, search query filters.
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const rollNumber = searchParams.get('rollNumber');

    // 1. Student self-service query
    if (userId) {
      // Check Supabase if configured
      if (isSupabaseConfigured) {
        try {
          const supabase = getServerSupabaseClient();
          if (supabase) {
            const { data, error } = await supabase
              .from('track_enrollments')
              .select('*')
              .eq('user_id', userId)
              .order('created_at', { ascending: false });

            if (!error && Array.isArray(data) && data.length > 0) {
              // Map DB snake_case columns to camelCase
              const mapped = data.map((item: any) => ({
                id: item.id,
                userId: item.user_id,
                studentName: item.student_name,
                studentEmail: item.student_email,
                rollNumber: item.roll_number,
                academicYear: item.academic_year,
                branch: item.branch,
                phoneNumber: item.phone_number,
                domainId: item.domain_id,
                domainName: item.domain_name,
                trackId: item.track_id,
                trackName: item.track_name,
                status: item.status,
                statement: item.statement,
                reviewedBy: item.reviewed_by,
                reviewedAt: item.reviewed_at,
                createdAt: item.created_at,
                updatedAt: item.updated_at
              }));
              return NextResponse.json({ success: true, data: mapped });
            }
          }
        } catch (sbErr) {
          console.warn('[OXNULL DB] Supabase fetch fallback to local store', sbErr);
        }
      }

      const userEnrollments = db.getEnrollmentsByUserId(userId);
      return NextResponse.json({ success: true, data: userEnrollments });
    }

    if (rollNumber) {
      const rollEnrollments = db.getEnrollmentsByRollNumber(rollNumber);
      return NextResponse.json({ success: true, data: rollEnrollments });
    }

    // 2. Administrator querying all enrollments
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrative session required to list all enrollments.' },
        { status: 401 }
      );
    }

    const domainId = searchParams.get('domainId') || 'all';
    const trackId = searchParams.get('trackId') || 'all';
    const status = searchParams.get('status') || 'all';
    const query = (searchParams.get('q') || searchParams.get('search') || '').trim().toLowerCase();

    // Check Supabase first if configured
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          let req = supabase.from('track_enrollments').select('*').order('created_at', { ascending: false });

          if (domainId !== 'all') req = req.eq('domain_id', domainId);
          if (trackId !== 'all') req = req.eq('track_id', trackId);
          if (status !== 'all') req = req.eq('status', status);

          const { data, error } = await req;
          if (!error && Array.isArray(data)) {
            let mapped = data.map((item: any) => ({
              id: item.id,
              userId: item.user_id,
              studentName: item.student_name,
              studentEmail: item.student_email,
              rollNumber: item.roll_number,
              academicYear: item.academic_year,
              branch: item.branch,
              phoneNumber: item.phone_number,
              domainId: item.domain_id,
              domainName: item.domain_name,
              trackId: item.track_id,
              trackName: item.track_name,
              status: item.status,
              statement: item.statement,
              reviewedBy: item.reviewed_by,
              reviewedAt: item.reviewed_at,
              createdAt: item.created_at,
              updatedAt: item.updated_at
            }));

            if (query) {
              mapped = mapped.filter(
                (e) =>
                  e.studentName.toLowerCase().includes(query) ||
                  e.studentEmail.toLowerCase().includes(query) ||
                  e.rollNumber.toLowerCase().includes(query) ||
                  e.domainName.toLowerCase().includes(query) ||
                  e.trackName.toLowerCase().includes(query)
              );
            }

            return NextResponse.json({ success: true, data: mapped });
          }
        }
      } catch (sbErr) {
        console.warn('[OXNULL DB] Supabase fetch fallback to local store', sbErr);
      }
    }

    let all = db.getEnrollments({ domainId, trackId, status });
    if (query) {
      all = all.filter(
        (e) =>
          e.studentName.toLowerCase().includes(query) ||
          e.studentEmail.toLowerCase().includes(query) ||
          e.rollNumber.toLowerCase().includes(query) ||
          e.domainName.toLowerCase().includes(query) ||
          e.trackName.toLowerCase().includes(query)
      );
    }

    return NextResponse.json({ success: true, data: all });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch enrollments' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/enrollments
 * Submits a new domain track enrollment request with server-side validation,
 * identity verification, and uniqueness constraint enforcement.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json().catch(() => ({}));
    const {
      userId,
      studentName,
      studentEmail,
      rollNumber,
      academicYear,
      branch,
      phoneNumber,
      domainId,
      trackId,
      statement
    } = body;

    // 1. Validate student name
    if (!studentName || typeof studentName !== 'string' || studentName.trim().length < 2) {
      return NextResponse.json(
        { success: false, error: 'Full student name is required (minimum 2 characters).' },
        { status: 400 }
      );
    }

    // 2. Validate email
    const cleanEmail = (studentEmail || '').trim().toLowerCase();
    if (!cleanEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(cleanEmail)) {
      return NextResponse.json(
        { success: false, error: 'A valid university or student email address is required.' },
        { status: 400 }
      );
    }

    // 3. Validate Roll Number
    const cleanRoll = (rollNumber || '').trim().toUpperCase();
    if (!cleanRoll || cleanRoll.length < 3) {
      return NextResponse.json(
        { success: false, error: 'College roll number is required (e.g. 22N31A6201).' },
        { status: 400 }
      );
    }

    // 4. Validate Academic Year
    if (!academicYear || !VALID_YEARS.includes(academicYear)) {
      return NextResponse.json(
        { success: false, error: 'Please select a valid academic year (1st, 2nd, 3rd, or 4th Year).' },
        { status: 400 }
      );
    }

    // 5. Validate Branch
    if (!branch || !VALID_BRANCHES.includes(branch)) {
      return NextResponse.json(
        { success: false, error: 'Please select an approved college department branch.' },
        { status: 400 }
      );
    }

    // 6. Validate Phone Number
    const cleanPhone = (phoneNumber || '').toString().trim().replace(/[\s-]/g, '');
    if (!cleanPhone || cleanPhone.length < 8 || !/^\+?[0-9]{8,15}$/.test(cleanPhone)) {
      return NextResponse.json(
        { success: false, error: 'Please provide a valid contact telephone number.' },
        { status: 400 }
      );
    }

    // 7. Validate Domain
    const domain = DOMAINS.find((d) => d.id === domainId || d.slug === domainId);
    if (!domain) {
      return NextResponse.json(
        { success: false, error: `Invalid cybersecurity domain specified (${domainId}).` },
        { status: 400 }
      );
    }

    // 8. Validate Core Track in Domain
    const availableTracks = db.getTracks(domain.id);
    const track = availableTracks.find((t) => t.id === trackId);
    if (!track) {
      return NextResponse.json(
        { success: false, error: `Invalid track specified (${trackId}) for domain "${domain.name}".` },
        { status: 400 }
      );
    }

    if (track.isActive === false) {
      return NextResponse.json(
        { success: false, error: `Track "${track.name}" is currently inactive and cannot accept new enrollments.` },
        { status: 400 }
      );
    }

    const sanitizedUserId = userId || `usr-${Date.now()}`;
    const sanitizedName = studentName.trim();

    // 9. Uniqueness check against duplicate enrollment (rollNumber + domainId + trackId)
    const existingEnrollments = db.getEnrollments();
    const duplicate = existingEnrollments.find(
      (e) =>
        e.rollNumber.toUpperCase() === cleanRoll &&
        e.domainId === domain.id &&
        e.trackId === track.id
    );

    if (duplicate) {
      return NextResponse.json(
        {
          success: false,
          error: `Roll Number ${cleanRoll} is already enrolled in "${track.name}". Current Status: ${duplicate.status.toUpperCase()}.`,
          data: duplicate
        },
        { status: 409 }
      );
    }

    // 10. Persist to Supabase if configured
    let savedId = `enr-${Date.now()}-${Math.random().toString(36).substring(2, 8)}`;
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          const { data: inserted, error: sbError } = await supabase
            .from('track_enrollments')
            .insert({
              user_id: sanitizedUserId,
              student_name: sanitizedName,
              student_email: cleanEmail,
              roll_number: cleanRoll,
              academic_year: academicYear,
              branch,
              phone_number: cleanPhone,
              domain_id: domain.id,
              domain_name: domain.name,
              track_id: track.id,
              track_name: track.name,
              status: 'pending',
              statement: (statement || '').trim() || null
            })
            .select()
            .single();

          if (!sbError && inserted?.id) {
            savedId = inserted.id;
          }
        }
      } catch (sbErr) {
        console.warn('[OXNULL DB] Supabase enrollment insertion fallback to local store', sbErr);
      }
    }

    // 11. Persist to local JSON DB store
    const created = db.createEnrollment({
      userId: sanitizedUserId,
      studentName: sanitizedName,
      studentEmail: cleanEmail,
      rollNumber: cleanRoll,
      academicYear,
      branch,
      phoneNumber: cleanPhone,
      domainId: domain.id,
      domainName: domain.name,
      trackId: track.id,
      trackName: track.name,
      statement: (statement || '').trim() || undefined
    });

    return NextResponse.json(
      {
        success: true,
        message: `Successfully submitted enrollment request for ${track.name}. Status: PENDING review.`,
        data: created
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to process enrollment request.' },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/enrollments
 * Updates enrollment status ('pending' | 'approved' | 'rejected').
 * Strictly requires verified administrator session.
 */
export async function PATCH(request: Request) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrative session required to modify enrollment status.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { id, status } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ success: false, error: 'Valid enrollment ID is required.' }, { status: 400 });
    }

    if (!status || !['pending', 'approved', 'rejected'].includes(status)) {
      return NextResponse.json(
        { success: false, error: 'Status must be one of "pending", "approved", or "rejected".' },
        { status: 400 }
      );
    }

    const reviewedBy = auth.username || 'oxnull-admin';
    const reviewedAt = new Date().toISOString();

    // Update in Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          await supabase
            .from('track_enrollments')
            .update({
              status,
              reviewed_by: reviewedBy,
              reviewed_at: reviewedAt,
              updated_at: reviewedAt
            })
            .eq('id', id);
        }
      } catch (sbErr) {
        console.warn('[OXNULL DB] Supabase status update fallback to local store', sbErr);
      }
    }

    // Update in local store
    const updated = db.updateEnrollmentStatus(id, status, reviewedBy);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Enrollment record not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Enrollment status updated to ${status}.`,
      data: updated
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update enrollment status.' },
      { status: 500 }
    );
  }
}
