import { NextResponse } from 'next/server';
import { safeRevalidate } from '@/lib/cache';
import { db } from '@/lib/store';
import { verifyAdminSession } from '@/lib/admin-auth';
import { getServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import type { LearningSubject } from '@/lib/data';

export async function GET() {
  try {
    // 1. If Supabase is configured on server, query learning_subjects
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase
            .from('learning_subjects')
            .select('*')
            .order('number', { ascending: true });

          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: LearningSubject[] = data.map((row: any) => ({
              id: row.id,
              slug: row.slug,
              number: row.number,
              title: row.title,
              subtitle: row.subtitle,
              description: row.description,
              keyConcepts: Array.isArray(row.key_concepts) ? row.key_concepts : [],
              handsOnLab: row.hands_on_lab || ''
            }));
            return NextResponse.json({ success: true, data: mapped });
          }
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase fetch learning_subjects fallback to local store', sbErr);
      }
    }

    // 2. Fallback to local database store
    const subjects = db.getLearningSubjects();
    return NextResponse.json({ success: true, data: subjects });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to fetch learning subjects' },
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
    const { slug, title, subtitle, description, keyConcepts, handsOnLab } = body;

    if (!slug || !title) {
      return NextResponse.json(
        { success: false, error: 'Subject slug and title are required.' },
        { status: 400 }
      );
    }

    // 1. Update in Supabase if configured
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          await supabase
            .from('learning_subjects')
            .update({
              title,
              subtitle: subtitle || '',
              description: description || '',
              key_concepts: Array.isArray(keyConcepts) ? keyConcepts : [],
              hands_on_lab: handsOnLab || '',
              updated_at: new Date().toISOString()
            })
            .eq('slug', slug);
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase update learning_subjects fallback to local store', sbErr);
      }
    }

    // 2. Update in local store
    const updated = db.updateLearningSubject(slug, {
      title,
      subtitle,
      description,
      keyConcepts: Array.isArray(keyConcepts) ? keyConcepts : undefined,
      handsOnLab
    });

    if (!updated) {
      return NextResponse.json(
        { success: false, error: 'Learning subject not found' },
        { status: 404 }
      );
    }

    // 3. Next.js cache revalidation
    try {
      safeRevalidate('/learn');
      safeRevalidate(`/learn/${slug}`);
    } catch (revErr) {
      console.warn('Revalidation warning:', revErr);
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: 'Failed to update learning subject' },
      { status: 500 }
    );
  }
}
