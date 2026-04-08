import { Suspense } from 'react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoriesGrid } from '@/components/home/CategoriesGrid';
import { FeaturedProducts } from '@/components/home/FeaturedProducts';
import { WhyGiftora } from '@/components/home/WhyGiftora';
import { NewsletterBanner } from '@/components/home/NewsletterBanner';
import { InstagramFeed } from '@/components/home/InstagramFeed';
import { Sustainability } from '@/components/home/Sustainability';

async function getFeaturedProducts() {
  return prisma.product.findMany({
    where: { status: 'ACTIVE', featured: true },
    take: 8,
    include: {
      images: { orderBy: { sortOrder: 'asc' } },
      category: true,
    },
    orderBy: { soldCount: 'desc' },
  });
}

async function getCategories() {
  return prisma.category.findMany({
    where: { isActive: true },
    orderBy: { sortOrder: 'asc' },
    take: 8,
  });
}

export default async function HomePage() {
  const [featuredProducts, categories] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
  ]);

  // Serialize Decimal values
  const serializedProducts = featuredProducts.map((p) => ({
    ...p,
    basePrice: Number(p.basePrice),
    salePrice: p.salePrice ? Number(p.salePrice) : null,
    costPrice: p.costPrice ? Number(p.costPrice) : null,
    rating: Number(p.rating),
  }));

  return (
    <>
      <HeroSection />
      <CategoriesGrid categories={categories} />
      <Sustainability />
      <WhyGiftora products={serializedProducts} />
      <Suspense fallback={<div className="h-96 animate-shimmer" />}>
        <FeaturedProducts products={serializedProducts} />
      </Suspense>
      <InstagramFeed />
      <NewsletterBanner />
    </>
  );
}
