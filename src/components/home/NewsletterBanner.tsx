import { NewsletterForm } from '@/components/marketing/NewsletterForm';

export function NewsletterBanner() {
  return (
    <section className="py-16 lg:py-20 bg-cream-100 border-y border-cream-200">
      <div className="section-padding">
        <div className="max-w-2xl mx-auto text-center">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-px w-12 bg-cream-300" />
            <p className="text-gold-600 text-xs font-semibold uppercase tracking-[0.2em]">Exclusive Offer</p>
            <div className="h-px w-12 bg-cream-300" />
          </div>
          <h2 className="font-serif text-3xl lg:text-5xl font-bold text-navy-950 mb-3">
            Get 10% Off Your First Order
          </h2>
          <p className="text-cream-600 mb-8">
            Join 50,000+ gift lovers. Get exclusive offers, new collection previews, and inspiring gifting ideas — straight to your inbox.
          </p>
          <NewsletterForm />
          <p className="text-xs text-cream-400 mt-3">
            No spam, ever. Unsubscribe any time.
          </p>
        </div>
      </div>
    </section>
  );
}
