import React, { useContext } from "react";  //cart page
import "./CartItem.css";
import { ShopContext } from "../../Context/ShopContext";
import remove_icon from "../Assets/cart_cross_icon.png";
import { useNavigate } from "react-router-dom";

const CartItem = () => {
  const {
    all_product,
    cartItems,
    removeFromCart,
    addToCart,
    getTotalCartAmount,
  } = useContext(ShopContext);
  const navigate = useNavigate();
  const handleCheckout = () => {
    navigate("/checkout");
  };

  return (
    <div className="cartitems">
      <div className="cartitems-format-main">
        <p>Products</p>
        <p>Title</p>
        <p>Price</p>
        <p>Quantity</p>
        <p>Total</p>
        <p>Remove</p>
      </div>
      <hr />

      {all_product.map((e) => {
        return Object.keys(cartItems)
          .filter((k) => k.startsWith(e.id + "_") && cartItems[k] > 0)
          .map((key) => {
            const size = key.split("_")[1];
            const quantity = cartItems[key];
            return (
              <div className="cartitems-format cartitems-format-main" key={key}>
                <img src={e.image} alt="" className="carticon-product-icon" />
                <p>
                  {e.name} ({size})
                </p>
                <p>Rs.{e.new_price}</p>
                <div className="cartitems-quantity-box">
                  <span
                    className="quantity-btn"
                    onClick={() => removeFromCart(key)}
                  >
                    {" "}
                    -{" "}
                  </span>

                  <button className="cartitems-quantity">{quantity}</button>
                  <span
                    className="quantity-btn"
                    onClick={() => addToCart(e.id, size)}
                  >
                    {" "}
                    +{" "}
                  </span>
                </div>

                <p>Rs.{e.new_price * quantity}</p>
                <img
                  className="cartitems-remove-icon"
                  src={remove_icon}
                  onClick={() => removeFromCart(key)}
                  alt=""
                />
              </div>
            );
          });
      })}

      <div className="cart_items-down">
        <div className="cart_items-total">
          <h1>Cart Total</h1>
          <div>
            <div className="cart_items-total_items">
              <p>Subtotal</p>
              <p>Rs.{getTotalCartAmount()}</p>
            </div>
            <hr />
            <div className="cart_items-total_items">
              <p>Shipping Fee</p>
              <p>Free</p>
            </div>
            <hr />
            <div className="cart_items-total_items">
              <h3>Total</h3>
              <h3>Rs.{getTotalCartAmount()}</h3>
            </div>
          </div>

          <button onClick={handleCheckout}>PROCEED TO CHECKOUT</button>
        </div>
      </div>
    </div>
  );
};

export default CartItem;
