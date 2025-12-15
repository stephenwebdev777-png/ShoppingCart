import React, { useState } from "react";
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

  const [modeState, setModeState] = useState(
    mode === "signup" || location.pathname === "/signup" ? "signup" : "login"
  );
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [forgotEmail, setForgotEmail] = useState("");
  const [resetMessage, setResetMessage] = useState("");

  const changeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const formTitle =
    modeState === "login" || modeState === "forgot"
      ? "Sign in or Create account"
      : "Create Account";

  const login = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/login`, {
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
        setTimeout(() => window.location.reload(), 100);
        navigate(data.role === "admin" ? "/admin" : "/");
      } else {
        alert(data.errors || "Login failed");
      }
    } catch {
      alert("Login failed. Please try again.");
    }
  };

  const signup = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/signup`, {
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
        alert("Signup successful. Please log in now.");
        setFormData({ username: "", email: "", password: "" });
        setModeState("login");
        navigate("/login");
      } else {
        alert(data.errors || "Signup failed");
      }
    } catch {
      alert("Signup failed. Please try again.");
    }
  };

  const handleToggle = () => {
    const newMode = modeState === "login" ? "signup" : "login";
    setModeState(newMode);
    setResetMessage("");
    navigate(newMode === "signup" ? "/signup" : "/login");
  };

  const handleForgotToggle = () => {
    setModeState("forgot");
    setResetMessage("");
      navigate("/forgotpassword");
  };

  const handleBackToLogin = () => {
    setModeState("login");
    setResetMessage("");
    setForgotEmail("");
    navigate("/login");
  };

  const forgotPasswordHandler = async () => {
    if (!forgotEmail.trim()) {
      setResetMessage("Please enter your email address.");
      return;
    }
    setResetMessage("Sending password reset email...");
    try {
      const response = await fetch(`${API_BASE_URL}/forgotpassword`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: forgotEmail.trim()}),
      });
      const data = await response.json();
      setResetMessage(
        data.success
          ? data.message
          : data.errors || "Failed to send reset email."
      );
      if (data.success) {
        alert(
          "Success! Check your email for the password reset link (via Mailtrap)."
        );
      } else {
        alert("Error: " + (data.errors || "Could not process request."));
      }
    } catch {
      setResetMessage("A network error occurred. Please try again.");
      alert("A network error occurred. Please try again.");
    }
  };

  const renderFormContent = () => {
    if (modeState === "forgot") {
      return (
        <div className="forgot-password-content">
          <h1>Reset Password</h1>
          <p style={{ marginBottom: "20px", color: "#5c5c5c" }}>
            Enter the email address associated with your account to receive a
            reset link.
          </p>
          <div className="loginsignup-fields">
            <input
              type="email"
              placeholder="Email Address"
              value={forgotEmail}
              onChange={(e) => setForgotEmail(e.target.value)}
            />
          </div>
          <button onClick={forgotPasswordHandler}>Send Reset Link</button>
          {resetMessage && (
            <p
              style={{
                color:
                  resetMessage.includes("sent") ||
                  resetMessage.includes("success")
                    ? "green"
                    : "#ff4141",
                marginTop: "15px",
              }}
            >
              {resetMessage}
            </p>
          )}
          <hr style={{ margin: "20px 0", borderColor: "#e0e0e0" }} />
          <p
            onClick={handleBackToLogin}
            style={{
              color: "#f32d2dff",
              cursor: "pointer",
              marginTop: "10px",
              fontWeight: 500,
            }}
          >
            ← Back to Login
          </p>
        </div>
      );
    }

    return (
      <>
        <h1>{formTitle}</h1>
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
        <button onClick={() => (modeState === "login" ? login() : signup())}>
          Continue
        </button>
        {modeState === "login" && (
          <p
            onClick={handleForgotToggle}
            style={{
              textAlign: "right",
              marginTop: "10px",
              cursor: "pointer",
              color: "#007bff",
              fontSize: "18px",
              textDecoration: "underline",
            }}
          > 
            Forgot Password?
          </p>
        )}
        {modeState === "login" && (
          <p className="loginsignup-agree">
            By continuing, you agree to Shoppers Conditions of Use and Privacy
            Notice.
          </p>
        )}
        <hr style={{ margin: "15px 0", borderColor: "#e0e0e0" }} />
        {modeState === "login" ? (
          <p style={{ marginTop: "10px", color: "#5c5c5c", fontSize: "18px" }}>
            Create an account?{" "}
            <span
              onClick={handleToggle}
              style={{ color: "#f32d2dff", cursor: "pointer", fontWeight: 500 }}
            >
              Click here
            </span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={handleToggle} className="btn">
              Login here
            </span>
          </p>
        )}
      </>
    );
  };

  return (
    <>
      <SimpleHeader />
      <div className="loginsignup">
        <div
          className="loginsignup-container"
          style={{
            height:
              modeState === "forgot"
                ? "450px"
                : modeState === "login"
                ? "500px"
                : "600px",
            transition: "height 0.3s ease",
          }}
        >
          {renderFormContent()}
        </div>
      </div>
    </>
  );
};

export default LoginSignup;
