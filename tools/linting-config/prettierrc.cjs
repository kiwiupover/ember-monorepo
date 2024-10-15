"use strict";

module.exports = {
  plugins: ["prettier-plugin-ember-template-tag"],
  singleQuote: true,
  printWidth: 120,
  quoteProps: "consistent",
  bracketSpacing: true,
  arrowParens: "always",
  useTabs: false,
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
