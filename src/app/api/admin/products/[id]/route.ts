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
    const product = await prisma.product.findUnique({ where: { id }, select: { status: true } });
    if (!product) return NextResponse.json({ error: 'Product not found' }, { status: 404 });

    if (product.status === 'ARCHIVED') {
      // Check if product has order history — can't permanently delete if so
      const orderCount = await prisma.orderItem.count({ where: { productId: id } });
      if (orderCount > 0) {
        return NextResponse.json(
          { error: `Cannot permanently delete — this product appears in ${orderCount} order(s). Keep it archived to preserve order history.` },
          { status: 409 }
        );
      }
      // No orders — safe to hard delete
      await prisma.wishlistItem.deleteMany({ where: { productId: id } });
      await prisma.cartItem.deleteMany({ where: { productId: id } });
      await prisma.review.deleteMany({ where: { productId: id } });
      await prisma.product.delete({ where: { id } });
    } else {
      // Soft delete — move to ARCHIVED
      await prisma.product.update({ where: { id }, data: { status: 'ARCHIVED' } });
    }

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error('Product delete error:', err);
    return NextResponse.json({ error: 'Delete failed' }, { status: 500 });
  }
}
