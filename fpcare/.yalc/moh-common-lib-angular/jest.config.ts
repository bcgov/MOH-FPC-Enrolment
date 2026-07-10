import type { Config } from 'jest';

const config: Config = {
  coverageDirectory: 'coverage',
  collectCoverageFrom: [
    'src/lib/**/*.ts',
    '!src/lib/**/*.spec.ts',
    '!src/lib/**/*.module.ts',
    '!src/lib/**/*.model.ts',
    '!src/lib/**/*.interface.ts',
    '!src/lib/**/*.constants.ts',
  ],
};

export default config;
