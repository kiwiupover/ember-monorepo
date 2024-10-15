import path from 'node:path';
import { files } from 'ember-apply';

export async function copyFile({
  dirname,
  location,
  sourcefile,
  fileName,
}: {
  dirname: string;
  location: string;
  sourcefile: string;
  fileName: string;
}): Promise<void> {
  await files.copyFileTo(path.join(location, fileName), {
    source: path.join(dirname, sourcefile),
  });
}
