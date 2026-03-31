import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isStaff } from '@/lib/utils';
import { prisma } from '@/lib/prisma';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isStaff(session.user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;
  const { status } = await req.json();

  const review = await prisma.review.update({
    where: { id },
    data: { status },
  });

  if (status === 'APPROVED' || status === 'REJECTED') {
    const product = await prisma.review.aggregate({
      where: { productId: review.productId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.product.update({
      where: { id: review.productId },
      data: {
        rating: product._avg.rating || 0,
        reviewCount: product._count,
      },
    });
  }

  return NextResponse.json({ data: review });
}

export async function DELETE(_req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isStaff(session.user.role)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { id } = await params;

  try {
    const review = await prisma.review.delete({ where: { id } });

    const stats = await prisma.review.aggregate({
      where: { productId: review.productId, status: 'APPROVED' },
      _avg: { rating: true },
      _count: true,
    });
    await prisma.product.update({
      where: { id: review.productId },
      data: { rating: stats._avg.rating || 0, reviewCount: stats._count },
    });

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
