import type { Config } from '@jest/types';

// Sync object
const config: Config.InitialOptions = {
  preset: 'ts-jest',
  globals: { 'ts-jest': { isolatedModules: true } },
  collectCoverage: true,
  coveragePathIgnorePatterns: ['/node_modules/', '/tests/'],
  setupFilesAfterEnv: ['<rootDir>/setupTests.ts'],
  transform: {
    '\\.m?jsx?$': 'jest-esm-transformer',
    '^.+\\.(js|jsx|ts|tsx)$': '<rootDir>/node_modules/babel-jest',
  },
  resetMocks: false,
  verbose: true,
  testEnvironment: 'jest-environment-jsdom',
  moduleNameMapper: {
    '^pages/(.*)$': '<rootDir>/pages/$1',
    '^tests/(.*)': '<rootDir>/tests/$1',
    '^@/components/(.*)$': '<rootDir>/src/components/$1',
    '^@/libs/(.*)$': '<rootDir>/src/libs/$1',
    '^@/hooks/(.*)': '<rootDir>/src/hooks/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '^react$': require.resolve('react'),
    '^wagmi$': require.resolve('wagmi'),
  },
};

export default config;
