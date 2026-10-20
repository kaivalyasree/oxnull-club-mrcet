import { NextResponse } from 'next/server';
import { safeRevalidate } from '@/lib/cache';
import { db } from '@/lib/store';
import { verifyAdminSession } from '@/lib/admin-auth';
import { getServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import type { Activity } from '@/lib/data';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('activities').select('*');
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: Activity[] = data.map((row: any) => ({
              id: row.id,
              number: row.number || '01',
              title: row.title,
              subtitle: row.subtitle || '',
              format: row.format || 'Technical',
              frequency: row.frequency || 'Weekly',
              description: row.description || '',
              summary: row.description || '',
              participants: row.participants || 'All Members',
              type: row.format || 'Technical',
              domainId: row.domain_id || undefined,
              domainName: row.domain_name || undefined,
              level: 'All Levels',
              cadence: row.frequency || 'Weekly',
              outcomes: []
            }));
            return NextResponse.json({ success: true, data: mapped });
          }
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase activities fetch fallback', sbErr);
      }
    }

    const activities = db.getActivities();
    return NextResponse.json({ success: true, data: activities });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch activities' }, { status: 500 });
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
    if (!body.title || (!body.summary && !body.description)) {
      return NextResponse.json({ success: false, error: 'Title and description are required' }, { status: 400 });
    }

    const actId = `act-${Date.now()}`;
    const desc = body.description || body.summary || '';

    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          await supabase.from('activities').insert({
            id: actId,
            number: body.number || '01',
            title: body.title.trim(),
            subtitle: body.subtitle?.trim() || '',
            format: body.format || body.type || 'Technical',
            frequency: body.frequency || 'Weekly',
            description: desc.trim(),
            participants: body.participants?.trim() || 'All Members',
            domain_id: body.domainId || null
          });
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase activity insert fallback', sbErr);
      }
    }

    const created = db.addActivity({
      ...body,
      description: desc,
      summary: desc
    });

    safeRevalidate('/activities');

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create activity' }, { status: 500 });
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
      return NextResponse.json({ success: false, error: 'ID is required' }, { status: 400 });
    }

    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          const sbPayload: any = {};
          if (body.title) sbPayload.title = body.title.trim();
          if (body.subtitle !== undefined) sbPayload.subtitle = body.subtitle.trim();
          if (body.type || body.format) sbPayload.format = body.type || body.format;
          if (body.frequency) sbPayload.frequency = body.frequency;
          if (body.description || body.summary) sbPayload.description = (body.description || body.summary).trim();
          if (body.participants !== undefined) sbPayload.participants = body.participants.trim();
          if (body.domainId !== undefined) sbPayload.domain_id = body.domainId || null;

          await supabase.from('activities').update(sbPayload).eq('id', body.id);
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase activity update fallback', sbErr);
      }
    }

    const updated = db.updateActivity(body.id, body);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Activity not found' }, { status: 404 });
    }

    safeRevalidate('/activities');

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to update activity' }, { status: 500 });
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

    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          await supabase.from('activities').delete().eq('id', id);
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase activity delete fallback', sbErr);
      }
    }

    const deleted = db.deleteActivity(id);

    safeRevalidate('/activities');

    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete activity' }, { status: 500 });
  }
}
