import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  await prisma.address.updateMany({
    where: { userId: session.user.id },
    data: { isDefault: false },
  });

  await prisma.address.update({
    where: { id },
    data: { isDefault: true },
  });

  return NextResponse.json({ success: true });
}
