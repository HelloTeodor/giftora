import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  productId: z.string(),
  rating: z.number().min(1).max(5),
  title: z.string().optional(),
  body: z.string().min(10),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  try {
    const data = schema.parse(await req.json());
    // Check if user already reviewed
    const existing = await prisma.review.findUnique({
      where: { productId_userId: { productId: data.productId, userId: session.user.id } },
    });
    if (existing) return NextResponse.json({ error: 'You have already reviewed this product' }, { status: 400 });

    // Check if verified purchase
    const purchase = await prisma.orderItem.findFirst({
      where: {
        productId: data.productId,
        order: { userId: session.user.id, paymentStatus: 'PAID' },
      },
    });

    const review = await prisma.review.create({
      data: {
        productId: data.productId,
        userId: session.user.id,
        rating: data.rating,
        title: data.title,
        body: data.body,
        isVerifiedPurchase: !!purchase,
        status: 'PENDING',
      },
    });
    return NextResponse.json({ data: review });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    return NextResponse.json({ error: 'Failed to submit review' }, { status: 500 });
  }
}
