'use strict';

const { findWorkspacePackagesNoCheck, arrayOfWorkspacePackagesToMap } = require('@pnpm/find-workspace-packages');
const path = require('path');
const fs = require('fs');

const monorepoRoot = path.join(__dirname, '../../');

/**
 * For a given "currentPath", we determine what packages (specified in the package.json)
 * are from the monorepo.
 *
 * @param {string} currentPath directory of the package, containing the package.json
 */
async function addons(currentPath) {
  const thisPackage = require(path.join(currentPath, 'package.json'));
  const { dependencies, devDependencies } = thisPackage;

  const allDependencies = [...Object.keys(dependencies || {}), ...Object.keys(devDependencies || {})];

  const packageInfos = await findWorkspacePackagesNoCheck(monorepoRoot);
  const packageObjectMap = arrayOfWorkspacePackagesToMap(packageInfos);

  const relevantPackages = [];

  for (const [name, info] of Object.entries(packageObjectMap)) {
    if (!allDependencies.includes(name)) {
      continue;
    }

    // Info is an object where the keys are versions and the values are package details.
    // In this monorepo, we only use one version per package, so we can safely use the first entry.
    const actualInfo = Object.values(info)[0];
    relevantPackages.push(actualInfo);
  }

  const inMonorepoAddons = relevantPackages
    .map((packageInfo) => packageInfo.manifest)
    .filter((manifest) => manifest.keywords?.includes('ember-addon') || manifest.keywords?.includes('auditboard-docs'));

  return inMonorepoAddons.map((manifest) => manifest.name);
}

const sideWatch = require('@embroider/broccoli-side-watch');

async function watchLibraries(projectDir) {
  const { packageUp } = await import('package-up');
  debugger;
  const libraries = await addons(projectDir);

  const promises = libraries.map(async (libraryName) => {
    const entry = require.resolve(libraryName, { paths: [projectDir] });
    const manifestPath = await packageUp({ cwd: entry });
    const packagePath = path.dirname(manifestPath);
    const manifest = require(manifestPath);

    if (!manifest.files) {
      return;
    }

    const toWatch = manifest.files.map((f) => path.join(packagePath, f));

    return toWatch;
  });

  const paths = (await Promise.all(promises)).flat().filter(Boolean);

  const relative = paths
    .filter((p) => {
      const repoRelative = p.replace(monorepoRoot, '');

      if (!fs.existsSync(p)) {
        // eslint-disable-next-line no-console
        console.warn(`Path ${repoRelative} doesn't exist. It will not be watched.`);
        return false;
      }

      if (!fs.lstatSync(p).isDirectory()) {
        // eslint-disable-next-line no-console
        console.warn(`Path ${repoRelative} is not a directory. It will not be watched.`);
        return false;
      }

      console.info(`\x1b[92mPath ${repoRelative}. It is being watched. 👍\x1b[0m`);
      return !p.endsWith('/src');
    })
    .map((p) => path.relative(projectDir, p));

  return sideWatch('app', { watching: relative });
}

async function libraryWatcher(__dirname) {
  if (process.env.EMBER_ENV !== 'development') {
    return {};
  }

  return {
    app: await watchLibraries(__dirname),
  };
}

module.exports = { libraryWatcher };
