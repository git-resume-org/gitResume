/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
      './dist/*.{html,js}',
      './client/*.{html,js}'
  ],
  theme: {
      extend: {},
  },
  plugins: [],
};
