module.exports = {
  setupFiles: ['<rootDir>/.jest/setEnvVars.js'],
  modulePathIgnorePatterns: [
    '<rootDir>/config/',
    '<rootDir>/listener/__tests__/ip-addresses.test.js',
    '<rootDir>/admin/__tests__/healthcheck.test.js',
    '<rootDir>/admin/__tests__/version.test.js'
  ],
};
