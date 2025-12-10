/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Breadcrum from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import "./CSS/Product.css";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const token = localStorage.getItem("auth-token");

  useEffect(() => {
    if (!productId) {
      setLoading(false);
      setError("Invalid URL format.");
      return;
    }
    const fetchProduct = async () => {
      setLoading(true);
      setError(null);
      setProduct(null);
      try {
        const response = await fetch(
          `http://localhost:3000/product/${productId}`,
          {
            method: "GET",
            headers: {
              "auth-token": token || "",
              "Content-Type": "application/json",
            },
          }
        );
        if (response.status === 404 || response.status === 400) {
          setError("Product not available or URL is incorrect.");
          await response.json();
        } else if (response.status === 401) {
          if (token) {
            localStorage.removeItem("auth-token");
          }
          setError("unauthorized");
          await response.json();
        } else if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setProduct(data.product);
          } else {
            setError(data.message || "An unexpected error occurred.");
          }
        } else {
          setError(`Server error: Status ${response.status}`);
        }
      } catch (err) {
        setError("Could not connect to the server.");
        console.error("Network or fetch error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [productId, token]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Enter email and password");
      return;
    }
    try {
      const response = await fetch("http://localhost:3000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();

      if (data.success) {
        localStorage.setItem("auth-token", data.token);
        window.location.reload();
      } else {
        alert(data.errors);
      }
    } catch (error) {
      console.error("Login failed:", error);
      alert("Login failed due to a network error.");
    }
  };
  if (loading) {
    return (
      <h2 style={{ padding: "50px", textAlign: "center" }}>
        Loading product details...
      </h2>
    );
  }
  if (error === "unauthorized") {
    return (
      <div className="login-modal-overlay">
        <div className="login-modal-content">
          <h2>Access Restricted</h2>
          <p>Login to view this product.</p>
          <input
            type="text"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="login-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="login-input"
          />

          <button className="login-modal-btn" onClick={handleLogin}>
            Login
          </button>

          <p style={{ marginTop: "15px", color: "red" }}>
            Please log in.
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return <h2 style={{ padding: "50px", textAlign: "center" }}>{error}</h2>;
  }

  if (product) {
    return (
      <div>
        <Breadcrum product={product} />
        <ProductDisplay product={product} />
      </div>
    );
  }
  return (
    <h2 style={{ padding: "50px", textAlign: "center" }}>
      Unable to load product.
    </h2>
  );
};

export default Product;
