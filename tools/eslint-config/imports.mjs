import SimpleImportSortPlugin from 'eslint-plugin-simple-import-sort';
import ImportPlugin from 'eslint-plugin-import';

const Ember = '@ember/';
const Glimmer = '@glimmer/';

const EmberData = '@ember-data/';
const WarpDrive = '@warp-drive/';

const ProjectPackages = '@repo';

export const sortGroups = [
  // Side effect imports.
  [`^\u0000`],
  // Packages.
  // Things that start with a letter (or digit or underscore), or `@` followed by a letter.
  // But not our packages, ember/glimmer/ember-data packages, or potential addons (things starting with ember- or @ember-)
  [`^(?!${Glimmer})(?!${EmberData})(?!${WarpDrive})(?!${ProjectPackages})`],
  // Ember & Glimmer Dependencies
  ['^ember$', `^${Ember}`],
  [`^${Glimmer}`],
  // EmberData Dependencies
  [`^${EmberData}`, `^${WarpDrive}`],
  // Potential Addons (Packages starting with ember-)
  [`^(@?ember-)`],
  // Project packages (engines / addons)
  [`^${ProjectPackages}`],
  // Absolute imports and other imports such as Vue-style `@/foo`.
  // Anything that does not start with a dot.
  ['^[^.]'],
  // Relative imports.
  // Anything that starts with a dot.
  [`^.`],
];

export function rules() {
  return {
    // Imports
    'import/first': 'error',
    'import/newline-after-import': 'error',
    'import/no-duplicates': 'error',
    'simple-import-sort/imports': ['error', { groups: sortGroups }],
  };
}

export function plugins() {
  return {
    'simple-import-sort': SimpleImportSortPlugin,
    'import': ImportPlugin,
  };
}
