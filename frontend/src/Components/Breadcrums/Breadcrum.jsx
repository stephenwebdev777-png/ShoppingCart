import React from "react";
import "./Breadcrum.css";
import arrow_icon from "../Assets/breadcrum_arrow.png";
import { Link } from "react-router-dom";

const Breadcrum = (props) => {
  const { product } = props;
  if (!product) return null;

  return (
    <div className="breadcrum">
      <Link to="/" style={{ textDecoration: "none", color: "inherit" }}>
        SHOP
      </Link>
      <img src={arrow_icon} alt="" />{" "}
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
      <img src={arrow_icon} alt="" />
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
