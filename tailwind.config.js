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
      fontFamily: {
       'sans': ['Montserrat', 'sans-serif'],
       'serif': ['Space Grotesk', 'sans-serif']
      },
      fontSize: {
        sm: ['12px', '20px'],
        base: ['16px', '24px'],
        lg: ['20px', '28px'],
        xl: ['24px', '32px'],
      }
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
