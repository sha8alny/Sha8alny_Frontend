import '@testing-library/jest-dom/extend-expect';
module.exports = {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Ensure this line is present
    testEnvironment: 'jest-environment-jsdom',
  };
  