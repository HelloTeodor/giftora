import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  firstName: z.string().min(2).optional(),
  lastName: z.string().min(2).optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
  newsletterOptIn: z.boolean().optional(),
});

export async function PATCH(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    const body = await req.json();
    const data = schema.parse(body);
    const name = data.firstName && data.lastName ? `${data.firstName} ${data.lastName}` : undefined;

    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { ...data, ...(name && { name }) },
    });

    return NextResponse.json({ user });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  try {
    // Soft-delete: set deletedAt, anonymise PII, but keep order history intact
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        deletedAt: new Date(),
        email: `deleted_${session.user.id}@deleted.giftora`,
        name: 'Deleted User',
        firstName: null,
        lastName: null,
        phone: null,
        avatar: null,
        password: null,
        newsletterOptIn: false,
      },
    });

    // Remove auth sessions / accounts so they can't log back in
    await prisma.account.deleteMany({ where: { userId: session.user.id } });
    await prisma.session.deleteMany({ where: { userId: session.user.id } });

    return NextResponse.json({ ok: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
