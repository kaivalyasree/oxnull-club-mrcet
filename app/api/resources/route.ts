import { NextResponse } from 'next/server';
import { db } from '@/lib/store';
import { verifyAdminSession } from '@/lib/admin-auth';

function isValidUrl(urlStr: string): boolean {
  if (!urlStr || typeof urlStr !== 'string') return false;
  const trimmed = urlStr.trim();
  if (trimmed.startsWith('/') && !trimmed.startsWith('//')) return true;
  try {
    const parsed = new URL(trimmed);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const domainId = searchParams.get('domainId');
    const subjectId = searchParams.get('subjectId');
    const all = searchParams.get('all') === 'true';

    // Check if caller is authenticated admin
    const auth = await verifyAdminSession(request);
    const isAdmin = auth.authorized;

    // Public visitors MUST only see published items
    const publishedOnly = !isAdmin || !all;

    const resources = db.getResources({
      publishedOnly,
      domainId: domainId || undefined,
      subjectId: subjectId || undefined
    });

    return NextResponse.json({ success: true, data: resources });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch resources' }, { status: 500 });
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
    if (!body.title?.trim() || !body.url?.trim()) {
      return NextResponse.json({ success: false, error: 'Title and URL are required' }, { status: 400 });
    }

    if (!isValidUrl(body.url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL. Please provide a valid HTTP/HTTPS URL or secure internal path.' },
        { status: 400 }
      );
    }

    const created = db.addResource({
      title: body.title.trim(),
      description: body.description?.trim() || '',
      category: body.category || 'Documentation',
      difficulty: body.difficulty || 'Beginner',
      domainId: body.domainId || 'd1',
      domainName: body.domainName || 'General',
      subjectId: body.subjectId || undefined,
      subjectName: body.subjectName || undefined,
      url: body.url.trim(),
      isExternal: body.url.startsWith('http'),
      isPublished: body.isPublished !== false,
      tags: Array.isArray(body.tags) ? body.tags : []
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create resource' }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrative session required.' },
        { status: 401 }
      );
    }

    const body = await request.json();
    if (!body.id) {
      return NextResponse.json({ success: false, error: 'Resource ID is required' }, { status: 400 });
    }

    if (body.action === 'toggle-publish') {
      const updated = db.togglePublishResource(body.id);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    if (body.url && !isValidUrl(body.url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL. Please provide a valid HTTP/HTTPS URL or secure internal path.' },
        { status: 400 }
      );
    }

    const updated = db.updateResource(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update resource' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'Resource ID required' }, { status: 400 });
    }
    const deleted = db.deleteResource(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete resource' }, { status: 500 });
  }
}
