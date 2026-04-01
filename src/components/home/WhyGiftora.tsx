import Link from 'next/link';
import Image from 'next/image';

interface Product {
  id: string;
  name: string;
  slug: string;
  basePrice: number;
  salePrice?: number | null;
  images: { url: string; isPrimary: boolean }[];
}

interface Props {
  products?: Product[];
}

export function WhyGiftora({ products = [] }: Props) {
  const bestSellers = products.slice(0, 4);

  return (
    <section className="py-14 lg:py-20 bg-cream-50">
      <div className="section-padding">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-start">

          {/* LEFT — Sustainability blob */}
          <div className="relative flex items-center justify-center min-h-[380px] lg:min-h-[480px]">
            {/* Organic blob background */}
            <div
              className="absolute inset-0"
              style={{
                background: '#6BB9D4',
                borderRadius: '60% 40% 55% 45% / 45% 55% 45% 55%',
                opacity: 0.18,
              }}
            />
            <div
              className="absolute inset-4"
              style={{
                background: '#6BB9D4',
                borderRadius: '45% 55% 40% 60% / 55% 45% 55% 45%',
                opacity: 0.22,
              }}
            />

            {/* Content */}
            <div className="relative z-10 px-8 py-10 text-center max-w-sm">
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-navy-950 leading-snug mb-4">
                Our Commitment to Sustainability
              </h2>
              <p className="text-navy-700 text-sm leading-relaxed mb-6">
                As a family-owned business, we believe in thoughtful gifting that
                doesn't harm the earth. We use eco-friendly materials, sustainable
                practices, and a personal touch to create gifts that bring joy to
                the heart and home.
              </p>
              <Link href="/about" className="btn-navy inline-block mb-4">
                Lovingly Made
              </Link>
              <p className="text-icy-600 text-xs font-medium tracking-wide mt-2">
                Eco-Friendly Packaging
              </p>
            </div>
          </div>

          {/* RIGHT — Best sellers grid */}
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-icy-500 mb-2">
              Shop Best Sellers
            </p>
            <div className="grid grid-cols-2 gap-4">
              {bestSellers.length > 0
                ? bestSellers.map((product) => {
                    const img =
                      product.images.find((i) => i.isPrimary)?.url ||
                      product.images[0]?.url;
                    const price = product.salePrice ?? product.basePrice;
                    return (
                      <Link
                        key={product.id}
                        href={`/products/${product.slug}`}
                        className="group block bg-white rounded-xl overflow-hidden shadow-card hover:shadow-premium transition-all"
                      >
                        <div className="relative aspect-square">
                          {img ? (
                            <Image
                              src={img}
                              alt={product.name}
                              fill
                              sizes="(max-width: 768px) 50vw, 25vw"
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <div className="w-full h-full bg-cream-100 flex items-center justify-center text-4xl">🎁</div>
                          )}
                        </div>
                        <div className="p-3">
                          <p className="text-icy-500 text-[10px] font-semibold uppercase tracking-widest mb-1">
                            Personalize It
                          </p>
                          <h4 className="font-serif text-navy-950 text-sm font-semibold leading-tight mb-1 line-clamp-2">
                            {product.name}
                          </h4>
                          <p className="text-navy-700 text-sm font-medium">
                            From €{price.toFixed(2)}
                          </p>
                        </div>
                      </Link>
                    );
                  })
                : /* Placeholder cards when no products */
                  Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="bg-white rounded-xl overflow-hidden shadow-card">
                      <div className="aspect-square bg-cream-100 animate-shimmer" />
                      <div className="p-3 space-y-2">
                        <div className="h-2.5 bg-cream-200 rounded w-1/2 animate-shimmer" />
                        <div className="h-3 bg-cream-200 rounded animate-shimmer" />
                        <div className="h-3 bg-cream-200 rounded w-2/3 animate-shimmer" />
                      </div>
                    </div>
                  ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
