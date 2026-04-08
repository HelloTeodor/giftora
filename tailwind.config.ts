import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  safelist: ["ml-[-100px]", "left-[-150px]", "w-[750px]"],
  theme: {
    extend: {
      colors: {
        // Peacock — primary brand (#084463)
        navy: {
          50: "#EEF5FA",
          100: "#D5E8F3",
          200: "#A9D0E6",
          300: "#72B4D8",
          400: "#3D97C9",
          500: "#1E7DB4",
          600: "#0F6396",
          700: "#0C4F79",
          800: "#093D5E",
          900: "#063047",
          950: "#084463",
        },
        // Saffron — CTA accent (#FFC64F)
        gold: {
          50: "#FFFCF0",
          100: "#FFF5CC",
          200: "#FFE899",
          300: "#FFD966",
          400: "#FFD04D",
          500: "#FFC64F",
          600: "#E6AE35",
          700: "#CC9820",
          800: "#B3830D",
          900: "#996E00",
          950: "#7A5800",
        },
        // Icy Sky — secondary accent (#6BB9D4)
        icy: {
          50: "#F0F9FC",
          100: "#D5EEF5",
          200: "#AADCEC",
          300: "#6BB9D4",
          400: "#4AAAC9",
          500: "#2D97BE",
          600: "#1F7FA3",
          700: "#166684",
          800: "#0F4E64",
          900: "#093A4A",
        },
        // Warm neutral — backgrounds
        cream: {
          50: "#FAFAF7",
          100: "#F5F2EE",
          200: "#EDE8E1",
          300: "#DDD8CF",
          400: "#C4BDB2",
          500: "#A89F95",
          600: "#8A8079",
          700: "#6B6059",
          800: "#504840",
          900: "#3A332C",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
      },
      fontFamily: {
        serif: ["Cormorant Garamond", "Playfair Display", "Georgia", "serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        playfair: ["Playfair", "serif"],
      },
      borderRadius: {
        sm: "2px",
        DEFAULT: "4px",
        md: "4px",
        lg: "6px",
        xl: "8px",
        "2xl": "10px",
        "3xl": "12px",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "fade-in": {
          from: { opacity: "0", transform: "translateY(10px)" },
          to: { opacity: "1", transform: "translateY(0)" },
        },
        marquee: {
          from: { transform: "translateX(0)" },
          to: { transform: "translateX(-50%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite linear",
        "fade-in": "fade-in 0.4s ease-out",
        marquee: "marquee 30s linear infinite",
      },
      backgroundImage: {
        "gold-gradient": "linear-gradient(135deg, #FFC64F 0%, #FFD04D 100%)",
        "navy-gradient": "linear-gradient(135deg, #084463 0%, #0C4F79 100%)",
        "hero-pattern":
          "url(\"data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23084463' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        gold: "0 4px 24px rgba(255, 198, 79, 0.35)",
        "gold-lg": "0 8px 40px rgba(255, 198, 79, 0.45)",
        premium:
          "0 20px 60px rgba(8,68,99,0.08), 0 4px 16px rgba(8,68,99,0.05)",
        card: "0 2px 16px rgba(0,0,0,0.06), 0 1px 4px rgba(0,0,0,0.04)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
