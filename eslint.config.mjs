// @ts-check
import { globalIgnores } from '@repo/eslint-config/ignore.mjs';
import * as node from '@repo/eslint-config/node.mjs';
import * as typescript from '@repo/eslint-config/typescript.mjs';
import * as gts from '@repo/eslint-config/gts.mjs';

/** @type {import('eslint').Linter.Config[]} */
export default [
  // all ===
  globalIgnores(),

  // browser (js/ts) ===
  typescript.browser({}),

  // gts
  gts.browser({
    srcDirs: ['app'],
    allowedImports: [],
  }),

  // node (module) ===
  node.esm(),

  // node (script) ===
  node.cjs(),
];
