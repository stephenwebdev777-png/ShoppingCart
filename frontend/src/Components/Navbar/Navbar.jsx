/* eslint-disable no-unused-vars */
import React, { useContext, useEffect, useState } from "react";
import "./Navbar.css";
import logo from "../Assets/logo.png";
import cart_icon from "../Assets/cart_icon.png";
import { Link } from "react-router-dom";
import { ShopContext } from "../../Context/ShopContext";

const Navbar = () => {
  const [menu, setMenu] = useState("shop");
  const { getTotalCartItems, setCartItems } = useContext(ShopContext);
  const [isAuth, setIsAuth] = useState(!!localStorage.getItem("auth-token"));

  useEffect(() => {
    const validateToken = async () => {
      const token = localStorage.getItem("auth-token");
      if (!token) {
        setIsAuth(false);
        return;
      }

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
          localStorage.removeItem("auth-token");
          localStorage.removeItem("user-role");
          setCartItems([]);
          setIsAuth(false);
        } else {
          setIsAuth(true);
        }
      } catch (error) {
        setIsAuth(false);
      }
    };

    validateToken();
  }, [setCartItems]);

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
        console.error("Logout failed:", error);
      }
    }
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-role");
    setCartItems([]);
    setIsAuth(false);
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
          {menu === "shop" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("mens")}>
          <Link style={{ textDecoration: "none" }} to="/mens">
            Men
          </Link>
          {menu === "mens" ? <hr /> : <></>}
        </li>
        <li onClick={() => setMenu("womens")}>
          <Link style={{ textDecoration: "none" }} to="/womens">
            Women
          </Link>
          {menu === "womens" ? <hr /> : <></>}
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
