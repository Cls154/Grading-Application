import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/vue';

// Cleanup after each test to prevent memory leaks
afterEach(() => {
  cleanup();
  vi.restoreAllMocks(); // Reset mocks
});