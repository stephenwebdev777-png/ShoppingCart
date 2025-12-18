/* eslint-disable no-unused-vars */
/* cite: Product.jsx, App.jsx */
import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Breadcrum from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";

const Product = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/products/product/${productId}`
        );
        if (response.ok) {
          const data = await response.json();

          // VERIFY CATEGORY MATCH: Extract category from URL path
          const urlCategory = location.pathname.split("/")[1]; // e.g., "mens" or "womens"
          const normalizedUrlCategory =
            urlCategory === "mens" ? "men" : "women";

          if (data.category !== normalizedUrlCategory) {
            setError("category_mismatch"); // Wrong category for this ID
          } else {
            setProduct(data);
            setError(null);
          }
        } else {
          setError("not_found"); // Invalid ID
        }
      } catch (err) {
        setError("network_error");
      }
    };
    fetchProduct();
  }, [productId, location.pathname]);

  // Handle Scroll Lock for Standalone Error View
  useEffect(() => {
    if (error === "not_found" || error === "category_mismatch") {
      document.body.style.overflow = "hidden";
      document.body.style.height = "100vh";
    } else {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    }
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, [error]);

  if (error === "not_found" || error === "category_mismatch") {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#fff",
          zIndex: 9999,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <h1 style={{ fontSize: "30px", fontWeight: "500", color: "#202124" }}>
          This product does not exist in our {location.pathname.split("/")[1]}{" "}
          catalog.
        </h1>
        <p style={{ fontSize: "17px", color: "#70757a", marginTop: "10px" }}>
          HTTP ERROR 404
        </p>
        <button
          onClick={() => navigate("/")}
          style={{
            marginTop: "30px",
            padding: "10px 20px",
            backgroundColor: "#1a73e8",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Return to Shop
        </button>
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
