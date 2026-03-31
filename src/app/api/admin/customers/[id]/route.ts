import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  // Prevent admin from deleting themselves
  if (id === session.user.id) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
  }

  const customer = await prisma.user.findUnique({ where: { id }, select: { id: true, role: true } });
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

  // Soft-delete: anonymise PII, keep order history intact
  await prisma.user.update({
    where: { id },
    data: {
      deletedAt: new Date(),
      email: `deleted_${id}@deleted.giftora`,
      name: 'Deleted User',
      firstName: null,
      lastName: null,
      phone: null,
      avatar: null,
      password: null,
      newsletterOptIn: false,
    },
  });

  // Revoke all auth sessions so they can't log back in
  await prisma.account.deleteMany({ where: { userId: id } });
  await prisma.session.deleteMany({ where: { userId: id } });

  return NextResponse.json({ ok: true });
}
