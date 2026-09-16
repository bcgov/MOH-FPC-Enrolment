// @ts-check
const eslint = require('@eslint/js');
const tseslint = require('typescript-eslint');
const angular = require('angular-eslint');

module.exports = tseslint.config(
  {
    files: ['**/*.ts'],
    extends: [
      eslint.configs.recommended,
      ...tseslint.configs.recommended,
      ...tseslint.configs.stylistic,
      ...angular.configs.tsRecommended,
    ],
    processor: angular.processInlineTemplates,
    rules: {
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          prefix: 'fpir',
          style: 'camelCase',
        },
      ],
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          prefix: 'fpir',
          style: 'kebab-case',
        },
      ],
      // This app is deliberately NgModule based and consumes the shared library
      // through its compatibility shim. Converting components to standalone is
      // out of scope, so this rule would only ever report the intended design.
      '@angular-eslint/prefer-standalone': 'off',
      // Pre-existing HTTP payload and ControlValueAccessor signatures; typing them is separate work.
      '@typescript-eslint/no-explicit-any': 'warn',
      // Renaming @Output() onHide changes the app's own public API and is out of scope for this story.
      '@angular-eslint/no-output-on-prefix': 'warn',
    },
  },
  {
    files: ['**/*.html'],
    extends: [
      ...angular.configs.templateRecommended,
      ...angular.configs.templateAccessibility,
    ],
    rules: {},
  }
);
