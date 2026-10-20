import { NextResponse } from 'next/server';
import { safeRevalidate } from '@/lib/cache';
import { db } from '@/lib/store';
import { verifyAdminSession } from '@/lib/admin-auth';
import { getServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import type { Resource } from '@/lib/data';

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

    // 1. If Supabase is configured, query Supabase resources table
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          let query = supabase.from('resources').select('*');

          if (publishedOnly) {
            query = query.eq('is_published', true);
          }
          if (domainId) {
            query = query.eq('domain_id', domainId);
          }
          if (subjectId) {
            query = query.eq('subject_id', subjectId);
          }

          const { data, error } = await query.order('created_at', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: Resource[] = data.map((row: any) => ({
              id: row.id,
              title: row.title,
              description: row.description || '',
              category: row.type || row.category || 'Documentation',
              difficulty: row.difficulty || 'Beginner',
              domainId: row.domain_id || undefined,
              domainName: row.domain_name || undefined,
              subjectId: row.subject_id || undefined,
              subjectName: row.subject_name || undefined,
              url: row.url,
              isExternal: row.url?.startsWith('http') || false,
              author: row.author || undefined,
              isPublished: row.is_published !== false,
              tags: Array.isArray(row.tags) ? row.tags : [],
              createdAt: row.created_at,
              updatedAt: row.updated_at
            }));
            return NextResponse.json({ success: true, data: mapped });
          }
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase fetch resources fallback to local store', sbErr);
      }
    }

    // 2. Fallback to local persistent store
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

    const resourceId = `r-${Date.now()}`;
    const isPublished = body.isPublished !== false;

    // 1. Transactional persistence in Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          await supabase.from('resources').insert({
            id: resourceId,
            title: body.title.trim(),
            description: body.description?.trim() || '',
            domain_id: body.domainId || null,
            difficulty: body.difficulty || 'Beginner',
            type: body.category || 'Documentation',
            url: body.url.trim(),
            author: auth.username || '0XNULL Admin',
            is_published: isPublished,
            subject_id: body.subjectId || null,
            subject_name: body.subjectName || null,
            tags: Array.isArray(body.tags) ? body.tags : []
          });
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase insert resource fallback to local store', sbErr);
      }
    }

    // 2. Persist to local store
    const created = db.addResource({
      title: body.title.trim(),
      description: body.description?.trim() || '',
      category: body.category || 'Documentation',
      difficulty: body.difficulty || 'Beginner',
      domainId: body.domainId || undefined,
      domainName: body.domainName || undefined,
      subjectId: body.subjectId || undefined,
      subjectName: body.subjectName || undefined,
      url: body.url.trim(),
      isExternal: body.url.startsWith('http'),
      isPublished,
      tags: Array.isArray(body.tags) ? body.tags : []
    });

    // 3. Cache revalidation
    try {
      safeRevalidate('/resources');
      safeRevalidate('/domains');
      safeRevalidate('/learn');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

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

      if (isSupabaseConfigured) {
        try {
          const supabase = getServerSupabaseClient();
          if (supabase) {
            await supabase
              .from('resources')
              .update({ is_published: updated.isPublished, updated_at: new Date().toISOString() })
              .eq('id', body.id);
          }
        } catch (sbErr) {
          console.warn('[OXNULL] Supabase toggle-publish resource fallback', sbErr);
        }
      }

      try {
        safeRevalidate('/resources');
        safeRevalidate('/domains');
        safeRevalidate('/learn');
      } catch (revErr) {
        console.warn('Revalidation warning:', revErr);
      }

      return NextResponse.json({ success: true, data: updated });
    }

    if (body.url && !isValidUrl(body.url)) {
      return NextResponse.json(
        { success: false, error: 'Invalid URL. Please provide a valid HTTP/HTTPS URL or secure internal path.' },
        { status: 400 }
      );
    }

    // Update in Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          const sbPayload: any = { updated_at: new Date().toISOString() };
          if (body.title) sbPayload.title = body.title.trim();
          if (body.description !== undefined) sbPayload.description = body.description.trim();
          if (body.domainId !== undefined) sbPayload.domain_id = body.domainId || null;
          if (body.difficulty) sbPayload.difficulty = body.difficulty;
          if (body.category) sbPayload.type = body.category;
          if (body.url) sbPayload.url = body.url.trim();
          if (body.subjectId !== undefined) sbPayload.subject_id = body.subjectId || null;
          if (body.subjectName !== undefined) sbPayload.subject_name = body.subjectName || null;
          if (Array.isArray(body.tags)) sbPayload.tags = body.tags;
          if (body.isPublished !== undefined) sbPayload.is_published = body.isPublished;

          await supabase.from('resources').update(sbPayload).eq('id', body.id);
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase update resource fallback', sbErr);
      }
    }

    const updated = db.updateResource(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Resource not found' }, { status: 404 });
    }

    try {
      safeRevalidate('/resources');
      safeRevalidate('/domains');
      safeRevalidate('/learn');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
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

    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          await supabase.from('resources').delete().eq('id', id);
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase delete resource fallback', sbErr);
      }
    }

    const deleted = db.deleteResource(id);

    try {
      safeRevalidate('/resources');
      safeRevalidate('/domains');
      safeRevalidate('/learn');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete resource' }, { status: 500 });
  }
}
