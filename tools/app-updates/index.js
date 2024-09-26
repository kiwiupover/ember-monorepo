import path from 'node:path';
import url from 'node:url';
import { promises as fs } from 'node:fs';

import { cleanUpLint } from './clean-up-lints.js';
import { scopedCss } from './scoped-css.js';
import { copyConfigFiles } from './copy-config-files.js';

import { packageJson, files } from 'ember-apply';

/**
 * @param {string} file
 */
async function deleteFile(file) {
  try {
    await fs.unlink(file);
    console.log('File deleted successfully');
  } catch (err) {
    console.error('Error deleting the file:', err);
  }
}

/**
 * @param {{ appLocation: string; appName: string, root?: string; }} info
 */
export async function updateApp(info) {
  const { root, appLocation, appName } = info;

  // Update the app

  // Update the package.json name to `@repo/${name}`
  const { name } = await packageJson.read(appLocation);

  debugger;

  await packageJson.modify((packageJson) => {
    if (name.startsWith('@repo/')) {
      return;
    }

    packageJson.name = `@repo/${name}`;
  }, appLocation);

  // update the package.json to include the new dependencies
  await packageJson.addDevDependencies(
    {
      '@repo/eslint-config': 'workspace:*',
      '@repo/prettier-config': 'workspace:*',
      '@repo/typescript-config': 'workspace:*',
      'ember-scoped-css': '0.21.4',
      'ember-route-template': '^1.0.3',
      'ember-template-imports': '^4.1.1',
      'prettier-plugin-ember-template-tag': '^2.0.2',
    },
    appLocation,
  );

  // Update app with componet files that use `gts` files
  await files.applyFolder(path.join(__dirname, 'files/app/components'), path.join(appLocation, 'app/components'));

  // Add the new scripts to the app to run build.
  await packageJson.addScripts(
    {
      dev: "concurrently 'pnpm:start:*'",
    },
    appLocation,
  );

  /**
   * Copy the eslint and tsconfig to the appLocation
   * This will overwrite the existing files
   */
  await copyConfigFiles({ dirname: __dirname, location: appLocation });

  // await scopedCss(appLocation);

  // Update test app files that use `gts` files
  await files.applyFolder(path.join(__dirname, 'files/templates'), path.join(appLocation, 'app/templates'));

  // Remove the application.hbs file
  await deleteFile(path.join(appLocation, 'app/templates/application.hbs'));
}

/**
 * @param {string} location
 */
export async function cleanUp(location) {
  await cleanUpLint(location);
}

// @ts-ignore
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

updateApp.path = __dirname;
