import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const orderNumber = searchParams.get('orderNumber');
  const email = searchParams.get('email');

  if (!orderNumber || !email) {
    return NextResponse.json({ error: 'Order number and email required' }, { status: 400 });
  }

  const order = await prisma.order.findFirst({
    where: {
      orderNumber: orderNumber.toUpperCase(),
      OR: [
        { guestEmail: { equals: email, mode: 'insensitive' } },
        { user: { email: { equals: email, mode: 'insensitive' } } },
      ],
    },
    select: {
      orderNumber: true,
      status: true,
      total: true,
      createdAt: true,
      trackingNumber: true,
      trackingUrl: true,
    },
  });

  if (!order) {
    return NextResponse.json({ error: 'Order not found. Please check your order number and email.' }, { status: 404 });
  }

  return NextResponse.json({
    ...order,
    total: Number(order.total),
  });
}
