import { render, screen, fireEvent } from '@testing-library/react';
import Addproduct from './Addproduct';
import { vi, expect, test, describe } from 'vitest';

describe('Addproduct Admin Logic', () => {
 test('updates text inputs correctly', () => {
  render(<Addproduct />);
  const nameInputs = screen.getAllByPlaceholderText(/Type here/i);
  fireEvent.change(nameInputs[0], { target: { value: 'New Winter Boots' } });
  expect(nameInputs[0].value).toBe('New Winter Boots');
});

  test('allows category selection change', () => {
    render(<Addproduct />);
    const select = screen.getByRole('combobox');
    fireEvent.change(select, { target: { value: 'women' } });
    expect(select.value).toBe('women');
  });

  test('prevents submission if not logged in as admin', () => {
    window.alert = vi.fn();
    localStorage.clear();
    render(<Addproduct />);
    fireEvent.click(screen.getByText('ADD'));
    expect(window.alert).toHaveBeenCalledWith("Please log in as admin.");
  });
});