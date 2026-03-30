import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { isAdmin } from '@/lib/utils';

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !isAdmin(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await req.json();
    const {
      code, description, type, value, minOrderAmount, maxDiscount,
      usageLimit, perUserLimit, isActive, startsAt, expiresAt,
      buyQuantity, getQuantity,
    } = body;

    if (!code || !type || value === undefined) {
      return NextResponse.json({ error: 'Code, type, and value are required' }, { status: 400 });
    }

    const existing = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (existing) return NextResponse.json({ error: 'Coupon code already exists' }, { status: 409 });

    const coupon = await prisma.coupon.create({
      data: {
        code: code.toUpperCase(),
        description,
        type,
        value,
        minOrderAmount: minOrderAmount ?? null,
        maxDiscount: maxDiscount ?? null,
        usageLimit: usageLimit ?? null,
        perUserLimit: perUserLimit ?? 1,
        isActive: isActive ?? true,
        startsAt: startsAt ? new Date(startsAt) : null,
        expiresAt: expiresAt ? new Date(expiresAt) : null,
        buyQuantity: buyQuantity ?? null,
        getQuantity: getQuantity ?? null,
      },
    });

    return NextResponse.json(coupon, { status: 201 });
  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
