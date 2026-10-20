import { NextResponse } from 'next/server';
import { safeRevalidate } from '@/lib/cache';
import { db } from '@/lib/store';
import { verifyAdminSession } from '@/lib/admin-auth';
import { getServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';
import type { Announcement } from '@/lib/data';

export async function GET() {
  try {
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          const { data, error } = await supabase.from('announcements').select('*');
          if (!error && Array.isArray(data) && data.length > 0) {
            const mapped: Announcement[] = data.map((row: any) => ({
              id: row.id,
              title: row.title,
              content: row.content,
              date: row.date,
              author: row.author,
              tag: row.tag || 'Official'
            }));
            return NextResponse.json({ success: true, data: mapped });
          }
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase announcements fetch fallback', sbErr);
      }
    }

    const announcements = db.getAnnouncements();
    return NextResponse.json({ success: true, data: announcements });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch announcements' }, { status: 500 });
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
    if (!body.title || !body.content) {
      return NextResponse.json({ success: false, error: 'Title and content are required' }, { status: 400 });
    }

    const annId = `ann-${Date.now()}`;
    const dateStr = new Date().toISOString().split('T')[0];

    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          await supabase.from('announcements').insert({
            id: annId,
            title: body.title.trim(),
            content: body.content.trim(),
            date: dateStr,
            author: body.author || auth.username || 'Admin'
          });
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase announcement insert fallback', sbErr);
      }
    }

    const created = db.addAnnouncement({
      title: body.title.trim(),
      content: body.content.trim(),
      tag: body.tag || 'Official',
      date: dateStr,
      author: body.author || auth.username || 'Admin'
    });

    safeRevalidate('/');

    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to create announcement' }, { status: 500 });
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
          await supabase.from('announcements').delete().eq('id', id);
        }
      } catch (sbErr) {
        console.warn('[OXNULL] Supabase announcement delete fallback', sbErr);
      }
    }

    const deleted = db.deleteAnnouncement(id);

    safeRevalidate('/');

    return NextResponse.json({ success: deleted });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to delete announcement' }, { status: 500 });
  }
}
