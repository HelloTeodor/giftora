import { Star, Quote } from 'lucide-react';
import Image from 'next/image';
import { getInitials } from '@/lib/utils';

interface Testimonial {
  id: string;
  rating: number;
  title?: string | null;
  body: string;
  createdAt: Date;
  user: { name?: string | null; avatar?: string | null };
}

const fallbackTestimonials = [
  { id: '1', rating: 5, title: 'Absolutely stunning!', body: "I ordered the Executive Welcome Box for our new hires and the team was blown away. The packaging is incredibly premium and every product inside is high quality. Will definitely be ordering again!", user: { name: 'Sarah M.', avatar: null } },
  { id: '2', rating: 5, title: 'Perfect Christmas gift', body: "Ordered the Christmas Luxury Box for my whole family. Everyone loved it. The presentation was beautiful and the products were premium quality. Giftora made my holiday shopping stress-free!", user: { name: 'James O.', avatar: null } },
  { id: '3', rating: 5, title: 'Made our client feel special', body: "We sent the Corporate Prestige Box to our top client as a year-end gift. They called us specifically to say how impressed they were. Worth every cent for the impression it created.", user: { name: 'Emma K.', avatar: null } },
  { id: '4', rating: 5, title: 'Perfect for new moms', body: "Gifted the Newborn Box to my sister and she cried happy tears. The quality and care that went into the selection was evident. The note card made it extra personal.", user: { name: 'Aoife B.', avatar: null } },
  { id: '5', rating: 5, title: 'Luxury at its finest', body: "The Self-Care Ritual Box was genuinely luxurious. Everything felt premium, the bath salts were amazing, the candle smells divine. I ended up ordering one for myself too!", user: { name: 'Laura T.', avatar: null } },
  { id: '6', rating: 5, title: 'Fast delivery, beautiful box', body: "Ordered a Birthday Bliss Box with 2-day shipping and it arrived perfectly packaged. My friend said it was the best birthday gift she'd ever received. Giftora exceeded expectations!", user: { name: 'Conor R.', avatar: null } },
];

export function Testimonials({ testimonials }: { testimonials: Testimonial[] }) {
  const items = testimonials.length >= 3 ? testimonials : fallbackTestimonials;

  return (
    <section className="py-16 lg:py-24 bg-cream-50">
      <div className="section-padding">
        <div className="text-center mb-12">
          <p className="text-gold-600 text-sm font-semibold uppercase tracking-widest mb-3">Customer Love</p>
          <h2 className="font-serif text-3xl lg:text-4xl font-bold text-navy-950 mb-4">
            What Our Customers Say
          </h2>
          <div className="flex items-center justify-center gap-2">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} size={18} className="text-gold-500 fill-gold-500" />
              ))}
            </div>
            <span className="text-navy-700 font-semibold">4.9 out of 5</span>
            <span className="text-cream-500 text-sm">· 10,000+ reviews</span>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.slice(0, 6).map((t) => (
            <div key={t.id} className="card-premium p-6 relative">
              <Quote size={24} className="text-gold-200 absolute top-4 right-4" />
              <div className="flex mb-3">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={14}
                    className={i < t.rating ? 'text-gold-500 fill-gold-500' : 'text-cream-200'}
                  />
                ))}
              </div>
              {t.title && (
                <h4 className="font-serif font-semibold text-navy-950 mb-2">{t.title}</h4>
              )}
              <p className="text-cream-600 text-sm leading-relaxed mb-4 line-clamp-3">{t.body}</p>
              <div className="flex items-center gap-3 pt-3 border-t border-cream-100">
                <div className="w-8 h-8 rounded-full bg-navy-950 flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                  {t.user.avatar ? (
                    <Image src={t.user.avatar} alt={t.user.name || ''} width={32} height={32} className="rounded-full" />
                  ) : (
                    getInitials(t.user.name)
                  )}
                </div>
                <div>
                  <p className="text-navy-800 font-medium text-sm">{t.user.name || 'Anonymous'}</p>
                  <p className="text-cream-400 text-xs">Verified Purchase</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
