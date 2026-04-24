/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: '#0b0b0b',
          panel: '#111111',
          panelAlt: '#161616',
          accent: '#FFDE21',
          text: '#FFFFFF',
          muted: '#BFBFBF',
          border: '#262626',
        },
      },
      fontFamily: {
        sans: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        display: ['Cormorant Garamond', 'serif'],
      },
      boxShadow: {
        glow: '0 18px 45px rgba(0, 0, 0, 0.35)',
        accent: '0 0 0 1px rgba(255, 222, 33, 0.25), 0 18px 45px rgba(0, 0, 0, 0.4)',
      },
      backgroundImage: {
        'hero-fade':
          'linear-gradient(180deg, rgba(11,11,11,0.2) 0%, rgba(11,11,11,0.85) 72%, rgba(11,11,11,1) 100%)',
        'panel-glow':
          'radial-gradient(circle at top, rgba(255,222,33,0.16), transparent 35%)',
      },
    },
  },
  plugins: [],
};
