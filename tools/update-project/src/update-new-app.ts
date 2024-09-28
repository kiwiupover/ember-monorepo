import path from 'node:path';
import url from 'node:url';
import { promises as fs } from 'node:fs';

import { scopedCssEmberCli } from './scoped-css.ts';
import { copyFile } from './copy-config-files.ts';
import { deleteFile } from './delete-file.ts';
import { updateImportPackageName } from './update-imports-with-package-name.ts';

import { packageJson, files } from 'ember-apply';

export interface AppInfo {
  root: string;
  appLocation: string;
  appName: string;
}

export async function updateNewApp(info: AppInfo): Promise<void> {
  const { appLocation, appName } = info;

  // Update the new app

  /*
  TODO: How can I name the package.json name to `@repo/${name}`? but still
  keep the original name in the ember-cli-build.


  // Update the package.json name to `@repo/${name}`

  const { name } = await packageJson.read(appLocation);

  await packageJson.modify((packageJson) => {
    if (name.startsWith('@repo/')) {
      return;
    }

    packageJson.name = `@repo/${name}`;
  }, appLocation);
  */

  // update the package.json to include the new dependencies
  await packageJson.addDevDependencies(
    {
      '@repo/eslint-config': 'workspace:*',
      '@repo/prettier-config': 'workspace:*',
      '@repo/typescript-config': 'workspace:*',
      'ember-scoped-css': '0.21.4',
      'eslint-plugin-ember': '^12.2.0',
      'ember-route-template': '^1.0.3',
      'ember-template-imports': '^4.1.1',
      'prettier-plugin-ember-template-tag': '^2.0.2',
    },
    appLocation,
  );

  // Update app with files that use `gts` files and delete hbs files
  await files.applyFolder(path.join(__dirname, 'files/app/components'), path.join(appLocation, 'app/components'));
  await files.applyFolder(path.join(__dirname, 'files/app/templates'), path.join(appLocation, 'app/templates'));
  await deleteFile(path.join(appLocation, 'app/templates/application.hbs'));

  // Add the new scripts to the app to run build.
  await packageJson.addScripts(
    {
      dev: "concurrently 'pnpm:start'",
    },
    appLocation,
  );

  /**
   * Copy the eslint appLocation
   * This will overwrite the existing files
   */
  await copyFile({
    dirname: __dirname,
    location: appLocation,
    fileName: '.eslintrc.cjs',
    sourcefile: 'files/app/.eslintrc.cjs',
  });

  // Remove the existing eslint and prettier files from the test app
  await deleteFile(path.join(appLocation, '.eslintrc.js'));
  await deleteFile(path.join(appLocation, '.prettierrc.js'));

  await scopedCssEmberCli(appLocation);

  await updateImportPackageName(appLocation, appName);
}

// @ts-ignore
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

updateNewApp.path = __dirname;
