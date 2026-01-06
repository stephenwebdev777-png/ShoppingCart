/* eslint-disable no-undef */
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import Listproduct from "./Listproduct";
import { vi, expect, test, beforeEach, describe } from "vitest";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";

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
  const mockProduct = {
    _id: "67890",
    id: 1,
    name: "Database Item",
    old_price: 150,
    new_price: 99,
    category: "men",
    image: "db.jpg",
  };

  beforeEach(() => {
    vi.clearAllMocks(); //clean mocks for every test

    global.fetch = vi.fn((url) => {
      if (url.includes("allproduct")) {
        return Promise.resolve({
          json: () => Promise.resolve([mockProduct]),
        });
      }
      return Promise.resolve({
        json: () => Promise.resolve({ success: true }),
      });
    });
    const mockToken = "mock-admin-token";
    Object.defineProperty(window, "localStorage", {
      value: {
        getItem: vi.fn().mockReturnValue(mockToken),
      },
      writable: true,
    });

    window.confirm = vi.fn(() => true);
  });

  test("enters edit mode when 'Edit' button is clicked", async () => {
    const store = createMockStore([mockProduct]);

    render(
      <Provider store={store}>
        <Listproduct />
      </Provider>
    );
    const editBtn = await screen.findByText("Edit");
    fireEvent.click(editBtn);

    const nameInput = screen.getByDisplayValue("Database Item");
    expect(nameInput).toBeInTheDocument();
    expect(nameInput.tagName).toBe("INPUT");

    expect(screen.getByText("Save")).toBeInTheDocument();
  });

  test("sends POST request to updateproduct when 'Save' is clicked", async () => {
    const store = createMockStore([mockProduct]);

    render(
      <Provider store={store}>
        <Listproduct />
      </Provider>
    );

    fireEvent.click(await screen.findByText("Edit"));

    const nameInput = screen.getByDisplayValue("Database Item");
    fireEvent.change(nameInput, { target: { value: "Updated Item Name", name: "name" } });

    const saveBtn = screen.getByText("Save");
    fireEvent.click(saveBtn);

    await waitFor(() => {
      const calls = vi.mocked(fetch).mock.calls;
      const updateCall = calls.find((call) => call[0].includes("updateproduct"));
      
      expect(updateCall).toBeDefined();
    
      const requestBody = JSON.parse(updateCall[1].body);
      expect(requestBody.name).toBe("Updated Item Name");
      expect(requestBody.id).toBe(1);
    });
  });

  test("sends POST request to removeproduct after confirmation", async () => {
    const store = createMockStore([mockProduct]);

    const { container } = render(
      <Provider store={store}>
        <Listproduct />
      </Provider>
    );

    await screen.findByText("Database Item");

    const removeIcon = container.querySelector(".listproduct-remove-icon");
    fireEvent.click(removeIcon);

    expect(window.confirm).toHaveBeenCalled();

    await waitFor(() => {
      const calls = vi.mocked(fetch).mock.calls;
      const removeCall = calls.find((call) => call[0].includes("removeproduct"));
      expect(removeCall).toBeDefined();
    });
  });
});