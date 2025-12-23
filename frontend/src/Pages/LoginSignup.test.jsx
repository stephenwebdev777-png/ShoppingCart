/* eslint-disable no-undef */
import { render, screen, fireEvent } from '@testing-library/react';
import { expect, test, vi } from 'vitest';
import { BrowserRouter } from 'react-router-dom'; // 1. Import Router
import LoginSignup from './LoginSignup';

global.fetch = vi.fn();

test('should show reset link button when forgot password is clicked', () => {
  // 2. Wrap the component in BrowserRouter
  render(
    <BrowserRouter>
      <LoginSignup />
    </BrowserRouter>
  );

  const forgotPasswordLink = screen.getByText(/Forgot Password\?/i);
  fireEvent.click(forgotPasswordLink);

  const actionButton = screen.getByRole('button');
  expect(actionButton).toHaveTextContent('Send Reset Link');
});