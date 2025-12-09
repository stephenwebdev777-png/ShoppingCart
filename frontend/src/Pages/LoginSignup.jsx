/* eslint-disable no-unused-vars */
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

   const [modeState, setModeState] = useState(
    mode === "signup" || location.pathname === "/signup" ? "signup" : "login"
  );

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
  });

  const changeHandler = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });
  const formTitle =
    modeState === "login" ? "Sign in or Create account" : "Create Account";

  const login = async () => {
    try {
      const response = await fetch("http://localhost:3000/login", {
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
    } catch (err) {
      alert("Login failed. Please try again.");
    }
  };

  const signup = async () => {
    try {
      const response = await fetch("http://localhost:3000/signup", {
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
        setFormData({
        username: "",
        email: "",
        password: "",
      });
        setModeState("login");
        navigate("/login");
      } else {
        alert(data.errors || "Signup failed");
      }
    } catch (err) {
      alert("Signup failed. Please try again.");
    }
  };

  const handleToggle = () => {
    const newMode = modeState === "login" ? "signup" : "login";
    setModeState(newMode);
    navigate(newMode === "signup" ? "/signup" : "/login");
  };

  return (
    <>
      <SimpleHeader />

      <div className="loginsignup">
        <div
          className="loginsignup-container"
          style={{
            height: modeState === "login" ? "500px" : "600px",
            transition: "height 0.3s ease",
          }}
        >
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
          <p className="loginsignup-agree">
            By continuing, you agree to Shoppers Conditions of Use and Privacy
            Notice.
          </p>
            )}

          <hr style={{ margin: "20px 0", borderColor: "#e0e0e0" }} />

          {modeState === "login" ? (
            <p
              style={{
                marginTop: "10px",
                color: "#5c5c5c",
                fontSize: "18px",
                fontWeight: "500",
              }}
            >
              Create an account?{" "}
              <span
                onClick={handleToggle}
                style={{ color: "#ff4141", cursor: "pointer" }}
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
        </div>
      </div>
    </>
  );
};

export default LoginSignup;