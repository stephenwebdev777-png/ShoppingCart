import { render, screen, fireEvent } from '@testing-library/react';
import { ShopContext } from '../Context/ShopContext';
import ShopCategory from './ShopCategory';
import { BrowserRouter } from 'react-router-dom';
import { expect, test } from 'vitest';

const mockContext = {
  all_product: [
    { id: 1, name: "Cheap Shirt", category: "mens", new_price: 10, old_price: 20 },
    { id: 2, name: "Expensive Shirt", category: "mens", new_price: 100, old_price: 200 }
  ]
};

test('filters and sorts products by price', () => {
  render(
    <BrowserRouter>
      <ShopContext.Provider value={mockContext}>
        <ShopCategory category="mens" banner="test.jpg" />
      </ShopContext.Provider>
    </BrowserRouter>
  );

  // 1. Change the Sort Dropdown to High to Low
  const select = screen.getByRole('combobox');
  fireEvent.change(select, { target: { value: 'high-low' } });

  // 2. Target the product names specifically.
  // We look for paragraphs that ARE NOT "Explore Products" or "Free Delivery"
  const allParagraphs = screen.getAllByRole('paragraph');
  
  const productNames = allParagraphs
    .map(p => p.textContent.trim())
    .filter(text => 
      text !== "Explore Products" && 
      !text.includes("Free Delivery") &&
      text !== ""
    );

  // 3. Verify that the expensive item is now first in the list
  expect(productNames[0]).toBe('Expensive Shirt');
  expect(productNames[1]).toBe('Cheap Shirt');
});