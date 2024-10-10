import { globalIgnores } from '@repo/eslint-config/ignore.mjs';
import * as node from '@repo/eslint-config/node.mjs';
import * as typescript from '@repo/eslint-config/typescript.mjs';
import * as gts from '@repo/eslint-config/gts.mjs';
import * as qunit from '@repo/eslint-config/qunit.mjs';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // all ===
  globalIgnores(),

  // browser (js/ts) ===
  typescript.browser({
    srcDirs: ['app'],
    allowedImports: [],
  }),

  // gts
  gts.browser({
    srcDirs: ['app'],
    allowedImports: [],
  }),

  // node (module) ===
  node.esm(),

  // node (script) ===
  node.cjs(),

  // Test Support ===
  qunit.ember({
    files: ['tests/**/*.{js,ts}'],
    allowedImports: [],
  }),
];
