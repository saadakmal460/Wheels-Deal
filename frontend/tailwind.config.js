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
        'custom-blue': '#54b4d3',
        'blue-hover' : '#31a2c7',
        'snow' : '#FFF'

      },
    },
  },
  plugins: [],
}