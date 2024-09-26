import path from 'path';
import { files } from 'ember-apply';

/**
 * We only need to lint in the new locations
 * @param {{ dirname: string; location: string; }} info
 */
export async function copyConfigFiles({ dirname, location }) {
  // Copy the new eslint files
  await files.copyFileTo(path.join(location, '.eslintrc.cjs'), {
    source: path.join(dirname, 'files/app/.eslintrc.cjs'),
  });

  // Copy the new tsconfig.json
  // await files.copyFileTo(path.join(location, "tsconfig.json"), {
  //   source: path.join(dirname, "files/app/tsconfig.json"),
  // });
}
