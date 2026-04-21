// Jest setup file
import '@testing-library/jest-dom';

// Mock UUID to produce deterministic IDs for testing
let mockUuidCounter = 0;
jest.mock('uuid', () => ({
  v4: () => `test-uuid-${++mockUuidCounter}`,
}));

// Reset UUID counter before each test
beforeEach(() => {
  mockUuidCounter = 0;
});

// Mock window and document for tests that need them
Object.defineProperty(window, 'URL', {
  writable: true,
  value: {
    createObjectURL: jest.fn(() => 'blob:mock-url'),
    revokeObjectURL: jest.fn(),
  },
});
