/* eslint-disable no-undef */
import { render, screen, waitFor } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import Product from './Product';
import { vi } from 'vitest';

test('shows 404 error if category is mismatched', async () => {
  global.fetch = vi.fn(() =>
    Promise.resolve({
      ok: true,
      json: () => Promise.resolve({ id: 1, category: "men" }),
    })
  );

  render(
    <MemoryRouter initialEntries={['/womens/product/1']}>
      <Product />
    </MemoryRouter>
  );

  await waitFor(() => {
    expect(screen.getByText(/This Shopper page can't be found/i)).toBeInTheDocument();
  });
});