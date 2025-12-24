/* eslint-disable no-undef */
import '@testing-library/jest-dom';  //Extends Vitest’s expect like expect(button).toBeDisabled()
import { vi } from 'vitest';

window.scrollTo = vi.fn();

const localStorageMock = {
  getItem: vi.fn(),   // mock (fake) function.
  setItem: vi.fn(),  // spy on an existing real function.(vi.spyOn)
  clear: vi.fn(),  // reset mocks
};
global.localStorage = localStorageMock;