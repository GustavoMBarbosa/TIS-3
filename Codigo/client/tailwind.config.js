/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/*.{vue,ts}', './src/**/*.{vue,ts}'],
  theme: {
    extend: {},
    screens: {
      'xs': '352px',
      'sm': '640px',
      'md': '769px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
    }
  },
  plugins: [],
}

