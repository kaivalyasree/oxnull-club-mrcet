import { NextRequest, NextResponse } from 'next/server';
import { db, AwarenessArticle } from '@/lib/store';
import { verifyAdminSession } from '@/lib/admin-auth';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category') || 'all';
    const all = searchParams.get('all') === 'true';

    // If client requests drafts/all, check for authorized admin session
    let canViewAll = false;
    if (all) {
      const auth = await verifyAdminSession(request);
      canViewAll = auth.authorized;
    }

    const articles = db.getAwarenessArticles({
      publishedOnly: !canViewAll,
      category: category !== 'all' ? category : undefined
    });

    return NextResponse.json({
      success: true,
      count: articles.length,
      data: articles
    });
  } catch (error: any) {
    console.error('Error fetching awareness articles:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to retrieve awareness articles' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const body = await request.json();
    const { title, summary, category, source, sourceUrl, publishedDate } = body;

    if (!title?.trim() || !summary?.trim() || !category || !source?.trim() || !sourceUrl?.trim()) {
      return NextResponse.json(
        { success: false, error: 'Missing required article fields (title, summary, category, source, sourceUrl)' },
        { status: 400 }
      );
    }

    const validCategories = ['tech-news', 'cyber-news', 'scam-alert'];
    if (!validCategories.includes(category)) {
      return NextResponse.json(
        { success: false, error: 'Invalid category. Must be tech-news, cyber-news, or scam-alert' },
        { status: 400 }
      );
    }

    const newArticle = db.addAwarenessArticle({
      category,
      title: title.trim(),
      summary: summary.trim(),
      content: body.content?.trim() || '',
      publishedDate: publishedDate || new Date().toISOString().split('T')[0],
      source: source.trim(),
      sourceUrl: sourceUrl.trim(),
      tag: body.tag?.trim() || (category === 'tech-news' ? 'Weekly Tech News' : category === 'cyber-news' ? 'Cybersecurity Update' : 'Scam Alert'),
      scamType: body.scamType?.trim(),
      howItWorks: Array.isArray(body.howItWorks) ? body.howItWorks.filter((s: any) => typeof s === 'string' && s.trim()) : undefined,
      redFlags: Array.isArray(body.redFlags) ? body.redFlags.filter((s: any) => typeof s === 'string' && s.trim()) : undefined,
      safetyTips: Array.isArray(body.safetyTips) ? body.safetyTips.filter((s: any) => typeof s === 'string' && s.trim()) : undefined,
      whatToDoIfTargeted: body.whatToDoIfTargeted?.trim(),
      reportingResource: body.reportingResource && typeof body.reportingResource === 'object' ? {
        name: body.reportingResource.name?.trim() || 'National Cyber Crime Reporting Portal',
        helpline: body.reportingResource.helpline?.trim() || '1930',
        url: body.reportingResource.url?.trim() || 'https://cybercrime.gov.in'
      } : undefined,
      isPublished: body.isPublished !== false,
      cadenceNote: body.cadenceNote?.trim() || (category === 'tech-news' ? 'Published Weekly' : category === 'cyber-news' ? 'Fortnightly Editorial Schedule' : 'Public Scam Awareness')
    });

    return NextResponse.json({ success: true, data: newArticle }, { status: 201 });
  } catch (error: any) {
    console.error('Error creating awareness article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create awareness article' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const body = await request.json();
    const { id, action, ...updates } = body;

    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
    }

    if (action === 'toggle-publish') {
      const toggled = db.togglePublishAwarenessArticle(id);
      if (!toggled) {
        return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, data: toggled });
    }

    const updated = db.updateAwarenessArticle(id, updates);
    if (!updated) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    console.error('Error updating awareness article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update awareness article' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json({ success: false, error: auth.error || 'Unauthorized: Admin session required' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, error: 'Article ID is required' }, { status: 400 });
    }

    const deleted = db.deleteAwarenessArticle(id);
    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Article not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Article deleted successfully' });
  } catch (error: any) {
    console.error('Error deleting awareness article:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete awareness article' },
      { status: 500 }
    );
  }
}
