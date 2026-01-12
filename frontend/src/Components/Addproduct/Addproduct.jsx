import React, { useState } from "react";
import "./Addproduct.css";
import { useDispatch } from "react-redux";
import { fetchAllProducts } from "../../Redux/shopSlice";

const Addproduct = () => {
  const dispatch = useDispatch();
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";
  const [image, setImage] = useState(false);
  const [useUrl, setUseUrl] = useState(false); // Toggle
  const [productDetails, setProductDetails] = useState({
    name: "",
    image: "",
    category: "men",
    new_price: "",
    old_price: "",
  });

  const changeHandler = (e) =>
    setProductDetails({ ...productDetails, [e.target.name]: e.target.value });

  const Add_Product = async () => {
    let finalImageUrl = productDetails.image;

    if (!useUrl) {
      if (!image) return alert("Please select an image file");
      let formData = new FormData();
      formData.append("product", image);

      const uploadResp = await fetch(`${API_BASE_URL}/products/upload`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "auth-token": localStorage.getItem("auth-token"),
        },
        body: formData,
      });
      const data = await uploadResp.json();
      if (data.success) finalImageUrl = data.image_url;
    }

    const response = await fetch(`${API_BASE_URL}/products/addproduct`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "auth-token": localStorage.getItem("auth-token"),
      },
      body: JSON.stringify({ ...productDetails, image: finalImageUrl }),
    });

    const result = await response.json();
    if (result.success) {
      alert("Product Added");
      dispatch(fetchAllProducts());
      setProductDetails({
        name: "",
        image: "",
        category: "men",
        new_price: "",
        old_price: "",
      });
      setImage(false);
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="add-product">
      <input
        value={productDetails.name}
        name="name"
        onChange={changeHandler}
        placeholder="Title"
      />
      <input
        value={productDetails.old_price}
        name="old_price"
        onChange={changeHandler}
        placeholder="Old Price"
      />
      <input
        value={productDetails.new_price}
        name="new_price"
        onChange={changeHandler}
        placeholder="New Price"
      />

      <div className="addproduct-itemfield">
        <p>
          Image Source:{" "}
          <button onClick={() => setUseUrl(!useUrl)}>
            {useUrl ? "Switch to File" : "Switch to URL"}
          </button>
        </p>
        {useUrl ? (
          <input
            name="image"
            value={productDetails.image}
            onChange={changeHandler}
            placeholder="Paste Image URL"
          />
        ) : (
          <label htmlFor="file-input">
            <img
              src={image ? URL.createObjectURL(image) : "/upload_area.svg"}
              className="addproduct-thumnail-img"
            />
            <input
              type="file"
              id="file-input"
              hidden
              onChange={(e) => setImage(e.target.files[0])}
            />
          </label>
        )}
      </div>
      <button onClick={Add_Product} className="addproduct-btn">
        ADD
      </button>
    </div>
  );
};
export default Addproduct;
