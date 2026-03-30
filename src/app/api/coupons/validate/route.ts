import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';

export async function POST(req: NextRequest) {
  const session = await auth();
  try {
    const { code, orderAmount } = await req.json();
    if (!code) return NextResponse.json({ error: 'Coupon code required' }, { status: 400 });

    const coupon = await prisma.coupon.findUnique({ where: { code: code.toUpperCase() } });
    if (!coupon || !coupon.isActive) return NextResponse.json({ error: 'Invalid or expired coupon' }, { status: 400 });

    const now = new Date();
    if (coupon.startsAt && coupon.startsAt > now) return NextResponse.json({ error: 'Coupon not yet active' }, { status: 400 });
    if (coupon.expiresAt && coupon.expiresAt < now) return NextResponse.json({ error: 'Coupon has expired' }, { status: 400 });
    if (coupon.usageLimit && coupon.usageCount >= coupon.usageLimit) return NextResponse.json({ error: 'Coupon usage limit reached' }, { status: 400 });
    if (coupon.minOrderAmount && orderAmount < Number(coupon.minOrderAmount)) {
      return NextResponse.json({ error: `Minimum order of €${coupon.minOrderAmount} required` }, { status: 400 });
    }

    return NextResponse.json({
      valid: true,
      type: coupon.type,
      value: Number(coupon.value),
      code: coupon.code,
    });
  } catch {
    return NextResponse.json({ error: 'Failed to validate coupon' }, { status: 500 });
  }
}
