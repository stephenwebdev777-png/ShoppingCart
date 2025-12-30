/* cite: Popular.jsx */
import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Item/Item";

const Popular = (props) => {
  const [popularProducts, setPopularProducts] = useState([]);
  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    fetch(`${API_BASE_URL}/products/popularinwomen`)
      .then((response) => response.json())
      .then((data) => setPopularProducts(data))
      .catch((err) => console.error("Error fetching popular products:", err));
  }, []);

  return (
    <div className="popular">
      <h1>POPULAR IN WOMEN</h1>
      <hr />
      <div className="popular-item">
        {popularProducts.map((item, i) => {
          const deliveryDateString = props.getDelivery(
            item.old_price,
            item.new_price
          );
          return (
            <div key={i} className="popular-item-container">
              <Item
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
                onItemClick={props.onItemClick}
              />
              <p
                style={{
                  marginTop: "10px",
                  fontSize: "17px",
                  color: "#555",
                  fontWeight: "bold",
                }}
              >
                Free Delivery ,{" "}
                <span style={{ color: "#ff4141" }}>{deliveryDateString}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
