/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme')

export default {
  content: ['./src/**/*.{js,jsx,jsx,ts,tsx,css}'],
  darkMode: 'media',
  theme: {
    extend: {
      colors: {
        orange: '#EF7A00',
        red: '#CB3D00',
        black: '#0D0D0D',
        white: '#FFFFFF'
      },
      fontFamily: {
        poppins: ['Poppins'],
        sans: ['Poppins', ...defaultTheme.fontFamily.sans]
      }
    }
  },
  variants: {
    extend: {}
  },
  plugins: []
}
