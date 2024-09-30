/** @type {import("eslint").Linter.Config} */
module.exports = {
  root: true,
  extends: ['@repo/eslint-config/ember-addon.cjs'],
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
  ],
};
