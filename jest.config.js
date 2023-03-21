const path = require('path')

module.exports = {
  roots: [path.resolve('src')],
  rootDir: path.resolve(__dirname),
  testEnvironment: 'node',
  testMatch: ['**/src/tests/**/*.test.js'],
  moduleDirectories: [
    'node_modules',
    __dirname,
    path.join(__dirname, './src'),
  ],
  coverageDirectory: path.join(__dirname, '../coverage/collective'),
  collectCoverageFrom: ['**/src/**/*.js'],
  coveragePathIgnorePatterns: ['**/src/tests/**/*.test.js'],
  setupFilesAfterEnv: [require.resolve('./src/tests/pretest.js')]
}
