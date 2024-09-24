# Ember MonoRepo

This is a starter monorepo for projects using ember.

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
- `@repo/prettier-config`: shared `prettier` configurations
- `@repo/typescript-config`: `tsconfig.json`s used throughout the monorepo

Each package and app is 100% [TypeScript](https://www.typescriptlang.org/).

### Utilities

This Turborepo has some additional tools already setup for you:

- [TypeScript](https://www.typescriptlang.org/) for static type checking
- [ESLint](https://eslint.org/) for code linting
- [Prettier](https://prettier.io) for code formatting
