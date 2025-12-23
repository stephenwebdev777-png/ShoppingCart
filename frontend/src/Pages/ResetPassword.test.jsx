/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import ResetPassword from './ResetPassword';
import { vi, expect, test, beforeEach, describe } from 'vitest';

describe("ResetPassword", () => {
  beforeEach(() => {
    // Silences "Window's alert() not implemented"
    window.alert = vi.fn();
    vi.clearAllMocks();
  });

  test('sends correct password reset request', async () => {
    // Mock successful response
    global.fetch = vi.fn().mockResolvedValueOnce({ 
      json: () => Promise.resolve({ success: true, message: "Success" }) 
    });

    render(
      <MemoryRouter initialEntries={['/reset/12345']}>
        <Routes>
          <Route path="/reset/:token" element={<ResetPassword />} />
          {/* Mock the login route to prevent "No routes matched" error */}
          <Route path="/login" element={<div data-testid="login-page">Login Page</div>} />
        </Routes>
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText('New Password');
    fireEvent.change(input, { target: { value: 'newpassword123' } });

    const submitBtn = screen.getByRole('button', { name: /Reset Password/i });
    fireEvent.click(submitBtn);

    // Using waitFor handles the async state update (clears act warning)
    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith(expect.any(String), expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ token: '12345', newPassword: 'newpassword123' })
      }));
    });

    // Optional: Verify it actually redirected to the login page
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });
  });
});