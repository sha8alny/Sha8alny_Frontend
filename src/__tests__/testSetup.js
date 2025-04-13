// src/__tests__/testSetup.js
import { cleanup } from '@testing-library/react';

// Setup global mocks or test environment

// Reset all mocks after each test
afterEach(() => {
  jest.clearAllTimers();
  jest.clearAllMocks();
  jest.resetModules();
  cleanup(); // React Testing Library cleanup
  
  // Reset any global state or variables that might affect tests
  // For example:
  // window.localStorage.clear();
  // window.sessionStorage.clear();
  // document.cookie = '';
});

// For tests that need to mock the window size
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation(query => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock IntersectionObserver
global.IntersectionObserver = class IntersectionObserver {
  constructor(callback) {
    this.callback = callback;
  }
  disconnect() {
    return null;
  }
  observe() {
    return null;
  }
  unobserve() {
    return null;
  }
};