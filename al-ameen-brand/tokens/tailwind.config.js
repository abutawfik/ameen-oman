/**
 * AL-AMEEN · Tailwind Config · v1.1 · Majlis Azure
 * -------------------------------------------------------------
 * Drop into your project root. Replace or merge with the
 * existing tailwind.config.{js,ts,mjs}.
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{js,jsx,ts,tsx,html}',
    './app/**/*.{js,jsx,ts,tsx,html}',
    './pages/**/*.{js,jsx,ts,tsx,html}',
    './components/**/*.{js,jsx,ts,tsx,html}',
  ],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        ocean: {
          50:  '#E8EEF5',
          100: '#B0C5DB',
          200: '#7A9CBF',
          300: '#4A7AA8',
          400: '#2C5F8F',
          500: '#1A4578',
          600: '#10325A',
          700: '#0A2540', // primary action
          800: '#051428',
          900: '#020A14',
        },
        rose: {
          50:  '#FAEEF0',
          100: '#F5D8DE',
          200: '#E8A3B0',
          300: '#D66878',
          400: '#C94A5E', // alert · high
          500: '#A52844',
          600: '#8A1F3C', // critical · customs
          700: '#701832',
          800: '#5A1428',
          900: '#3A0D1E',
        },
        brass: {
          50:  '#FBF6EA',
          100: '#F4E5C4',
          200: '#E8CF9A',
          300: '#DDB96B',
          400: '#D6B47E',
          500: '#C99C48',
          600: '#B88A3C', // ceremonial
          700: '#96732C',
          800: '#7A5C22',
          900: '#5A4418',
        },
        alabaster: {
          50:  '#FFFFFF',
          100: '#FBF8F0',
          200: '#F8F5F0', // canvas
          300: '#EFE8D7',
          400: '#EAE2CF',
          500: '#E0D8C5',
          600: '#C4BCA8',
          700: '#A9A193',
          800: '#8A8374',
          900: '#4A453B',
        },
        risk: {
          clear:    '#14786A',
          low:      '#4A8E3A',
          elevated: '#C98A1B',
          high:     '#C94A5E',
          critical: '#8A1F3C',
        },
        cat: {
          core:      '#2C5F8F',
          mobility:  '#C94A5E',
          financial: '#14786A',
          health:    '#8A1F3C',
          utility:   '#C98A1B',
          education: '#6B4FAE',
          labor:     '#4A8E3A',
          commerce:  '#1F7A8C',
          digital:   '#8A6C1B',
          customs:   '#701832',
          maritime:  '#0A2540',
          postal:    '#A8547A',
        },
      },
      fontFamily: {
        display: ['Cormorant Garamond', 'Playfair Display', 'Georgia', 'serif'],
        sans:    ['Inter', 'Geist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        arabic:  ['Cairo', 'Tajawal', 'IBM Plex Sans Arabic', 'Noto Sans Arabic', 'sans-serif'],
        mono:    ['JetBrains Mono', 'IBM Plex Mono', 'ui-monospace', 'monospace'],
      },
      fontSize: {
        '2xs': ['0.6875rem', { lineHeight: '1rem',     letterSpacing: '0.08em' }],
        xs:    ['0.75rem',   { lineHeight: '1rem',     letterSpacing: '0.04em' }],
        sm:    ['0.875rem',  { lineHeight: '1.35rem' }],
        base:  ['1rem',      { lineHeight: '1.6rem' }],
        lg:    ['1.125rem',  { lineHeight: '1.75rem' }],
        xl:    ['1.25rem',   { lineHeight: '1.85rem' }],
        '2xl': ['1.5rem',    { lineHeight: '2rem',    letterSpacing: '-0.01em' }],
        '3xl': ['1.875rem',  { lineHeight: '2.35rem', letterSpacing: '-0.015em' }],
        '4xl': ['2.25rem',   { lineHeight: '2.6rem',  letterSpacing: '-0.02em' }],
        '5xl': ['3rem',      { lineHeight: '3.3rem',  letterSpacing: '-0.02em' }],
        '6xl': ['3.75rem',   { lineHeight: '4rem',    letterSpacing: '-0.025em' }],
        '7xl': ['4.5rem',    { lineHeight: '4.75rem', letterSpacing: '-0.03em' }],
      },
      boxShadow: {
        xs:   '0 1px 2px rgba(2, 10, 20, 0.06)',
        sm:   '0 1px 3px rgba(2, 10, 20, 0.08), 0 1px 2px rgba(2, 10, 20, 0.06)',
        md:   '0 4px 8px rgba(2, 10, 20, 0.08), 0 2px 4px rgba(2, 10, 20, 0.06)',
        lg:   '0 12px 20px rgba(2, 10, 20, 0.10), 0 4px 8px rgba(2, 10, 20, 0.06)',
        xl:   '0 20px 40px rgba(2, 10, 20, 0.14), 0 8px 16px rgba(2, 10, 20, 0.08)',
        '2xl':'0 32px 64px rgba(2, 10, 20, 0.18)',
        brass: '0 0 0 1px rgba(184, 138, 60, 0.4), 0 4px 16px rgba(184, 138, 60, 0.2)',
        alert: '0 0 0 1px rgba(201, 74, 94, 0.4), 0 4px 16px rgba(201, 74, 94, 0.2)',
        ocean: '0 0 0 1px rgba(10, 37, 64, 0.3), 0 8px 24px rgba(10, 37, 64, 0.18)',
      },
      borderRadius: {
        xs: '2px', sm: '4px', md: '6px', lg: '8px', xl: '12px', '2xl': '16px',
      },
      transitionDuration: {
        instant: '80ms',  fast: '150ms', med: '250ms', slow: '400ms',
      },
      transitionTimingFunction: {
        std:  'cubic-bezier(0.4, 0, 0.2, 1)',
        emph: 'cubic-bezier(0.2, 0.8, 0.2, 1)',
      },
      backgroundImage: {
        'brass-gradient': 'linear-gradient(180deg, #D6B47E 0%, #B88A3C 100%)',
        'rose-gradient':  'linear-gradient(180deg, #C94A5E 0%, #8A1F3C 100%)',
        'ocean-gradient': 'linear-gradient(180deg, #0A2540 0%, #051428 100%)',
        'grid-line':      'linear-gradient(rgba(184,138,60,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(184,138,60,0.08) 1px, transparent 1px)',
      },
      backgroundSize: {
        grid: '40px 40px',
      },
    },
  },
  plugins: [],
};
