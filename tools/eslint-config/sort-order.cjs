/* eslint-disable no-useless-escape */
const Ember = '@ember/';
const Glimmer = '@glimmer/';

const EmberData = '@ember-data/';
const WarpDrive = '@warp-drive/';

const ProjectPackages = '(@repo|@repo/ui)';

const sortGroups = [
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
  [`^\.`],
];

module.exports = {
  sortGroups,
};
