import React from "react";
import "./Breadcrum.css";
import { Link } from "react-router-dom";

const Breadcrum = (props) => {
  const { product } = props;
  if (!product) return null;

  return (
    <div className="breadcrum">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        SHOP
      </Link>
      <img src="/breadcrum_arrow.png" alt="" />{" "}
      <Link
        to={`/${
          product.category.toLowerCase() === "men"
            ? "mens"
            : product.category.toLowerCase() === "women"
            ? "womens"
            : product.category.toLowerCase()
        }`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {product.category}
      </Link>
      <img src="/breadcrum_arrow.png" alt="" />
      <Link
        to={`/${
          product.category.toLowerCase() === "men"
            ? "mens"
            : product.category.toLowerCase() === "women"
            ? "womens"
            : product.category.toLowerCase()
        }`}
        style={{ textDecoration: "none", color: "inherit" }}
      >
        {product.category}
      </Link>
      {product.name}
    </div>
  );
};

export default Breadcrum;
