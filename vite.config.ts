/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#0000AA',
        secondary: '#FF6600',
        'primary-dark': '#000088',
        'secondary-dark': '#E55A00',
      },
    },
  },
  plugins: [],
}