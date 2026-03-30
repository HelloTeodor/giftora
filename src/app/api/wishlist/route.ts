import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const items = await prisma.wishlistItem.findMany({
    where: { userId: session.user.id },
    include: { product: { include: { images: { take: 1 }, category: true } } },
    orderBy: { createdAt: 'desc' },
  });
  return NextResponse.json({ data: items });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { productId } = await req.json();
  await prisma.wishlistItem.upsert({
    where: { userId_productId: { userId: session.user.id, productId } },
    create: { userId: session.user.id, productId },
    update: {},
  });
  return NextResponse.json({ success: true });
}

export async function DELETE(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  const { productId } = await req.json();
  await prisma.wishlistItem.deleteMany({
    where: { userId: session.user.id, productId },
  });
  return NextResponse.json({ success: true });
}
