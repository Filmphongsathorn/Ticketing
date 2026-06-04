/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        stage: {
          black:  '#0a0a0b',
          dark:   '#111114',
          card:   '#18181d',
          border: '#2a2a32',
          amber:  '#f5a623',
          gold:   '#e8c96a',
          dim:    '#7a6a3a',
          muted:  '#6b6b7a',
          light:  '#d4d4dc',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        body:    ['"DM Sans"', 'sans-serif'],
        mono:    ['"JetBrains Mono"', 'monospace'],
      },
      backgroundImage: {
        'spotlight': 'radial-gradient(ellipse 60% 40% at 50% 0%, rgba(245,166,35,0.12) 0%, transparent 70%)',
        'card-glow': 'radial-gradient(ellipse 80% 60% at 50% -20%, rgba(245,166,35,0.08) 0%, transparent 60%)',
      },
      boxShadow: {
        'amber-sm': '0 0 12px rgba(245,166,35,0.15)',
        'amber-md': '0 0 30px rgba(245,166,35,0.20), 0 0 60px rgba(245,166,35,0.08)',
        'amber-lg': '0 0 50px rgba(245,166,35,0.25), 0 0 100px rgba(245,166,35,0.10)',
        'card':     '0 4px 24px rgba(0,0,0,0.6), 0 1px 0 rgba(255,255,255,0.04) inset',
      },
      keyframes: {
        shimmer: {
          '0%':   { backgroundPosition: '-200% center' },
          '100%': { backgroundPosition:  '200% center' },
        },
        fadeUp: {
          '0%':   { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulse_amber: {
          '0%, 100%': { boxShadow: '0 0 12px rgba(245,166,35,0.2)' },
          '50%':       { boxShadow: '0 0 28px rgba(245,166,35,0.45)' },
        },
        spin_slow: {
          to: { transform: 'rotate(360deg)' },
        },
      },
      animation: {
        shimmer:      'shimmer 2.5s linear infinite',
        fadeUp:       'fadeUp 0.5s ease forwards',
        pulse_amber:  'pulse_amber 2s ease-in-out infinite',
        spin_slow:    'spin_slow 1s linear infinite',
      },
    },
  },
  plugins: [],
};
