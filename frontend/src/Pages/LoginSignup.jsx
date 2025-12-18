/* eslint-disable no-unused-vars */
/* cite: LoginSignup.jsx, authController.js */
import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import "./CSS/LoginSignup.css";

const LoginSignup = ({ mode }) => {
  const location = useLocation();

  const [state, setState] = useState(mode || "login");
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });

  const changeHandler = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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

      // FIX: Check for redirect parameter in URL
      const params = new URLSearchParams(window.location.search);
      const redirectPath = params.get("redirect");

      if (responseData.role === "admin") {
        window.location.replace("/admin");
      } else {
        // Redirect back to specific product or shop home
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
      <div className="loginsignup-container">
        <h1>{state === "signup" ? "Sign Up" : "Login"}</h1>
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
          <input
            name="password"
            value={formData.password}
            onChange={changeHandler}
            type="password"
            placeholder="Password"
          />
        </div>
        <button onClick={() => (state === "login" ? login() : signup())}>
          Continue
        </button>
        {state === "signup" ? (
          <p className="loginsignup-login">
            Already have an account?{" "}
            <span onClick={() => setState("login")}>Login here</span>
          </p>
        ) : (
          <p className="loginsignup-login">
            Create an account?{" "}
            <span onClick={() => setState("signup")}>Click here</span>
          </p>
        )}
      </div>
    </div>
  );
};

export default LoginSignup;
