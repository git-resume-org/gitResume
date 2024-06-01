module.exports = {
  purge: ['./client/**/*.{js,jsx,ts,tsx}', './client/**/*.html'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      colors: {
        greenGR: '#62e6ce',
        blueGR: '#62aee6',
        lavenderGR: '#c4b0fc',
        blackGR: '#010102',
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
