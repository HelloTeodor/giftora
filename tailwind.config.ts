import type { Config } from 'tailwindcss';

const config: Config = {
  darkMode: ['class'],
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          50:  '#f0f2f8',
          100: '#dde3f0',
          200: '#bec9e2',
          300: '#95a8ce',
          400: '#6a83b5',
          500: '#4e68a0',
          600: '#3d5185',
          700: '#31416d',
          800: '#2b375c',
          900: '#1a2238',
          950: '#0d1117',
        },
        gold: {
          50:  '#fdf9ee',
          100: '#faf0d0',
          200: '#f4de9d',
          300: '#ecc763',
          400: '#e5b13a',
          500: '#c8941e',
          600: '#b07318',
          700: '#8c5417',
          800: '#734319',
          900: '#61391a',
          950: '#371c09',
        },
        cream: {
          50:  '#fdfcfa',
          100: '#faf7f2',
          200: '#f4ede2',
          300: '#ebdfcc',
          400: '#ddc9ab',
          500: '#ceb38a',
          600: '#b8926a',
          700: '#9a7453',
          800: '#7f5e45',
          900: '#694e3b',
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: 'hsl(var(--muted))',
          foreground: 'hsl(var(--muted-foreground))',
        },
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        popover: {
          DEFAULT: 'hsl(var(--popover))',
          foreground: 'hsl(var(--popover-foreground))',
        },
        card: {
          DEFAULT: 'hsl(var(--card))',
          foreground: 'hsl(var(--card-foreground))',
        },
      },
      fontFamily: {
        serif: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'fade-in': {
          from: { opacity: '0', transform: 'translateY(10px)' },
          to: { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        shimmer: 'shimmer 2s infinite linear',
        'fade-in': 'fade-in 0.4s ease-out',
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(135deg, #c8941e 0%, #e5b13a 50%, #c8941e 100%)',
        'navy-gradient': 'linear-gradient(135deg, #0d1117 0%, #1a2238 100%)',
        'hero-pattern': "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        'gold': '0 4px 24px rgba(200, 148, 30, 0.2)',
        'gold-lg': '0 8px 40px rgba(200, 148, 30, 0.3)',
        'premium': '0 20px 60px rgba(0,0,0,0.08), 0 4px 16px rgba(0,0,0,0.05)',
        'card': '0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

export default config;
