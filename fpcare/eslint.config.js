// @ts-check
const eslint = require("@eslint/js");
const tseslint = require("typescript-eslint");
const angular = require("angular-eslint");

module.exports = tseslint.config(
  {
    // Generated coverage HTML report, not source; gitignored, never authored.
    ignores: ["src/test/coverage/**"],
  },
  {
    files: ["**/*.ts"],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      "@angular-eslint/directive-selector": [
        "warn",
        {
          type: "attribute",
          prefix: "fpcare",
          style: "camelCase",
        },
      ],
      // "app-root" (the framework's own bootstrap convention, also hard-coded in
      // index.html) and several pre-existing "fpc"-prefixed selectors predate
      // this migration; renaming them touches the app's public API and
      // deploy-facing markup for no functional benefit, so this stays a warning.
      "@angular-eslint/component-selector": [
        "warn",
        {
          type: "element",
          prefix: "fpcare",
          style: "kebab-case",
        },
      ],
      // This app is deliberately NgModule based and consumes the shared library
      // through its compatibility shim. Converting components to standalone is
      // out of scope, so this rule would only ever report the intended design.
      "@angular-eslint/prefer-standalone": "off",
      // Pre-existing HTTP payload and ControlValueAccessor signatures; typing
      // them is separate work.
      "@typescript-eslint/no-explicit-any": "warn",
      // Renaming an @Output changes the app's own public API, out of scope.
      "@angular-eslint/no-output-on-prefix": "warn",
    },
  },
  {
    files: ["**/*.html"],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
