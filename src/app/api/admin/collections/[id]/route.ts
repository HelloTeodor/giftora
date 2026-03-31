import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export async function GET(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  const collection = await prisma.collection.findUnique({
    where: { id },
    include: { products: { select: { id: true, name: true, slug: true } } },
  });

  if (!collection) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json(collection);
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { name, slug, description, image, isActive, sortOrder, productIds } = body;

    if (slug) {
      const conflict = await prisma.collection.findFirst({ where: { slug, NOT: { id } } });
      if (conflict) return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }

    const collection = await prisma.collection.update({
      where: { id },
      data: {
        ...(name && { name }),
        ...(slug && { slug }),
        description: description ?? undefined,
        image: image ?? undefined,
        ...(isActive !== undefined && { isActive }),
        ...(sortOrder !== undefined && { sortOrder }),
        ...(productIds !== undefined && { products: { set: productIds.map((pid: string) => ({ id: pid })) } }),
      },
    });

    return NextResponse.json(collection);
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    await prisma.collection.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
