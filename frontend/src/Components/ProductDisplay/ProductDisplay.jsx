/* eslint-disable no-unused-vars */
import React, { useContext, useState } from "react"; //single product page
import "./ProductDisplay.css";
import star_icon from "../Assets/star_icon.png";
import star_dull_icon from "../Assets/star_dull_icon.png";
import { ShopContext } from "../../Context/ShopContext";
import { useNavigate } from "react-router-dom";

const ProductDisplay = ({ product }) => {
  const { addToCart } = useContext(ShopContext);
  const [selectedSize, setSelectedSize] = useState("");
  const navigate = useNavigate();

  //discount percent
  const discountPercentage = Math.round(
    ((product.old_price - product.new_price) / product.old_price) * 100
  );

  //delivery date to get within 7 and 10 days, use modulo 4  7+(0 to 3)
  const daysToAdd = 7 + (product.id % 4);
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
  const deliveryDateString = deliveryDate.toLocaleDateString("en-US", {
    //month day(us)
    day: "numeric",
    month: "short",
  });

  // to get within  7 to 10 days, use modulo 4 7+(0,1,2,3)
  const returnDays = 7 + (product.id % 4);
  const baseBadges = [
    "Top Brand",
    "Free Delivery",
    `Return/Exchange within ${returnDays} Days`,
    "Pay on Delivery",
    "Secure Transaction",
  ];

  const optionalBadges = []; //if needed badges can add (without changing the base structure)
  const confidenceBadges = [...baseBadges, ...optionalBadges];

  const handleAddToCart = () => {
    // REMOVED: token check here so non-users can add to cart
    if (!selectedSize) {
      alert("Please select a size before adding to cart.");
      return;
    }
    addToCart(product.id, selectedSize);
  };

  return (
    <div className="product_display">
      <div className="product_display-left">
        <div className="product_display_image-list">
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
          <img src={product.image} alt="" />
        </div>
        <div className="product_display_image">
          <img
            className="product_display_main-img"
            src={product.image}
            alt=""
          />
        </div>
      </div>

      <div className="product_display-right">
        <h1>{product.name}</h1>

        <div className="product_display-right-deal">
          <h2 style={{ color: "#ff4141", fontWeight: "bold" }}>
            LIMITED DEAL!
          </h2>
          <p style={{ fontSize: "20px", fontWeight: "500", color: "green" }}>
            {discountPercentage}% Off
          </p>
        </div>

        <div className="product_display-right-stars">
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_icon} alt="" />
          <img src={star_dull_icon} alt="" />
        </div>

        <div className="product_display-right-prices">
          <div className="product_display-right-prices-old">
            Rs.{product.old_price}
          </div>
          <div className="product_display-right-prices-new">
            Rs.{product.new_price}
          </div>
        </div>

        <p style={{ color: "#051162ff", fontSize: "20px" }}>
          Price inclusive of all taxes.
        </p>

        <p style={{ marginTop: "10px", color: "#111", fontSize: "19px" }}>
          <span style={{ fontWeight: "bold" }}>Free Delivery,</span>{" "}
          <span style={{ color: "#ff4141" }}>{deliveryDateString}</span>
        </p>

        <div
          style={{ fontSize: "21px", marginTop: "15px" }}
          className="product_display-right-description"
        >
          A lightweight, breathable, and comfortable piece that works well for
          daily use, casual plans, or layering with different outfits. Designed
          for ease and versatility, offering a soft feel and relaxed fit that
          suits any style or occasion.
        </div>

        <div className="product_display-right-size">
          <h1>Select Size</h1>
          <div className="product_display-right-size-list">
            {["S", "M", "L", "XL", "XXL"].map((size) => (
              <div
                key={size}
                className={selectedSize === size ? "size-selected" : ""} //highlights size
                onClick={() => setSelectedSize(size)}
              >
                {size}
              </div>
            ))}
          </div>
        </div>
        <button onClick={handleAddToCart}>ADD TO CART</button>
        <p
          style={{ fontSize: "18px" }}
          className="product_display-right-category"
        >
          <span>Category: </span> {product.category}
        </p>
        <div
          className="product_display-right-confidence"
          style={{
            marginTop: "20px",
            borderTop: "1px solid #ccc",
            fontSize: "18px",
            paddingTop: "15px",
          }}
        >
          <h4
            style={{ marginBottom: "10px", color: "#008cba", fontSize: "19px" }}
          >
            Shop with Confidence:
          </h4>
          <div
            className="confidence-badges-list"
            style={{ display: "flex", flexWrap: "wrap", gap: "19px" }}
          >
            {confidenceBadges.map((badge, index) => (
              <span
                key={index}
                style={{
                  padding: "5px 10px",
                  backgroundColor: "#f3f3f3",
                  border: "1px solid #ddd",
                  borderRadius: "4px",
                  cursor: "pointer",
                  fontSize: "17px",
                  color: "#333",
                  fontWeight: "bold",
                }}
              >
                {badge}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDisplay;
