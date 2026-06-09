/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,jsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {

      colors: {
        brand: {
          50:  '#fdf8f0',
          100: '#f7ead6',
          200: '#edd4ad',
          300: '#deb87a',
          400: '#e4b370',
          500: '#dc9e4a', // TDC Primary Gold
          600: '#ba771c', // TDC Hover Gold
          700: '#b07d3a', // TDC Dark Gold
          800: '#7d5115',
          900: '#55341a',
          950: '#1a1814', // TDC Charcoal
        },
        tdc: {
          green: '#11201d', // Primary Button Green
          'green-light': '#065f4e', // Button Hover/Icon Green
          cream: '#f5eddc', // Section background
          cream2: '#f3f0ea',
          dark: '#1a1814',  // Footer/Hero Dark background
          offwhite: '#fafaf9',
        },
        crimson: {
          50:  '#fff1f2',
          100: '#ffe4e6',
          500: '#f43f5e',
          600: '#e11d48',
          700: '#be123c',
          800: '#9f1239',
          900: '#881337',
        },
        jade: {
          50:  '#f0fdf4',
          500: '#22c55e',
          700: '#15803d',
        },
        ivory: {
          50:  '#fdfcf8',
          100: '#f9f6ee',
          200: '#f2ecd9',
          300: '#e8dfc0',
        },
      },

      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"Inter Tight"', 'Inter', 'system-ui', 'sans-serif'],
      },

      boxShadow: {
        'card':        '0 8px 24px rgba(26,24,20,0.1)', // #1a18141a
        'card-hover':  '0 28px 72px rgba(26,24,20,0.2)', // #1a181433
        'modal':       '0 24px 48px rgba(0,0,0,0.18), 0 8px 16px rgba(0,0,0,0.10)',
        'input-focus': '0 0 0 2px #dc9e4a', // TDC Gold focus ring
      },

      animation: {
        'fade-up':  'fadeUp 0.35s ease forwards',
        'fade-in':  'fadeIn 0.25s ease forwards',
        'slide-in': 'slideIn 0.3s cubic-bezier(0.16,1,0.3,1) forwards',
        'scale-in': 'scaleIn 0.2s ease forwards',
        'spin-slow':'spin 1.2s linear infinite',
      },

      keyframes: {
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideIn: {
          '0%':   { opacity: '0', transform: 'translateX(16px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        scaleIn: {
          '0%':   { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
      },

    },
  },
  plugins: [],
}