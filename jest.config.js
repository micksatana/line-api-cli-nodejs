module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  collectCoverageFrom: ['lib/**/*.ts'],
  coverageThreshold: {
    global: {
      branches: 90,
      functions: 90,
      lines: 90,
      statements: 90
    }
  },
  testPathIgnorePatterns: ['bin/', '/node_modules/'],
  globalSetup: './global-setup.ts'
};
