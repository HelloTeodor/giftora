import { Gift, Truck, Shield, RefreshCw, Heart, Sparkles } from 'lucide-react';

const features = [
  {
    icon: Gift,
    title: 'Artisan Curation',
    description: 'Every box is thoughtfully assembled with premium, hand-selected products.',
  },
  {
    icon: Sparkles,
    title: 'Luxury Packaging',
    description: 'Stunning presentation in branded boxes wrapped with signature gold ribbon.',
  },
  {
    icon: Truck,
    title: 'Fast & Reliable Delivery',
    description: 'Free shipping over €75. Express options available nationwide.',
  },
  {
    icon: Heart,
    title: 'Personal Touch',
    description: 'Add a handwritten note or personalised message to make it truly special.',
  },
  {
    icon: Shield,
    title: 'Satisfaction Guaranteed',
    description: "Not happy? We'll make it right with our hassle-free returns policy.",
  },
  {
    icon: RefreshCw,
    title: 'Easy Returns',
    description: '30-day return window. No questions asked, full refund guaranteed.',
  },
];

export function WhyGiftora() {
  return (
    <section className="py-16 lg:py-24 bg-navy-950 relative overflow-hidden">
      <div className="absolute inset-0 bg-hero-pattern" />
      <div className="absolute top-0 right-1/4 w-64 h-64 rounded-full bg-gold-500/5 blur-3xl" />

      <div className="section-padding relative z-10">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-white/20" />
            <p className="text-gold-400 text-xs font-semibold uppercase tracking-[0.2em]">The Giftora Difference</p>
            <div className="h-px w-12 bg-white/20" />
          </div>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-white mb-4">
            Why Choose Giftora?
          </h2>
          <p className="text-cream-400 max-w-xl mx-auto">
            We believe gifting should be effortless, beautiful, and meaningful. Every detail matters.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="group p-6 rounded-2xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-gold-500/30 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gold-500/10 border border-gold-500/20 flex items-center justify-center mb-4 group-hover:bg-gold-500/20 transition-colors">
                <f.icon size={22} className="text-gold-400" />
              </div>
              <h3 className="font-serif text-white font-semibold text-lg mb-2">{f.title}</h3>
              <p className="text-cream-400 text-sm leading-relaxed">{f.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
