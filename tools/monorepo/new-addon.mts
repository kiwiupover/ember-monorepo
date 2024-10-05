import type { AddonInfo } from '@repo/update-project/src/update-new-addon.ts';
import { execa } from 'execa';
import path from 'node:path';

const { updateAddon, cleanUp } = await import('@repo/update-project/src/index.ts');

export async function generateAddon(info: AddonInfo) {
  const { root, packageName, addonLocation, testAppLocation } = info;

  if (!root || !packageName || !addonLocation || !testAppLocation) {
    throw new Error('Please provide a packagName required arguments');
  }

  console.log('Generating new addon');

  await execa(
    'npx',
    [
      'ember-cli@latest',
      'addon',
      packageName,

      // the v2 addon blueprint
      '--blueprint',
      '@embroider/addon-blueprint',

      // don't install dependencies
      '--skip-npm',

      // don't create a git repo
      '--skip-git',

      // use pnpm
      '--pnpm',

      // use typescript
      '--typescript',

      // location of the new addon
      `--addon-location=${addonLocation}`,
      `--test-app-location=${testAppLocation}`,
      `--test-app-name=${packageName}-tests`,
    ],
    {
      cwd: root,
      env: {
        EMBER_CLI_PNPM: 'true',
      },
    },
  );

  console.log('Addon generated successfully');
}

export async function updateNewAddon(info: AddonInfo) {
  await updateAddon(info);
}

if (!process.argv[2]) {
  console.error("Please provide a package name IE: 'design-system'");
  process.exit(1);
}

// Check if this script is being run directly from the command line
if (import.meta.url === `file://${process.argv[1]}` && process.argv[2]) {
  const newAddonObject = {
    root: process.cwd(),
    packageName: process.argv[2],
    addonLocation: path.join(`libraries/${process.argv[2]}/package`),
    testAppLocation: `libraries/${process.argv[2]}/test-app`,
  };

  console.log('Starting generation of the new addon', newAddonObject);

  await generateAddon(newAddonObject);
  console.log('Addon generated successfully');

  await updateNewAddon(newAddonObject);
  console.log('Addon updated successfully');

  await execa('pnpm', ['install'], { cwd: newAddonObject.root });
  console.log('Update dependancies pnpm install has run successfully');

  await cleanUp(newAddonObject.addonLocation);
  await cleanUp(newAddonObject.testAppLocation);

  console.log('Clean up has run successfully');

  process.exit(0);
}
