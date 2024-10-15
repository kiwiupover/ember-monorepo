import path from 'node:path';

import { packageJson, html } from 'ember-apply';
import { copyFile } from './copy-config-files.ts';
import { deleteFile } from './delete-file.ts';
import { dirname } from 'path';
import { fileURLToPath } from 'url';

export async function installTailwindCss(location: string): Promise<void> {
  await packageJson.addDevDependencies(
    {
      'tailwindcss': 'latest',
      '@tailwindcss/forms': 'latest',
      'stylelint-config-tailwindcss': 'latest',
    },
    location,
  );

  await copyFile({
    dirname: __dirname,
    location,
    fileName: 'tailwind.config.cjs',
    sourcefile: 'files/tailwindcss/tailwind.config.cjs',
  });

  await copyFile({
    dirname: __dirname,
    location,
    fileName: `app/styles/tailwind.css`,
    sourcefile: 'files/tailwindcss/tailwind.css',
  });

  await copyFile({
    dirname: __dirname,
    location,
    fileName: `.gitignore`,
    sourcefile: 'files/tailwindcss/.gitignore',
  });

  await copyFile({
    dirname: __dirname,
    location,
    fileName: `.stylelintrc.cjs`,
    sourcefile: 'files/tailwindcss/.stylelintrc.cjs',
  });

  deleteFile(path.join(location, '.stylelintrc.js'));

  await html.insertText(`${location}/app/index.html`, {
    text: `<link integrity="" rel="stylesheet" href="{{rootURL}}assets/tailwind.css">\n`,
    beforeFirst: 'link',
  });

  await html.insertText(`${location}/app/index.html`, {
    text: `<link rel="stylesheet" href="{{rootURL}}assets/tailwind.css">\n`,
    beforeFirst: 'link',
  });

  await packageJson.addScripts(
    {
      'tailwind:build':
        'npx tailwindcss' +
        ' -c ./tailwind.config.cjs' +
        ' -i ./app/styles/tailwind.css' +
        ' -o ./public/assets/tailwind.css',
      'tailwind:watch':
        'npx tailwindcss' +
        ' -c ./tailwind.config.cjs' +
        ' -i ./app/styles/tailwind.css' +
        ' -o ./public/assets/tailwind.css' +
        ' --watch',

      'dev': "concurrently 'npm:start:ember' 'npm:tailwind:watch' --names 'serve,styles'",
      'start': "concurrently 'npm:start:ember' 'npm:tailwind:watch' --names 'serve,styles'",
      'start:ember': 'ember serve',
      'build': 'npm run tailwind:build && ember build --environment=production',
    },
    location,
  );
}

const __dirname = dirname(fileURLToPath(import.meta.url));
installTailwindCss.path = __dirname;
