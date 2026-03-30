import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendPasswordResetEmail } from '@/lib/email';
import { generateToken } from '@/lib/utils';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) return NextResponse.json({ error: 'Email required' }, { status: 400 });

    const user = await prisma.user.findUnique({ where: { email: email.toLowerCase() } });

    // Always return success to prevent user enumeration
    if (!user) return NextResponse.json({ message: 'If the email exists, a reset link will be sent.' });

    // Delete old reset tokens
    await prisma.verificationToken.deleteMany({
      where: { identifier: user.email, type: 'PASSWORD_RESET' },
    });

    const token = generateToken();
    await prisma.verificationToken.create({
      data: {
        identifier: user.email,
        token,
        type: 'PASSWORD_RESET',
        expires: new Date(Date.now() + 60 * 60 * 1000), // 1 hour
      },
    });

    await sendPasswordResetEmail(user.email, token, user.firstName || user.name || undefined);

    return NextResponse.json({ message: 'Reset email sent' });
  } catch {
    return NextResponse.json({ error: 'Failed to send reset email' }, { status: 500 });
  }
}
