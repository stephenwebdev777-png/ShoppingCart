/* eslint-disable no-undef */
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { MemoryRouter } from "react-router-dom";
import LoginSignup from "./LoginSignup";

const localStorageMock = (() => {
  let store = {};
  return {
    getItem: vi.fn((key) => store[key] || null),
    setItem: vi.fn((key, value) => {
      store[key] = value;
    }),
    clear: vi.fn(() => {
      store = {};
    }),
    removeItem: vi.fn((key) => {
      delete store[key];
    }),
  };
})();

Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});
const mockReplace = vi.fn();  //navigate to either login or signup
Object.defineProperty(window, "location", { //instead of window.location.replace() used mockreplace
  value: { replace: mockReplace },
  writable: true,
});

describe("LoginSignup Component", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();

    global.fetch = vi.fn();

    vi.spyOn(window, "alert").mockImplementation(() => {});
  });

  const renderComponent = (mode = "login") => {
    return render(
      <MemoryRouter>
        <LoginSignup mode={mode} />
      </MemoryRouter> //history of navigation
    );
  };

  it("successful login redirects user to home and sets localStorage", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        token: "fake-token",
        role: "user",
      }),
    });
    renderComponent("login");
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { name: "email", value: "test@user.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: "password", value: "password123" },
    });

    fireEvent.click(screen.getByRole("button", { name: /continue/i }));

    await waitFor(() => {
      expect(localStorage.getItem("auth-token")).toBe("fake-token");
    });

    expect(mockReplace).toHaveBeenCalledWith("/");
  });

it("admin login redirects to admin dashboard", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({
      success: true,
      token: "admin-token",
      role: "admin",
    }),
  });

  renderComponent("login");
  fireEvent.change(screen.getByPlaceholderText(/email address/i), {
    target: { name: "email", value: "admin@test.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { name: "password", value: "admin123" },
  });

  fireEvent.click(screen.getByRole("button", { name: /continue/i }));

  await waitFor(() => {
    expect(mockReplace).toHaveBeenCalledWith("/admin/addproduct");
  });
});

  it("switches to signup mode and renders name field", () => {
    renderComponent("login");
    fireEvent.click(screen.getByText(/click here/i));
    expect(
      screen.getByRole("heading", { name: /sign up/i })
    ).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/your name/i)).toBeInTheDocument();
  });

it("successful signup alerts user and switches to login view", async () => {
  global.fetch.mockResolvedValueOnce({
    ok: true,
    json: async () => ({ success: true }),
  });

  renderComponent("signup");
  fireEvent.change(screen.getByPlaceholderText(/your name/i), {
    target: { name: "username", value: "Kiru" },
  });
  fireEvent.change(screen.getByPlaceholderText(/email address/i), {
    target: { name: "email", value: "kiru@gmail.com" },
  });
  fireEvent.change(screen.getByPlaceholderText(/password/i), {
    target: { name: "password", value: "password123" },
  });
  fireEvent.click(screen.getByRole("button", { name: /continue/i }));

  await waitFor(() => {
    expect(window.alert).toHaveBeenCalledWith(
      "Account created successfully! Please login to continue."
    );

    expect(
      screen.getByRole("heading", { name: /login/i })
    ).toBeInTheDocument();
  });
});

  it("forgot password mode sends reset link correctly", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    renderComponent("login");

    fireEvent.click(screen.getByText(/forgot password\?/i));
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { name: "email", value: "reset@test.com" },
    });

    fireEvent.click(
      screen.getByRole("button", { name: /send reset link/i })
    );

    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith(
        "Reset link sent! Please check your Mailtrap inbox."
      );

      expect(
        screen.getByRole("heading", { name: /login/i })
      ).toBeInTheDocument();
    });
  });

 it("shows error alert on failed login", async () => {
    global.fetch.mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: false,
        errors: "Invalid Credentials",
      }),
    });

    renderComponent("login");
    fireEvent.change(screen.getByPlaceholderText(/email address/i), {
      target: { name: "email", value: "wrong@user.com" },
    });

    fireEvent.change(screen.getByPlaceholderText(/password/i), {
      target: { name: "password", value: "wrongpassword" },
    });
    fireEvent.click(screen.getByRole("button", { name: /continue/i }));
    await waitFor(() => {
      expect(window.alert).toHaveBeenCalledWith("Invalid Credentials");
    });
  });
});
