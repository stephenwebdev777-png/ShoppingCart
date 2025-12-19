/* cite: CartItem.jsx, ShopContext.jsx */
import React, { useContext } from "react";
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
    const hasItems = cartItems.some((item) => item.quantity > 0);
    if (!hasItems) {
      alert(
        "Nothing added in cart! Please add items to your cart before proceeding to checkout."
      );
      return;
    }
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
        const matchedItems = cartItems.filter(
          (item) => item.key.startsWith(e.id + "_") && item.quantity > 0
        );

        return matchedItems.map((item) => {
          const size = item.key.split("_")[1];
          return (
            <div
              className="cartitems-format cartitems-format-main"
              key={item.key}
            >
              <img src={e.image} alt="" className="carticon-product-icon" />
              <p>
                {e.name} ({size})
              </p>
              <p>Rs.{e.new_price}</p>
              <div className="cartitems-quantity-box">
                <span
                  className="quantity-btn"
                  onClick={() => removeFromCart(item.key)}
                >
                  {" "}
                  -{" "}
                </span>
                <button className="cartitems-quantity">{item.quantity}</button>
                <span
                  className="quantity-btn"
                  onClick={() => addToCart(e.id, size)}
                >
                  {" "}
                  +{" "}
                </span>
              </div>
              <p>Rs.{e.new_price * item.quantity}</p>
              <img
                className="cartitems-remove-icon"
                src={remove_icon}
                onClick={() => removeFromCart(item.key)}
                alt="remove"
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
