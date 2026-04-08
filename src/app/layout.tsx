import type { Metadata, Viewport } from 'next';
import './globals.css';
import { Providers } from './providers';

export const metadata: Metadata = {
  title: {
    default: 'HappyBox — Premium Gift Boxes for Every Occasion',
    template: '%s | HappyBox',
  },
  description:
    'Discover beautifully curated gift boxes for every occasion. New hire, Christmas, birthdays, newborns, Valentine\'s Day, Easter, and more. Premium gifting made effortless.',
  keywords: [
    'gift boxes', 'luxury gifts', 'curated gifts', 'premium gift boxes',
    'corporate gifts', 'birthday gifts', 'Christmas gifts', 'new hire gifts',
  ],
  authors: [{ name: 'HappyBox' }],
  creator: 'HappyBox',
  openGraph: {
    type: 'website',
    locale: 'en_IE',
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: 'HappyBox',
    title: 'HappyBox — Premium Gift Boxes for Every Occasion',
    description: 'Beautifully curated gift boxes for every occasion.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'HappyBox — Premium Gift Boxes',
    description: 'Beautifully curated gift boxes for every occasion.',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true },
  },
  manifest: '/site.webmanifest',
  icons: {
    icon: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

export const viewport: Viewport = {
  themeColor: '#0d1117',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
