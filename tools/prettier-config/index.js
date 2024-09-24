"use strict";

module.exports = {
  plugins: ["prettier-plugin-ember-template-tag"],
  singleQuote: true,
  printWidth: 120,
  quoteProps: "consistent",
  bracketSpacing: true,
  arrowParens: "always",
  useTabs: true,
  overrides: [
    {
      files: [
        "*.js",
        "*.ts",
        "*.cjs",
        "*.mjs",
        "*.cts",
        "*.mts",
        "*.gjs",
        "*.gts",
      ],
      options: {
        trailingComma: "all",
      },
    },
    {
      files: "*.json",
      options: {
        useTabs: false,
      },
    },
    {
      files: "*.yml",
      options: {
        useTabs: false,
      },
    },
    {
      files: "*.hbs",
      options: {
        printWidth: 80,
        singleQuote: false,
        parser: "glimmer",
      },
    },
    {
      files: "*.css",
      options: {
        printWidth: 80,
        singleQuote: false,
        parser: "css",
      },
    },
    {
      files: "*.svg",
      options: {
        printWidth: 80,
        singleQuote: false,
        parser: "html",
      },
    },
    {
      files: ["*.gjs", "*.gts"],
      options: {
        templateSingleQuote: false,
      },
    },
  ],
};
