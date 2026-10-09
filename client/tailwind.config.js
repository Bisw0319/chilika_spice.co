/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        spice: {
          crimson: '#7E191B',
          red: '#991B1E',
          deepRed: '#5C1012',
          lightRed: '#FEE2E2',
          turmeric: '#E68A00',
          yellow: '#F59E0B',
          lightYellow: '#FEF3C7',
          green: '#1E4D2B',
          forest: '#14381F',
          lightGreen: '#DCFCE7',
          cream: '#FBF8F2',
          sand: '#F4ECE1',
          tan: '#E7D8C5',
          brown: '#2C1810',
          charcoal: '#1A1412',
          gold: '#C99700',
          antiqueGold: '#D4AF37'
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'spice': '0 4px 20px -2px rgba(126, 25, 27, 0.12)',
        'spice-lg': '0 10px 30px -4px rgba(126, 25, 27, 0.18)',
        'warm': '0 8px 30px rgba(44, 24, 16, 0.08)',
        'bottom-nav': '0 -4px 20px rgba(0, 0, 0, 0.08)',
      },
      screens: {
        'xs': '375px',
      }
    },
  },
  plugins: [],
}
