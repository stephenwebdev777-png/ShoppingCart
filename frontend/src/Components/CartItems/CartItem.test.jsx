import { render, screen, fireEvent } from "@testing-library/react";
import { ShopContext } from "../../Context/ShopContext";
import CartItem from "./CartItem";
import { BrowserRouter } from "react-router-dom";
import { vi, expect, test, describe } from "vitest";

const mockContext = {
  all_product: [
    { id: 1, name: "Premium Jacket", new_price: 100, image: "img.jpg" },
  ],
  cartItems: [{ key: "1_S", quantity: 2 }],
  getTotalCartAmount: () => 200,
  removeFromCart: vi.fn(),
  addToCart: vi.fn(),
  deleteFromCart: vi.fn(), 
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
    expect(screen.getByText(/Premium Jacket/i)).toBeInTheDocument();

    expect(screen.getByText("2")).toBeInTheDocument();

    expect(screen.getAllByText(/200/).length).toBeGreaterThan(0);
  });

  test("calls deleteFromCart with the correct key when the remove icon is clicked", () => {
    render(
      <BrowserRouter>
        <ShopContext.Provider value={mockContext}>
          <CartItem />
        </ShopContext.Provider>
      </BrowserRouter>
    );

    const removeIcon = screen.getByAltText("remove");
    fireEvent.click(removeIcon);
    expect(mockContext.deleteFromCart).toHaveBeenCalledWith("1_S");
  });

  test("calls removeFromCart when the minus button is clicked", () => {
    render(
      <BrowserRouter>
        <ShopContext.Provider value={mockContext}>
          <CartItem />
        </ShopContext.Provider>
      </BrowserRouter>
    );

    const minusBtn = screen.getByText("-");
    fireEvent.click(minusBtn);

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
