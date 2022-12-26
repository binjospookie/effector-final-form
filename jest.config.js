export default new Promise(async (resolve) => {
  resolve({
    modulePaths: ['./src'],
    snapshotFormat: {
      escapeString: true,
      printBasicPrototype: true,
    },
    coverageThreshold: {
      global: {
        statements: 100,
      },
    },
    bail: true,
    maxConcurrency: 25,
    testEnvironment: 'node',
    transform: {
      '^.+\\.(t|j)sx?$': ['@swc/jest'],
    },
    coverageReporters: ['text'],
    // "jest-haste-map: duplicate manual mock found" because we have esm and cjs build
    modulePathIgnorePatterns: ['/modules/', '/build/'],
    testPathIgnorePatterns: ['/node_modules/', '/build/', '__fixtures__', '__mocks__'],
    testMatch: ['**/__tests__/**/*.spec.ts'],
  });
});
