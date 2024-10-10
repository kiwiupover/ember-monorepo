import * as isolation from './isolation.mjs';
import * as qunit from './qunit.mjs';

const QUNIT_BANNED_IMPORTS = ['ember-qunit', 'qunit', 'ember-exam'];

/** @returns {import('eslint').Linter.Config} */
export function browser(config = {}) {
  const base = qunit.ember(config);
  base.rules = Object.assign(
    base.rules,
    {
      'qunit/no-assert-equal': 'off',
    },
    isolation.rules({
      allowedImports: ['@ember/test-helpers', '@ember/test-waiters', ...(config.allowedImports ?? [])].filter(
        (v) => !QUNIT_BANNED_IMPORTS.includes(v),
      ),
    }),
    config.rules ?? {},
  );

  return base;
}
