import { execa } from "execa";

/**
 * We only need to lint in the new locations
 * @param {{ addonLocation: string; testAppLocation: string; }} info
 */
export async function cleanUpLint(info) {
  await lintIgnoringErrors(info.addonLocation);
  await lintIgnoringErrors(info.testAppLocation);

  // ensure stability, double check.
  //
  // however, the fact this is needed
  //   may reveal our lint + prettier configs
  //   may have a disagreement
  //   (or a bug in the jsonc/sort-keys fixer)
  await execa("pnpm", ["lint:fix"], { cwd: info.addonLocation });
  await execa("pnpm", ["lint:fix"], { cwd: info.testAppLocation });
}

/**
 * @param {string} cwd
 */
async function lintIgnoringErrors(cwd) {
  try {
    await execa("pnpm", ["lint:fix"], { cwd });
  } catch {}
}
