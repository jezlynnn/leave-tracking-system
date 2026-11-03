import type { Config } from 'jest';

const config: Config = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  rootDir: '.',
  testMatch: ['**/tests/**/*.test.ts'],
  globalSetup: '<rootDir>/tests/setup.ts',
  transform: {
    '^.+\\.ts$': ['ts-jest', {
      tsconfig: {
        strict: true,
        esModuleInterop: true,
        rootDir: '.',
      },
    }],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/server.ts',
    '!src/migrate.ts',
    '!src/types/**',
  ],
  coverageDirectory: 'coverage',
  testTimeout: 30000,
};

export default config;
