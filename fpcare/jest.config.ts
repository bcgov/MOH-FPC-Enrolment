import type { Config } from 'jest';

const config: Config = {
  preset: 'jest-preset-angular',
  setupFilesAfterEnv: ['<rootDir>/setup-jest.ts'],
  testEnvironment: 'jsdom',
  testPathIgnorePatterns: [
    '<rootDir>/node_modules/',
    '<rootDir>/.yalc/',
    '<rootDir>/src/test.ts',
    // All tests commented out (pending restoration)
    '<rootDir>/src/app/models/api.model.spec.ts',
    '<rootDir>/src/app/validation/fpcare-required.directive.spec.ts',
    // Helper file only (exports mockValue), no tests
    '<rootDir>/src/app/validation/base-validation.component.spec.ts',
  ],
  // Allow transformation of TypeScript source in moh-common-lib-angular (installed via yalc)
  transformIgnorePatterns: [
    'node_modules/(?!(moh-common-lib-angular|uuid|.*\\.mjs$|@angular/common/locales/.*\\.js$))',
  ],
  transform: {
    '^.+\\.(ts|js|mjs|html|svg)$': [
      'jest-preset-angular',
      {
        tsconfig: '<rootDir>/src/tsconfig.spec.json',
        stringifyContentPathRegex: '\\.(html|svg)$',
        diagnostics: false,
      },
    ],
  },
  moduleNameMapper: {
    // Use node_modules copy (no nested @angular) rather than .yalc source (has nested @angular)
    'moh-common-lib-angular': '<rootDir>/node_modules/moh-common-lib-angular/src/public-api.ts',
    '^environments/environment$': '<rootDir>/src/environments/environment.ts',
    // Force uuid to use its CJS build (uuid lives in moh-common-lib-angular's node_modules, not fpcare's)
    '^uuid$': '<rootDir>/node_modules/moh-common-lib-angular/node_modules/uuid/dist/cjs/index.js',
    // Resolve Angular baseUrl-style imports (tsconfig baseUrl: "src")
    '^app/(.*)$': '<rootDir>/src/app/$1',
  },
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/app/**/*.ts',
    '!src/app/**/*.spec.ts',
    '!src/app/**/*.module.ts',
  ],
};

export default config;
