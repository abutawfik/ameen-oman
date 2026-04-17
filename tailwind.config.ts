/**
 * Al-Ameen brand v1.0 Tailwind config
 * Palette: Oman sovereign — navy / red / gold / ivory
 * Source of truth mirrors al-ameen-brand/tokens/tokens.css
 * Keep this file in sync with that token sheet.
 */

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: ["class", "[data-theme=\"dark\"]"],
  theme: {
    extend: {
      colors: {
        // ── Brand core ──
        midnight: {
          50:  "#F0F2F7",
          100: "#B8BFD0",
          200: "#8B95B0",
          300: "#5A6787",
          400: "#3E4A6B",
          500: "#2A3654",
          600: "#1C2740",
          700: "#141D2E",
          800: "#0B1220",
          900: "#05080F",
        },
        oman: {
          50:  "#FDF0F2",
          100: "#FADDE0",
          200: "#F0A0A7",
          300: "#E06570",
          400: "#CC4049",
          500: "#B32830",
          600: "#9A1F24", // primary Oman royal red
          700: "#831B1F",
          800: "#6B1519",
          900: "#4A0F13",
        },
        gold: {
          50:  "#FBF6EA",
          100: "#F4E5C4",
          200: "#E8CF9A",
          300: "#DDB96B",
          400: "#D4A84B",
          500: "#C99C48",
          600: "#B58E3C", // frankincense gold — ceremonial accent
          700: "#96732C",
          800: "#7A5C22",
          900: "#5A4418",
        },
        ivory: {
          50:  "#FFFFFF",
          100: "#FAF6EC",
          200: "#F5EFE3", // desert ivory canvas
          300: "#EFE7D3",
          400: "#E7DEC7",
          500: "#DAD0B8",
          600: "#C4BCA8",
          700: "#A9A193",
          800: "#8A8374",
          900: "#4A453B",
        },

        // ── Semantic risk tiers (match tokens.css risk palette) ──
        risk: {
          clear:    "#0E7C66",
          low:      "#4F9A35",
          elevated: "#C98A1B",
          high:     "#D25A2A",
          critical: "#9A1F24",
        },

        // ── Stream category tokens (12 hues for intelligence streams) ──
        cat: {
          core:      "#2466A3",
          mobility:  "#D25A2A",
          financial: "#0E7C66",
          health:    "#B32830",
          utility:   "#C98A1B",
          education: "#6B4FAE",
          labor:     "#4F9A35",
          commerce:  "#1F7A8C",
          digital:   "#8A6C1B",
          customs:   "#9A1F24",
          maritime:  "#2C5F8F",
          postal:    "#A8547A",
        },
      },
      fontFamily: {
        display: ["Cormorant Garamond", "Canela", "Playfair Display", "Georgia", "serif"],
        sans:    ["Inter", "Geist", "ui-sans-serif", "system-ui", "sans-serif"],
        arabic:  ["Cairo", "Tajawal", "IBM Plex Sans Arabic", "Noto Sans Arabic", "sans-serif"],
        mono:    ["JetBrains Mono", "IBM Plex Mono", "ui-monospace", "monospace"],
      },
      fontSize: {
        "2xs": ["0.6875rem", { lineHeight: "1rem",    letterSpacing: "0.08em" }],
        xs:    ["0.75rem",   { lineHeight: "1rem",    letterSpacing: "0.04em" }],
        sm:    ["0.875rem",  { lineHeight: "1.35rem" }],
        base:  ["1rem",      { lineHeight: "1.6rem" }],
        lg:    ["1.125rem",  { lineHeight: "1.75rem" }],
        xl:    ["1.25rem",   { lineHeight: "1.85rem" }],
        "2xl": ["1.5rem",    { lineHeight: "2rem",    letterSpacing: "-0.01em" }],
        "3xl": ["1.875rem",  { lineHeight: "2.35rem", letterSpacing: "-0.015em" }],
        "4xl": ["2.25rem",   { lineHeight: "2.6rem",  letterSpacing: "-0.02em" }],
        "5xl": ["3rem",      { lineHeight: "3.3rem",  letterSpacing: "-0.02em" }],
        "6xl": ["3.75rem",   { lineHeight: "4rem",    letterSpacing: "-0.025em" }],
        "7xl": ["4.5rem",    { lineHeight: "4.75rem", letterSpacing: "-0.03em" }],
      },
      boxShadow: {
        xs:   "0 1px 2px rgba(5, 8, 15, 0.06)",
        sm:   "0 1px 3px rgba(5, 8, 15, 0.08), 0 1px 2px rgba(5, 8, 15, 0.06)",
        md:   "0 4px 8px rgba(5, 8, 15, 0.08), 0 2px 4px rgba(5, 8, 15, 0.06)",
        lg:   "0 12px 20px rgba(5, 8, 15, 0.10), 0 4px 8px rgba(5, 8, 15, 0.06)",
        xl:   "0 20px 40px rgba(5, 8, 15, 0.14), 0 8px 16px rgba(5, 8, 15, 0.08)",
        "2xl":"0 32px 64px rgba(5, 8, 15, 0.18)",
        gold: "0 0 0 1px rgba(181, 142, 60, 0.4), 0 4px 16px rgba(181, 142, 60, 0.2)",
        risk: "0 0 0 1px rgba(154, 31, 36, 0.4), 0 4px 16px rgba(154, 31, 36, 0.2)",
      },
      borderRadius: {
        xs: "2px", sm: "4px", md: "6px", lg: "8px", xl: "12px", "2xl": "16px",
      },
      transitionDuration: {
        instant: "80ms", fast: "150ms", med: "250ms", slow: "400ms",
      },
      transitionTimingFunction: {
        std:  "cubic-bezier(0.4, 0, 0.2, 1)",
        emph: "cubic-bezier(0.2, 0.8, 0.2, 1)",
      },
      backgroundImage: {
        "gold-gradient":     "linear-gradient(180deg, #D4A84B 0%, #B58E3C 100%)",
        "oman-gradient":     "linear-gradient(180deg, #B32830 0%, #9A1F24 100%)",
        "midnight-gradient": "linear-gradient(180deg, #141D2E 0%, #0B1220 100%)",
        "grid-line":         "linear-gradient(rgba(181,142,60,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(181,142,60,0.08) 1px, transparent 1px)",
      },
      backgroundSize: {
        grid: "40px 40px",
      },
    },
  },
  plugins: [],
};
