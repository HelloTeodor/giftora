import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';

export async function POST(req: NextRequest) {
  try {
    const { token, password } = await req.json();
    if (!token || !password) return NextResponse.json({ error: 'Missing fields' }, { status: 400 });

    const record = await prisma.verificationToken.findUnique({
      where: { token },
    });

    if (!record || record.type !== 'PASSWORD_RESET' || record.expires < new Date()) {
      return NextResponse.json({ error: 'Reset link is invalid or has expired' }, { status: 400 });
    }

    const hashed = await bcrypt.hash(password, 12);

    await prisma.user.update({
      where: { email: record.identifier },
      data: { password: hashed },
    });

    await prisma.verificationToken.delete({ where: { token } });

    return NextResponse.json({ message: 'Password reset successfully' });
  } catch {
    return NextResponse.json({ error: 'Reset failed' }, { status: 500 });
  }
}
