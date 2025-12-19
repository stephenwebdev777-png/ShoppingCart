/* eslint-disable no-unused-vars */
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./CSS/LoginSignup.css";
import logo from "../Assets/logo.png";

const LoginSignup = ({ mode }) => {
  const [state, setState] = useState(mode || "login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const sendResetLink = async () => {
    if (!formData.email) {
      alert("Please enter your email address");
      return;
    }
    try {
      const response = await fetch(
        "http://localhost:3000/auth/forgotpassword",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email: formData.email }),
        }
      );
      const data = await response.json();
      if (data.success) {
        alert("Reset link sent! Please check your Mailtrap inbox.");
        setState("login");
      } else {
        alert(data.message || "User not found");
      }
    } catch (error) {
      alert("Error connecting to the server.");
    }
  };

  const login = async () => {
    let responseData;
    await fetch("http://localhost:3000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      localStorage.setItem("user-role", responseData.role);
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect");
      if (responseData.role === "admin") {
        window.location.replace("/admin");
      } else {
        window.location.replace(
          redirectPath ? decodeURIComponent(redirectPath) : "/"
        );
      }
    } else {
      alert("Invalid login credentials");
    }
  };

  const signup = async () => {
    let responseData;
    await fetch("http://localhost:3000/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    })
      .then((res) => res.json())
      .then((data) => (responseData = data));

    if (responseData.success) {
      localStorage.setItem("auth-token", responseData.token);
      localStorage.setItem("user-role", responseData.role);
      window.location.replace("/");
    } else {
      alert(responseData.message);
    }
  };

  return (
    <div className="loginsignup">
   
      <div className="loginsignup-header-outside">
        <Link to="/" style={{ textDecoration: "none" }}>
          <div className="nav-logo">
            <img src={logo} alt="logo" />
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
                fontSize: "15px",
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
