# Ember MonoRepo

This is a starter monorepo for projects using ember.

## Adding a new app

Run the following command:

```sh
pnpm new:app <APP-NAME>
```

### A new app with tailwindcss

```sh
pnpm new:app <APP-NAME> --tailwind
```

## Adding a new addon

Run the following command:

```sh
pnpm new:addon <MODULE-NAME>
```

## What's inside?

This Turborepo includes the following packages and apps:

### Apps and Packages

- `docs`: a vanilla [ember](https://emberjs.com) ts app
- `@repo/ui`: an addon for a design-system as V2 addon
- `@repo/eslint-config`: shared `eslint` configurations
- `@repo/linting-config`: shared `prettier` & `template-lint` & `stylelint` configurations
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/), [gts](https://github.com/ember-cli/ember-template-imports) files, and [Ember Route Templates](https://github.com/discourse/ember-route-template) for `gts` route templates.

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [TemplateLint](https://github.com/ember-template-lint/ember-template-lint) for template linting
- [StyleLint](https://stylelint.io/) for css linting
- [Prettier](https://prettier.io) for code formatting

### Thanks

Thank you [@wagenet](https://github.com/wagenet) and [NullVoxPopuli](https://github.com/NullVoxPopuli) for the inspritation behind this repo.
