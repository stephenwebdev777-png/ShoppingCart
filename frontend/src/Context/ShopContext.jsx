/* eslint-disable react-refresh/only-export-components */
import React, { useState, createContext, useEffect, useCallback } from "react";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [all_product, setAll_product] = useState([]);
  const [cartItems, setCartItems] = useState([]);

  const handleForceLogout = useCallback(() => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-role");
    setCartItems([]);
    window.location.href = "/";
  }, []);
  const fetchCartData = useCallback(
    (token) => {
      fetch("http://localhost:3000/user/getcart", {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
      })
        .then((res) => {
          if (res.status === 401) {
            handleForceLogout();
            return;
          }
          return res.json();
        })
        .then((data) => {
          if (data && Array.isArray(data)) {
            setCartItems(data);
          }
        })
        .catch(() => handleForceLogout());
    },
    [handleForceLogout]
  );

  useEffect(() => {
    const handleStorageChange = (e) => {
      if (e.key === "auth-token") {
        if (e.newValue !== e.oldValue) {
          if (!e.newValue) {
            handleForceLogout();
          } else {
            fetchCartData(e.newValue);
          }
        }
      }
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, [fetchCartData, handleForceLogout]);

  // 4. Initial Load
  useEffect(() => {
    fetch("http://localhost:3000/products/allproduct")
      .then((res) => res.json())
      .then((data) => setAll_product(data));

    const token = localStorage.getItem("auth-token");
    if (token) {
      fetchCartData(token);
    }
  }, [fetchCartData]);

  const addToCart = (itemId, size) => {
    const token = localStorage.getItem("auth-token");
    const key = `${itemId}_${size}`;

    setCartItems((prev) => {
      const existingItemIndex = prev.findIndex((item) => item.key === key);
      if (existingItemIndex > -1) {
        const updatedCart = [...prev];
        updatedCart[existingItemIndex].quantity += 1;
        return updatedCart;
      }
      return [...prev, { key: key, quantity: 1 }];
    });

    if (token) {
      fetch("http://localhost:3000/user/addtocart", {
        method: "POST",
        headers: { "auth-token": token, "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: key }),
      }).then((res) => {
        if (res.status === 401) handleForceLogout();
      });
    }
  };

  const removeFromCart = (key) => {
    const token = localStorage.getItem("auth-token");
    setCartItems((prev) => {
      const index = prev.findIndex((item) => item.key === key);
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
        headers: { "auth-token": token, "Content-Type": "application/json" },
        body: JSON.stringify({ itemId: key }),
      }).then((res) => {
        if (res.status === 401) handleForceLogout();
      });
    }
  };

  const contextValue = {
    all_product,
    cartItems,
    addToCart,
    removeFromCart,
    setCartItems,
    getTotalCartItems: () =>
      cartItems.reduce((total, item) => total + item.quantity, 0),
    getTotalCartAmount: () => {
      let total = 0;
      cartItems.forEach((item) => {
        const [id] = item.key.split("_");
        const itemInfo = all_product.find((p) => p.id === Number(id));
        if (itemInfo) total += itemInfo.new_price * item.quantity;
      });
      return total;
    },
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
