import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export async function GET() {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const collections = await prisma.collection.findMany({
    orderBy: { sortOrder: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  return NextResponse.json(collections);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, image, isActive, sortOrder, productIds } = body;

    if (!name || !slug) {
      return NextResponse.json({ error: 'Name and slug are required' }, { status: 400 });
    }

    const existing = await prisma.collection.findUnique({ where: { slug } });
    if (existing) {
      return NextResponse.json({ error: 'Slug already in use' }, { status: 409 });
    }

    const collection = await prisma.collection.create({
      data: {
        name,
        slug,
        description: description || null,
        image: image || null,
        isActive: isActive ?? true,
        sortOrder: sortOrder ?? 0,
        products: productIds?.length ? { connect: productIds.map((id: string) => ({ id })) } : undefined,
      },
    });

    return NextResponse.json(collection, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
