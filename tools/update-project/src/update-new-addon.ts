import path from 'node:path';
import url from 'node:url';

import { scopedCssVite, scopedCssEmberCli } from './scoped-css.ts';
import { copyFile } from './copy-config-files.ts';
import { deleteFile } from './delete-file.ts';
import { updateImportPackageName } from './update-imports-with-package-name.ts';

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
   * Copy the eslint to the addonLocation
   * This will overwrite the existing files
   */
  await copyFile({
    dirname: __dirname,
    location: addonLocation,
    fileName: '.eslintrc.cjs',
    sourcefile: 'files/addon/.eslintrc.cjs',
  });

  await copyFile({
    dirname: __dirname,
    location: addonLocation,
    fileName: '.gitignore',
    sourcefile: 'files/addon/.gitignore',
  });

  await scopedCssVite(addonLocation);

  // Remove the existing prettier file from the addon
  await deleteFile(path.join(addonLocation, '.prettierrc.cjs'));

  await updateImportPackageName(addonLocation, packageName);

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

  // Copy the new eslint files to the test app
  await copyFile({
    dirname: __dirname,
    location: testAppLocation,
    fileName: '.eslintrc.cjs',
    sourcefile: 'files/addon-test/.eslintrc.cjs',
  });

  // Remove the existing eslint and prettier files from the test app
  await deleteFile(path.join(testAppLocation, '.eslintrc.js'));
  await deleteFile(path.join(testAppLocation, '.prettierrc.js'));

  // Update imports with the new package name
  await updateImportPackageName(path.join(testAppLocation, 'app'), packageName);

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
