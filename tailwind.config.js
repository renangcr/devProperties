/** @type {import('tailwindcss').Config} */
const colors = require('tailwindcss/colors');

export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        color1: '#DEEFE7',
        color2: '#002333',
        color3: '#159A9C',
        color4: '#B4BEC9',
      }
    },
  },
  plugins: [],
}

