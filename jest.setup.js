import '@testing-library/jest-dom/extend-expect';

export default {
    setupFilesAfterEnv: ['<rootDir>/jest.setup.js'], // Ensure this line is present
    testEnvironment: 'jest-environment-jsdom',
    afterEach: () => {
        jest.clearAllTimers();
    },
};

// jest.setup.js
import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';

// Mock Next.js router
jest.mock('next/router', () => ({
  useRouter: jest.fn().mockReturnValue({
    query: {},
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    pathname: '/',
  }),
}));

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter: jest.fn().mockReturnValue({
    push: jest.fn(),
    replace: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
    prefetch: jest.fn(),
  }),
  usePathname: jest.fn().mockReturnValue('/'),
  useSearchParams: jest.fn().mockReturnValue(new URLSearchParams()),
}));

// Cleanup after each test
afterEach(() => {
  cleanup();
});