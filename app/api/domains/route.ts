import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET() {
  try {
    const domains = db.getDomains();
    return NextResponse.json({ success: true, data: domains });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch domains' }, { status: 500 });
  }
}
