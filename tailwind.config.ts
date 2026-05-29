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
          50: '#FDFCFA',
          100: '#FAF8F5',
          200: '#F5F0E8',
          300: '#EDE8DF',
          400: '#E0D8CC',
        },
        linen: {
          100: '#EDE8DF',
          200: '#DDD5C8',
          300: '#C8B99A',
          400: '#B5A28A',
          500: '#9A8A76',
        },
        sage: {
          100: '#D4E4D4',
          200: '#AECBAE',
          300: '#8AAF8A',
          400: '#6B9467',
          500: '#527A52',
          600: '#3D5E3D',
          700: '#2A4229',
        },
        bark: {
          100: '#E8E2DC',
          200: '#C8BDB4',
          300: '#A89890',
          400: '#8A7B6B',
          500: '#6B5E50',
          600: '#4E433A',
        },
        warm: {
          50: '#FAFAF9',
          100: '#F4F1EE',
          200: '#E8E3DC',
          300: '#D4CCC2',
          400: '#B8AFA4',
          500: '#9A9089',
          600: '#7A726B',
          700: '#5C5651',
          800: '#3E3A36',
          900: '#2C2A27',
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
