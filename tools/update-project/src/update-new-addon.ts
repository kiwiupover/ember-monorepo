import path from 'node:path';
import url from 'node:url';

import { scopedCssVite, scopedCssEmberCli } from './scoped-css.ts';
import { copyConfigAddonFiles, copyConfigAddonTestFiles } from './copy-config-files.ts';
import { deleteFile } from './delete-file.ts';

import { packageJson, files } from 'ember-apply';

export interface AddonInfo {
  root: string;
  addonLocation: string;
  packageName: string;
  testAppLocation: string;
}

export async function updateNewAddon(info: AddonInfo): Promise<void> {
  const { addonLocation, packageName, testAppLocation } = info;

  // Update the addon

  // Update the package.json name to `@repo/${name}`
  const { name } = await packageJson.read(addonLocation);

  await packageJson.modify((packageJson) => {
    if (name.startsWith('@repo/')) {
      return;
    }

    packageJson.name = `@repo/${name}`;
  }, addonLocation);

  // update the package.json to include the new dependencies
  await packageJson.addDevDependencies(
    {
      '@repo/eslint-config': 'workspace:*',
      '@repo/prettier-config': 'workspace:*',
      '@repo/typescript-config': 'workspace:*',
      '@glimmer/tracking': '^1.1.2',
      '@glimmer/component': '^1.1.2',
      'eslint-plugin-ember': '^12.2.0',
      'ember-template-imports': '^4.1.1',
      'prettier-plugin-ember-template-tag': '^2.0.2',
    },
    addonLocation,
  );

  // Update addon with componet files that use `gts` files
  await files.applyFolder(path.join(__dirname, 'files/addon/components'), path.join(addonLocation, 'src/components'));

  // Add the new scripts to the addon to run build.
  await packageJson.addScripts(
    {
      dev: "concurrently 'pnpm:start:*'",
    },
    addonLocation,
  );

  /**
   * Copy the eslint and tsconfig to the addonLocation
   * This will overwrite the existing files
   */
  await copyConfigAddonFiles({ dirname: __dirname, location: addonLocation });

  await scopedCssVite(addonLocation);

  // Remove the existing prettier file from the addon
  await deleteFile(path.join(addonLocation, '.prettierrc.cjs'));

  // Update the test app
  await scopedCssEmberCli(testAppLocation);

  // Add repo scoped dependencies to the test app
  const { dependencies } = await packageJson.read(testAppLocation);

  await packageJson.modify((packageJson) => {
    packageJson.dependencies = {
      [`@repo/${packageName}`]: 'workspace:*',
      ...dependencies,
    };
  }, testAppLocation);

  // Update test app files that use `gts` files
  await files.applyFolder(
    path.join(__dirname, 'files/addon-test/templates'),
    path.join(testAppLocation, 'app/templates'),
  );

  // Remove the application.hbs file
  await deleteFile(path.join(testAppLocation, 'app/templates/application.hbs'));

  // Remove the `"name": "workspace: *"` from the package.json
  await packageJson.removeDevDependencies([packageName], testAppLocation);

  // Add the new dependencies to the test app
  await packageJson.addDevDependencies(
    {
      'eslint-plugin-ember': '^12.2.0',
      '@glimmer/component': '^1.1.2',
      '@glimmer/tracking': '^1.1.2',
      'ember-route-template': '^1.0.3',
      'ember-template-imports': '^4.1.1',
      'prettier-plugin-ember-template-tag': '^2.0.2',
    },
    testAppLocation,
  );

  await copyConfigAddonTestFiles({ dirname: __dirname, location: testAppLocation });
  await deleteFile(path.join(testAppLocation, '.eslintrc.js'));
  await deleteFile(path.join(testAppLocation, '.prettierrc.js'));

  // Add the new scripts to the test app to run the addon
  await packageJson.addScripts(
    {
      dev: 'ember serve',
    },
    testAppLocation,
  );
}

//@ts-ignore
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

updateNewAddon.path = __dirname;
