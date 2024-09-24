import { execa } from "execa";
import path from "path";

import { updateAddon, cleanUp } from "@repo/update-project";

export async function generateAddon(info) {
  const { root, packageName, addonLocation, testAppLocation } = info;

  if (!root || !packageName || !addonLocation || !testAppLocation) {
    throw new Error("Please provide a packagName required arguments");
  }

  console.log("Generating new addon");

  const newAddon = await execa(
    "npx",
    [
      "ember-cli@latest",
      "addon",
      packageName,

      // the v2 addon blueprint
      "--blueprint",
      "@embroider/addon-blueprint",

      // don't install dependencies
      "--skip-npm",

      // don't create a git repo
      "--skip-git",

      // use pnpm
      "--pnpm",

      // use typescript
      "--typescript",

      // location of the new addon
      `--addon-location=${addonLocation}`,
      `--test-app-location=${testAppLocation}`,
      `--test-app-name=${packageName}-tests`,
    ],
    {
      cwd: root,
      env: {
        EMBER_CLI_PNPM: "true",
      },
    }
  );

  console.log("Addon generated successfully");
}

export async function updateNewAddon(info) {
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

  console.log("Starting generation of the new addon", newAddonObject);

  await generateAddon(newAddonObject);
  console.log("Addon generated successfully");

  await updateNewAddon(newAddonObject);
  console.log("Addon updated successfully");

  await execa("pnpm", ["install"], { cwd: newAddonObject.root });
  console.log("pnpm install has run successfully");

  //TODO: we need to fix linting first
  await cleanUp(newAddonObject);
  console.log("Clean up has run successfully");

  process.exit(0);
}
