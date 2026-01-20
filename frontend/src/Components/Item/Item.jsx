import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";

const Item = (props) => {
  const getCategoryPath = (cat) => {
    const category = cat ? cat.toLowerCase() : "";
    const mapping = { men: "mens", mens: "mens", women: "womens", womens: "womens","women new": "womens" };
   return mapping[category] || "womens";
  };

  const categoryPath = getCategoryPath(props.category);
  const productPath = `/${categoryPath}/product/${props.id}`;

  const handleProductClick = (e) => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      e.preventDefault();
      if (props.onItemClick) props.onItemClick(productPath);
    } else {
      window.scrollTo(0, 0);
    }
  };

  return (
    <div className="item">
      <Link onClick={handleProductClick} to={productPath}>
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
