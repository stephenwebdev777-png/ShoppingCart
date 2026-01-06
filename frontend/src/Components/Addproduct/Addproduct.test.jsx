import { render, screen, fireEvent } from '@testing-library/react';
import Addproduct from './Addproduct';
import { vi, expect, test, describe } from 'vitest';
//fireevent => user actions
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { BrowserRouter } from 'react-router-dom';

const mockStore = configureStore({
  reducer: {
    shop: () => ({ all_product: [], loading: false }), 
  }
});

describe('Addproduct Admin Logic', () => {
  
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
    
    const addButton = screen.getByRole('button', { name: /ADD/i });
    fireEvent.click(addButton);
    
    expect(window.alert).toHaveBeenCalledWith("Please log in as admin.");
  });
});