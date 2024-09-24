import path from "node:path";
import url from "node:url";
import { promises as fs } from "node:fs";

import { cleanUpLint } from "./clean-up-lints.js";
import { scopedCss } from "./scoped-css.js";
import { copyConfigFiles } from "./copy-config-files.js";

import { packageJson, files } from "ember-apply";

/**
 * @param {string} file
 */
async function deleteFile(file) {
  try {
    await fs.unlink(file);
    console.log("File deleted successfully");
  } catch (err) {
    console.error("Error deleting the file:", err);
  }
}

/**
 * @param {{ addonLocation: string; packageName: string, root?: string; testAppLocation: string; }} info
 */
export async function updateAddon(info) {
  const { root, addonLocation, packageName, testAppLocation } = info;

  // Update the addon

  // Update the package.json name to `@repo/${name}`
  const { name } = await packageJson.read(addonLocation);

  await packageJson.modify((packageJson) => {
    if (name.startsWith("@repo/")) {
      return;
    }

    packageJson.name = `@repo/${name}`;
  }, addonLocation);

  // update the package.json to include the new dependencies
  await packageJson.addDevDependencies(
    {
      "@repo/eslint-config": "workspace:*",
      "@repo/prettier-config": "workspace:*",
      "@repo/typescript-config": "workspace:*",
      "ember-scoped-css": "0.21.4",
      "ember-template-imports": "^4.1.1",
      "prettier-plugin-ember-template-tag": "^2.0.2",
    },
    addonLocation
  );

  // Update addon with componet files that use `gts` files
  await files.applyFolder(
    path.join(__dirname, "files/addon/components"),
    path.join(addonLocation, "src/components")
  );

  // Add the new scripts to the addon to run build.
  await packageJson.addScripts(
    {
      dev: "concurrently 'pnpm:start:*'",
    },
    addonLocation
  );

  /**
   * Copy the eslint and tsconfig to the addonLocation
   * This will overwrite the existing files
   */
  await copyConfigFiles({ dirname: __dirname, location: addonLocation });

  await scopedCss(addonLocation);

  // Update the test app
  // await scopedCss(testAppLocation);

  // Add repo scoped dependencies to the test app
  const { dependencies } = await packageJson.read(testAppLocation);

  await packageJson.modify((packageJson) => {
    packageJson.dependencies = {
      ...dependencies,
      [`@repo/${packageName}`]: "workspace:*",
    };
  }, testAppLocation);

  // Update test app files that use `gts` files
  await files.applyFolder(
    path.join(__dirname, "files/templates"),
    path.join(testAppLocation, "app/templates")
  );

  // Remove the application.hbs file
  await deleteFile(path.join(testAppLocation, "app/templates/application.hbs"));

  // Remove the `"name": "workspace: *"` from the package.json
  await packageJson.removeDevDependencies([packageName], testAppLocation);

  // Add the new dependencies to the test app
  await packageJson.addDevDependencies(
    {
      "ember-scoped-css": "0.21.4",
      "ember-route-template": "^1.0.3",
      "ember-template-imports": "^4.1.1",
      "prettier-plugin-ember-template-tag": "^2.0.2",
    },
    testAppLocation
  );

  // Add the new scripts to the test app to run the addon
  await packageJson.addScripts(
    {
      dev: "ember serve",
    },
    testAppLocation
  );
}

/**
 * @param {{ addonLocation: string; testAppLocation: string; }} info
 */
export async function cleanUp(info) {
  await cleanUpLint(info);
}

// @ts-ignore
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

updateAddon.path = __dirname;
