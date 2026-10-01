/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#F5F5F7',
        surface: '#D2D2D7',
        'text-primary': '#1D1D1F',
        'text-secondary': '#6E6E73',
        'accent-blue': '#0066CC',
        'accent-orange-dark': '#B64400',
        'accent-orange': '#FF791B',
      },
    },
  },
  plugins: [],
};
