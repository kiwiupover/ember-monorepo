import path from 'node:path';
import url from 'node:url';

import { scopedCssEmberCli } from './scoped-css.ts';
import { copyFile } from './copy-config-files.ts';
import { deleteFile } from './delete-file.ts';
import { updateImportPackageName } from './update-imports-with-package-name.ts';

import { packageJson, files } from 'ember-apply';
import { emberCliLibraryWatch } from './library-watcher.ts';
import { addGlintToTsconfig } from './add-glint-to-tsconfig.ts';

export interface AppInfo {
  root: string;
  appLocation: string;
  appName: string;
}

export async function updateNewApp(info: AppInfo): Promise<void> {
  const { appLocation, appName } = info;

  // update the package.json to include the new dependencies
  await packageJson.addDevDependencies(
    {
      '@repo/eslint-config': 'workspace:*',
      '@repo/linting-config': 'workspace:*',
      '@repo/typescript-config': 'workspace:*',
      '@babel/plugin-proposal-decorators': '7.24.7',
      '@babel/plugin-transform-class-properties': '7.25.4',
      '@babel/plugin-transform-private-methods': '7.25.4',
      '@babel/plugin-transform-typescript': '7.25.2',
      'ember-scoped-css': '0.21.4',
      'ember-route-template': '^1.0.3',
      'ember-template-imports': '^4.1.1',
      'prettier-plugin-ember-template-tag': '^2.0.2',
    },
    appLocation,
  );
  await packageJson.addDependencies(
    {
      '@repo/ui': 'workspace:*',
    },
    appLocation,
  );

  // Remove the existing eslint dependencies
  await packageJson.removeDevDependencies(
    [
      '@typescript-eslint/eslint-plugin',
      '@typescript-eslint/parser',
      'eslint',
      'eslint-config-prettier',
      'eslint-plugin-ember',
      'eslint-plugin-n',
      'eslint-plugin-prettier',
      'eslint-plugin-qunit',
    ],
    appLocation,
  );

  // Update app with files that use `gts` files and delete hbs files
  await files.applyFolder(path.join(__dirname, 'files/app/components'), path.join(appLocation, 'app/components'));
  await files.applyFolder(path.join(__dirname, 'files/app/templates'), path.join(appLocation, 'app/templates'));
  await deleteFile(path.join(appLocation, 'app/templates/application.hbs'));

  // Add the new scripts to the app to run build.
  await packageJson.addScripts(
    {
      'dev': "concurrently 'pnpm:start'",
      'start:types': 'glint --declaration --watch --preserveWatchOutput',
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
    fileName: 'eslint.config.mjs',
    sourcefile: 'files/app/eslint.config.mjs',
  });

  // Remove the existing eslint and prettier files from the test app
  await deleteFile(path.join(appLocation, '.eslintrc.js'));
  await deleteFile(path.join(appLocation, '.prettierrc.js'));

  await emberCliLibraryWatch(appLocation);

  await scopedCssEmberCli(appLocation);

  await updateImportPackageName(appLocation, appName);

  // Add glint to the tsconfig
  await addGlintToTsconfig(appLocation);
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

updateNewApp.path = __dirname;
