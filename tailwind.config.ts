const {
  default: flattenColorPalette,
} = require("tailwindcss/lib/util/flattenColorPalette");

module.exports = {
  purge: ['./client/**/*.{js,jsx,ts,tsx}', './client/**/*.html'],
  darkMode: 'class', // or 'media' or 'false'
  theme: {
    extend: {
      colors: {
        greenGR: '#62e6ce',
        blueGR: '#62afe6',
        lavenderGR: '#c4b0fc',
        blackGR: '#010102',
        greyGR: '#1E1C28'
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [addVariablesForColors],
}

// This plugin adds each Tailwind color as a global CSS variable, e.g. var(--gray-200).
function addVariablesForColors({ addBase, theme }: any) {
  let allColors = flattenColorPalette(theme("colors"));
  let newVars = Object.fromEntries(
    Object.entries(allColors).map(([key, val]) => [`--${key}`, val])
  );
 
  addBase({
    ":root": newVars,
  });
}