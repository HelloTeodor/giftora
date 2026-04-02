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

  const productCards = bestSellers.length > 0
    ? bestSellers.map((product) => {
        const img =
          product.images.find((i) => i.isPrimary)?.url ||
          product.images[0]?.url;
        const price = product.salePrice ?? product.basePrice;
        return (
          <Link
            key={product.id}
            href={`/products/${product.slug}`}
            className="group block bg-white rounded-xl overflow-hidden transition-all"
          >
            <div className="relative aspect-square">
              {img ? (
                <Image
                  src={img}
                  alt={product.name}
                  fill
                  sizes="(max-width: 768px) 50vw, 30vw"
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
    : Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl overflow-hidden">
          <div className="aspect-square bg-cream-100 animate-shimmer" />
          <div className="p-3 space-y-2">
            <div className="h-2.5 bg-cream-200 rounded w-1/2 animate-shimmer" />
            <div className="h-3 bg-cream-200 rounded animate-shimmer" />
            <div className="h-3 bg-cream-200 rounded w-2/3 animate-shimmer" />
          </div>
        </div>
      ));

  return (
    <section className="py-14 lg:py-20 bg-cream-50 relative">

      <div className="section-padding">

        {/* ── DESKTOP ── */}
        <div className="hidden lg:grid items-center relative" style={{ gridTemplateColumns: '2fr 3fr', gap: '2rem' }}>

          {/* Watercolor — direct child of grid, absolute, behind everything */}
          <div
            className="absolute pointer-events-none z-0"
            style={{ top: '50%', left: '-120px', transform: 'translateY(-50%)', width: '650px', height: '650px' }}
          >
            <Image
              src="https://i.imgur.com/I3p4nka.png"
              alt=""
              fill
              className="object-contain w-full h-full"
              aria-hidden
            />
          </div>

          {/* LEFT — text on top of watercolor */}
          <div className="relative z-10 flex items-center justify-center" style={{ minHeight: '540px' }}>

            {/* Text on top of watercolor */}
            <div className="relative z-10 text-center max-w-[280px] px-2">
              <h2 className="font-serif text-3xl lg:text-4xl font-semibold text-navy-950 leading-snug mb-4">
                Our Commitment to Sustainability
              </h2>
              <p className="text-navy-700 text-sm leading-relaxed mb-6">
                As a family-owned business, we believe in thoughtful gifting that
                doesn&apos;t harm the earth. We use eco-friendly materials, sustainable
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

          {/* RIGHT — solid panel overlapping the watercolor from the right */}
          <div className="relative z-20 -ml-20 bg-[#F6F1E8] p-8 rounded-lg">
            <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-icy-500 mb-6">
              Shop Best Sellers
            </p>
            <div className="grid grid-cols-2 gap-4">
              {productCards}
            </div>
          </div>

        </div>

        {/* ── MOBILE ── */}
        <div className="lg:hidden space-y-10">
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="relative w-[140%] h-[140%]">
                <Image
                  src="https://i.imgur.com/I3p4nka.png"
                  alt=""
                  fill
                  className="object-contain"
                  aria-hidden
                />
              </div>
            </div>
            <div className="relative z-10 px-6 py-16 text-center max-w-sm mx-auto">
              <h2 className="font-serif text-3xl font-semibold text-navy-950 leading-snug mb-4">
                Our Commitment to Sustainability
              </h2>
              <p className="text-navy-700 text-sm leading-relaxed mb-6">
                As a family-owned business, we believe in thoughtful gifting that
                doesn&apos;t harm the earth. We use eco-friendly materials, sustainable
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
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-icy-500 mb-4">
              Shop Best Sellers
            </p>
            <div className="grid grid-cols-2 gap-4">
              {productCards}
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
