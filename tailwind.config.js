/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./src/**/*.{js,jsx,ts,tsx}", // Ensure this covers App.js
      "./public/index.html",
    ],
    theme: {
      extend: {
        colors: {
          eth: {
            blue: '#3C3C3D',
            light: '#62A9FF',
            dark: '#343434',
            accent: '#00A3FF',
          },
        },
        boxShadow: {
          glow: '0 0 15px rgba(98, 169, 255, 0.5)',
        },
        animation: {
          pulse: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        },
      },
    },
    plugins: [],
  };