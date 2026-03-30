import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: NextRequest) {
  const q = req.nextUrl.searchParams.get('q');
  if (!q || q.trim().length < 2) return NextResponse.json({ data: [] });

  const products = await prisma.product.findMany({
    where: {
      status: 'ACTIVE',
      OR: [
        { name: { contains: q, mode: 'insensitive' } },
        { description: { contains: q, mode: 'insensitive' } },
        { shortDesc: { contains: q, mode: 'insensitive' } },
        { category: { name: { contains: q, mode: 'insensitive' } } },
      ],
    },
    take: 10,
    include: {
      images: { take: 1, orderBy: { sortOrder: 'asc' } },
      category: true,
    },
    orderBy: [{ featured: 'desc' }, { soldCount: 'desc' }],
  });

  return NextResponse.json({
    data: products.map(p => ({
      id: p.id,
      name: p.name,
      slug: p.slug,
      basePrice: Number(p.basePrice),
      salePrice: p.salePrice ? Number(p.salePrice) : null,
      image: p.images[0]?.url,
      category: p.category.name,
    })),
  });
}
