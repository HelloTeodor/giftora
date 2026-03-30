import Link from 'next/link';
import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { NewsletterForm } from '@/components/marketing/NewsletterForm';

const footerLinks = {
  shop: [
    { label: 'All Gift Boxes', href: '/products' },
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Best Sellers', href: '/products?sort=popular' },
    { label: 'Sale', href: '/products?sale=true' },
    { label: 'Collections', href: '/collections' },
  ],
  occasions: [
    { label: 'New Hire', href: '/categories/new-hire' },
    { label: 'Christmas', href: '/categories/christmas' },
    { label: 'Birthday', href: '/categories/birthday' },
    { label: 'Newborn', href: '/categories/newborn' },
    { label: "Valentine's Day", href: '/categories/valentines' },
    { label: 'Corporate', href: '/categories/corporate' },
  ],
  company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Affiliate Program', href: '/affiliate' },
  ],
  support: [
    { label: 'Help Center', href: '/help' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'Returns & Refunds', href: '/policies/returns' },
    { label: 'Shipping Info', href: '/policies/shipping' },
    { label: 'Contact Us', href: '/contact' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-950 text-cream-200">
      {/* Newsletter */}
      <div className="border-b border-navy-800">
        <div className="section-padding py-12">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl font-semibold text-white mb-2">
                Stay in the loop
              </h3>
              <p className="text-cream-400 text-sm">
                Get exclusive offers, new collection alerts, and gifting inspiration.
              </p>
            </div>
            <div className="w-full lg:w-auto lg:min-w-96">
              <NewsletterForm dark />
            </div>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="section-padding py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <Link href="/" className="block mb-4">
              <span className="font-serif text-2xl font-bold tracking-widest text-white">
                GIFT<span className="text-gold-500">ORA</span>
              </span>
            </Link>
            <p className="text-cream-400 text-sm leading-relaxed mb-6">
              Beautifully curated gift boxes for every moment that matters. Making gifting effortless and unforgettable.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: 'https://instagram.com/giftora' },
                { Icon: Facebook, href: 'https://facebook.com/giftora' },
                { Icon: Twitter, href: 'https://twitter.com/giftora' },
                { Icon: Linkedin, href: 'https://linkedin.com/company/giftora' },
              ].map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center text-cream-400 hover:bg-gold-600 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links columns */}
          {[
            { title: 'Shop', links: footerLinks.shop },
            { title: 'Occasions', links: footerLinks.occasions },
            { title: 'Company', links: footerLinks.company },
            { title: 'Support', links: footerLinks.support },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-sm uppercase tracking-widest mb-4">
                {title}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-cream-400 text-sm hover:text-gold-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact */}
        <div className="mt-10 pt-8 border-t border-navy-800 flex flex-col sm:flex-row gap-4 sm:gap-8">
          <a href="mailto:hello@giftora.com" className="flex items-center gap-2 text-cream-400 text-sm hover:text-gold-400 transition-colors">
            <Mail size={14} /> hello@giftora.com
          </a>
          <a href="tel:+353123456789" className="flex items-center gap-2 text-cream-400 text-sm hover:text-gold-400 transition-colors">
            <Phone size={14} /> +353 1 234 5678
          </a>
          <span className="flex items-center gap-2 text-cream-400 text-sm">
            <MapPin size={14} /> Dublin, Ireland
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800">
        <div className="section-padding py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-cream-500">
          <p>© {new Date().getFullYear()} Giftora. All rights reserved.</p>
          <div className="flex gap-4 flex-wrap justify-center">
            {[
              { label: 'Privacy Policy', href: '/policies/privacy' },
              { label: 'Terms of Service', href: '/policies/terms' },
              { label: 'Cookie Policy', href: '/policies/cookies' },
              { label: 'Accessibility', href: '/accessibility' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-gold-400 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
          {/* Payment icons */}
          <div className="flex items-center gap-2">
            {['Visa', 'MC', 'Amex', 'PayPal', 'Klarna'].map((p) => (
              <span key={p} className="px-2 py-1 bg-navy-800 text-cream-400 text-xs rounded font-medium">
                {p}
              </span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
