import { NextResponse } from 'next/server';
import { safeRevalidate } from '@/lib/cache';
import { db } from '@/lib/store';
import { verifyAdminSession } from '@/lib/admin-auth';
import { getServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import type { Certification } from '@/lib/data';

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

    // 1. If Supabase is configured, query certifications
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          let query = supabase.from('certifications').select('*');
          if (publishedOnly) {
            query = query.eq('is_published', true);
          }
          if (domainId) {
            query = query.eq('domain_id', domainId);
          }

          const { data, error } = await query.order('created_at', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: Certification[] = data.map((row: any) => ({
              id: row.id,
              name: row.title || row.name,
              provider: row.provider,
              domainId: row.domain_id || undefined,
              domainName: row.domain_name || undefined,
              level: row.level || 'Intermediate',
              cost: row.cost || 'Paid',
              url: row.url || '#',
              description: row.description || '',
              examCode: row.exam_code || undefined,
              isPublished: row.is_published !== false,
              tags: Array.isArray(row.tags) ? row.tags : [],
              createdAt: row.created_at,
              updatedAt: row.updated_at
            }));
            return NextResponse.json({ success: true, data: mapped });
          }
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase fetch certifications fallback to local store', sbErr);
      }
    }

    // 2. Fallback to local store
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

    const certId = `c-${Date.now()}`;
    const isPublished = body.isPublished !== false;

    // 1. Transactional persistence in Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          await supabase.from('certifications').insert({
            id: certId,
            title: body.name.trim(),
            provider: body.provider.trim(),
            domain_id: body.domainId,
            level: body.level || 'Intermediate',
            cost: body.cost?.trim() || 'Paid',
            url: body.url?.trim() || '#',
            description: body.description?.trim() || '',
            exam_code: body.examCode || body.code || null,
            is_published: isPublished,
            tags: Array.isArray(body.tags) ? body.tags : []
          });
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase insert certification fallback to local store', sbErr);
      }
    }

    // 2. Persist to local store
    const created = db.addCertification({
      name: body.name.trim(),
      provider: body.provider.trim(),
      domainId: body.domainId,
      domainName: body.domainName || 'General',
      level: body.level || 'Intermediate',
      cost: body.cost?.trim() || 'Paid',
      url: body.url?.trim() || '#',
      description: body.description?.trim() || '',
      isPublished,
      tags: Array.isArray(body.tags) ? body.tags : []
    });

    // 3. Cache revalidation
    try {
      safeRevalidate('/certifications');
      safeRevalidate('/domains');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

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

      if (isSupabaseConfigured) {
        try {
          const supabase = getServerSupabaseClient();
          if (supabase) {
            await supabase
              .from('certifications')
              .update({ is_published: updated.isPublished, updated_at: new Date().toISOString() })
              .eq('id', body.id);
          }
        } catch (sbErr) {
          console.warn('[OXNULL] Supabase toggle-publish certification fallback', sbErr);
        }
      }

      try {
        safeRevalidate('/certifications');
        safeRevalidate('/domains');
      } catch (revErr) {
        console.warn('Revalidation warning:', revErr);
      }

      return NextResponse.json({ success: true, data: updated });
    }

    if (body.url && !isValidUrl(body.url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL. Please provide a valid HTTP/HTTPS URL.' },
        { status: 400 }
      );
    }

    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          const sbPayload: any = { updated_at: new Date().toISOString() };
          if (body.name) sbPayload.title = body.name.trim();
          if (body.provider) sbPayload.provider = body.provider.trim();
          if (body.domainId !== undefined) sbPayload.domain_id = body.domainId;
          if (body.level) sbPayload.level = body.level;
          if (body.cost !== undefined) sbPayload.cost = body.cost;
          if (body.url) sbPayload.url = body.url.trim();
          if (body.description !== undefined) sbPayload.description = body.description.trim();
          if (body.examCode !== undefined) sbPayload.exam_code = body.examCode;
          if (Array.isArray(body.tags)) sbPayload.tags = body.tags;
          if (body.isPublished !== undefined) sbPayload.is_published = body.isPublished;

          await supabase.from('certifications').update(sbPayload).eq('id', body.id);
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase update certification fallback', sbErr);
      }
    }

    const updated = db.updateCertification(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Certification not found' }, { status: 404 });
    }

    try {
      safeRevalidate('/certifications');
      safeRevalidate('/domains');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
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

    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          await supabase.from('certifications').delete().eq('id', id);
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase delete certification fallback', sbErr);
      }
    }

    const deleted = db.deleteCertification(id);

    try {
      safeRevalidate('/certifications');
      safeRevalidate('/domains');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete certification' }, { status: 500 });
  }
}
