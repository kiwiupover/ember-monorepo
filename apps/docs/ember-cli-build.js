'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  const app = new EmberApp(defaults, {
    'trees': {
      ...(await require('@repo/ember-cli/watch-dependencies.cjs').libraryWatcher(__dirname)),
    },
    'ember-cli-babel': { enableTypeScriptTransform: true },

    // Add options here
  });

  const { Webpack } = require('@embroider/webpack');
  return require('@embroider/compat').compatBuild(app, Webpack, {
    staticAddonTestSupportTrees: true,
    staticAddonTrees: true,
    staticHelpers: true,
    staticModifiers: true,
    staticComponents: true,
    staticEmberSource: true,

    skipBabel: [
      {
        package: 'qunit',
      },
    ],

    packagerOptions: {
      webpackConfig: {
        module: {
          rules: [
            {
              test: /\.css$/,
              use: [
                {
                  loader: require.resolve('ember-scoped-css/build/app-css-loader'),
                  options: {
                    // layerName: 'the-layer-name',
                  },
                },
              ],
            },
          ],
        },
      },
    },
  });
};
