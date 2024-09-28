import type { AppInfo } from '@repo/update-project/src/update-new-app.ts';
import { execa } from 'execa';
import path from 'path';

const { updateApp, cleanUp } = await import('@repo/update-project/src/index.ts');

const appLocation = 'apps';

export async function generateApp(info: AppInfo) {
  const { root, appName } = info;

  if (!appName) {
    throw new Error('Please provide a packagName required arguments');
  }

  console.log('Generating new app');

  const newApp = await execa(
    'npx',
    [
      'ember-cli@latest',
      'new',
      appName,

      // the v2 app blueprint
      // '--blueprint',
      // 'app-blueprint-kiwiupover',

      // don't install dependencies
      '--skip-npm',

      // don't create a git repo
      '--skip-git',

      // use pnpm
      '--pnpm',

      // use embroider
      '--embroider',

      // use typescript
      // TODO update when typescript is ready.
      '--typescript',
    ],
    {
      cwd: path.join(root, appLocation),
      env: {
        EMBER_CLI_PNPM: 'true',
      },
    },
  );
}

export async function updateNewApp(info: AppInfo) {
  await updateApp(info);
}

if (!process.argv[2]) {
  console.error("Please provide a application name IE: 'cool-project-name'");
  process.exit(1);
}

// Check if this script is being run directly from the command line
if (import.meta.url === `file://${process.argv[1]}` && process.argv[2]) {
  const newAppObject = {
    root: process.cwd(),
    appName: process.argv[2],
    appLocation: path.join(`${appLocation}/${process.argv[2]}`),
  };

  console.log('Starting generation of the new app', newAppObject);

  await generateApp(newAppObject);
  console.log('App generated successfully');

  await updateNewApp(newAppObject);
  console.log('App updated successfully');

  await execa('pnpm', ['install'], { cwd: newAppObject.root });
  console.log('Update dependancies pnpm install has run successfully');

  await cleanUp(newAppObject.appLocation);
  console.log('Clean up has run successfully');

  process.exit(0);
}
