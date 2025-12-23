import { render, screen } from '@testing-library/react';
import Proceed from './Proceed';
import { BrowserRouter } from 'react-router-dom';
import { expect, test } from 'vitest';

test('renders payment options in proceed page', () => {
  render(
    <BrowserRouter>
      <Proceed />
    </BrowserRouter>
  );

  expect(screen.getByText(/Payment Method/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Place Order/i })).toBeInTheDocument();
});