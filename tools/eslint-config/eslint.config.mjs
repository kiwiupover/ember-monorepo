import globals from 'globals';
import pluginJs from '@eslint/js';

export default [
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
