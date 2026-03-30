import Link from 'next/link';
import Image from 'next/image';

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Left panel - form */}
      <div className="flex flex-col justify-center px-6 py-12 lg:px-12 bg-white">
        <div className="w-full max-w-md mx-auto">
          <Link href="/" className="inline-block mb-10">
            <span className="font-serif text-2xl font-bold tracking-widest text-navy-950">
              GIFT<span className="text-gold-500">ORA</span>
            </span>
          </Link>
          {children}
        </div>
      </div>

      {/* Right panel - image */}
      <div className="hidden lg:flex relative bg-navy-gradient overflow-hidden">
        <div className="absolute inset-0 bg-hero-pattern" />
        <div className="relative z-10 flex flex-col justify-center items-center p-12 text-center">
          <div className="relative w-80 h-80 mb-8">
            <Image
              src="https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=700"
              alt="Giftora premium gift box"
              fill
              className="object-cover rounded-3xl shadow-2xl"
            />
            <div className="absolute -bottom-4 -right-4 bg-gold-500 text-white rounded-2xl p-4 shadow-gold">
              <p className="font-serif text-2xl font-bold">4.9★</p>
              <p className="text-xs opacity-90">10k+ reviews</p>
            </div>
          </div>
          <h2 className="font-serif text-3xl font-bold text-white mb-3">
            Premium Gifting, Effortlessly
          </h2>
          <p className="text-cream-300 max-w-sm">
            Join thousands of happy customers and discover the art of perfect gifting.
          </p>
        </div>
      </div>
    </div>
  );
}
