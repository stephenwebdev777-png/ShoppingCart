import React, { useState } from "react";
import "./Addproduct.css";
import upload_area from "../../assets/upload_area.svg";

const Addproduct = ({ onProductAdded }) => {
  const [image, setImage] = useState(false);
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "men",
    new_price: "",
    old_price: "",
  });

  const imagehandler = (e) => {
    setImage(e.target.files[0]);
  };

  const changeHandler = (e) => {
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });
  };

  const Add_Product = async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("Please log in as admin.");
      return;
    }

    if (!image) {
      alert("Please upload a product image.");
      return;
    }

    let responseData;
    let formData = new FormData();
    formData.append("product", image);

   
    try {
      const uploadResp = await fetch("http://localhost:3000/upload", {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": token,
        },
        body: formData,
      });
      responseData = await uploadResp.json();

      if (responseData.success) {
    
        const product = {
          ...productDetails,
          image: responseData.image_url,
          new_price: Number(productDetails.new_price),
          old_price: Number(productDetails.old_price),
        };

        const addResp = await fetch("http://localhost:3000/addproduct", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            "auth-token": token,
          },
          body: JSON.stringify(product),
        });

        const data = await addResp.json();

        if (data.success) {
          alert("Product Added Successfully");
          if (onProductAdded) {
            onProductAdded();
          }

          setProductDetails({
            name: "",
            image: "",
            category: "men",
            new_price: "",
            old_price: "",
          });
          setImage(false);
        } else {
          alert("Failed to add product: " + (data.message || "Unknown error"));
        }
      }
    } catch (err) {
      console.error("Error adding product:", err);
      alert("Server error. Please check if the backend is running.");
    }
  };

  return (
    <div className="add-product">
      <div className="addproduct-itemfield">
        <p>Product title</p>
        <input
          value={productDetails.name}
          onChange={changeHandler}
          type="text"
          name="name"
          placeholder="Type Here"
        />
      </div>
      <div className="addproduct-price">
        <div className="addproduct-itemfield">
          <p>Old Price</p>
          <input
            value={productDetails.old_price}
            onChange={changeHandler}
            type="text"
            name="old_price"
            placeholder="Type Here"
          />
        </div>
        <div className="addproduct-itemfield">
          <p>New Price</p>
          <input
            value={productDetails.new_price}
            onChange={changeHandler}
            type="text"
            name="new_price"
            placeholder="Type Here"
          />
        </div>
      </div>
      <div className="addproduct-itemfield">
        <p>Product Category</p>
        <select
          value={productDetails.category}
          onChange={changeHandler}
          name="category"
          className="add-product-selector"
        >
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>
      </div>
      <div className="addproduct-itemfield">
        <label htmlFor="file-input">
          <img
            src={image ? URL.createObjectURL(image) : upload_area}
            className="addproduct-thumnail-img"
            alt=""
          />
        </label>
        <input
          onChange={imagehandler}
          type="file"
          name="image"
          id="file-input"
          hidden
        />
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};

export default Addproduct;