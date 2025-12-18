/* eslint-disable react-refresh/only-export-components */
/* cite: ShopContext.jsx, cartController.js, userRoutes.js */
import React, { useState, createContext, useEffect } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [all_product, setAll_product] = useState([]);
  const [cartItems, setCartItems] = useState([]); // Default to Array to match backend

  useEffect(() => {
    // Fetch all products with the /products prefix
    fetch("http://localhost:3000/products/allproduct")
      .then((response) => response.json())
      .then((data) => setAll_product(data))
      .catch((err) => console.error("Failed to fetch products:", err));

    const token = localStorage.getItem("auth-token");
    if (token) {
      // Fetch user cart with the /user prefix
      fetch("http://localhost:3000/user/getcart", {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
      })
      .then((res) => res.json())
      .then((data) => {
        // Ensure data is an array before setting state
        setCartItems(Array.isArray(data) ? data : []);
      })
      .catch((err) => console.error("Cart fetch error:", err));
    }
  }, []);

  const addToCart = (itemId, size) => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      alert("Please Login to add items to cart");
      return;
    }
    const key = `${itemId}_${size}`;

    // Optimistic Update for the Array structure
    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex(item => item.key === key);
      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      }
      return [...prev, { key: key, quantity: 1 }];
    });

    fetch("http://localhost:3000/user/addtocart", {
      method: "POST",
      headers: {
        "auth-token": token,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId: key }),
    });
  };

  const removeFromCart = (key) => {
    const token = localStorage.getItem("auth-token");
    setCartItems((prev) => {
      const index = prev.findIndex(item => item.key === key);
      if (index > -1) {
        const updatedCart = [...prev];
        if (updatedCart[index].quantity > 1) {
          updatedCart[index].quantity -= 1;
        } else {
          updatedCart.splice(index, 1);
        }
        return updatedCart;
      }
      return prev;
    });

    if (token) {
      fetch("http://localhost:3000/user/removefromcart", {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ itemId: key }),
      });
    }
  };

  const getTotalCartAmount = () => {
    let totalAmount = 0;
    cartItems.forEach((item) => {
      if (item.quantity > 0) {
        const [id] = item.key.split("_");
        const itemInfo = all_product.find((product) => product.id === Number(id));
        if (itemInfo) {
          totalAmount += itemInfo.new_price * item.quantity;
        }
      }
    });
    return totalAmount;
  };

  const getTotalCartItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <ShopContext.Provider value={{ all_product, cartItems, addToCart, removeFromCart, getTotalCartAmount, getTotalCartItems }}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;