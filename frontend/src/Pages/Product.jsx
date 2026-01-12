
import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Breadcrum from "../Components/Breadcrums/Breadcrum";
import ProductDisplay from "../Components/ProductDisplay/ProductDisplay";

const Product = () => {
  const { productId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  // Use the Environment Variable for the API
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        // FIX: Replaced localhost with dynamic API_BASE_URL
        const response = await fetch(
          `${API_BASE_URL}/products/product/${productId}`
        );

        if (response.ok) {
          const data = await response.json();
          const urlCategory = location.pathname.split("/")[1];

          const validRoutes = {
            men: "mens",
            mens: "mens",
            women: "womens",
            womens: "womens",
            "women new": "womens",
          };

          if (validRoutes[data.category] !== urlCategory) {
            setError("page_not_found");
            setLoading(false);
            return;
          }
          
          const token = localStorage.getItem("auth-token");
          if (!token) {
            navigate(
              `/login?redirect=${encodeURIComponent(location.pathname)}`
            );
            return;
          }

          setProduct(data);
          setError(null);
        } else {
          setError("page_not_found");
        }
      } catch (err) {
        console.error("Fetch error:", err);
        setError("network_error");
      } finally {
        setTimeout(() => setLoading(false), 150);
      }
    };
    fetchProduct();
  }, [productId, location.pathname, navigate, API_BASE_URL]); // Added API_BASE_URL to dependency array

  if (loading)
    return <div style={{ height: "100vh", backgroundColor: "white" }}></div>;

  if (error === "page_not_found" || error === "network_error") {
    return (
      <div
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "100vw",
          height: "100vh",
          backgroundColor: "#ffffff",
          zIndex: 10000,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
        }}
      >
        <h1 style={{ fontSize: "40px", color: "#ff4141", margin: "0" }}>
          {error === "network_error" 
            ? "Server Connection Error" 
            : "This Shopper page can't be found"}
        </h1>

        <div style={{ fontSize: "20px", color: "#5f6368", marginTop: "10px" }}>
          {error === "network_error" 
            ? "Could not connect to the backend server." 
            : `No webpage found for: ${location.pathname}`}
          <p style={{ marginTop: "20px" }}> 
            {error === "network_error" ? "Check your internet or server status" : "HTTP ERROR 404"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="product-container">
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