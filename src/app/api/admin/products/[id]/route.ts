import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isStaff } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isStaff(session.user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const body = await req.json();
    const { images, ...data } = body;

    const product = await prisma.product.update({
      where: { id },
      data: {
        ...data,
        ...(images && {
          images: {
            deleteMany: {},
            create: images,
          },
        }),
      },
      include: { images: true, category: true },
    });

    return NextResponse.json({ data: product });
  } catch {
    return NextResponse.json({ error: 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isStaff(session.user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    await prisma.product.update({
      where: { id },
      data: { status: 'ARCHIVED' },
    });
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
