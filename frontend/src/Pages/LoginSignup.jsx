/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import "./CSS/LoginSignup.css";
import shopper_logo from "../Assets/logo_big.png";

const SimpleHeader = () => (
  <div
    className="loginsignup-header"
    style={{
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      padding: "20px 0",
      backgroundColor: "#fff",
      borderBottom: "1px solid #eee",
    }}
  >
    <Link
      to="/"
      style={{
        textDecoration: "none",
        display: "flex",
        alignItems: "center",
        color: "#ff4141",
      }}
    >
      <img
        src={shopper_logo}
        alt="Shopper Logo"
        style={{ height: "40px", marginRight: "10px" }}
      />
      <p style={{ fontSize: "28px", fontWeight: "bold", margin: 0 }}>SHOPPER</p>
    </Link>
  </div>
);

const LoginSignup = ({ mode }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const API_BASE_URL = "http://localhost:3000";

  const [errorMsg, setErrorMsg] = useState("");
  const [resetMessage, setResetMessage] = useState("");
  const [modeState, setModeState] = useState(mode || "login");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const [forgotEmail, setForgotEmail] = useState("");

  // Clean up messages and handle redirects from ProtectedRoutes
  useEffect(() => {
    setErrorMsg("");
    setResetMessage("");
    if (mode) {
      setModeState(mode);
    }
    // If redirected from ProtectedRoute, show the message passed in state
    if (location.state?.message) {
      setErrorMsg(location.state.message);
    }
  }, [mode, location]);

  const changeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const login = async () => {
    if (!formData.email.trim() || !formData.password.trim()) {
      setErrorMsg("Enter email and password");
      return;
    }

    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth-token", data.token);

        const params = new URLSearchParams(window.location.search);
        const redirectPath = params.get("redirect");

        if (data.role === "admin") {
          window.location.replace("/admin");
        } else if (redirectPath) {
          window.location.replace(decodeURIComponent(redirectPath));
        } else {
          window.location.replace("/");
        }
      } else {
        setErrorMsg(data.message || "Invalid credentials");
      }
    } catch (err) {
      setErrorMsg("Something went wrong. Please check your server connection.");
    }
  };

  const signup = async () => {
    if (
      !formData.email.trim() ||
      !formData.password.trim() ||
      !formData.username.trim()
    ) {
      setErrorMsg("Please fill in all fields");
      return;
    }

    setErrorMsg("");
    try {
      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username.trim(),
          email: formData.email.trim(),
          password: formData.password,
        }),
      });
      const data = await response.json();
      if (data.success) {
        setResetMessage("Signup successful! Redirecting to login...");
        setFormData({ username: "", email: "", password: "" });
        setTimeout(() => navigate("/login"), 2000);
      } else {
        setErrorMsg(data.message || "Signup failed");
      }
    } catch (err) {
      setErrorMsg("Signup failed. Please try again.");
    }
  };

  const forgotPasswordHandler = async () => {
    if (!forgotEmail.trim()) {
      setErrorMsg("Please enter your email address.");
      return;
    }
    setErrorMsg("");
    setResetMessage("Sending password reset email...");

    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim() }),
      });
      const data = await response.json();

      if (data.success) {
        setResetMessage(
          "Success! Check your Mailtrap inbox for the reset link."
        );
      } else {
        setResetMessage("");
        setErrorMsg(data.message || "Failed to send reset email.");
      }
    } catch (err) {
      setResetMessage("");
      setErrorMsg("A network error occurred. Please try again.");
    }
  };

  const renderFormContent = () => {
    if (modeState === "forgot") {
      return (
        <div className="forgot-password-content">
          <h1>Reset Password</h1>
          <p
            style={{ marginBottom: "20px", color: "#5c5c5c", fontSize: "17px" }}
          >
            Enter your email address to receive a reset link.
          </p>
          <div className="loginsignup-fields">
            <input
              type="email"
              placeholder="Email Address"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </div>

          {errorMsg && (
            <p
              className="error-msg"
              style={{ color: "red", marginTop: "10px" }}
            >
              {errorMsg}
            </p>
          )}
          {resetMessage && (
            <p
              className="success-msg"
              style={{ color: "green", marginTop: "10px" }}
            >
              {resetMessage}
            </p>
          )}

          <button onClick={forgotPasswordHandler} style={{ marginTop: "20px" }}>
            Send Reset Link
          </button>

          <p
            onClick={() => navigate("/login")}
            style={{
              textAlign: "center",
              color: "#ff4141",
              cursor: "pointer",
              marginTop: "20px",
              fontWeight: "600",
              fontSize: "18px",
            }}
          >
            ← Back to Login
          </p>
        </div>
      );
    }
    return (
      <>
        <h1>{modeState === "login" ? "Sign In" : "Sign Up"}</h1>
        <div className="loginsignup-fields">
          {modeState === "signup" && (
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
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>

        {errorMsg && (
          <p className="error-msg" style={{ color: "red", marginTop: "10px" }}>
            {errorMsg}
          </p>
        )}
        {resetMessage && (
          <p
            className="success-msg"
            style={{ color: "green", marginTop: "10px" }}
          >
            {resetMessage}
          </p>
        )}

        <button onClick={() => (modeState === "login" ? login() : signup())}>
          Continue
        </button>

        {modeState === "login" && (
          <p
            onClick={() => navigate("/forgotpassword")}
            style={{
              textAlign: "right",
              marginTop: "15px",
              cursor: "pointer",
              color: "#007bff",
              fontSize: "16px",
              textDecoration: "underline",
            }}
          >
            Forgot Password?
          </p>
        )}

        <div className="loginsignup-login" style={{ marginTop: "20px" }}>
          {modeState === "login" ? (
            <p>
              Create an account?{" "}
              <span
                onClick={() => navigate("/signup")}
                style={{ color: "#ff4141", cursor: "pointer" }}
              >
                Click here
              </span>
            </p>
          ) : (
            <p>
              Already have an account?{" "}
              <span
                onClick={() => navigate("/login")}
                style={{ color: "#ff4141", cursor: "pointer" }}
              >
                Login here
              </span>
            </p>
          )}
        </div>
      </>
    );
  };

  return (
    <div className="loginsignup-page">
      {/* SimpleHeader included here; Ensure App.jsx hides the main Navbar on this route */}
      <SimpleHeader />
      <div
        className="loginsignup"
        style={{ paddingBottom: "100px", paddingTop: "50px" }}
      >
        <div
          className="loginsignup-container"
          style={{
            height: "auto",
            minHeight: modeState === "forgot" ? "400px" : "500px",
            paddingBottom: "40px",
          }}
        >
          {renderFormContent()}
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
