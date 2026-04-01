import Link from 'next/link';
import Image from 'next/image';

export function HeroSection() {
  return (
    <section className="relative w-full h-[480px] sm:h-[560px] lg:h-[640px] overflow-hidden">
      {/* Full-bleed hero image */}
      <Image
        src="https://i.imgur.com/AswAvB2.png"
        alt="Beautifully curated eco-friendly gift box"
        fill
        className="object-cover object-left"
        priority
      />

      {/* Text overlay — sits over the right/white area of the image */}
      <div className="absolute inset-0 flex items-center justify-end">
        <div className="w-full sm:w-1/2 lg:w-[42%] px-8 sm:px-10 lg:px-14 xl:pr-20">
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-[2.6rem] font-semibold text-navy-950 leading-snug mb-5">
            Give a meaningful,{' '}
            <span className="italic text-navy-700">eco-friendly</span> gift
            box made with love.
          </h1>
          <p className="text-navy-600 text-base leading-relaxed mb-8 max-w-sm">
            Surprise your loved ones with curated gift sets that nurture and
            delight while caring for the planet.
          </p>
          <Link href="/products" className="btn-gold inline-block">
            Shop Gift Boxes
          </Link>

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
