/* cite: Popular.jsx */
import React, { useEffect, useState } from "react";
import "./Popular.css";
import Item from "../Item/Item";

const Popular = () => {
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
          // Delivery date logic synchronized with ProductDisplay.jsx
          const daysToAdd = 7 + (item.id % 4);
          const deliveryDate = new Date();
          deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
          const deliveryDateString = deliveryDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          });

          return (
            <div key={i} className="popular-item-container">
              <Item
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
                // Ensure "women" is passed for popular items to build /womens/product/id links
                category={item.category === "women" ? "womens" : "mens"}
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
                <span style={{ color: "#ff4141", fontWeight: "bold" }}>
                  {deliveryDateString}
                </span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Popular;
