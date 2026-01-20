import { render, screen, fireEvent,waitFor} from '@testing-library/react';
import Addproduct from './Addproduct';
import { vi, expect, test, describe ,beforeEach} from 'vitest';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

const mockStore = configureStore({
  reducer: {
    shop: () => ({ all_product: [], loading: false }), 
  }
});

describe('Addproduct Admin Logic', () => {
  beforeEach(() => {  
    vi.stubGlobal('localStorage', {
      getItem: vi.fn(),
      setItem: vi.fn(),
      removeItem: vi.fn(),
      clear: vi.fn(),
    });
    vi.stubGlobal('fetch', vi.fn());
    vi.clearAllMocks();
  });
  
  const renderWithProviders = (component) => {
    return render(
      <Provider store={mockStore}>
        <BrowserRouter>
          {component}
        </BrowserRouter>
      </Provider>
    );
  };

  test('updates text inputs correctly', () => {
    renderWithProviders(<Addproduct />);
    const nameInputs = screen.getAllByPlaceholderText(/Type here/i);
    fireEvent.change(nameInputs[0], { target: { value: 'New Winter Boots' } });
    expect(nameInputs[0].value).toBe('New Winter Boots');
  });
  test('toggles between file upload and URL input', () => {
    renderWithProviders(<Addproduct />);
    const toggleBtn = screen.getByText(/Switch to Image URL/i);
    fireEvent.click(toggleBtn);
    expect(screen.getByPlaceholderText(/Paste permanent Image URL/i)).toBeInTheDocument();
  });

  test('allows category selection change', () => {
    renderWithProviders(<Addproduct />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'women' } });
    expect(select.value).toBe('women');
  });

  test('prevents submission if not logged in as admin', () => {
    window.alert = vi.fn();
    localStorage.clear();
    renderWithProviders(<Addproduct />);
    
    const addButton = screen.getByRole('button', { name: /ADD/i });
    fireEvent.click(addButton);
    
    expect(window.alert).toHaveBeenCalledWith("Please log in as admin.");
  });
  test('successfully adds product using image URL', async () => {
    window.alert = vi.fn();
    localStorage.getItem.mockReturnValue("fake-token");
    
    fetch.mockResolvedValueOnce({
      json: () => Promise.resolve({ success: true }),
    });

    renderWithProviders(<Addproduct />);
    
    fireEvent.click(screen.getByText(/Switch to Image URL/i));

    const inputs = screen.getAllByPlaceholderText(/Type Here/i);
    fireEvent.change(inputs[0], { target: { name: 'name', value: 'Test Shirt' } });
    fireEvent.change(screen.getByPlaceholderText(/Paste permanent Image URL/i), { target: { name: 'image', value: 'test.com/img.jpg' } });

    fireEvent.click(screen.getByRole('button', { name: /ADD/i }));

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Product Added Successfully");
    });
  });
});