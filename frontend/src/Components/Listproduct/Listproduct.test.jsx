/* eslint-disable no-undef */
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import Listproduct from './Listproduct';
import { vi, expect, test, beforeEach, describe } from 'vitest';

describe("Listproduct Component", () => {
  
  beforeEach(() => {
    vi.clearAllMocks();

    // 1. Setup fetch mock
    global.fetch = vi.fn((url) => {
      if (url.includes('allproduct')) {
        return Promise.resolve({
          json: () => Promise.resolve([
            { _id: "67890", id: 1, name: "Database Item", old_price: 150, new_price: 99, category: "men", image: "db.jpg" }
          ]),
        });
      }
      // Return success for removeproduct
      return Promise.resolve({ json: () => Promise.resolve({ success: true }) });
    });

    // 2. Robust localStorage mock
    const mockToken = "mock-admin-token";
    Object.defineProperty(window, 'localStorage', {
      value: {
        getItem: vi.fn().mockReturnValue(mockToken),
        setItem: vi.fn(),
      },
      writable: true
    });

    window.alert = vi.fn();
  });

  test('sends POST request to remove product when auth token exists', async () => {
    const { container } = render(<Listproduct />);

    // Wait for data to render
    await screen.findByText("Database Item");

    // Find the icon by class
    const removeIcon = container.querySelector('.listproduct-remove-icon');
    
    // Use fireEvent (no extra install needed)
    fireEvent.click(removeIcon);

    // Verify the removal call exists in the fetch history
    await waitFor(() => {
      const calls = vi.mocked(fetch).mock.calls;
      const removeCall = calls.find(call => call[0].includes('removeproduct'));

      expect(removeCall).toBeDefined();
      expect(removeCall[1]).toEqual(expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ id: 1 })
      }));
    });
  });

  test('fetches and displays product list', async () => {
    render(<Listproduct />);
    await waitFor(() => {
      expect(screen.getByText("Database Item")).toBeInTheDocument();
    });
  });
});