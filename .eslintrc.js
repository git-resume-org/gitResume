module.exports = {
  env: {
      browser: true,
      es2022: true,
      node: true,
  },
  extends: 'eslint:recommended',
  parserOptions: {
      ecmaVersion: 12,
      sourceType: 'module',
  },
  rules: {
      // Indentation: use either 2 or 4 spaces (replace with your preference)
      'indent': ['error', 4],

      // Single quotes for strings
      'quotes': ['error', 'single'],

      // Semicolon at the end of each statement
      'semi': ['error', 'always'],

      // Disallow unused variables
      'no-unused-vars': 'error',

      // Disallow variable declarations without var, let, or const
      'no-undef': 'error',

      // Space before and after curly braces
      'block-spacing': 'error',

      // Disallow extra spaces
      'no-multi-spaces': 'error',

      // Disallow multiple empty lines
      'no-multiple-empty-lines': 'error',

      // Prefer arrow functions over function when possible
      'prefer-arrow-callback': 'error',

      // Disallow unnecessary use of semicolons
      'no-extra-semi': 'error',

      // Disallow the use of 'var'
      'no-var': 'error',
  },
};
