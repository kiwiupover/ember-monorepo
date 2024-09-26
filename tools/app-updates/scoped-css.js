import path from 'node:path';
import url from 'node:url';
import { appendFile } from 'fs/promises';

import { js } from 'ember-apply';

/**
 * @param {string} location
 */
export async function scopedCss(location) {
  const rollupConfig = path.join(location, 'rollup.config.mjs');
  const importPlugin = `import { scopedCssUnplugin } from 'ember-scoped-css/build';`;

  await appendFile(rollupConfig, importPlugin);

  await js.transform(rollupConfig, async ({ root, j }) => {
    root.find(j.Property, { key: { name: 'plugins' } }).forEach((/** @type {string} */ path) => {
      /**
       * Remove addon.keepAssets(...)
       */
      j(path)
        .find(j.CallExpression, {
          callee: {
            object: { name: 'addon' },
            property: { name: 'keepAssets' },
          },
        })
        .forEach((/** @type {string} */ path) => {
          /**
           * 2. Add scopedCssUnplugin.rollup()
           */

          const newPlugin = j.callExpression(
            j.memberExpression(j.identifier('scopedCssUnplugin'), j.identifier('rollup')),
            [],
          );

          j(path).insertAfter(newPlugin);
        });
    });
  });
}

// @ts-ignore
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

scopedCss.path = __dirname;
