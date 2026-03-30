import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth';
import { isAdmin, isStaff } from '@/lib/utils';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

const schema = z.object({
  name: z.string().min(3),
  slug: z.string().min(3),
  sku: z.string().min(2),
  description: z.string().min(10),
  shortDesc: z.string().optional(),
  categoryId: z.string(),
  basePrice: z.number().positive(),
  salePrice: z.number().optional().nullable(),
  costPrice: z.number().optional().nullable(),
  stock: z.number().int().min(0),
  lowStockAlert: z.number().int().min(0).default(5),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']),
  featured: z.boolean().default(false),
  brand: z.string().optional(),
  metaTitle: z.string().optional(),
  metaDesc: z.string().optional(),
  images: z.array(z.object({
    url: z.string().url(),
    isPrimary: z.boolean().default(false),
    sortOrder: z.number().default(0),
  })).optional(),
});

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session || !isStaff(session.user.role)) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const body = await req.json();
    const data = schema.parse(body);

    const { images, ...productData } = data;

    const product = await prisma.product.create({
      data: {
        ...productData,
        ...(images && { images: { create: images } }),
      },
      include: { images: true, category: true },
    });

    return NextResponse.json({ data: product }, { status: 201 });
  } catch (error) {
    if (error instanceof z.ZodError) return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
