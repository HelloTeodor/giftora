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
  shortDesc: z.string().optional().nullable(),
  categoryId: z.string().min(1, 'Category is required'),
  basePrice: z.coerce.number().positive('Base price must be greater than 0'),
  salePrice: z.coerce.number().optional().nullable(),
  costPrice: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0),
  lowStockAlert: z.coerce.number().int().min(0).default(5),
  status: z.enum(['ACTIVE', 'DRAFT', 'ARCHIVED']),
  featured: z.boolean().default(false),
  brand: z.string().optional().nullable(),
  metaTitle: z.string().optional().nullable(),
  metaDesc: z.string().optional().nullable(),
  images: z.array(z.object({
    url: z.string().min(1),
    isPrimary: z.boolean().default(false),
    sortOrder: z.coerce.number().default(0),
  })).optional().transform(imgs => imgs?.filter(i => i.url && i.url.startsWith('http'))),
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
    if (error instanceof z.ZodError) {
      const field = error.errors[0].path.join('.');
      const msg = error.errors[0].message;
      return NextResponse.json({ error: field ? `${field}: ${msg}` : msg }, { status: 400 });
    }
    console.error(error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
