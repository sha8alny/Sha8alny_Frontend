const nextJest = require('next/jest')

/** @type {import('jest').Config} */
const createJestConfig = nextJest({
  dir: './',
})

const config = {
  coverageProvider: 'v8',
  testEnvironment: 'jsdom',
  transform: {
    "^.+\\.(js|jsx)$": "babel-jest"
  },
  collectCoverage: true,
  coveragePathIgnorePatterns: [
    "/node_modules/",
    "/dist/",
    "/coverage/",
    "/src/utils/",
    "/src/app/services/",
  ],
  // setupFilesAfterEnv: ['<rootDir>/jest.setup.ts'],
  detectOpenHandles: true,
}

module.exports = createJestConfig(config)