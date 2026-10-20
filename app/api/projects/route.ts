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
    const all = searchParams.get('all') === 'true';

    const auth = await verifyAdminSession(request);
    const isAdmin = auth.authorized;

    const publishedOnly = !isAdmin || !all;

    const projects = db.getProjects({
      publishedOnly,
      domainId: domainId || undefined
    });

    return NextResponse.json({ success: true, data: projects });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch projects' }, { status: 500 });
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
    if (!body.title?.trim() || !body.domainId) {
      return NextResponse.json(
        { success: false, error: 'Project title and domain are required' },
        { status: 400 }
      );
    }

    if (body.githubUrl && !isValidUrl(body.githubUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid GitHub URL. Must be a valid HTTP/HTTPS link.' },
        { status: 400 }
      );
    }

    if (body.demoUrl && !isValidUrl(body.demoUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Demo URL. Must be a valid HTTP/HTTPS link.' },
        { status: 400 }
      );
    }

    const created = db.addProject({
      title: body.title.trim(),
      description: body.description?.trim() || '',
      domainId: body.domainId,
      domainName: body.domainName || 'General',
      tags: Array.isArray(body.tags) ? body.tags : [],
      stars: typeof body.stars === 'number' ? body.stars : 0,
      status: body.status || 'Active',
      githubUrl: body.githubUrl?.trim() || undefined,
      demoUrl: body.demoUrl?.trim() || undefined,
      thumbnail: body.thumbnail?.trim() || undefined,
      isPublished: body.isPublished !== false
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create project' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'Project ID is required' }, { status: 400 });
    }

    if (body.action === 'toggle-publish') {
      const updated = db.togglePublishProject(body.id);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    if (body.githubUrl && !isValidUrl(body.githubUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid GitHub URL. Must be a valid HTTP/HTTPS link.' },
        { status: 400 }
      );
    }

    if (body.demoUrl && !isValidUrl(body.demoUrl)) {
      return NextResponse.json(
        { success: false, error: 'Invalid Demo URL. Must be a valid HTTP/HTTPS link.' },
        { status: 400 }
      );
    }

    const updated = db.updateProject(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update project' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'Project ID required' }, { status: 400 });
    }
    const deleted = db.deleteProject(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
