/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "./CSS/LoginSignup.css";

const LoginSignup = ({ mode }) => {
  // Use Environment Variable for the API URL
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const [state, setState] = useState(mode || "login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);
  const redirectPath = queryParams.get("redirect") || "/";

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendResetLink = async () => {
    if (!formData.email) {
      alert("Please enter your email address");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgotpassword`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ email: formData.email }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `Server Error: ${response.status}`
        );
      }

      const data = await response.json();
      if (data.success) {
        alert("Reset link sent! Please check your Mailtrap inbox.");
        setState("login");
      }
    } catch (error) {
      console.error("Forgot Password Error:", error);
      alert(`Error: ${error.message}`);
    }
  };
  const login = async () => {
    if (!formData.email || !formData.password) {
      alert("Please fill in both Email and Password fields.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        localStorage.setItem("user-role", data.role);

        if (data.role === "admin") {
          window.location.replace("/admin/addproduct");
        } else {
          window.location.replace(redirectPath);
        }
      } else {
        alert(data.errors || "Login Failed");
      }
    } catch (error) {
      alert("Error connecting to the server.");
    }
  };

  const signup = async () => {
    if (!formData.username || !formData.email || !formData.password) {
      alert("All fields are required for Sign Up.");
      return;
    }
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
      const responseData = await response.json();

      if (responseData.success) {
        alert("Account created successfully! Please login to continue.");
        setState("login");
        setFormData({ ...formData, password: "" });
      } else {
        alert(responseData.message || "Signup failed");
      }
    } catch (error) {
      alert("Error connecting to the server.");
    }
  };

  return (
    <div className="loginsignup">
      <div className="loginsignup-logo-top">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="nav-logo">
            <img src="/logo.png" alt="logo" />
            <p>SHOPPER</p>
          </div>
        </Link>
      </div>

      <div className="loginsignup-container">
        <h1>
          {state === "signup"
            ? "Sign Up"
            : state === "forgot"
            ? "Reset Password"
            : "Login"}
        </h1>

        <div className="loginsignup-fields">
          {state === "signup" && (
            <input
              name="username"
              value={formData.username}
              onChange={changeHandler}
              type="text"
              placeholder="Your Name"
            />
          )}
          <input
            name="email"
            value={formData.email}
            onChange={changeHandler}
            type="email"
            placeholder="Email Address"
          />
          {state !== "forgot" && (
            <input
              name="password"
              value={formData.password}
              onChange={changeHandler}
              type="password"
              placeholder="Password"
            />
          )}
        </div>

        {state === "login" && (
          <div style={{ textAlign: "right", marginTop: "10px" }}>
            <span
              onClick={() => setState("forgot")}
              style={{
                color: "#ff4141",
                cursor: "pointer",
                fontWeight: "600",
                fontSize: "18px",
              }}
            >
              Forgot Password?
            </span>
          </div>
        )}

        <button
          onClick={() => {
            if (state === "login") login();
            else if (state === "signup") signup();
            else sendResetLink();
          }}
        >
          {state === "forgot" ? "Send Reset Link" : "Continue"}
        </button>

        <div className="loginsignup-login">
          {state === "forgot" ? (
            <p>
              Remembered your password?{" "}
              <span onClick={() => setState("login")}>Login here</span>
            </p>
          ) : state === "signup" ? (
            <p>
              Already have an account?{" "}
              <span onClick={() => setState("login")}>Login here</span>
            </p>
          ) : (
            <p>
              Create an account?{" "}
              <span onClick={() => setState("signup")}>Click here</span>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
