/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext, useEffect } from "react";
export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [all_product, setAll_product] = useState([]);
  const [cartItems, setCartItems] = useState({});

  useEffect(() => {
    // FIX: Added /products/ prefix
    fetch("http://localhost:3000/products/allproduct")
      .then((response) => response.json())
      .then((data) => setAll_product(data))
      .catch((err) => console.error("Failed to fetch products:", err));

    const token = localStorage.getItem("auth-token");
    if (token) {
      const handleResponse = (response) => {
        if (!response.ok) {
          console.error(`Failed to fetch cart: Status ${response.status}`);
          return {};
        }
        return response.json();
      };
      // FIX: Added /user/ prefix
      fetch("http://localhost:3000/user/getcart", {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
      })
        .then(handleResponse)
        .then((data) => {
          if (data && Object.keys(data).length > 0) {
            setCartItems(data);
          } else {
            setCartItems({});
          }
        })
        .catch((err) => {
          console.error("Cart fetch error:", err);
          setCartItems({});
        });
    }
  }, []);

  const addToCart = (itemId, size) => {
    if (!localStorage.getItem("auth-token")) {
      alert("Please Login to add items to cart");
      return;
    }
    const key = `${itemId}_${size}`;
    setCartItems((prev) => ({ ...prev, [key]: (prev[key] || 0) + 1 }));

    // FIX: Added /user/ prefix
    fetch("http://localhost:3000/user/addtocart", {
      method: "POST",
      headers: {
        "auth-token": localStorage.getItem("auth-token"),
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId: key }),
    });
  };

  const removeFromCart = (key) => {
    setCartItems((prev) => ({
      ...prev,
      [key]: Math.max((prev[key] || 0) - 1, 0),
    }));

    const token = localStorage.getItem("auth-token");
    if (token) {
      // FIX: Added /user/ prefix
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

  // ... rest of your helper functions (getTotalCartAmount, etc.) stay the same
  const getTotalCartAmount = () => {
    let totalAmount = 0;
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        const [id] = key.split("_");
        const itemInfo = all_product.find(
          (product) => product.id === Number(id)
        );
        if (itemInfo) {
          totalAmount += itemInfo.new_price * cartItems[key];
        }
      }
    }
    return totalAmount;
  };

  const getTotalCartItems = () => {
    let totalItems = 0;
    for (const key in cartItems) {
      if (cartItems[key] > 0) {
        const [id] = key.split("_");
        const itemInfo = all_product.find(
          (product) => product.id === Number(id)
        );
        if (itemInfo) {
          totalItems += cartItems[key];
        }
      }
    }
    return totalItems;
  };

  return (
    <ShopContext.Provider
      value={{
        all_product,
        cartItems,
        addToCart,
        removeFromCart,
        getTotalCartAmount,
        getTotalCartItems,
      }}
    >
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
