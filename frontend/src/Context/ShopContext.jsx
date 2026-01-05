/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchAllProducts,
  fetchCartData,
  addToCart,
  removeFromCart,
  deleteFromCart,
  clearCart,
} from "../Redux/shopSlice";

export const ShopContext = createContext(null);

const ShopContextProvider = ({ children }) => {
  const dispatch = useDispatch();
  const { all_product, cartItems } = useSelector((state) => state.shop);

  const handleForceLogout = useCallback(() => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-role");
    dispatch(clearCart());
    window.location.href = "/";
  }, [dispatch]);

  useEffect(() => {
    dispatch(fetchAllProducts());

    const token = localStorage.getItem("auth-token");
    if (token) {
      dispatch(fetchCartData(token))
        .unwrap()
        .catch(() => handleForceLogout());
    }
  }, [dispatch, handleForceLogout]);

  const contextValue = {
    all_product,
    cartItems,

    addToCart: (itemId, size) =>
      dispatch(addToCart({ itemId, size })).unwrap().catch(handleForceLogout),

    removeFromCart: (key) =>
      dispatch(removeFromCart(key)).unwrap().catch(handleForceLogout),

    deleteFromCart: (key) =>
      dispatch(deleteFromCart(key)).unwrap().catch(handleForceLogout),

    clearCart: () => dispatch(clearCart()),

    getTotalCartItems: () =>
      cartItems.reduce((total, item) => total + item.quantity, 0),

    getTotalCartAmount: () =>
      cartItems.reduce((total, item) => {
        const [id] = item.key.split("_");
        const product = all_product.find((p) => p.id === Number(id));
        return product
          ? total + product.new_price * item.quantity
          : total;
      }, 0),
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;
