/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Breadcrum from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";
import "./CSS/Product.css";

const Product = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("auth-token");

  useEffect(() => {
    const fetchProduct = async () => {
      if (!productId) return;
      setLoading(true);
      try {
        // FIX: Added /products prefix to match backend index.js mounting
        const response = await fetch(
          `http://localhost:3000/products/product/${productId}`,
          {
            method: "GET",
            headers: {
              "auth-token": token || "",
              "Content-Type": "application/json",
            },
          }
        );

        if (response.ok) {
          const data = await response.json();
          setProduct(data);
          setError(null);
        } else if (response.status === 401) {
          setError("unauthorized");
        } else if (response.status === 404) {
          setError("not_found"); // Handles IDs that don't exist in DB
        } else {
          setError("error");
        }
      } catch (err) {
        setError("network_error");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [productId, token]);

  if (loading)
    return (
      <div
        className="loading"
        style={{ padding: "100px", textAlign: "center" }}
      >
        Loading...
      </div>
    );

  // Handle Unauthorized (User not logged in)
  if (error === "unauthorized") {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h2>Login Required</h2>
        <p>Please login to view full product details.</p>
        <button
          onClick={() => navigate(`/login?redirect=${location.pathname}`)}
        >
          Go to Login
        </button>
      </div>
    );
  }

  // Handle Missing Products (e.g., /product/1000)
  if (error === "not_found") {
    return (
      <div style={{ padding: "100px", textAlign: "center" }}>
        <h1 style={{ fontSize: "80px", color: "#ccc" }}>404</h1>
        <h2>Product Unavailable</h2>
        <p>The product you are looking for does not exist in our catalog.</p>
        <button onClick={() => navigate("/")}>Return to Shop</button>
      </div>
    );
  }

  return (
    <div>
      {product && (
        <>
          <Breadcrum product={product} />
          <ProductDisplay product={product} />
        </>
      )}
    </div>
  );
};

export default Product;
