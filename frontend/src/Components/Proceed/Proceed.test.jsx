import { render, screen, fireEvent } from '@testing-library/react';
import Proceed from './Proceed';
import { BrowserRouter } from 'react-router-dom';
import { expect, test, vi, beforeEach, describe } from 'vitest';

describe('Proceed Component', () => {
  beforeEach(() => {
    vi.stubGlobal('localStorage', {
      getItem: vi.fn().mockReturnValue("valid-token"),
    });
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      json: () => Promise.resolve({ success: true, username: "Kiruthika" }),
    }));

    vi.clearAllMocks();
  });

  test('renders payment options and handles address edit', async () => {
    render(<BrowserRouter><Proceed /></BrowserRouter>);

    expect(screen.getByText(/Payment Method/i)).toBeInTheDocument();
    
    const changeBtn = screen.getByText(/Change Address/i);
    fireEvent.click(changeBtn);
    
    const textarea = screen.getByRole('textbox');
    fireEvent.change(textarea, { target: { value: 'New Test Address' } });
    fireEvent.click(screen.getByText(/Confirm/i));
    
    expect(screen.getByText('New Test Address')).toBeInTheDocument();
  });

  test('shows success banner when order is placed', async () => {
    render(<BrowserRouter><Proceed /></BrowserRouter>);

    const codOption = screen.getByLabelText(/Cash on Delivery/i);
    fireEvent.click(codOption);

    const placeBtn = screen.getByRole('button', { name: /PLACE ORDER NOW/i });
    fireEvent.click(placeBtn);
    expect(await screen.findByText(/Order Placed Successfully!/i)).toBeInTheDocument();
  });

  test('shows login popup if token is missing or expired', async () => {
    localStorage.getItem.mockReturnValue(null);
    
    render(<BrowserRouter><Proceed /></BrowserRouter>);
    
    expect(screen.getByText(/Login Required/i)).toBeInTheDocument();
    expect(screen.getByText(/You must be logged in to proceed to checkout/i)).toBeInTheDocument();
  });
});