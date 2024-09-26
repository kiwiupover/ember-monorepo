import path from 'node:path';
import { files } from 'ember-apply';

export async function copyConfigFiles({ dirname, location }: { dirname: string; location: string }): Promise<void> {
  // Copy the new eslint files
  await files.copyFileTo(path.join(location, '.eslintrc.cjs'), {
    source: path.join(dirname, 'files/addon/.eslintrc.cjs'),
  });

  // Copy the new tsconfig.json
  await files.copyFileTo(path.join(location, 'tsconfig.json'), {
    source: path.join(dirname, 'files/addon/tsconfig.json'),
  });
}
