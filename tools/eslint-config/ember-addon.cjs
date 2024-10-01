'use strict';

/* eslint-disable no-useless-escape */
const Ember = '@ember/';
const Glimmer = '@glimmer/';

const EmberData = '@ember-data/';
const WarpDrive = '@warp-drive/';

const ProjectPackages = '(@repo|@repo/ui)';

const sort = [
  // Side effect imports.
  [`^\u0000`],
  // Packages.
  // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
  // But not our packages, ember/glimmer/ember-data packages, or potential addons (things starting with ember- or @ember-)
  [`^(?!${Glimmer})(?!${EmberData})(?!${WarpDrive})(?!${ProjectPackages})`],
  // Ember & Glimmer Dependencies
  ['^ember$', `^${Ember}`],
  [`^${Glimmer}`],
  // EmberData Dependencies
  [`^${EmberData}`, `^${WarpDrive}`],
  // Potential Addons (Packages starting with ember-)
  [`^(@?ember-)`],

  // Project packages (engines / addons)
  [`^${ProjectPackages}`],

  // Absolute imports and other imports such as Vue-style `@/foo`.
  // Anything that does not start with a dot.
  ['^[^.]'],
  // Relative imports.
  // Anything that starts with a dot.
  [`^\.`],
];

const { sortGroups } = require('./sort-order.cjs');

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
  rules: {
    'simple-import-sort/imports': [
      'error',
      {
        groups: sort,
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.js', '**/*.ts'],
      env: { browser: true },
      parser: '@typescript-eslint/parser',
      parserOptions: {
        ecmaVersion: 'latest',
      },
      plugins: ['ember', 'import', 'simple-import-sort'],
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
      plugins: ['ember', 'import', 'simple-import-sort'],
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
      plugins: ['ember', 'import', 'simple-import-sort'],
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
