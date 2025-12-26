import { render, screen, fireEvent } from "@testing-library/react";
import { ShopContext } from "../../Context/ShopContext";
import CartItem from "./CartItem";
import { BrowserRouter } from "react-router-dom";
import { vi, expect, test, describe } from "vitest";

const mockContext = {
  all_product: [
    { id: 1, name: "Premium Jacket", new_price: 100, image: "img.jpg" },
  ],
  // FIX 1: cartItems must be an array for .filter() and use the correct key format "id_size"
  cartItems: [{ key: "1_S", quantity: 2 }],
  getTotalCartAmount: () => 200,
  removeFromCart: vi.fn(),
  addToCart: vi.fn(),
};

describe("CartItem Component", () => {
  test("renders cart items and handles quantity math", () => {
    render(
      <BrowserRouter>
        <ShopContext.Provider value={mockContext}>
          <CartItem />
        </ShopContext.Provider>
      </BrowserRouter>
    );

    // FIX 2: Use a Regex to match "Premium Jacket" even if it has (S) next to it
    expect(screen.getByText(/Premium Jacket/i)).toBeInTheDocument();

    // Verify Quantity
    expect(screen.getByText("2")).toBeInTheDocument();

    // Verify Totals
    expect(screen.getAllByText(/200/).length).toBeGreaterThan(0);
  });

  test("calls removeFromCart with the correct key when delete icon is clicked", () => {
    render(
      <BrowserRouter>
        <ShopContext.Provider value={mockContext}>
          <CartItem />
        </ShopContext.Provider>
      </BrowserRouter>
    );
    const removeIcon = screen.getByAltText("remove");
    fireEvent.click(removeIcon);

    expect(mockContext.removeFromCart).toHaveBeenCalledWith("1_S");
  });

  test("shows alert if checkout is clicked without auth token", () => {
    window.alert = vi.fn();
    localStorage.clear();

    render(
      <BrowserRouter>
        <ShopContext.Provider value={mockContext}>
          <CartItem />
        </ShopContext.Provider>
      </BrowserRouter>
    );

    const checkoutBtn = screen.getByText("PROCEED TO CHECKOUT");
    fireEvent.click(checkoutBtn);

    expect(window.alert).toHaveBeenCalledWith(
      "Please login to proceed to checkout."
    );
  });
});
