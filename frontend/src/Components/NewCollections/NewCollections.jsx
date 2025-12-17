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
          return (
            <Item
              key={i}
              id={item.id}
              name={item.name}
              image={item.image}
              new_price={item.new_price}
              old_price={item.old_price}
              category={item.category}
            />
          );
        })}
      </div>
    </div>
  );
};

export default NewCollections;
