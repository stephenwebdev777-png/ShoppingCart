import { render, screen, fireEvent } from '@testing-library/react';
import Addproduct from './Addproduct';
import { vi, expect, test, describe } from 'vitest';

// NEW: Import Redux and Router providers
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

// Create a mock store for testing
const mockStore = configureStore({
  reducer: {
    shop: () => ({ all_product: [], loading: false }), // Mocking your shop slice
  }
});

describe('Addproduct Admin Logic', () => {
  
  // Helper function to wrap component with necessary providers
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
    
    // Using getAllByText because 'ADD' might appear in buttons or text
    const addButton = screen.getByRole('button', { name: /ADD/i });
    fireEvent.click(addButton);
    
    expect(window.alert).toHaveBeenCalledWith("Please log in as admin.");
  });
});