import Link from 'next/link';
import { Instagram, Facebook, Twitter, Linkedin, Mail, Phone, MapPin } from 'lucide-react';
import { NewsletterForm } from '@/components/marketing/NewsletterForm';

const footerLinks = {
  shop: [
    { label: 'Gift Boxes',        href: '/products' },
    { label: 'Gift Sets',         href: '/collections' },
    { label: 'Home & Living',     href: '/categories/self-care' },
    { label: 'Personalized Gifts',href: '/products' },
  ],
  company: [
    { label: 'About',           href: '/about' },
    { label: 'Sustainability',  href: '/about' },
    { label: 'Blog',            href: '/blog' },
    { label: 'Contact',         href: '/contact' },
  ],
  help: [
    { label: 'FAQ',       href: '/help' },
    { label: 'Shipping',  href: '/policies/shipping' },
    { label: 'Returns',   href: '/policies/returns' },
    { label: 'Track Order',href: '/track-order' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-navy-950 text-white">

      {/* Newsletter */}
      <div className="border-b border-navy-800">
        <div className="section-padding py-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
            <div className="text-center lg:text-left">
              <h3 className="font-serif text-2xl font-semibold mb-1">Stay in the loop</h3>
              <p className="text-navy-300 text-sm">Exclusive offers, new arrivals, and gifting ideas.</p>
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
          <div className="col-span-2 md:col-span-4 lg:col-span-2">
            <Link href="/" className="block mb-4">
              <span className="font-serif text-2xl font-bold tracking-[0.04em] text-white">Radu <span className="text-gold-500">&amp;</span> Co</span>
              <span className="block text-[10px] italic text-navy-400 font-light tracking-wide mt-0.5">Thoughtful Gifts &amp; Living</span>
            </Link>
            <p className="text-navy-300 text-sm leading-relaxed mb-6 max-w-xs">
              Beautifully curated, eco-friendly gift boxes for every occasion — made with love and care.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: 'https://instagram.com/giftora' },
                { Icon: Facebook,  href: 'https://facebook.com/giftora' },
                { Icon: Twitter,   href: 'https://twitter.com/giftora' },
                { Icon: Linkedin,  href: 'https://linkedin.com/company/giftora' },
              ].map(({ Icon, href }) => (
                <a
                  key={href}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 rounded-full bg-navy-800 flex items-center justify-center text-navy-300 hover:bg-gold-500 hover:text-white transition-all"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {[
            { title: 'Shop',    links: footerLinks.shop },
            { title: 'Company', links: footerLinks.company },
            { title: 'Help',    links: footerLinks.help },
          ].map(({ title, links }) => (
            <div key={title}>
              <h4 className="text-white font-semibold text-xs uppercase tracking-widest mb-4">{title}</h4>
              <ul className="space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-navy-300 text-sm hover:text-gold-400 transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Contact row */}
        <div className="mt-10 pt-8 border-t border-navy-800 flex flex-col sm:flex-row gap-4 sm:gap-8">
          <a href="mailto:hello@giftora.com" className="flex items-center gap-2 text-navy-300 text-sm hover:text-gold-400 transition-colors">
            <Mail size={14} /> hello@giftora.com
          </a>
          <a href="tel:+353123456789" className="flex items-center gap-2 text-navy-300 text-sm hover:text-gold-400 transition-colors">
            <Phone size={14} /> +353 1 234 5678
          </a>
          <span className="flex items-center gap-2 text-navy-400 text-sm">
            <MapPin size={14} /> Dublin, Ireland
          </span>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy-800">
        <div className="section-padding py-5 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-navy-400">
          <p>© {new Date().getFullYear()} Radu &amp; Co. All rights reserved.</p>
          <div className="flex gap-5 flex-wrap justify-center">
            {[
              { label: 'Privacy Policy',  href: '/policies/privacy' },
              { label: 'Terms of Service',href: '/policies/terms' },
              { label: 'Cookie Policy',   href: '/policies/cookies' },
            ].map((l) => (
              <Link key={l.href} href={l.href} className="hover:text-gold-400 transition-colors">{l.label}</Link>
            ))}
          </div>
          <div className="flex items-center gap-2">
            {['Visa','MC','Amex','PayPal','Klarna'].map((p) => (
              <span key={p} className="px-2 py-1 bg-navy-800 text-navy-300 text-xs rounded font-medium">{p}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
