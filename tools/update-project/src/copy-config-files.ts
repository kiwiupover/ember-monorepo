import path from 'node:path';
import { files } from 'ember-apply';

export async function copyConfigAddonFiles({
  dirname,
  location,
}: {
  dirname: string;
  location: string;
}): Promise<void> {
  // Copy the new eslint files
  await files.copyFileTo(path.join(location, '.eslintrc.cjs'), {
    source: path.join(dirname, 'files/addon/.eslintrc.cjs'),
  });

  // Uses the default tsconfig.json
}

export async function copyConfigAddonTestFiles({
  dirname,
  location,
}: {
  dirname: string;
  location: string;
}): Promise<void> {
  // Copy the new eslint files
  await files.copyFileTo(path.join(location, '.eslintrc.cjs'), {
    source: path.join(dirname, 'files/addon-test/.eslintrc.cjs'),
  });

  // Uses the default tsconfig.json
}
