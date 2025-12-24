import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";

import ShopCategory from "./ShopCategory";
import { ShopContext } from "../Context/ShopContext";

const mockProducts = [
  { id: 1, name: "Product A", category: "men", image: "img1.jpg", new_price: 50, old_price: 80 },
  { id: 2, name: "Product B", category: "men", image: "img2.jpg", new_price: 30, old_price: 50 },
  { id: 3, name: "Product C", category: "women", image: "img3.jpg", new_price: 100, old_price: 150 },
];

//test-id used by React Testing Library
vi.mock("../Components/Item/Item", () => ({
  default: ({ name, new_price }) => (
     <div data-testid="product-item"> 
      <span>{name}</span>
      <span data-testid="price-value">{new_price}</span>
    </div>
  ),
}));

const renderWithContext = (props) => {
  return render(
    <ShopContext.Provider value={{ all_product: mockProducts }}>
      <ShopCategory {...props} />
    </ShopContext.Provider>
  );
};

describe("ShopCategory Component", () => {
  const defaultProps = {
    category: "men",
    banner: "men-banner.png",
  };

  it("renders the correct banner image", () => {
    const { container } = renderWithContext(defaultProps);
    // Use querySelector (css )
    const banner = container.querySelector(".shopcategory-banner");
    expect(banner).toBeInTheDocument();
    expect(banner).toHaveAttribute("src", "men-banner.png");
  });

  it("filters products based on category", () => {
    renderWithContext(defaultProps);
    const items = screen.getAllByTestId("product-item");  //data-testid 
    expect(items).toHaveLength(2);
    expect(screen.getByText("Product A")).toBeInTheDocument();
  });

  it("sorts products by price: Low to High", () => {
    renderWithContext(defaultProps);
    const select = screen.getByRole("combobox");
    
    //firevent-user changing the value of an input
    fireEvent.change(select, { target: { value: "low-high" } });

    // Using data-testid instead of ClassName
    const prices = screen.getAllByTestId("price-value");
    expect(prices[0].textContent).toBe("30"); 
    expect(prices[1].textContent).toBe("50");
  });

  it("sorts products by price: High to Low", () => {
    renderWithContext(defaultProps);
    const select = screen.getByRole("combobox");
    
    //firevent-user changing the value of an input
    fireEvent.change(select, { target: { value: "high-low" } });  
    const prices = screen.getAllByTestId("price-value");
    expect(prices[0].textContent).toBe("50");
    expect(prices[1].textContent).toBe("30");
  });

  it("displays the delivery date text", () => {
    renderWithContext(defaultProps);
    //vary in capital letters - (i) case insensitive 
    const deliveryInfo = screen.getAllByText(/Free Delivery/i);   
    expect(deliveryInfo.length).toBeGreaterThan(0);
  });
});