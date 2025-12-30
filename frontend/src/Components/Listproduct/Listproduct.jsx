import React, { useEffect } from "react";
import "./Listproduct.css";
import cross_icon from "../../assets/cross_icon.png";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllProducts } from "../../Redux/shopSlice";

const Listproduct = () => {
  const dispatch = useDispatch();
  // REDUX: Pulling state from the store
  const { all_product, loading } = useSelector((state) => state.shop);

  useEffect(() => {
    dispatch(fetchAllProducts());
  }, [dispatch]);

  const remove_product = async (id) => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("Authentication token missing. Please log in as admin.");
      return;
    }
    await fetch("http://localhost:3000/products/removeproduct", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "auth-token": token,
      },
      body: JSON.stringify({ id }),
    });
    // REDUX: Refresh global list after removal
    dispatch(fetchAllProducts());
  };

  if (loading) return <p>Loading products...</p>;

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
        <hr />
        {all_product.map((product) => (
          <React.Fragment key={product.id}>
            <div className="listproduct-format-main listproduct-format">
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
            <hr />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default Listproduct;
