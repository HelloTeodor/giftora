import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const page = Number(searchParams.get('page')) || 1;
  const perPage = Number(searchParams.get('perPage')) || 12;
  const q = searchParams.get('q');
  const category = searchParams.get('category');
  const featured = searchParams.get('featured') === 'true';
  const sort = searchParams.get('sort') || 'popular';

  const where: Record<string, unknown> = {
    status: 'ACTIVE',
    ...(q && { OR: [
      { name: { contains: q, mode: 'insensitive' } },
      { description: { contains: q, mode: 'insensitive' } },
    ]}),
    ...(category && { category: { slug: category } }),
    ...(featured && { featured: true }),
  };

  const orderBy: Record<string, string> =
    sort === 'price-asc' ? { basePrice: 'asc' }
    : sort === 'price-desc' ? { basePrice: 'desc' }
    : sort === 'rating' ? { rating: 'desc' }
    : sort === 'newest' ? { createdAt: 'desc' }
    : { soldCount: 'desc' };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      take: perPage,
      skip: (page - 1) * perPage,
      orderBy,
      include: {
        images: { orderBy: { sortOrder: 'asc' }, take: 1 },
        category: true,
      },
    }),
    prisma.product.count({ where }),
  ]);

  return NextResponse.json({
    data: products.map(p => ({
      ...p,
      basePrice: Number(p.basePrice),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      rating: Number(p.rating),
    })),
    meta: { page, perPage, total, totalPages: Math.ceil(total / perPage) },
  });
}
