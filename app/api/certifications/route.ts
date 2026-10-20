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

    const certs = db.getCertifications({
      publishedOnly,
      domainId: domainId || undefined
    });

    return NextResponse.json({ success: true, data: certs });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch certifications' }, { status: 500 });
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
    if (!body.name?.trim() || !body.provider?.trim() || !body.domainId) {
      return NextResponse.json(
        { success: false, error: 'Certification name, issuing organization, and domain are required' },
        { status: 400 }
      );
    }

    if (body.url && !isValidUrl(body.url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL. Please provide a valid HTTP/HTTPS URL.' },
        { status: 400 }
      );
    }

    const created = db.addCertification({
      name: body.name.trim(),
      provider: body.provider.trim(),
      domainId: body.domainId,
      domainName: body.domainName || 'General',
      level: body.level || 'Intermediate',
      cost: body.cost?.trim() || 'Paid',
      url: body.url?.trim() || '#',
      description: body.description?.trim() || '',
      isPublished: body.isPublished !== false,
      tags: Array.isArray(body.tags) ? body.tags : []
    });

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create certification' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'Certification ID is required' }, { status: 400 });
    }

    if (body.action === 'toggle-publish') {
      const updated = db.togglePublishCertification(body.id);
      if (!updated) {
        return NextResponse.json({ success: false, error: 'Certification not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: updated });
    }

    if (body.url && !isValidUrl(body.url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL. Please provide a valid HTTP/HTTPS URL.' },
        { status: 400 }
      );
    }

    const updated = db.updateCertification(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Certification not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update certification' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'Certification ID required' }, { status: 400 });
    }
    const deleted = db.deleteCertification(id);
    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete certification' }, { status: 500 });
  }
}
