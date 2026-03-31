import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isStaff } from '@/lib/utils';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !isStaff(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const urlInput = formData.get('url') as string | null;
    const folder = (formData.get('folder') as string) || 'giftora/uploads';

    // Lazy-load cloudinary to avoid issues with module init
    const cloudinary = (await import('cloudinary')).v2;
    cloudinary.config({
      cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
      secure: true,
    });

    let uploadSource: string;

    if (file && file.size > 0) {
      // File upload — convert to base64 data URI
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      uploadSource = `data:${file.type};base64,${buffer.toString('base64')}`;
    } else if (urlInput && urlInput.startsWith('http')) {
      // URL upload — pass URL directly to Cloudinary
      uploadSource = urlInput;
    } else {
      return NextResponse.json({ error: 'No file or URL provided' }, { status: 400 });
    }

    const result = await cloudinary.uploader.upload(uploadSource, {
      folder,
      transformation: [{ quality: 'auto', fetch_format: 'auto' }],
    });

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Upload API Error]', message);
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
