/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState, useCallback } from "react";
import "./Navbar.css";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("auth-token"));

  // Dynamic API Base URL
  const API_BASE_URL =
    import.meta.env.VITE_BACKEND_URL || "http://localhost:3000";

  const forceLogoutCleanup = useCallback(() => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-role");
    clearCart();
    setIsAuth(false);
    navigate("/");
  }, [clearCart, navigate]);

  const validateToken = useCallback(async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    try {
      // FIX: Use API_BASE_URL instead of "assets"
      const response = await fetch(`${API_BASE_URL}/user/getuserinfo`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "auth-token": token,
        },
      });
      const data = await response.json();
      if (!data.success) {
        forceLogoutCleanup();
      } else {
        setIsAuth(true);
      }
    } catch (error) {
      forceLogoutCleanup();
    }
  }, [forceLogoutCleanup, API_BASE_URL]);

  useEffect(() => {
    window.addEventListener("storage", (e) => {
      if (e.key === "auth-token") {
        validateToken();
      }
    });
    let lastToken = localStorage.getItem("auth-token");
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("auth-token");
      if (currentToken !== lastToken) {
        lastToken = currentToken;
        if (currentToken) {
          validateToken();
        } else {
          forceLogoutCleanup();
        }
      }
    }, 500);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", validateToken);
    };
  }, [validateToken, forceLogoutCleanup]);

  const handleLogout = async () => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      try {
        // FIX: Use API_BASE_URL instead of "assets"
        await fetch(`${API_BASE_URL}/auth/logout`, {
          method: "POST",
          headers: {
            "auth-token": token,
            "Content-Type": "application/json",
          },
        });
      } catch (error) {
        console.error("Logout failed", error);
      }
    }
    forceLogoutCleanup();
    window.location.replace("/");
  };

  return (
    <div className="navbar">
      <Link to="/" style={{ textDecoration: "none" }}>
        <div className="nav-logo">
          <img src="/logo.png" alt="logo" />
          <p>SHOPPER</p>
        </div>
      </Link>
      <ul className="nav-menu">
        <li style={{ textDecoration: "none" }} onClick={() => setMenu("shop")}>
          <Link to="/">Shop</Link>
          {menu === "shop" ? <hr /> : null}
        </li>
        <li style={{ textDecoration: "none" }} onClick={() => setMenu("mens")}>
          <Link to="/mens">Men</Link>
          {menu === "mens" ? <hr /> : null}
        </li>
        <li
          style={{ textDecoration: "none" }}
          onClick={() => setMenu("womens")}
        >
          <Link to="/womens">Women</Link>
          {menu === "womens" ? <hr /> : null}
        </li>
      </ul>
      <div className="nav-login-cart">
        {isAuth ? (
          <button onClick={handleLogout}>Logout</button>
        ) : (
          <Link to="/login">
            <button>Login</button>
          </Link>
        )}
        <Link to="/cart">
          <img src="/cart_icon.png" alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
