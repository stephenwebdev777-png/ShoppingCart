/* eslint-disable react-hooks/set-state-in-effect */
import React, { useEffect, useState } from "react";
import "./Listproduct.css";
import cross_icon from "../../assets/cross_icon.png";

const Listproduct = ({refreshTrigger}) => {
  const [allproducts, setAllproducts] = useState([]);

  const fetchInfo = async () => {
    const res = await fetch("http://localhost:3000/allproduct");
    const data = await res.json();
    setAllproducts(data);
  };

  useEffect(() => {
    fetchInfo();
  }, [refreshTrigger]); //refresh the product list only when a new product is added

  const remove_product = async (id) => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
        alert("Authentication token missing. Please log in as admin.");
        return; 
    }
    await fetch("http://localhost:3000/removeproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({ id }),
    });
    fetchInfo(); 
  };

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
       <hr/>
        {allproducts.map((product) => (
          <div
            className="listproduct-format-main listproduct-format"
            key={product._id}
          >
            <img
              src={product.image}
              alt=""
              className="listproduct-product-icon"
            />
            <p>{product.name}</p>
            <p>Rs.{product.old_price}</p>
            <p>Rs.{product.new_price}</p>
            <p>{product.category}</p>
            <img
             onClick={() => remove_product(product.id)}
              src={cross_icon}
              alt=""
              className="listproduct-remove-icon"
            />         
          </div>
        ))}
      </div>
    </div>
  );
};

export default Listproduct;
