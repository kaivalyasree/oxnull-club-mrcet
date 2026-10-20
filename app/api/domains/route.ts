import { NextResponse } from 'next/server';
import { safeRevalidate } from '@/lib/cache';
import { db } from '@/lib/store';
import { verifyAdminSession } from '@/lib/admin-auth';
import { getServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import type { Domain } from '@/lib/data';

export async function GET() {
  try {
    // 1. If Supabase is configured, query domains
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase
            .from('domains')
            .select('*')
            .order('number', { ascending: true });

          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: Domain[] = data.map((row: any) => ({
              id: row.id,
              slug: row.slug,
              number: row.number,
              name: row.name,
              badge: row.badge,
              tagline: row.tagline,
              overview: row.overview,
              focusAreas: Array.isArray(row.focus_areas) ? row.focus_areas : [],
              learningPathway: row.learning_pathway || [],
              activities: row.activities || []
            }));
            return NextResponse.json({ success: true, data: mapped });
          }
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase fetch domains fallback to local store', sbErr);
      }
    }

    // 2. Fallback to local persistent store
    const domains = db.getDomains();
    return NextResponse.json({ success: true, data: domains });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch domains' },
      { status: 500 }
    );
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
    const { slug, name, tagline, badge, overview, focusAreas, learningPathway } = body;

    if (!slug) {
      return NextResponse.json(
        { success: false, error: 'Domain slug or ID is required.' },
        { status: 400 }
      );
    }

    // 1. Update in Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          const updatePayload: any = {};
          if (name) updatePayload.name = name;
          if (tagline) updatePayload.tagline = tagline;
          if (badge) updatePayload.badge = badge;
          if (overview) updatePayload.overview = overview;
          if (Array.isArray(focusAreas)) updatePayload.focus_areas = focusAreas;

          await supabase
            .from('domains')
            .update(updatePayload)
            .eq('slug', slug);
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase update domain fallback to local store', sbErr);
      }
    }

    // 2. Update in local store
    const updated = db.updateDomain(slug, {
      name,
      tagline,
      badge,
      overview,
      focusAreas: Array.isArray(focusAreas) ? focusAreas : undefined,
      learningPathway: Array.isArray(learningPathway) ? learningPathway : undefined
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Domain not found' },
        { status: 404 }
      );
    }

    // 3. Next.js cache revalidation
    safeRevalidate('/');
    safeRevalidate('/domains');
    safeRevalidate(`/domains/${slug}`);

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update domain' },
      { status: 500 }
    );
  }
}
