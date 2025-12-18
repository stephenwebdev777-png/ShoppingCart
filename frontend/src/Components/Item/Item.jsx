import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";

const Item = (props) => {
  // Map "men" to "mens" and "women" to "womens" to match App.jsx routes
  const categoryPath = props.category === "men" ? "mens" : "womens";

  return (
    <div className="item">
      {/* Dynamic routing based on category */}
      <Link to={`/${categoryPath}/product/${props.id}`}>
        <img
          onClick={() => window.scrollTo(0, 0)}
          src={props.image}
          alt={props.name}
        />
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
