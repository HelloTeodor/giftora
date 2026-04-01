'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useState, useEffect } from 'react';

const slides = [
  { src: 'https://i.imgur.com/AswAvB2.png', alt: 'Beautifully curated eco-friendly gift box' },
  { src: 'https://i.imgur.com/vicYZKf.png', alt: 'Premium gift set with natural products' },
  { src: 'https://i.imgur.com/xTPHYnW.png', alt: 'Thoughtful gifts made with love' },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent((prev) => (prev + 1) % slides.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative w-full h-[480px] sm:h-[560px] lg:h-[640px] overflow-hidden">
      {/* Slides */}
      {slides.map((slide, i) => (
        <div
          key={slide.src}
          className="absolute inset-0 transition-opacity duration-1000"
          style={{ opacity: i === current ? 1 : 0 }}
        >
          <Image
            src={slide.src}
            alt={slide.alt}
            fill
            className="object-cover object-left"
            priority={i === 0}
          />
        </div>
      ))}

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
            {slides.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`transition-all duration-300 rounded-full ${
                  i === current
                    ? 'w-6 h-2 bg-gold-500'
                    : 'w-2 h-2 bg-cream-300'
                }`}
                aria-label={`Go to slide ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
