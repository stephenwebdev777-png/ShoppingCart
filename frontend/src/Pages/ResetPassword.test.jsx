/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";//runs setup before each test(beforeEach)
import React from "react";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import ResetPassword from "./ResetPassword";

const mockNavigate = vi.fn();  //spy function for useNavigate
vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
    useParams: () => ({ token: "test-token-123" }),
  };
});

global.fetch = vi.fn();
global.alert = vi.fn();

describe("ResetPassword Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders the Reset Password form correctly", () => {
    render(
      //same as BrowserRouter
      <MemoryRouter>  
        <ResetPassword />
      </MemoryRouter>
    );

    expect(screen.getByPlaceholderText(/New Password/i)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /Reset Password/i })).toBeInTheDocument();
  });


  it("shows an alert if password is empty", async () => {
    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const button = screen.getByRole("button", { name: /Reset Password/i });
    fireEvent.click(button);

    expect(global.alert).toHaveBeenCalledWith("Please enter a new password");
  });

  it("calls fetch API and navigates to login on success", async () => {
   
    fetch.mockResolvedValueOnce({
      json: async () => ({ success: true, message: "Password updated successfully" }),
    });

    render(
      <MemoryRouter>
        <ResetPassword />
      </MemoryRouter>
    );

    const input = screen.getByPlaceholderText(/New Password/i);
    const button = screen.getByRole("button", { name: /Reset Password/i });

    fireEvent.change(input, { target: { value: "securePass123" } });
    fireEvent.click(button);

    await waitFor(() => {
      expect(fetch).toHaveBeenCalledWith("http://localhost:3000/resetpassword", expect.objectContaining({
        method: "POST",
        body: JSON.stringify({ token: "test-token-123", newPassword: "securePass123" }),
      }));
    });

    expect(global.alert).toHaveBeenCalledWith("Password updated successfully");
    expect(mockNavigate).toHaveBeenCalledWith("/login");
  });
});