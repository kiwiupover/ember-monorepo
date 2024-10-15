import path from 'node:path';
import url from 'node:url';
import { js, packageJson } from 'ember-apply';

/**
 * @param {string} location
 */
export async function emberCliLibraryWatch(location: string) {
  // Add necessary devDependencies
  await packageJson.addDevDependencies(
    {
      '@repo/ember-cli': 'workspace:*',
    },
    location,
  );

  // Define the path to ember-cli-build.js
  const emberCliBuild = path.join(location, 'ember-cli-build.js');

  // Perform the JS transformation
  await js.transform(emberCliBuild, async ({ root, j }) => {
    // Find the first function and set it to async
    root.find(j.FunctionExpression).forEach((path) => {
      path.node.async = true;
    });

    // Find the new EmberApp
    const emberApp = root.find(j.NewExpression, {
      callee: { name: 'EmberApp' },
    });

    // Insert the new trees configuration
    emberApp.forEach((path) => {
      const options = path.value.arguments[1];
      if (options && options.type === 'ObjectExpression') {
        // Add the new 'trees' property directly the emberApp options
        const treesCode = `'trees': {
  ...(await require('@repo/ember-cli/watch-dependencies.cjs').libraryWatcher(__dirname)),
}`;

        // Add the new property to the existing properties
        // @ts-ignore
        options.properties.push(j.identifier(treesCode));
      }
    });
  });
}

// Resolve __dirname for ESM
const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

// Set the path for emberCliLibraryWatch
emberCliLibraryWatch.path = __dirname;
