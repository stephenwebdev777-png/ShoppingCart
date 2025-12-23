/* eslint-disable no-undef */
import '@testing-library/jest-dom';
import { vi } from 'vitest';

// Mocking window.scrollTo since your Item.jsx uses it
window.scrollTo = vi.fn();

// Mocking localStorage for auth-token logic
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
};
global.localStorage = localStorageMock;