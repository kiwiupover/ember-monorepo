'use strict';

const EmberApp = require('ember-cli/lib/broccoli/ember-app');

module.exports = async function (defaults) {
  let app = new EmberApp(defaults, {
    'ember-cli-babel': { enableTypeScriptTransform: true },
    'autoImport': {
      watchDependencies: ['ui'],
    },
    'trees': {
      ...(await require('@repo/ember-cli/watch-dependencies.cjs').libraryWatcher(__dirname)),
    },
  });

  const { maybeEmbroider } = require('@embroider/test-setup');
  return maybeEmbroider(app);
};
