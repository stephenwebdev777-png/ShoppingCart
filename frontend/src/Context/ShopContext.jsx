/* eslint-disable react-refresh/only-export-components */
import React, { createContext, useEffect, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import {     fetchAllProducts,fetchCartData, addToCartLocal,removeFromCartLocal,clearCart,setCartItemsManual 
} from "../Redux/shopSlice";

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
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
            dispatch(fetchCartData(token)).unwrap().catch(() => handleForceLogout());
        }
    }, [dispatch, handleForceLogout]);

    const addToCart = (itemId, size) => {
        const token = localStorage.getItem("auth-token");
        const key = `${itemId}_${size}`;

        // 1. Update Redux State (Instant UI update)
        dispatch(addToCartLocal({ itemId, size }));

        // 2. Sync with DB
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
        
        // 1. Update Redux State
        dispatch(removeFromCartLocal(key));

        // 2. Sync with DB
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
        setCartItems: (data) => dispatch(setCartItemsManual(data)),
        getTotalCartItems: () => cartItems.reduce((total, item) => total + item.quantity, 0),
        getTotalCartAmount: () => {
            return cartItems.reduce((total, item) => {
                const [id] = item.key.split("_");
                const itemInfo = all_product.find((p) => p.id === Number(id));
                return itemInfo ? total + (itemInfo.new_price * item.quantity) : total;
            }, 0);
        },
    };

    return (
        <ShopContext.Provider value={contextValue}>
            {props.children}
        </ShopContext.Provider>
    );
};

export default ShopContextProvider;