import React from "react";
import "./Item.css";
import { Link } from "react-router-dom";

const Item = (props) => {
  const getCategoryPath = (cat) => {
    const mapping = {
      men: "mens",
      mens: "mens",
      women: "womens",
      womens: "womens",
      "women new": "womens",
    };
    return mapping[cat] || "womens";
  };

  const categoryPath = getCategoryPath(props.category);

  return (
    <div className="item">
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
