/* eslint-disable no-unused-vars */
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

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `http://localhost:3000/products/product/${productId}`
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
        setError("network_error");
      } finally {
        setTimeout(() => setLoading(false), 150);
      }
    };
    fetchProduct();
  }, [productId, location.pathname, navigate]);

  if (loading)
    return <div style={{ height: "100vh", backgroundColor: "white" }}></div>;

  if (error === "page_not_found") {
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
          {" "}
          This Shopper page can't be found
        </h1>

        <div style={{ fontSize: "20px", color: "#5f6368", marginTop: "10px" }}>
          No webpage found for: <b>{location.pathname}</b>
          <p style={{ marginTop: "20px" }}> HTTP ERROR 404</p>
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
