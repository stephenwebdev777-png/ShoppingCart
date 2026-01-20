/* cite: NewCollections.jsx */
import React, { useEffect, useState } from "react";
import "./NewCollections.css";
import Item from "../Item/Item";

const NewCollections = (props) => {
  const [new_collection, setNew_collection] = useState([]);
  const API_BASE_URL = import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  useEffect(() => {
    fetch(`${API_BASE_URL}/products/newcollections`)
      .then((response) => response.json())
      .then((data) => setNew_collection(data))
      .catch((err) => console.error("Error fetching collections:", err));
  }, [API_BASE_URL]);

  return (
    <div className="new-collections" id="new-collections">
      <h1>NEW COLLECTIONS</h1>
      <hr />
      <div className="collections">
        {new_collection.map((item, i) => {
          const deliveryDateString = props.getDelivery(
            item.old_price,
            item.new_price
          );
          return (
            <div key={i} className="collection-item-wrapper">
              <Item
                id={item.id}
                name={item.name}
                image={item.image}
                new_price={item.new_price}
                old_price={item.old_price}
                category={item.category}
                onItemClick={props.onItemClick}
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
                <span style={{ color: "#ff4141" }}>{deliveryDateString}</span>
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NewCollections;
