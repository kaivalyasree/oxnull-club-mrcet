import { NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { DOMAINS } from '@/lib/data';
import { verifyAdminSession } from '@/lib/admin-auth';

/**
 * GET /api/tracks
 * Public read access for domain tracks.
 * Query params: ?domainId=...
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId') || undefined;
    const tracks = db.getTracks(domainId);
    return NextResponse.json({ success: true, data: tracks });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to fetch tracks' },
      { status: 500 }
    );
  }
}

/**
 * POST /api/tracks
 * Authorized admin only. Creates a new core track.
 */
export async function POST(request: Request) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { name, description, domainId, topics, deliverable, isActive } = body;

    if (!name || typeof name !== 'string' || name.trim().length < 3) {
      return NextResponse.json({ success: false, error: 'Track name is required (min 3 chars).' }, { status: 400 });
    }

    if (!description || typeof description !== 'string' || description.trim().length < 10) {
      return NextResponse.json(
        { success: false, error: 'Track description is required (min 10 chars).' },
        { status: 400 }
      );
    }

    const domain = DOMAINS.find((d) => d.id === domainId || d.slug === domainId);
    if (!domain) {
      return NextResponse.json({ success: false, error: 'Valid domainId is required.' }, { status: 400 });
    }

    const newTrack = db.addTrack({
      name: name.trim(),
      description: description.trim(),
      domainId: domain.id,
      domainSlug: domain.slug,
      topics: Array.isArray(topics) ? topics : typeof topics === 'string' ? topics.split(',').map((s) => s.trim()).filter(Boolean) : [],
      deliverable: (deliverable || '').trim() || undefined,
      isActive: isActive !== false
    });

    return NextResponse.json({ success: true, data: newTrack }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to create track' },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/tracks
 * Authorized admin only. Updates a core track or toggles its active status.
 */
export async function PUT(request: Request) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const body = await request.json().catch(() => ({}));
    const { id, name, description, topics, deliverable, isActive } = body;

    if (!id || typeof id !== 'string') {
      return NextResponse.json({ success: false, error: 'Track ID is required.' }, { status: 400 });
    }

    const updatePayload: any = {};
    if (name) updatePayload.name = name.trim();
    if (description) updatePayload.description = description.trim();
    if (topics !== undefined) {
      updatePayload.topics = Array.isArray(topics)
        ? topics
        : typeof topics === 'string'
        ? topics.split(',').map((s: string) => s.trim()).filter(Boolean)
        : [];
    }
    if (deliverable !== undefined) updatePayload.deliverable = deliverable.trim();
    if (isActive !== undefined) updatePayload.isActive = Boolean(isActive);

    const updated = db.updateTrack(id, updatePayload);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Track not found.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to update track' },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/tracks
 * Authorized admin only. Deletes a track with referential integrity protection.
 */
export async function DELETE(request: Request) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Admin session required.' },
        { status: 401 }
      );
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Track ID is required.' }, { status: 400 });
    }

    const result = db.deleteTrack(id);
    if (!result.success) {
      return NextResponse.json({ success: false, error: result.error || 'Failed to delete track.' }, { status: 400 });
    }

    return NextResponse.json({ success: true, message: 'Track removed or deactivated successfully.' });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error?.message || 'Failed to delete track' },
      { status: 500 }
    );
  }
}
