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
    <div className="relative w-full flex items-center justify-center">
      <section className="relative w-[90%] mx-auto py-16">

        {/* WATERCOLOUR IMAGE */}
        <Image
          src="https://res.cloudinary.com/dwastb4mg/image/upload/v1775496985/ChatGPT_Image_Apr_1_2026_at_11_40_18_PM_Background_Removed_tdmrh1.png"
          alt=""
          width={750}
          height={750}
          className="absolute top-1/2 -translate-y-1/2 z-0 pointer-events-none select-none"
          style={{ left: '-150px', width: '750px', maxWidth: 'none', height: 'auto' }}
          aria-hidden
        />

        {/* MAIN CONTENT */}
        <div className="relative grid lg:grid-cols-2 items-center z-10">

          {/* LEFT TEXT */}
          <div className="flex justify-center lg:justify-start">
            <div className="max-w-[420px] text-center lg:text-left ml-12">
              <h2 className="font-serif text-[42px] leading-tight text-[#2f4f4f] mb-6">
                Our Commitment <br />
                to Sustainability
              </h2>

              <p className="text-gray-600 text-[15px] leading-relaxed mb-6">
                As a family-owned business, we believe in thoughtful gifting
                that doesn&apos;t harm the earth. We use eco-friendly materials,
                sustainable practices, and a personalized touch to create gifts
                that bring joy to the heart and home.
              </p>

              <Link
                href="/about"
                className="inline-block bg-[#2f6f73] text-white px-7 py-3 text-xs tracking-[0.25em] rounded-sm"
              >
                LOVINGLY MADE
              </Link>

              <p className="mt-3 text-sm text-gray-600">Eco-Friendly Packaging.</p>

              {/* dots */}
              <div className="flex justify-center lg:justify-start gap-2 mt-4">
                <span className="w-2 h-2 bg-[#caa86a] rounded-full"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
                <span className="w-2 h-2 bg-gray-300 rounded-full"></span>
              </div>
            </div>
          </div>

          {/* RIGHT WHITE CARD */}
          <div className="relative">
            <div className="bg-white rounded-sm shadow-lg p-8 ml-[-100px]">

              {/* HEADING */}
              <div className="flex items-center gap-4 mb-6">
                <div className="flex-1 h-px bg-gray-300"></div>
                <h3 className="text-[11px] tracking-[0.35em] text-gray-500 whitespace-nowrap">
                  SHOP BEST SELLERS
                </h3>
                <div className="flex-1 h-px bg-gray-300"></div>
              </div>

              {/* GRID */}
              <div className="grid grid-cols-2 gap-8">
                {bestSellers.length > 0
                  ? bestSellers.map((product) => {
                      const img =
                        product.images.find((i) => i.isPrimary)?.url ||
                        product.images[0]?.url;
                      const price = product.salePrice ?? product.basePrice;
                      return (
                        <Link key={product.id} href={`/products/${product.slug}`}>
                          <div className="relative w-full h-[150px] mb-3">
                            {img ? (
                              <Image
                                src={img}
                                alt={product.name}
                                fill
                                sizes="(max-width: 768px) 50vw, 20vw"
                                className="object-cover rounded-sm"
                              />
                            ) : (
                              <div className="w-full h-full bg-cream-100 rounded-sm flex items-center justify-center text-3xl">🎁</div>
                            )}
                          </div>
                          <p className="text-[10px] tracking-[0.25em] text-[#caa86a] mb-1">
                            PERSONALIZE IT
                          </p>
                          <h4 className="font-serif text-[18px] text-gray-800 leading-snug">
                            {product.name}
                          </h4>
                          <p className="text-sm text-gray-500 italic">
                            From €{price.toFixed(2)}
                          </p>
                        </Link>
                      );
                    })
                  : Array.from({ length: 4 }).map((_, i) => (
                      <div key={i}>
                        <div className="w-full h-[150px] bg-gray-100 rounded-sm mb-3 animate-pulse" />
                        <div className="h-2 bg-gray-100 rounded w-1/2 mb-2 animate-pulse" />
                        <div className="h-4 bg-gray-100 rounded mb-1 animate-pulse" />
                        <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse" />
                      </div>
                    ))}
              </div>

            </div>
          </div>

        </div>
      </section>
    </div>
  );
}
