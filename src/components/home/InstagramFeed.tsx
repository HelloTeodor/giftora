import Image from 'next/image';
import { Instagram } from 'lucide-react';

const posts = [
  { url: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=300', alt: 'Gift box' },
  { url: 'https://images.unsplash.com/photo-1512909006721-3d6018887383?w=300', alt: 'Christmas box' },
  { url: 'https://images.unsplash.com/photo-1549465220-1a8b9238cd48?w=300', alt: 'Birthday box' },
  { url: 'https://images.unsplash.com/photo-1522771930-78848d9293e8?w=300', alt: 'Newborn box' },
  { url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=300', alt: "Valentine's box" },
  { url: 'https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=300', alt: 'Self-care box' },
];

export function InstagramFeed() {
  return (
    <section className="py-16 lg:py-20 bg-white">
      <div className="section-padding">
        <div className="text-center mb-10">
          <p className="text-gold-600 text-sm font-semibold uppercase tracking-widest mb-3">Follow Us</p>
          <h2 className="font-serif text-3xl font-bold text-navy-950 mb-2">
            @GiftOra on Instagram
          </h2>
          <a
            href="https://instagram.com/giftora"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-cream-500 hover:text-gold-600 transition-colors text-sm"
          >
            <Instagram size={16} /> Follow us for daily gifting inspiration
          </a>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
          {posts.map((post, i) => (
            <a
              key={i}
              href="https://instagram.com/giftora"
              target="_blank"
              rel="noopener noreferrer"
              className="relative aspect-square overflow-hidden rounded-lg group"
            >
              <Image
                src={post.url}
                alt={post.alt}
                fill
                sizes="(max-width: 640px) 33vw, 16vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-navy-950/0 group-hover:bg-navy-950/40 transition-colors flex items-center justify-center">
                <Instagram size={24} className="text-white opacity-0 group-hover:opacity-100 transition-opacity" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
