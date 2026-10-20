import { NextResponse } from 'next/server';
import { safeRevalidate } from '@/lib/cache';
import { db } from '@/lib/store';
import { verifyAdminSession } from '@/lib/admin-auth';
import { getServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import type { Project } from '@/lib/data';

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

    // 1. If Supabase is configured, query projects
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          let query = supabase.from('projects').select('*');
          if (publishedOnly) {
            query = query.eq('is_published', true);
          }
          if (domainId) {
            query = query.eq('domain_id', domainId);
          }

          const { data, error } = await query.order('created_at', { ascending: false });
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: Project[] = data.map((row: any) => ({
              id: row.id,
              title: row.name || row.title,
              description: row.description || '',
              domainId: row.domain_id || undefined,
              domainName: row.domain_name || undefined,
              difficulty: row.difficulty || 'Intermediate',
              techStack: Array.isArray(row.technologies) ? row.technologies : [],
              tags: Array.isArray(row.tags) ? row.tags : [],
              stars: typeof row.stars === 'number' ? row.stars : 0,
              status: row.status || 'Active',
              githubUrl: row.repository_url || row.github_url || undefined,
              demoUrl: row.demo_url || undefined,
              thumbnail: row.thumbnail || undefined,
              imageUrl: row.thumbnail || undefined,
              isPublished: row.is_published !== false,
              createdAt: row.created_at,
              updatedAt: row.updated_at
            }));
            return NextResponse.json({ success: true, data: mapped });
          }
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase fetch projects fallback to local store', sbErr);
      }
    }

    // 2. Fallback to local store
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

    const projId = `p-${Date.now()}`;
    const isPublished = body.isPublished !== false;

    // 1. Transactional persistence in Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          await supabase.from('projects').insert({
            id: projId,
            name: body.title.trim(),
            description: body.description?.trim() || '',
            domain_id: body.domainId,
            difficulty: body.difficulty || 'Intermediate',
            technologies: Array.isArray(body.techStack) ? body.techStack : (Array.isArray(body.tags) ? body.tags : []),
            status: body.status || 'Active',
            repository_url: body.githubUrl?.trim() || null,
            demo_url: body.demoUrl?.trim() || null,
            stars: typeof body.stars === 'number' ? body.stars : 0,
            thumbnail: body.thumbnail?.trim() || body.imageUrl?.trim() || null,
            is_published: isPublished,
            tags: Array.isArray(body.tags) ? body.tags : []
          });
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase insert project fallback to local store', sbErr);
      }
    }

    // 2. Persist to local store
    const created = db.addProject({
      title: body.title.trim(),
      description: body.description?.trim() || '',
      domainId: body.domainId,
      domainName: body.domainName || 'General',
      tags: Array.isArray(body.tags) ? body.tags : [],
      techStack: Array.isArray(body.techStack) ? body.techStack : (Array.isArray(body.tags) ? body.tags : []),
      stars: typeof body.stars === 'number' ? body.stars : 0,
      status: body.status || 'Active',
      githubUrl: body.githubUrl?.trim() || undefined,
      demoUrl: body.demoUrl?.trim() || undefined,
      thumbnail: body.thumbnail?.trim() || body.imageUrl?.trim() || undefined,
      imageUrl: body.thumbnail?.trim() || body.imageUrl?.trim() || undefined,
      isPublished
    });

    // 3. Cache revalidation
    try {
      safeRevalidate('/projects');
      safeRevalidate('/domains');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

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

      if (isSupabaseConfigured) {
        try {
          const supabase = getServerSupabaseClient();
          if (supabase) {
            await supabase
              .from('projects')
              .update({ is_published: updated.isPublished, updated_at: new Date().toISOString() })
              .eq('id', body.id);
          }
        } catch (sbErr) {
          console.warn('[OXNULL] Supabase toggle-publish project fallback', sbErr);
        }
      }

      try {
        safeRevalidate('/projects');
        safeRevalidate('/domains');
      } catch (revErr) {
        console.warn('Revalidation warning:', revErr);
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

    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          const sbPayload: any = { updated_at: new Date().toISOString() };
          if (body.title) sbPayload.name = body.title.trim();
          if (body.description !== undefined) sbPayload.description = body.description.trim();
          if (body.domainId !== undefined) sbPayload.domain_id = body.domainId;
          if (body.difficulty) sbPayload.difficulty = body.difficulty;
          if (Array.isArray(body.techStack) || Array.isArray(body.technologies)) {
            sbPayload.technologies = body.techStack || body.technologies;
          }
          if (body.status) sbPayload.status = body.status;
          if (body.githubUrl !== undefined) sbPayload.repository_url = body.githubUrl;
          if (body.demoUrl !== undefined) sbPayload.demo_url = body.demoUrl;
          if (typeof body.stars === 'number') sbPayload.stars = body.stars;
          if (body.thumbnail !== undefined) sbPayload.thumbnail = body.thumbnail;
          if (Array.isArray(body.tags)) sbPayload.tags = body.tags;
          if (body.isPublished !== undefined) sbPayload.is_published = body.isPublished;

          await supabase.from('projects').update(sbPayload).eq('id', body.id);
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase update project fallback', sbErr);
      }
    }

    const updated = db.updateProject(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Project not found' }, { status: 404 });
    }

    try {
      safeRevalidate('/projects');
      safeRevalidate('/domains');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
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

    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          await supabase.from('projects').delete().eq('id', id);
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase delete project fallback', sbErr);
      }
    }

    const deleted = db.deleteProject(id);

    try {
      safeRevalidate('/projects');
      safeRevalidate('/domains');
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete project' }, { status: 500 });
  }
}
