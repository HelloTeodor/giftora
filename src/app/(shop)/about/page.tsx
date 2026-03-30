import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Heart, Sparkles, Users, Globe } from 'lucide-react';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About Us',
  description: 'Learn about Giftora — our story, mission, and commitment to premium gifting.',
};

const values = [
  { icon: Heart, title: 'Curated with Love', desc: 'Every product in our boxes is hand-selected for quality, beauty, and thoughtfulness.' },
  { icon: Sparkles, title: 'Premium Quality', desc: 'We partner with artisan brands and premium suppliers to ensure only the finest products.' },
  { icon: Users, title: 'Customer First', desc: 'Our customers are at the heart of everything we do — from packaging to post-purchase support.' },
  { icon: Globe, title: 'Sustainable Gifting', desc: 'We\'re committed to sustainable packaging and environmentally responsible practices.' },
];

export default function AboutPage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-navy-gradient py-20 text-center relative overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="relative z-10 section-padding">
          <p className="text-gold-400 text-sm font-semibold uppercase tracking-widest mb-4">Our Story</p>
          <h1 className="font-serif text-4xl lg:text-5xl font-bold text-white mb-4">
            Gifting Made <span className="text-transparent bg-clip-text bg-gold-gradient">Extraordinary</span>
          </h1>
          <p className="text-cream-300 max-w-2xl mx-auto text-lg">
            Giftora was born from a simple belief: that every special moment deserves a beautifully curated gift that tells a story.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="section-padding grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-gold-600 text-sm font-semibold uppercase tracking-widest mb-4">Who We Are</p>
            <h2 className="font-serif text-3xl font-bold text-navy-950 mb-6">
              We believe gifts should create memories, not stress.
            </h2>
            <div className="space-y-4 text-cream-700 leading-relaxed">
              <p>
                Founded in Dublin, Ireland, Giftora was created to solve the universal challenge of finding the perfect gift. Too often, people settle for generic, impersonal presents — not because they don't care, but because they don't have the time or knowledge to curate something truly special.
              </p>
              <p>
                We handle all the curation, so you can focus on the moment. Each of our gift boxes is thoughtfully assembled from premium, artisan products that together tell a story — whether it's welcoming a new team member, celebrating a new life, or simply saying "I love you."
              </p>
              <p>
                From our signature navy packaging to the golden ribbon and personalised note card, every detail is designed to create a premium unboxing experience that recipients will remember.
              </p>
            </div>
          </div>
          <div className="relative">
            <div className="rounded-2xl overflow-hidden shadow-premium">
              <Image
                src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700"
                alt="Giftora premium gift box"
                width={600}
                height={500}
                className="object-cover w-full"
              />
            </div>
            <div className="absolute -bottom-5 -left-5 bg-navy-950 text-white rounded-2xl p-5 shadow-premium max-w-44">
              <p className="font-serif text-3xl font-bold text-gold-400">10k+</p>
              <p className="text-cream-300 text-sm">Happy Customers</p>
            </div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-16 lg:py-20 bg-cream-50">
        <div className="section-padding">
          <div className="text-center mb-12">
            <h2 className="font-serif text-3xl font-bold text-navy-950 mb-3">Our Values</h2>
            <p className="text-cream-500">The principles that guide everything we do.</p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {values.map(v => (
              <div key={v.title} className="card-premium p-6 text-center">
                <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center mx-auto mb-4">
                  <v.icon size={22} className="text-gold-600" />
                </div>
                <h3 className="font-serif font-semibold text-navy-950 mb-2">{v.title}</h3>
                <p className="text-cream-500 text-sm leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-white text-center">
        <div className="section-padding">
          <h2 className="font-serif text-3xl font-bold text-navy-950 mb-4">Ready to Gift Beautifully?</h2>
          <p className="text-cream-500 mb-8 max-w-lg mx-auto">
            Browse our full collection of premium gift boxes for every occasion.
          </p>
          <Link href="/products" className="btn-gold inline-flex items-center gap-2 text-base px-8 py-3.5">
            Shop Gift Boxes <ArrowRight size={18} />
          </Link>
        </div>
      </section>
    </div>
  );
}
