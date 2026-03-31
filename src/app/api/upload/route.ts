import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isStaff } from '@/lib/utils';
import crypto from 'crypto';

export const runtime = 'nodejs';

function signCloudinaryParams(params: Record<string, string | number>, apiSecret: string): string {
  const sorted = Object.keys(params)
    .sort()
    .map(k => `${k}=${params[k]}`)
    .join('&');
  return crypto.createHash('sha1').update(sorted + apiSecret).digest('hex');
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !isStaff(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    console.error('[Upload] Missing Cloudinary env vars:', { cloudName: !!cloudName, apiKey: !!apiKey, apiSecret: !!apiSecret });
    return NextResponse.json({ error: 'Cloudinary is not configured on the server' }, { status: 500 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const urlInput = formData.get('url') as string | null;
    const folder = (formData.get('folder') as string) || 'giftora/uploads';

    let fileSource: string | Blob;

    if (file && file.size > 0) {
      // Use the file blob directly
      fileSource = file;
    } else if (urlInput && urlInput.startsWith('http')) {
      // URL — pass as string to Cloudinary
      fileSource = urlInput;
    } else {
      return NextResponse.json({ error: 'No file or URL provided' }, { status: 400 });
    }

    const timestamp = Math.floor(Date.now() / 1000);
    const paramsToSign: Record<string, string | number> = { folder, timestamp };
    const signature = signCloudinaryParams(paramsToSign, apiSecret);

    const cloud = new FormData();
    cloud.append('file', fileSource as Blob | string);
    cloud.append('api_key', apiKey);
    cloud.append('timestamp', String(timestamp));
    cloud.append('signature', signature);
    cloud.append('folder', folder);

    const res = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      { method: 'POST', body: cloud }
    );

    const result = await res.json();

    if (!res.ok) {
      const errMsg = result?.error?.message || JSON.stringify(result);
      console.error('[Upload] Cloudinary error:', errMsg);
      return NextResponse.json({ error: `Cloudinary: ${errMsg}` }, { status: 500 });
    }

    return NextResponse.json({
      url: result.secure_url,
      publicId: result.public_id,
      width: result.width,
      height: result.height,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : JSON.stringify(err);
    console.error('[Upload] Unexpected error:', message);
    return NextResponse.json({ error: `Upload failed: ${message}` }, { status: 500 });
  }
}
