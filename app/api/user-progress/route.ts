import { NextResponse } from 'next/server';
import { db } from '@/lib/store';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'User ID is required to fetch progress.' },
        { status: 400 }
      );
    }

    const sanitizedUserId = userId.trim();
    const progress = db.getUserProgress(sanitizedUserId);
    return NextResponse.json({ success: true, data: progress });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch user progress' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const userId = body?.userId;

    if (!userId || typeof userId !== 'string' || userId.trim() === '') {
      return NextResponse.json(
        { success: false, error: 'User ID is required to save progress.' },
        { status: 400 }
      );
    }

    const sanitizedUserId = userId.trim();
    const updated = db.updateUserProgress(sanitizedUserId, body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to save progress' }, { status: 500 });
  }
}
