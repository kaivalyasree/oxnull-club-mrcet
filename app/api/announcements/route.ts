import { NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { verifyAdminSession } from '@/lib/admin-auth';

export async function GET() {
  try {
    const announcements = db.getAnnouncements();
    return NextResponse.json({ success: true, data: announcements });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch announcements' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrative session required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }
    const created = db.addAnnouncement(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create announcement' }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrative session required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ success: false, error: 'ID required' }, { status: 400 });
    }
    const deleted = db.deleteAnnouncement(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete announcement' }, { status: 500 });
  }
}
