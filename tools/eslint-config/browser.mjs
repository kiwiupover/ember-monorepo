// @ts-check
import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import * as imports from './imports.mjs';
import * as isolation from './isolation.mjs';
import * as ts from './typescript.mjs';

export function rules(config = {}) {
  const ourRules = {
    'eqeqeq': 'error',
    'new-cap': ['error', { capIsNew: false }],
    'no-caller': 'error',
    'no-cond-assign': ['error', 'except-parens'],
    'no-console': 'error', // no longer recommended in eslint v6, this restores it
    'no-eq-null': 'error',
    'no-eval': 'error',
    'no-unused-vars': ['error', { args: 'none' }],

    // Too many false positives
    // See https://github.com/eslint/eslint/issues/11899 and similar
    'require-atomic-updates': 'off',

    'prefer-rest-params': 'off',
    'prefer-const': 'error',
  };

  return Object.assign(
    {},
    js.configs.recommended.rules,
    prettier.rules,
    imports.rules(),
    isolation.rules(config),
    ourRules,
  );
}

/**
 * @param {object} config
 * @param {string[]} [config.files]
 * @returns {import('eslint').Linter.Config}
 */
export function browser(config = {}) {
  config.files = Array.isArray(config.files) ? config.files : ['**/*.{js,gjs}'];
  const base = ts.browser(config);
  // @ts-expect-error
  base.languageOptions.parserOptions.project = null;
  base.rules = rules(config);
  base.plugins = imports.plugins();

  return base;
}
