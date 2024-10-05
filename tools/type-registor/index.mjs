import { generateTypes } from './generate-type-registries/types.mjs';
import path from 'node:path';

const { cleanUp } = await import('@repo/update-project/src/index.ts');

if (import.meta.url === `file://${process.argv[1]}`) {
  const root = process.cwd();
  const envPath = path.join(root, 'config', 'environment.js');
  const { default: getEnv } = await import(envPath);

  const { modulePrefix } = getEnv();

  const sourceDirArg = process.argv.find((arg) => arg.startsWith('--sourceDir'));
  const sourceDirectroy = sourceDirArg ? 'src' : 'app';

  const projectArg = `--project=${root}`;
  const prefixArg = `--prefix=${modulePrefix}`;
  const sourceDir = `--sourceDir=${sourceDirectroy}`;

  const argv = process.argv;
  process.argv = [...argv, projectArg, prefixArg, sourceDir];

  await generateTypes();

  await cleanUp(root);
}
