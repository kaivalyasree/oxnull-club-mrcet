import { NextResponse } from 'next/server';

interface ThreatEntry {
  id: string;
  cveID: string;
  vendorProject: string;
  product: string;
  vulnerabilityName: string;
  dateAdded: string;
  shortDescription: string;
  requiredAction: string;
  dueDate?: string;
  notes?: string;
  verified: boolean;
}

let cachedThreats: { data: ThreatEntry[]; timestamp: number } | null = null;
const CACHE_TTL_MS = 10 * 60 * 1000; // 10 minutes

export async function GET() {
  try {
    const now = Date.now();
    if (cachedThreats && now - cachedThreats.timestamp < CACHE_TTL_MS) {
      return NextResponse.json({
        success: true,
        source: 'CISA KEV Catalog (Cached)',
        data: cachedThreats.data
      });
    }

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);

    const response = await fetch(
      'https://www.cisa.gov/sites/default/files/feeds/known_exploited_vulnerabilities.json',
      {
        signal: controller.signal,
        headers: {
          'User-Agent': '0XNULL-ThreatIntel/1.0 (Cybersecurity Research Club)'
        }
      }
    );
    clearTimeout(timeout);

    if (!response.ok) {
      throw new Error(`CISA KEV feed responded with HTTP ${response.status}`);
    }

    const json = await response.json();
    const rawList = Array.isArray(json.vulnerabilities) ? json.vulnerabilities : [];

    // Take latest 20 vulnerabilities
    const latestList = rawList.slice(-20).reverse();

    const formatted: ThreatEntry[] = latestList.map((v: any, idx: number) => ({
      id: `threat-${idx + 1}-${v.cveID}`,
      cveID: v.cveID || 'CVE-UNKNOWN',
      vendorProject: v.vendorProject || 'Unknown Vendor',
      product: v.product || 'Unknown Product',
      vulnerabilityName: v.vulnerabilityName || 'Known Exploited Vulnerability',
      dateAdded: v.dateAdded || new Date().toISOString().split('T')[0],
      shortDescription: v.shortDescription || 'No description provided in advisory feed.',
      requiredAction: v.requiredAction || 'Apply vendor updates in accordance with guidance.',
      dueDate: v.dueDate,
      notes: v.notes,
      verified: true
    }));

    cachedThreats = { data: formatted, timestamp: now };

    return NextResponse.json({
      success: true,
      source: 'CISA Known Exploited Vulnerabilities (KEV) Catalog',
      data: formatted
    });
  } catch (error: any) {
    if (cachedThreats?.data && cachedThreats.data.length > 0) {
      return NextResponse.json({
        success: true,
        source: 'CISA KEV Catalog (Fallback Cache)',
        data: cachedThreats.data
      });
    }
    return NextResponse.json(
      {
        success: false,
        error: error?.message || 'Failed to fetch threat intelligence feed.',
        data: []
      },
      { status: 502 }
    );
  }
}
