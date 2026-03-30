import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { sendNewsletterWelcome } from '@/lib/email';
import { z } from 'zod';

export async function POST(req: NextRequest) {
  try {
    const { email } = z.object({ email: z.string().email() }).parse(await req.json());

    const existing = await prisma.newsletterSubscriber.findUnique({ where: { email } });
    if (existing?.isActive) return NextResponse.json({ message: 'Already subscribed' });

    await prisma.newsletterSubscriber.upsert({
      where: { email },
      create: { email, isActive: true },
      update: { isActive: true, unsubscribedAt: null },
    });

    await sendNewsletterWelcome(email).catch(() => {});

    return NextResponse.json({ message: 'Subscribed successfully' });
  } catch {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }
}
