/* eslint-disable no-undef */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Listproduct from "./Listproduct";
import { vi, expect, test, beforeEach, describe } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

// 1. Create a helper to generate a store with specific product data
const createMockStore = (products = []) => {
  return configureStore({
    reducer: {
      shop: () => ({
        all_product: products,
        loading: false,
      }),
    },
  });
};

describe("Listproduct Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    // 2. Mock Global Fetch
    global.fetch = vi.fn((url) => {
      if (url.includes("allproduct")) {
        return Promise.resolve({
          json: () =>
            Promise.resolve([
              {
                _id: "67890",
                id: 1,
                name: "Database Item",
                old_price: 150,
                new_price: 99,
                category: "men",
                image: "db.jpg",
              },
            ]),
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      });
    });

    // 3. Mock LocalStorage
    const mockToken = "mock-admin-token";
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn().mockReturnValue(mockToken),
        setItem: vi.fn(),
      },
      writable: true,
    });
  });

  test("fetches and displays product list", async () => {
    // We provide the product directly to the store so it renders immediately
    const store = createMockStore([
      {
        _id: "67890",
        id: 1,
        name: "Database Item",
        old_price: 150,
        new_price: 99,
        category: "men",
        image: "db.jpg",
      },
    ]);

    render(
      <Provider store={store}>
        <Listproduct />
      </Provider>
    );

    // Use findByText (which is async) to wait for the item to appear
    const item = await screen.findByText("Database Item");
    expect(item).toBeInTheDocument();
  });

  test("sends POST request to remove product", async () => {
    const store = createMockStore([
      {
        _id: "67890",
        id: 1,
        name: "Database Item",
        old_price: 150,
        new_price: 99,
        category: "men",
        image: "db.jpg",
      },
    ]);

    const { container } = render(
      <Provider store={store}>
        <Listproduct />
      </Provider>
    );

    await screen.findByText("Database Item");

    // Find the cross icon/remove icon
    const removeIcon = container.querySelector(".listproduct-remove-icon");
    fireEvent.click(removeIcon);

    await waitFor(() => {
      const calls = vi.mocked(fetch).mock.calls;
      const removeCall = calls.find((call) =>
        call[0].includes("removeproduct")
      );
      expect(removeCall).toBeDefined();
    });
  });
});
