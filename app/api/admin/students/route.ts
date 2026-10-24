import { NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { verifyAdminSession } from '@/lib/admin-auth';

/**
 * GET /api/admin/students
 * Authorized admin only.
 * Returns aggregated list of registered students with their profile info and enrollment history.
 * No passwords, hashes, tokens, or cookies are ever exposed.
 */
export async function GET(request: Request) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const query = (searchParams.get('q') || searchParams.get('search') || '').trim().toLowerCase();
    const branchFilter = searchParams.get('branch') || 'all';
    const yearFilter = searchParams.get('year') || 'all';

    const applications = db.getApplications();
    const enrollments = db.getEnrollments();
    const store = db.getStore();
    const userProgress = store.userProgress || {};

    // Group by unique rollNumber or userId
    const studentMap = new Map<string, {
      userId: string;
      fullName: string;
      email: string;
      rollNumber: string;
      academicYear: string;
      branch: string;
      phoneNumber: string;
      clubApplicationStatus?: string;
      registeredAt: string;
      enrollments: Array<{
        id: string;
        domainName: string;
        trackName: string;
        status: string;
        createdAt: string;
        reviewedAt?: string;
        reviewedBy?: string;
      }>;
    }>();

    // 1. Ingest from Club Applications
    for (const app of applications) {
      const key = (app.rollNumber || app.userId || app.id).toUpperCase();
      if (!studentMap.has(key)) {
        studentMap.set(key, {
          userId: app.userId,
          fullName: app.fullName,
          email: `${app.rollNumber.toLowerCase()}@mrcet.ac.in`,
          rollNumber: app.rollNumber,
          academicYear: app.year,
          branch: app.branch,
          phoneNumber: app.phoneNumber,
          clubApplicationStatus: app.status,
          registeredAt: app.createdAt,
          enrollments: []
        });
      }
    }

    // 2. Ingest from Track Enrollments
    for (const enr of enrollments) {
      const key = (enr.rollNumber || enr.userId || enr.id).toUpperCase();
      let record = studentMap.get(key);

      if (!record) {
        record = {
          userId: enr.userId,
          fullName: enr.fullName || (enr as any).studentName || 'Student Member',
          email: enr.email || (enr as any).studentEmail || `${enr.rollNumber.toLowerCase()}@mrcet.ac.in`,
          rollNumber: enr.rollNumber,
          academicYear: enr.year || (enr as any).academicYear || 'Member',
          branch: enr.branch,
          phoneNumber: enr.phoneNumber,
          clubApplicationStatus: 'enrolled',
          registeredAt: enr.createdAt,
          enrollments: []
        };
        studentMap.set(key, record);
      } else {
        const studentEmail = enr.email || (enr as any).studentEmail;
        if (studentEmail && !record.email.includes('@')) {
          record.email = studentEmail;
        }
      }

      record.enrollments.push({
        id: enr.id,
        domainName: enr.domainName,
        trackName: enr.trackTitle || (enr as any).trackName || 'Core Track',
        status: enr.status,
        createdAt: enr.createdAt,
        reviewedAt: enr.reviewedAt,
        reviewedBy: enr.reviewedBy
      });
    }

    let students = Array.from(studentMap.values());

    // Apply Filters
    if (query) {
      students = students.filter(
        (s) =>
          s.fullName.toLowerCase().includes(query) ||
          s.email.toLowerCase().includes(query) ||
          s.rollNumber.toLowerCase().includes(query) ||
          s.branch.toLowerCase().includes(query)
      );
    }

    if (branchFilter !== 'all') {
      students = students.filter((s) => s.branch === branchFilter);
    }

    if (yearFilter !== 'all') {
      students = students.filter((s) => s.academicYear === yearFilter);
    }

    // Sort by registeredAt descending
    students.sort((a, b) => new Date(b.registeredAt).getTime() - new Date(a.registeredAt).getTime());

    return NextResponse.json({ success: true, data: students });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch student directory' },
      { status: 500 }
    );
  }
}
