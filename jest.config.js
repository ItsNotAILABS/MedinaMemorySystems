/** @type {import('jest').Config} */
const config = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/src'],
  testMatch: ['**/__tests__/**/*.test.ts', '**/__tests__/**/*.test.tsx'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.tsx?$': ['ts-jest', {
      tsconfig: 'tsconfig.json',
      // Skip type-checking during test runs for speed
      diagnostics: false,
    }],
  },
  setupFilesAfterEnv: ['<rootDir>/src/__tests__/setup.ts'],
  collectCoverageFrom: [
    'src/lib/**/*.{ts,tsx}',
    '!src/lib/**/*.d.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 45,
      functions: 45,
      lines: 45,
      statements: 45,
    },
  },
  // ── Performance & Scale ──────────────────────────────────────────────────
  // Use 50% of available CPUs for parallel test execution
  maxWorkers: '50%',
  // Cache compiled transforms between runs
  cache: true,
  // Per-test timeout (ms) — prevents hung tests from blocking the suite
  testTimeout: 15000,
  // Fail fast in CI; remove locally if you want full output
  // bail: 1,
  // Verbose output suppressed at scale — set to true for debugging
  verbose: false,
};

module.exports = config;
