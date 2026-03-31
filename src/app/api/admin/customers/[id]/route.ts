import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { hardDeleteUser } from '@/lib/deleteUser';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (id === session.user.id) {
    return NextResponse.json({ error: 'You cannot delete your own account' }, { status: 400 });
  }

  const customer = await prisma.user.findUnique({ where: { id }, select: { id: true } });
  if (!customer) return NextResponse.json({ error: 'Customer not found' }, { status: 404 });

  try {
    await hardDeleteUser(id);
    return NextResponse.json({ ok: true });
  } catch (e) {
    console.error('hardDeleteUser failed:', e);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
