import js from '@eslint/js';

import { create as noProcess } from './custom-es-config.js';

export default [
  js.configs.recommended,
  // noProcess,
  {
    languageOptions: {
      globals: {
        browser: true,
        es2021: true,
        node: true,
      },
      parserOptions: {
        ecmaVersion: 2020,
        sourceType: 'module',
      },
    },
    rules: {
      // Indentation: use either 2 or 4 spaces (replace with your preference)
      'indent': ['error', 2],

      // Single quotes for strings
      'quotes': ['error', 'single'],

      // Semicolon at the end of each statement
      'semi': ['error', 'always'],

      // Disallow unused variables
      'no-unused-vars': 'off',

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

      // Disable errors about process, global, etc.
      'globals': '',

    },
  }
];
