// filepath: c:\Users\Hussein Essam\OneDrive\Desktop\Senior-1B\Mats\Software\Repo\sha8alny_frontend\jest.config.js
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
}

module.exports = createJestConfig(config)