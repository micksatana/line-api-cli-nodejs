module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*.{js,jsx}',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/__mocks__/**'
  ],
  coverageDirectory: 'coverage',
  roots: ['lib'],
  setupFilesAfterEnv: ['jest-extended', '<rootDir>/global-test-setup.js']
};
