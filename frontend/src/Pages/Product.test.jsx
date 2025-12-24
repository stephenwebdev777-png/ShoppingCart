/* eslint-disable no-undef */
import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import React from "react";
import { MemoryRouter, Routes, Route } from "react-router-dom";
import Product from "./Product";

vi.mock("../Components/Breadcrums/Breadcrum", () => ({
  default: () => <div data-testid="breadcrum">Breadcrum</div>,
}));
vi.mock("../Components/ProductDisplay/ProductDisplay", () => ({
  default: ({ product }) => (
    <div data-testid="product-display">{product.name}</div>
  ),
}));

describe("Product Page Component", () => {
  beforeEach(() => {
    //Resets call counts
    vi.clearAllMocks();

    const localStorageMock = {
      getItem: vi.fn().mockReturnValue("fake-token"),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    };
    vi.stubGlobal("localStorage", localStorageMock);
    global.fetch = vi.fn();
  });

  it("renders product correctly after loading", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 12,
        name: "Classic Jacket",
        category: "men",
      }),
    });

    render(
      <MemoryRouter initialEntries={["/mens/12"]}>
        <Routes>
          <Route path="/:category/:productId" element={<Product />} />
          <Route
            path="/login"
            element={<div data-testid="login-page">Login Page</div>}
          />
        </Routes>
      </MemoryRouter>
    );

    const productDisplay = await screen.findByTestId(
      "product-display",{},{ timeout: 5000 }
    );

    expect(productDisplay).toBeInTheDocument();
    expect(screen.getByText("Classic Jacket")).toBeInTheDocument(); //getByText-element must exist
    expect(screen.queryByTestId("login-page")).not.toBeInTheDocument(); //queryByTestId-element might not exist
  });

  it("shows 404 error when the product category doesn't match the URL", async () => {
    global.fetch.mockResolvedValue({
      ok: true,
      json: async () => ({
        id: 12,
        name: "Classic Jacket",
        category: "men",
      }),
    });

    render(
      <MemoryRouter initialEntries={["/womens/12"]}>
        <Routes>
          <Route path="/:category/:productId" element={<Product />} />
        </Routes>
      </MemoryRouter>
    );

    const errorMsg = await screen.findByText(
      /This Shopper page can't be found/i,
      {},
      { timeout: 4000 }
    );
    expect(errorMsg).toBeInTheDocument();
  });
});
