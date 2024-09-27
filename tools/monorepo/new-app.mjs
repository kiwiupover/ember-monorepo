import { execa } from 'execa';
import path from 'path';

import { updateApp, cleanUp } from '@repo/app-updates';

const appLocation = 'apps';

export async function generateApp(info) {
  const { root, appName } = info;

  if (!root || !appName) {
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
      '--blueprint',
      '@embroider/app-blueprint',

      // don't install dependencies
      '--skip-npm',

      // don't create a git repo
      '--skip-git',

      // use pnpm
      '--pnpm',

      // use typescript
      '--typescript',
    ],
    {
      cwd: path.join(root, appLocation),
      env: {
        EMBER_CLI_PNPM: 'true',
      },
    },
  );

  console.log('App generated successfully');
}

export async function updateNewApp(info) {
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

  debugger;

  console.log('Starting generation of the new app', newAppObject);

  await generateApp(newAppObject);
  console.log('App generated successfully');

  await updateNewApp(newAppObject);
  console.log('App updated successfully');

  await execa('pnpm', ['install'], { cwd: newAppObject.root });
  console.log('Update dependancies pnpm install has run successfully');

  //TODO: we need to fix linting first
  await cleanUp(newAppObject.appLocation);
  console.log('Clean up has run successfully');

  process.exit(0);
}
