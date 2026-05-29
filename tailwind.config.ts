import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        cream: {
          50: '#FDFAF4',
          100: '#F8F1E2',   // main background — varm honung
          200: '#EEE0C4',   // paneler
          300: '#E0C9A0',   // kanter
          400: '#CCAE7C',   // mörkare kanter
        },
        linen: {
          100: '#EAD9BE',
          200: '#D4BC94',
          300: '#BA9E6C',
          400: '#9E8450',
          500: '#826A38',
        },
        sage: {             // → skogsgrön
          100: '#C4D4BC',
          200: '#99B890',
          300: '#6E9C66',
          400: '#4C8050',
          500: '#35643A',   // primär skogsgrön
          600: '#274C2B',
          700: '#1A3420',
        },
        bark: {             // → kastanjebrun
          100: '#EEDCCA',
          200: '#D4B08A',
          300: '#B8844E',
          400: '#9A6030',
          500: '#7C4418',
          600: '#5A2E08',
        },
        warm: {             // → bruntonade neutraler
          50:  '#FAF7F2',
          100: '#F2EAE0',
          200: '#E4D4C0',
          300: '#CEBA9C',
          400: '#AA9070',
          500: '#886C52',
          600: '#664E38',
          700: '#4A3424',
          800: '#321E10',
          900: '#1E1008',
        },
        mustard: {          // → senap
          100: '#FDF2BC',
          200: '#F8DC78',
          300: '#EAC030',
          400: '#C89C00',
          500: '#A07800',
          600: '#785800',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      borderRadius: {
        'xl': '0.75rem',
        '2xl': '1rem',
      },
    },
  },
  plugins: [],
}

export default config
