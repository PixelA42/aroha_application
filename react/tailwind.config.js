/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#251c1a',
        secondary: '#b19f84',
        background: '#f3eee5',
      },
    },
  },
  plugins: [],
} 