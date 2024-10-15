import path from 'node:path';
import url from 'node:url';
import { promises as fs } from 'node:fs';
import assert from 'node:assert';

import { js, packageJson } from 'ember-apply';

import { makeUtils } from './utils/jscodeshift-utils.ts';

export async function scopedCssVite(location: string) {
  const rollupConfig = path.join(location, 'rollup.config.mjs');
  const importPlugin = `import { scopedCssUnplugin } from 'ember-scoped-css/build';`;

  const rollupConfigContent = await fs.readFile(rollupConfig, 'utf8');

  if (!rollupConfigContent.includes(importPlugin)) {
    const updatedContent = `${importPlugin}\n${rollupConfigContent}`;
    await fs.writeFile(rollupConfig, updatedContent, 'utf8');
  }

  await packageJson.addDevDependencies(
    {
      'ember-scoped-css': '0.21.4',
    },
    location,
  );

  await js.transform(rollupConfig, async ({ root, j }) => {
    root.find(j.Property, { key: { name: 'plugins' } }).forEach((path) => {
      // Find the plugins array
      j(path)
        .find(j.CallExpression, {
          callee: {
            object: { name: 'addon' },
            property: { name: 'keepAssets' },
          },
        })
        .forEach((path) => {
          /**
           * 2. Add scopedCssUnplugin.rollup()
           */
          const newPlugin = j.callExpression(
            j.memberExpression(j.identifier('scopedCssUnplugin'), j.identifier('rollup')),
            [],
          );

          j(path).insertAfter(newPlugin);

          /**
           * 1. Remove addon.keepAssets()
           */
          j(path).remove();
        });
    });
  });
}

/**
 * @param {string} location
 */
export async function scopedCssEmberCli(location: string) {
  await packageJson.addDevDependencies(
    {
      'ember-scoped-css': '0.21.4',
      'ember-scoped-css-compat': '10.0.2',
    },
    location,
  );

  const emberCliBuild = path.join(location, 'ember-cli-build.js');

  const config = `
    {
			test: /\\.css$/,
			use: [
				{
					loader: require.resolve('ember-scoped-css/build/app-css-loader'),
					options: {
						// layerName: 'the-layer-name',
					},
				},
			],
		},
		`;

  await js.transform(emberCliBuild, async ({ root, j }) => {
    root.find(j.CallExpression, { callee: { property: { name: 'compatBuild' } } }).forEach((path) => {
      const lastArg = path.node.arguments.at(-1);

      assert(
        lastArg?.type === 'ObjectExpression',
        `Expected last argument to embroider's compatBuild() to be an object`,
      );

      const { ensureObj, ensureArr } = makeUtils(j);

      const packagerOptions = ensureObj('packagerOptions', lastArg);
      const webpackConfig = ensureObj('webpackConfig', packagerOptions);
      const webpackModule = ensureObj('module', webpackConfig);
      const rules = ensureArr('rules', webpackModule);

      j(rules)
        .find(j.ArrayExpression)
        .forEach((path) => {
          path.node.elements.push(j.identifier(config));
        });
    });
  });
}

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

scopedCssVite.path = __dirname;
