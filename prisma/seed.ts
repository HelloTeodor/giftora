import { PrismaClient, Role, ProductStatus } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding Giftora database...');

  // Admin user
  const adminPassword = await bcrypt.hash('Admin@123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@giftora.com' },
    update: {},
    create: {
      email: 'admin@giftora.com',
      name: 'Giftora Admin',
      firstName: 'Giftora',
      lastName: 'Admin',
      password: adminPassword,
      role: Role.SUPER_ADMIN,
      emailVerified: new Date(),
    },
  });
  console.log('✅ Admin user created:', admin.email);

  // Categories
  const categories = await Promise.all([
    prisma.category.upsert({ where: { slug: 'new-hire' }, update: {}, create: { name: 'New Hire', slug: 'new-hire', description: 'Welcome your new team members with curated onboarding gift boxes.', icon: '🎉', sortOrder: 1 } }),
    prisma.category.upsert({ where: { slug: 'christmas' }, update: {}, create: { name: 'Christmas', slug: 'christmas', description: 'Festive holiday gift boxes for everyone on your list.', icon: '🎄', sortOrder: 2 } }),
    prisma.category.upsert({ where: { slug: 'birthday' }, update: {}, create: { name: 'Birthday', slug: 'birthday', description: 'Make every birthday unforgettable with our luxury gift boxes.', icon: '🎂', sortOrder: 3 } }),
    prisma.category.upsert({ where: { slug: 'newborn' }, update: {}, create: { name: 'Newborn', slug: 'newborn', description: 'Celebrate new arrivals with thoughtfully curated newborn gifts.', icon: '👶', sortOrder: 4 } }),
    prisma.category.upsert({ where: { slug: 'valentines' }, update: {}, create: { name: "Valentine's Day", slug: 'valentines', description: 'Express love with our romantic Valentine\'s Day gift boxes.', icon: '❤️', sortOrder: 5 } }),
    prisma.category.upsert({ where: { slug: 'easter' }, update: {}, create: { name: 'Easter', slug: 'easter', description: 'Spring joy in every box with our Easter collection.', icon: '🐣', sortOrder: 6 } }),
    prisma.category.upsert({ where: { slug: 'self-care' }, update: {}, create: { name: 'Self Care', slug: 'self-care', description: 'Premium wellness and self-care gift boxes for the ones you cherish.', icon: '🌸', sortOrder: 7 } }),
    prisma.category.upsert({ where: { slug: 'corporate' }, update: {}, create: { name: 'Corporate', slug: 'corporate', description: 'Impress clients and partners with our exclusive corporate gift boxes.', icon: '💼', sortOrder: 8 } }),
  ]);
  console.log('✅ Categories created:', categories.length);

  // Sample products
  const products = [
    {
      name: 'The Executive Welcome Box',
      slug: 'executive-welcome-box',
      sku: 'GFT-001',
      description: 'A premium onboarding experience. Includes branded notebook, luxury pen, artisan coffee, and a personalised welcome card. Perfect for making every new hire feel valued from day one.',
      shortDesc: 'Premium new hire gift box with artisan essentials.',
      basePrice: 89.99,
      salePrice: null,
      stock: 50,
      categorySlug: 'new-hire',
      featured: true,
      status: ProductStatus.ACTIVE,
      images: ['https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=800'],
    },
    {
      name: 'Festive Christmas Luxury Box',
      slug: 'festive-christmas-luxury-box',
      sku: 'GFT-002',
      description: 'A beautifully curated Christmas box filled with premium chocolates, mulled wine spices, a scented candle, and festive treats. Wrapped in elegant gold ribbon.',
      shortDesc: 'Opulent holiday box with premium festive goodies.',
      basePrice: 74.99,
      salePrice: 64.99,
      stock: 120,
      categorySlug: 'christmas',
      featured: true,
      status: ProductStatus.ACTIVE,
      images: ['https://images.unsplash.com/photo-1512909006721-3d6018887383?w=800'],
    },
    {
      name: 'Birthday Bliss Box',
      slug: 'birthday-bliss-box',
      sku: 'GFT-003',
      description: 'Celebrate in style with this birthday gift box featuring champagne, luxury truffles, a hand-poured soy candle, and a heartfelt greeting card.',
      shortDesc: 'Celebrate every birthday with luxury and love.',
      basePrice: 59.99,
      salePrice: null,
      stock: 80,
      categorySlug: 'birthday',
      featured: true,
      status: ProductStatus.ACTIVE,
      images: ['https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=800'],
    },
    {
      name: 'Sweet Arrival Newborn Box',
      slug: 'sweet-arrival-newborn-box',
      sku: 'GFT-004',
      description: 'Welcome the little one with organic baby essentials, a personalised blanket, and artisan biscuits for the new parents.',
      shortDesc: 'Organic and gentle welcome gifts for newborns.',
      basePrice: 69.99,
      salePrice: null,
      stock: 45,
      categorySlug: 'newborn',
      featured: false,
      status: ProductStatus.ACTIVE,
      images: ['https://images.unsplash.com/photo-1522771930-78848d9293e8?w=800'],
    },
    {
      name: "Love in a Box — Valentine's",
      slug: 'love-in-a-box-valentines',
      sku: 'GFT-005',
      description: 'A romantic collection of Belgian chocolates, champagne truffles, a rose-scented candle, and a personalised love note card.',
      shortDesc: 'Romantic luxury box for Valentine\'s Day.',
      basePrice: 54.99,
      salePrice: 44.99,
      stock: 60,
      categorySlug: 'valentines',
      featured: true,
      status: ProductStatus.ACTIVE,
      images: ['https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800'],
    },
    {
      name: 'Spring Easter Delight Box',
      slug: 'spring-easter-delight-box',
      sku: 'GFT-006',
      description: 'A cheerful Easter box filled with hand-painted chocolate eggs, spring florals, artisan honey, and a charming bunny plush.',
      shortDesc: 'Joyful Easter treats in a beautiful spring box.',
      basePrice: 49.99,
      salePrice: null,
      stock: 70,
      categorySlug: 'easter',
      featured: false,
      status: ProductStatus.ACTIVE,
      images: ['https://images.unsplash.com/photo-1615460549969-36fa19521a4f?w=800'],
    },
    {
      name: 'Luxury Self-Care Ritual Box',
      slug: 'luxury-self-care-ritual-box',
      sku: 'GFT-007',
      description: 'Indulge in ultimate self-care with this box featuring bath salts, a silk sleep mask, aromatherapy oil, jade roller, and artisan herbal tea.',
      shortDesc: 'Premium wellness and self-care essentials.',
      basePrice: 84.99,
      salePrice: null,
      stock: 35,
      categorySlug: 'self-care',
      featured: true,
      status: ProductStatus.ACTIVE,
      images: ['https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=800'],
    },
    {
      name: 'The Corporate Prestige Box',
      slug: 'corporate-prestige-box',
      sku: 'GFT-008',
      description: 'Leave a lasting impression with this executive corporate gift. Premium whisky miniatures, artisan chocolates, leather card holder, and branded packaging.',
      shortDesc: 'Executive corporate gift box for clients & partners.',
      basePrice: 119.99,
      salePrice: 99.99,
      stock: 25,
      categorySlug: 'corporate',
      featured: true,
      status: ProductStatus.ACTIVE,
      images: ['https://images.unsplash.com/photo-1520006403909-838d6b92c22e?w=800'],
    },
  ];

  for (const p of products) {
    const category = categories.find((c) => c.slug === p.categorySlug);
    if (!category) continue;

    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: {
        name: p.name,
        slug: p.slug,
        sku: p.sku,
        description: p.description,
        shortDesc: p.shortDesc,
        basePrice: p.basePrice,
        salePrice: p.salePrice,
        stock: p.stock,
        categoryId: category.id,
        featured: p.featured,
        status: p.status,
        images: {
          create: p.images.map((url, i) => ({
            url,
            isPrimary: i === 0,
            sortOrder: i,
          })),
        },
      },
    });
  }
  console.log('✅ Products created:', products.length);

  // Sample coupon
  await prisma.coupon.upsert({
    where: { code: 'WELCOME10' },
    update: {},
    create: {
      code: 'WELCOME10',
      description: '10% off your first order',
      type: 'PERCENTAGE',
      value: 10,
      usageLimit: 1000,
      perUserLimit: 1,
      isActive: true,
    },
  });
  console.log('✅ Sample coupon created');

  console.log('🎉 Seed complete!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
