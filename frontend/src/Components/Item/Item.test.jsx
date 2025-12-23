import { render, screen } from '@testing-library/react';
import Item from './Item';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, describe } from 'vitest';

describe('Individual Item Component', () => {
  const props = { id: 5, name: "Summer Dress", new_price: 45, old_price: 60, image: "dress.jpg" };

  test('renders image and price correctly', () => {
    render(
      <BrowserRouter>
        <Item {...props} />
      </BrowserRouter>
    );
    const img = screen.getByRole('img');
    expect(img).toHaveAttribute('src', 'dress.jpg');
    expect(screen.getByText(/45/)).toBeInTheDocument();
  });

  test('creates the correct dynamic link based on product ID', () => {
    render(
      <BrowserRouter>
        <Item {...props} />
      </BrowserRouter>
    );
    const link = screen.getByRole('link');
    // Checks if the link leads to product 5
    expect(link).toHaveAttribute('href', expect.stringContaining('/product/5'));
  });
});