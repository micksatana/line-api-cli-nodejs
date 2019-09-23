module.exports = {
  collectCoverage: true,
  collectCoverageFrom: [
    'lib/**/*.{js,jsx}',
    '!lib/clis/*.{js,jsx}',
    '!**/typedef/**',
    '!**/node_modules/**',
    '!**/__tests__/**',
    '!**/__mocks__/**'
  ],
  coverageDirectory: 'coverage',
  roots: ['lib'],
  setupFilesAfterEnv: ['jest-extended', '<rootDir>/global-test-setup.js', 'jest-date-mock']
};
