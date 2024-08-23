/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Define your custom colors here
        'custom-blue': '#1ca9c9',
        'blue-hover' : 'rgb(39 123 151)',
        'snow' : '#FFF'

      },
    },
  },
  plugins: [],
}