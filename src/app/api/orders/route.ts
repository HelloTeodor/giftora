import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, parseInt(searchParams.get('page') ?? '1'));
  const limit = Math.min(50, parseInt(searchParams.get('limit') ?? '10'));
  const skip = (page - 1) * limit;

  try {
    const [orders, total] = await Promise.all([
      prisma.order.findMany({
        where: { userId: session.user.id },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit,
        include: {
          items: {
            include: {
              product: { select: { images: { take: 1, select: { url: true } } } },
            },
          },
        },
      }),
      prisma.order.count({ where: { userId: session.user.id } }),
    ]);

    // Serialize Decimal fields
    const serialized = orders.map((order) => ({
      ...order,
      subtotal: Number(order.subtotal),
      discountAmount: Number(order.discountAmount),
      taxAmount: Number(order.taxAmount),
      total: Number(order.total),
      shippingCost: Number(order.shippingCost),
      giftCardAmount: Number(order.giftCardAmount),
      items: order.items.map((item) => ({
        ...item,
        price: Number(item.price),
        total: Number(item.total),
      })),
    }));

    return NextResponse.json({
      orders: serialized,
      pagination: { page, limit, total, totalPages: Math.ceil(total / limit) },
    });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
