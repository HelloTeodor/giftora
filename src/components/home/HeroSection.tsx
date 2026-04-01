import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative bg-cream-50 overflow-hidden">
      <div className="grid lg:grid-cols-[55%_45%] min-h-[540px] lg:min-h-[620px]">

        {/* LEFT — hero image */}
        <div className="relative w-full h-72 sm:h-96 lg:h-auto">
          <Image
            src="https://images.unsplash.com/photo-1512909006721-3d6018887383?w=900&auto=format&fit=crop"
            alt="A beautifully curated eco-friendly gift box"
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* RIGHT — text content */}
        <div className="flex flex-col justify-center px-8 sm:px-12 lg:px-16 py-14 bg-white">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-navy-950 leading-snug mb-5">
            Give a meaningful,{' '}
            <span className="italic text-navy-700">eco-friendly</span> gift
            box made with love.
          </h1>
          <p className="text-cream-600 text-base leading-relaxed mb-8 max-w-md">
            Surprise your loved ones with curated gift sets that nurture and
            delight while caring for the planet.
          </p>
          <div className="flex flex-col sm:flex-row items-start gap-4">
            <Link href="/products" className="btn-gold">
              Shop Gift Boxes
            </Link>
          </div>

          {/* Slider dots */}
          <div className="flex items-center gap-2 mt-10">
            <span className="w-6 h-2 rounded-full bg-gold-500" />
            <span className="w-2 h-2 rounded-full bg-cream-300" />
            <span className="w-2 h-2 rounded-full bg-cream-300" />
          </div>
        </div>
      </div>
    </section>
  );
}
