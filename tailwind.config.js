export default {
  // https://tailwindcss.com/docs/upgrade-guide#configure-content-sources
  content: ['./client/**/*.{html,js,jsx,ts,tsx}'],
  // https://tailwindcss.com/docs/upgrade-guide#remove-dark-mode-configuration
  // darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  // https://tailwindcss.com/docs/upgrade-guide#remove-variant-configuration
  // variants: {
  //   extend: {},
  // },
  plugins: [],
};
