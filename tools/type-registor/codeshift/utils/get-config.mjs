import path from 'node:path';
import process from 'node:process';
import { URL } from 'node:url';

import { onceFn } from './memoize.mjs';

const ROOT = path.resolve(new URL('.', import.meta.url).pathname, '../../../..');

function _getConfig() {
  const projectArg = process.argv.find((arg) => arg.startsWith('--project='));
  const fileArg = process.argv.find((arg) => arg.startsWith('--file='));
  const prefixArg = process.argv.find((arg) => arg.startsWith('--prefix='));
  const sourceDirArg = process.argv.find((arg) => arg.startsWith('--sourceDir='));
  const debugArg = process.argv.find((arg) => arg.startsWith('--debug'));
  const dryRunArg = process.argv.find((arg) => arg.startsWith('--dry-run'));

  // substring(9) removes the '--project=' prefix
  return {
    prettierConfigPath: path.resolve(ROOT, '.prettierrc.js'),
    eslintConfigPath: path.resolve(ROOT, '.eslintrc.js'),
    modulePrefix: prefixArg.substring(9),
    project: projectArg.substring(10),
    sourceDir: sourceDirArg.substring(12),
    file: fileArg ? fileArg.substring(7) : null,
    dryRun: dryRunArg ? true : false,
    DEBUG: debugArg ? true : false,
  };
}

export const getConfig = onceFn(_getConfig);
