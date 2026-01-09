/* eslint-disable react-hooks/set-state-in-effect */
import React, { useContext, useState, useEffect } from "react";
import "./CSS/ShopCategory.css";
import { ShopContext } from "../Context/ShopContext";
import Item from "../Components/Item/Item";
import { useNavigate } from "react-router-dom";

const ShopCategory = (props) => {
  const { all_product } = useContext(ShopContext);
  const [sortType, setSortType] = useState("default");
  const [showModal, setShowModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    setSortType("default");
  }, [props.category]);

  const triggerModal = (path) => {
    setRedirectPath(path);
    setShowModal(true);
  };

  const handleGoToLogin = () => {
    setShowModal(false);
    // Redirect to login and pass the product path as a query parameter
    navigate(`/login?redirect=${encodeURIComponent(redirectPath)}`);
  };

  const getDeliveryDate = (oldPrice, newPrice) => {
    const difference = Math.abs(oldPrice - newPrice);
    const ratio = (difference / newPrice) * 100;

    // Use the same formula as Shop.jsx
    let variance = Math.round(ratio) % 7;
    const daysToAdd = 4 + variance;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

    return deliveryDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  let filtered = all_product.filter((item) => item.category === props.category);

  if (sortType === "low-high") {
    filtered = [...filtered].sort((a, b) => a.new_price - b.new_price);
  } else if (sortType === "high-low") {
    filtered = [...filtered].sort((a, b) => b.new_price - a.new_price);
  }

  return (
    <div className="shop-category">
      {showModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h2>Login Required</h2>
            <p>Please login to view product details and continue shopping.</p>
            <div className="modal-buttons">
              <button className="btn-login" onClick={handleGoToLogin}>
                Go to Login
              </button>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      <img className="shopcategory-banner" src={props.banner} alt="" />

      <div className="shopcategory-indexSort">
        <p>
          <span>Explore Products</span>
        </p>
        <div className="shopcategory-sort">
          <select
            value={sortType}
            onChange={(e) => setSortType(e.target.value)}
            className="sort-dropdown"
          >
            <option value="default">Sort by</option>
            <option value="low-high">Price: Low to High</option>
            <option value="high-low">Price: High to Low</option>
          </select>
        </div>
      </div>

      <div className="shopcategory-products">
        {filtered.map((item, i) => {
          const deliveryDateString = getDeliveryDate(
            item.old_price,
            item.new_price
          );
          return (
            <div key={i} className="shopcategory-item-container">
              <Item
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
                category={props.category}
                onItemClick={triggerModal}
              />
              <div className="shopcategory-delivery">
                <p
                  style={{ fontSize: "16px", marginTop: "5px", color: "#111" }}
                >
                  <span style={{ fontWeight: "bold" }}>Free Delivery,</span>{" "}
                  <span style={{ color: "#ff4141" }}>{deliveryDateString}</span>
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default ShopCategory;
