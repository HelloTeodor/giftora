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

// Organic watercolor blob SVG — matches the icy-blue paper circle reference
function BotanicalBlob() {
  return (
    <svg
      viewBox="0 0 500 500"
      xmlns="http://www.w3.org/2000/svg"
      className="w-full h-full"
      aria-hidden
    >
      <defs>
        <radialGradient id="blobGrad" cx="45%" cy="42%" r="55%">
          <stop offset="0%"  stopColor="#ffffff" stopOpacity="0.95" />
          <stop offset="45%" stopColor="#d8eef5" stopOpacity="0.9" />
          <stop offset="100%" stopColor="#6BB9D4" stopOpacity="0.55" />
        </radialGradient>
        <filter id="paper" x="-5%" y="-5%" width="110%" height="110%">
          <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" result="noise"/>
          <feColorMatrix type="saturate" values="0" in="noise" result="greyNoise"/>
          <feBlend in="SourceGraphic" in2="greyNoise" mode="multiply" result="blend"/>
          <feComposite in="blend" in2="SourceGraphic" operator="in"/>
        </filter>
        <clipPath id="blobClip">
          <path d="
            M 248 42
            C 278 38, 312 31, 338 47
            C 362 62, 375 88, 394 108
            C 414 130, 442 145, 454 171
            C 467 198, 462 229, 460 258
            C 458 285, 462 312, 451 336
            C 440 360, 418 375, 398 393
            C 376 412, 354 430, 328 441
            C 302 452, 273 454, 246 456
            C 219 458, 191 458, 166 448
            C 140 438, 119 419, 98 401
            C 77 383, 55 366, 43 342
            C 31 318, 35 290, 34 263
            C 33 236, 27 208, 36 183
            C 46 157, 67 138, 88 118
            C 109 98, 128 77, 154 63
            C 180 49, 218 46, 248 42 Z
          "/>
        </clipPath>
      </defs>

      {/* Main blob */}
      <g clipPath="url(#blobClip)">
        <ellipse cx="250" cy="250" rx="215" ry="215" fill="url(#blobGrad)" filter="url(#paper)" />
      </g>

      {/* Blob outline with rough edge */}
      <path
        d="
          M 248 42
          C 278 38, 312 31, 338 47
          C 362 62, 375 88, 394 108
          C 414 130, 442 145, 454 171
          C 467 198, 462 229, 460 258
          C 458 285, 462 312, 451 336
          C 440 360, 418 375, 398 393
          C 376 412, 354 430, 328 441
          C 302 452, 273 454, 246 456
          C 219 458, 191 458, 166 448
          C 140 438, 119 419, 98 401
          C 77 383, 55 366, 43 342
          C 31 318, 35 290, 34 263
          C 33 236, 27 208, 36 183
          C 46 157, 67 138, 88 118
          C 109 98, 128 77, 154 63
          C 180 49, 218 46, 248 42 Z
        "
        fill="none"
        stroke="#6BB9D4"
        strokeWidth="1.5"
        strokeOpacity="0.3"
      />

      {/* Top-left botanical — leaf branch */}
      <g transform="translate(88, 92) rotate(-30)" opacity="0.7">
        <path d="M0 0 Q8-14 18-10" stroke="#7aab90" strokeWidth="1.2" fill="none"/>
        <path d="M4-6 Q14-18 22-12" stroke="#7aab90" strokeWidth="1.2" fill="none"/>
        <ellipse cx="18" cy="-10" rx="6" ry="3.5" fill="#9dbfaa" transform="rotate(-20 18 -10)"/>
        <ellipse cx="22" cy="-12" rx="5.5" ry="3" fill="#8fb5a0" transform="rotate(-35 22 -12)"/>
        <ellipse cx="8" cy="-5" rx="5" ry="3" fill="#a8c9b5" transform="rotate(-10 8 -5)"/>
      </g>

      {/* Bottom-right botanical — wildflower */}
      <g transform="translate(350, 368)" opacity="0.75">
        <line x1="0" y1="0" x2="-4" y2="-28" stroke="#8aaa7a" strokeWidth="1.2"/>
        <line x1="-2" y1="-14" x2="-10" y2="-22" stroke="#8aaa7a" strokeWidth="1"/>
        <line x1="-2" y1="-14" x2="6" y2="-20" stroke="#8aaa7a" strokeWidth="1"/>
        <circle cx="-4" cy="-30" r="3.5" fill="#e8c56a" opacity="0.9"/>
        <circle cx="-10" cy="-24" r="3" fill="#d4b85a" opacity="0.85"/>
        <circle cx="6" cy="-22" r="3" fill="#e8c56a" opacity="0.85"/>
        {/* Small berries */}
        <circle cx="10" cy="-8" r="3.5" fill="#afd4c8" opacity="0.8"/>
        <circle cx="14" cy="-14" r="3" fill="#c5e0d8" opacity="0.75"/>
        <circle cx="18" cy="-6" r="3" fill="#afd4c8" opacity="0.8"/>
      </g>
    </svg>
  );
}

export function WhyGiftora({ products = [] }: Props) {
  const bestSellers = products.slice(0, 4);

  return (
    <section className="py-14 lg:py-20 bg-cream-50">
      <div className="section-padding">
        <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">

          {/* LEFT — Sustainability blob */}
          <div className="relative flex items-center justify-center min-h-[380px] lg:min-h-[500px]">
            {/* SVG blob background */}
            <div className="absolute inset-0">
              <BotanicalBlob />
            </div>

            {/* Text content */}
            <div className="relative z-10 px-10 py-12 text-center max-w-sm">
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
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-icy-500 mb-4">
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
                : Array.from({ length: 4 }).map((_, i) => (
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
