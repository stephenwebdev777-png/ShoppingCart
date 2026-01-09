import React, { useEffect, useState } from "react";
import "./Listproduct.css";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../../Redux/shopSlice";

const Listproduct = () => {
  const dispatch = useDispatch();
  const { all_product, loading } = useSelector((state) => state.shop);

  // State for inline editing
  const [editId, setEditId] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    old_price: "",
    new_price: "",
    category: "",
  });

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const handleEditClick = (product) => {
    setEditId(product.id);
    setEditFormData({
      name: product.name,
      old_price: product.old_price,
      new_price: product.new_price,
      category: product.category,
    });
  };

  const handleInputChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const save_product = async (id) => {
    const token = localStorage.getItem("auth-token");
    const response = await fetch(
      "http://localhost:3000/products/updateproduct",
      {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ...editFormData, id: id }),
      }
    );
    const data = await response.json();
    if (data.success) {
      setEditId(null);
      dispatch(fetchAllProducts()); // Refresh list
    } else {
      alert("Update failed");
    }
  };

  const remove_product = async (id) => {
    const token = localStorage.getItem("auth-token");
    if (window.confirm("Remove this product?")) {
      await fetch("http://localhost:3000/products/removeproduct", {
        method: "POST",
        headers: { "Content-Type": "application/json", "auth-token": token },
        body: JSON.stringify({ id }),
      });
      dispatch(fetchAllProducts());
    }
  };

  if (loading) return <p>Loading products...</p>;

  return (
    <div className="list-product">
      <h1>All Products List</h1>
      <div className="listproduct-format-main listproduct-header">
        <p>Product</p>
        <p className="text-left">Title</p>
        <p>Old Price</p>
        <p>New Price</p>
        <p>Category</p>
        <p>Action</p>
        <p>Remove</p>
      </div>
      <div className="listproduct-allproducts">
        {all_product.map((product) => (
          <React.Fragment key={product.id}>
            <div
              className={`listproduct-format-main listproduct-format ${
                editId === product.id ? "editing-row" : ""
              }`}
            >
              <img
                src={product.image}
                alt=""
                className="listproduct-product-icon"
              />

              {editId === product.id ? (
                <>
                  <input
                    className="edit-input"
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleInputChange}
                  />
                  <input
                    className="edit-input small"
                    type="number"
                    name="old_price"
                    value={editFormData.old_price}
                    onChange={handleInputChange}
                  />
                  <input
                    className="edit-input small"
                    type="number"
                    name="new_price"
                    value={editFormData.new_price}
                    onChange={handleInputChange}
                  />
                  <select
                    className="edit-input"
                    name="category"
                    value={editFormData.category}
                    onChange={handleInputChange}
                  >
                    <option value="women">Women</option>
                    <option value="men">Men</option>
                  </select>
                  <button
                    className="save-btn"
                    onClick={() => save_product(product.id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <p className="listproduct-title text-left">{product.name}</p>
                  <p>Rs.{product.old_price}</p>
                  <p>Rs.{product.new_price}</p>
                  <p>{product.category}</p>
                  <button
                    className="listproduct-edit-btn"
                    onClick={() => handleEditClick(product)}
                  >
                    Edit
                  </button>
                </>
              )}

              <img
                onClick={() => remove_product(product.id)}
                src="/cross_icon.png"
                alt=""
                className="listproduct-remove-icon"
              />
            </div>
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Listproduct;
