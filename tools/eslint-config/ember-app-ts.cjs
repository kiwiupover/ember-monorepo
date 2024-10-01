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

console.log('sortOrder', sort);
console.log('sortOrder SortGroup', sortGroups);

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
        groups: sortGroups,
      },
    ],
  },
  overrides: [
    {
      files: ['**/*.{js,ts}'],
      plugins: ['ember'],
      parser: '@typescript-eslint/parser',
      extends: [
        'eslint:recommended',
        'plugin:ember/recommended', // or other configuration
      ],
      rules: {
        // override / enable optional rules
        'ember/no-replace-test-comments': 'error',
      },
    },
    {
      files: ['**/*.gts'],
      parser: 'ember-eslint-parser',
      plugins: ['ember'],
      extends: [
        'eslint:recommended',
        'plugin:@typescript-eslint/recommended',
        'plugin:ember/recommended',
        'plugin:ember/recommended-gts',
      ],
    },
    {
      files: ['**/*.gjs'],
      parser: 'ember-eslint-parser',
      plugins: ['ember'],
      extends: ['eslint:recommended', 'plugin:ember/recommended', 'plugin:ember/recommended-gjs'],
    },
    {
      files: ['tests/**/*.{js,ts,gjs,gts}'],
      rules: {
        // override / enable optional rules
        'ember/no-replace-test-comments': 'error',
      },
    },
    // ts files
    {
      files: ['**/*.ts'],
      extends: ['plugin:@typescript-eslint/eslint-recommended', 'plugin:@typescript-eslint/recommended'],
      rules: {},
    },
    // node files
    {
      files: [
        './.eslintrc.cjs',
        './.stylelintrc.js',
        './.template-lintrc.js',
        './ember-cli-build.js',
        './testem.js',
        './blueprints/*/index.js',
        './config/**/*.js',
        './lib/*/index.js',
        './server/**/*.js',
      ],
      env: {
        browser: false,
        node: true,
      },
      extends: ['plugin:n/recommended'],
    },
    {
      // test files
      files: ['tests/**/*-test.{js,ts}'],
      extends: ['plugin:qunit/recommended'],
    },
  ],
};
