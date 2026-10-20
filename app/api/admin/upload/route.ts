import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import { verifyAdminSession } from '@/lib/admin-auth';
import { getServerSupabaseClient, isSupabaseConfigured } from '@/lib/supabase';

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB
const ALLOWED_MIME_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/gif',
  'image/svg+xml',
  'application/pdf'
];

export async function POST(request: Request) {
  try {
    // 1. Verify administrative session
    const auth = await verifyAdminSession(request);
    if (!auth.authorized) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Administrative session required.' },
        { status: 401 }
      );
    }

    // 2. Extract multipart form data
    const formData = await request.formData();
    const file = formData.get('file') as File | null;

    if (!file || typeof file === 'string') {
      return NextResponse.json(
        { success: false, error: 'No file provided for upload.' },
        { status: 400 }
      );
    }

    // 3. Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          error: `File exceeds maximum allowed size of 10 MB. (File size: ${(file.size / (1024 * 1024)).toFixed(2)} MB)`
        },
        { status: 400 }
      );
    }

    // 4. Validate MIME type
    if (!ALLOWED_MIME_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          error: `Invalid file type "${file.type}". Only PNG, JPEG, WebP, SVG images and PDF documents are permitted.`
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
    const fileName = `${Date.now()}-${sanitizedName}`;

    // 5. If Supabase is configured, upload to 'club-assets' storage bucket
    if (isSupabaseConfigured) {
      try {
        const supabase = getServerSupabaseClient();
        if (supabase) {
          const { error: uploadError } = await supabase.storage
            .from('club-assets')
            .upload(fileName, buffer, {
              contentType: file.type,
              upsert: true
            });

          if (!uploadError) {
            const { data } = supabase.storage.from('club-assets').getPublicUrl(fileName);
            return NextResponse.json({
              success: true,
              url: data.publicUrl,
              fileName,
              originalName: file.name,
              sizeBytes: file.size,
              storage: 'supabase'
            });
          } else {
            console.warn('[OXNULL Storage] Supabase bucket upload error, falling back to local:', uploadError);
          }
        }
      } catch (sbErr) {
        console.warn('[OXNULL Storage] Supabase upload failed, falling back to local file storage:', sbErr);
      }
    }

    // 6. Local persistent fallback storage in public/uploads
    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const localPath = path.join(uploadsDir, fileName);
    fs.writeFileSync(localPath, buffer);

    const publicUrl = `/uploads/${fileName}`;
    return NextResponse.json({
      success: true,
      url: publicUrl,
      fileName,
      originalName: file.name,
      sizeBytes: file.size,
      storage: 'local'
    });
  } catch (error) {
    console.error('[OXNULL Storage] Upload error:', error);
    return NextResponse.json(
      { success: false, error: 'Internal server error processing file upload.' },
      { status: 500 }
    );
  }
}
