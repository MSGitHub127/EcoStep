/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        charcoal: '#1A1A1A',
        'charcoal-soft': '#242320',
        offwhite: '#F9F6F0',
        sage: '#8F9E8B',
        terracotta: '#D3A297',
      },
      fontFamily: {
        display: ['Fraunces', 'serif'],
        body: ['Manrope', 'sans-serif'],
      },
      boxShadow: {
        soft: '0 1px 2px rgba(26,26,26,0.04), 0 10px 24px -8px rgba(26,26,26,0.10)',
      },
    },
  },
  plugins: [],
}
