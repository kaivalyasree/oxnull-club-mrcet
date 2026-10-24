import { NextResponse } from 'next/server';

interface NewsItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  source: string;
  snippet: string;
}

let cachedNews: { data: NewsItem[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 5 * 60 * 1000; // 5 minutes

export async function GET() {
  try {
    const now = Date.now();
    if (cachedNews && now - cachedNews.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        source: 'The Hacker News (Cached)',
        data: cachedNews.data
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://feeds.feedburner.com/TheHackersNews', {
      signal: controller.signal,
      headers: {
        'User-Agent': '0XNULL-ThreatIntel/1.0 (Cybersecurity Research Club)'
      }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`Feed responded with HTTP ${response.status}`);
    }

    const xml = await response.text();
    const items: NewsItem[] = [];
    const itemRegex = /<item>([\s\S]*?)<\/item>/g;
    let match;

    while ((match = itemRegex.exec(xml)) !== null && items.length < 15) {
      const itemXml = match[1];
      const titleMatch =
        itemXml.match(/<title><!\[CDATA\[([\s\S]*?)\]\]><\/title>/) ||
        itemXml.match(/<title>([\s\S]*?)<\/title>/);
      const linkMatch = itemXml.match(/<link>([\s\S]*?)<\/link>/);
      const dateMatch = itemXml.match(/<pubDate>([\s\S]*?)<\/pubDate>/);
      const descMatch =
        itemXml.match(/<description><!\[CDATA\[([\s\S]*?)\]\]><\/description>/) ||
        itemXml.match(/<description>([\s\S]*?)<\/description>/);

      const title = titleMatch ? titleMatch[1].trim() : 'Security Advisory';
      const link = linkMatch ? linkMatch[1].trim() : '#';
      const pubDate = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
      const rawDesc = descMatch ? descMatch[1] : '';
      const cleanSnippet = rawDesc
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 180);

      items.push({
        id: `news-${items.length + 1}`,
        title,
        link,
        pubDate,
        source: 'The Hacker News',
        snippet: cleanSnippet ? `${cleanSnippet}...` : 'Read full advisory at source.'
      });
    }

    cachedNews = { data: items, timestamp: now };

    return NextResponse.json({
      success: true,
      source: 'The Hacker News Live Feed',
      data: items
    });
  } catch (error: any) {
    if (cachedNews?.data && cachedNews.data.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'The Hacker News (Fallback Cache)',
        data: cachedNews.data
      });
    }
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch cybersecurity tech news feed.',
        data: []
      },
      { status: 502 }
    );
  }
}
