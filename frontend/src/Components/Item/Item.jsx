import React from "react";
import "./Item.css";
import { Link, useNavigate } from "react-router-dom";

const Item = (props) => {
  const navigate = useNavigate();

  // Maps database category to your desired URL path
  const categoryPath = props.category === "women" ? "womens" : "mens";
  const productPath = `/${categoryPath}/product/${props.id}`;

  const handleItemClick = (e) => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      e.preventDefault(); // Block the <Link>
      alert("Please login to view product details.");
      navigate(`/login?redirect=${encodeURIComponent(productPath)}`);
    }
  };

  return (
    <div className="item">
      <Link to={productPath} onClick={handleItemClick}>
        <img src={props.image} alt={props.name} />
      </Link>
      <p>{props.name}</p>
      <div className="item-prices">
        <div className="item-price-new">Rs.{props.new_price}</div>
        <div className="item-price-old">Rs.{props.old_price}</div>
      </div>
    </div>
  );
};

export default Item;
