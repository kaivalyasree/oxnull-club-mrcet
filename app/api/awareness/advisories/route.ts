import { NextResponse } from 'next/server';

interface AdvisoryItem {
  id: string;
  title: string;
  link: string;
  pubDate: string;
  summary: string;
  source: string;
}

let cachedAdvisories: { data: AdvisoryItem[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  try {
    const now = Date.now();
    if (cachedAdvisories && now - cachedAdvisories.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        source: 'CISA Cybersecurity Advisories (Cached)',
        data: cachedAdvisories.data
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch('https://www.cisa.gov/cybersecurity-advisories/all.xml', {
      signal: controller.signal,
      headers: {
        'User-Agent': '0XNULL-ThreatIntel/1.0 (Cybersecurity Research Club)'
      }
    });
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`CISA Advisories feed responded with HTTP ${response.status}`);
    }

    const xml = await response.text();
    const items: AdvisoryItem[] = [];
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

      const title = titleMatch ? titleMatch[1].trim() : 'CISA Advisory';
      const link = linkMatch ? linkMatch[1].trim() : 'https://www.cisa.gov/cybersecurity-advisories';
      const pubDate = dateMatch ? dateMatch[1].trim() : new Date().toISOString();
      const rawDesc = descMatch ? descMatch[1] : '';
      const cleanSummary = rawDesc
        .replace(/<[^>]+>/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'")
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 220);

      items.push({
        id: `adv-${items.length + 1}`,
        title,
        link,
        pubDate,
        summary: cleanSummary ? `${cleanSummary}...` : 'Official vendor vulnerability mitigation advisory.',
        source: 'CISA / US-CERT'
      });
    }

    cachedAdvisories = { data: items, timestamp: now };

    return NextResponse.json({
      success: true,
      source: 'CISA Official Cybersecurity Advisories',
      data: items
    });
  } catch (error: any) {
    if (cachedAdvisories?.data && cachedAdvisories.data.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'CISA Cybersecurity Advisories (Fallback Cache)',
        data: cachedAdvisories.data
      });
    }
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch security advisories feed.',
        data: []
      },
      { status: 502 }
    );
  }
}
