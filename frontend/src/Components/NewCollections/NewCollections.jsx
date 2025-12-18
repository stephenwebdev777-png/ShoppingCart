import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";

const NewCollections = () => {
  const [new_collection, setNew_collection] = useState([]);
  const API_BASE_URL = "http://localhost:3000";

  useEffect(() => {
    fetch(`${API_BASE_URL}/products/newcollections`)
      .then((response) => response.json())
      .then((data) => setNew_collection(data))
      .catch((err) => console.error("Error fetching collections:", err));
  }, []);

  return (
    <div className="new-collections" id="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
          // Delivery date logic synchronized with ProductDisplay.jsx
          const daysToAdd = 7 + (item.id % 4);
          const deliveryDate = new Date();
          deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
          const deliveryDateString = deliveryDate.toLocaleDateString("en-US", {
            day: "numeric",
            month: "short",
          });

          return (
            <div key={i} className="collection-item-wrapper">
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
                  color: "#302f2fff",
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

export default NewCollections;
