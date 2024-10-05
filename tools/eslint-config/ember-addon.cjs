'use strict';

const { sortGroups } = require('./sort-order.cjs');

const rules = {
  'simple-import-sort/imports': [
    'error',
    {
      groups: sortGroups,
    },
  ],
};

module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 'latest',
  },
  plugins: ['ember', '@typescript-eslint', 'simple-import-sort'],
  extends: ['eslint:recommended', 'plugin:ember/recommended', 'plugin:prettier/recommended'],
  env: {
    browser: true,
  },
  rules,
  overrides: [
    {
      files: ['**/*.js', '**/*.ts'],
      env: { browser: true },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
      },
      plugins: ['ember', 'import'],
      extends: ['eslint:recommended', 'plugin:ember/recommended', 'plugin:prettier/recommended'],
      rules: {
        // require relative imports use full extensions
        'import/extensions': ['error', 'always', { ignorePackages: true }],
        // Add any custom rules here
      },
    },
    // ts files
    {
      files: ['**/*.ts'],
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:prettier/recommended',
      ],
      rules: {
        // require relative imports use full extensions
        'import/extensions': ['error', 'always', { ignorePackages: true }],
        // Add any custom rules here
      },
    },
    {
      files: ['**/*.gts'],
      parser: 'ember-eslint-parser',
      plugins: ['ember', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/eslint-recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:ember/recommended',
        'plugin:ember/recommended-gts',
        'plugin:prettier/recommended',
      ],
      rules: {
        // require relative imports use full extensions
        'import/extensions': ['error', 'always', { ignorePackages: true }],
        // Add any custom rules here
      },
    },
    {
      files: ['**/*.gjs'],
      parser: 'ember-eslint-parser',
      plugins: ['ember', 'import'],
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended',
        'plugin:ember/recommended-gjs',
        'plugin:prettier/recommended',
      ],
      rules: {
        // require relative imports use full extensions
        'import/extensions': ['error', 'always', { ignorePackages: true }],
        // Add any custom rules here
      },
    },
    // node files
    {
      files: ['./.eslintrc.cjs', './.prettierrc.cjs', './.template-lintrc.cjs', './addon-main.cjs'],
      parserOptions: {
        sourceType: 'script',
      },
      env: {
        browser: false,
        node: true,
      },
      plugins: ['n'],
      extends: ['eslint:recommended', 'plugin:n/recommended', 'plugin:prettier/recommended'],
    },
  ],
};
