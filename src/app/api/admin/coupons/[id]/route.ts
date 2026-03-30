import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const {
      code, description, type, value, minOrderAmount, maxDiscount,
      usageLimit, perUserLimit, isActive, startsAt, expiresAt,
      buyQuantity, getQuantity,
    } = body;

    if (code) {
      const conflict = await prisma.coupon.findFirst({
        where: { code: code.toUpperCase(), NOT: { id } },
      });
      if (conflict) return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });
    }

    const coupon = await prisma.coupon.update({
      where: { id },
      data: {
        ...(code && { code: code.toUpperCase() }),
        description,
        type,
        value,
        minOrderAmount: minOrderAmount ?? null,
        maxDiscount: maxDiscount ?? null,
        usageLimit: usageLimit ?? null,
        perUserLimit,
        isActive,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        buyQuantity: buyQuantity ?? null,
        getQuantity: getQuantity ?? null,
      },
    });

    return NextResponse.json(coupon);
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
    await prisma.coupon.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
