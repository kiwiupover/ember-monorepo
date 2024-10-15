import { execa } from 'execa';

/**
 * We only need to lint in the new locations
 * @param {string} location
 */
export async function cleanUpLint(location: string): Promise<void> {
  await lintIgnoringErrors(location);

  // ensure stability, double check.
  //
  // however, the fact this is needed
  //   may reveal our lint + prettier configs
  //   may have a disagreement
  //   (or a bug in the jsonc/sort-keys fixer)
  await execa('pnpm', ['lint:fix'], { cwd: location });
}

/**
 * @param {string} cwd
 */
async function lintIgnoringErrors(cwd: string) {
  try {
    await execa('pnpm', ['lint:fix'], { cwd });
  } catch {
    /* empty */
  }
}
