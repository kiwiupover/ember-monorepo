import globals from 'globals';
import pluginJs from '@eslint/js';

/** @type {import('eslint').Linter.Config} */
const config = [
  {
    files: ['**/*.cjs'],
    ignores: ['node_modules'],
    languageOptions: {
      sourceType: 'commonjs',
    },
  },
  {
    languageOptions: {
      globals: globals.browser,
    },
  },
  pluginJs.configs.recommended,
];

export default config;
