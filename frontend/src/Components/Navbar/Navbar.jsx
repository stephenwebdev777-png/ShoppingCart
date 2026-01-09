/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState, useCallback } from "react";
import "./Navbar.css";
import logo from "../assets/logo.png";
import cart_icon from "../assets/cart_icon.png";
import { Link, useNavigate } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems, clearCart } = useContext(ShopContext);
  const navigate = useNavigate();
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("auth-token"));

  // Function to wipe local data and redirect
  const forceLogoutCleanup = useCallback(() => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-role");
    clearCart();
    setIsAuth(false);
    navigate("/");
  }, [clearCart, navigate]);

  // Validate the token with the server
  const validateToken = useCallback(async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) return;

    try {
      const response = await fetch("http://localhost:3000/user/getuserinfo", {
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
  }, [forceLogoutCleanup]);

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
        await fetch("http://localhost:3000/auth/logout", {
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
          <img src={logo} alt="logo" />
          <p>SHOPPER</p>
        </div>
      </Link>
      <ul className="nav-menu">
        <li onClick={() => setMenu("shop")}>
          <Link style={{ textDecoration: "none" }} to="/">
            Shop
          </Link>
          {menu === "shop" ? <hr /> : null}
        </li>
        <li onClick={() => setMenu("mens")}>
          <Link style={{ textDecoration: "none" }} to="/mens">
            Men
          </Link>
          {menu === "mens" ? <hr /> : null}
        </li>
        <li onClick={() => setMenu("womens")}>
          <Link style={{ textDecoration: "none" }} to="/womens">
            Women
          </Link>
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
          <img src={cart_icon} alt="cart" />
        </Link>
        <div className="nav-cart-count">{getTotalCartItems()}</div>
      </div>
    </div>
  );
};

export default Navbar;
