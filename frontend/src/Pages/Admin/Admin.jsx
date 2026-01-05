/* eslint-disable no-unused-vars */
import React, { useEffect, useCallback } from "react";
import { Outlet } from "react-router-dom";
import "./Admin.css";
import Navbar from "../../Components/adminNavbar/Navbar";
import Sidebar from "../../Components/Sidebar/Sidebar";

const Admin = () => {
  const forceLogoutCleanup = useCallback(() => {
    localStorage.removeItem("auth-token");
    localStorage.removeItem("user-role");
    window.location.replace("/");
  }, []);

  const validateToken = useCallback(async () => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      forceLogoutCleanup();
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
        forceLogoutCleanup();
      }
    } catch (error) {
      forceLogoutCleanup();
    }
  }, [forceLogoutCleanup]);

  useEffect(() => {
    const storageHandler = (e) => {
      if (e.key === "auth-token") {
        validateToken();
      }
    };

    window.addEventListener("storage", storageHandler);

    let lastToken = localStorage.getItem("auth-token");
    const interval = setInterval(() => {
      const currentToken = localStorage.getItem("auth-token");
      if (currentToken !== lastToken) {
        lastToken = currentToken;
        validateToken();
      }
    }, 500);

    return () => {
      clearInterval(interval);
      window.removeEventListener("storage", storageHandler);
    };
  }, [validateToken]);

  const handleLogout = async () => {
    const token = localStorage.getItem("auth-token");
    if (token) {
      try {
        await fetch("http://localhost:3000/auth/logout", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "auth-token": token,
          },
        });
      } catch (error) {
        console.error(error);
      }
    }
    forceLogoutCleanup();
  };

  return (
    <div className="admin-panel">
      <div
        style={{
          backgroundColor: "#fff",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          height: "80px",
          display: "flex",
          alignItems: "center",
          padding: "0 20px",
          justifyContent: "space-between",
        }}
      >
        <Navbar />
        <button
          className="logout-button"
          onClick={handleLogout}
          style={{
            margin: "0",
            position: "static",
            height: "58px",
          }}
        >
          Logout
        </button>
      </div>

      <div style={{ display: "flex", flex: 1 }}>
        <Sidebar />
        <div style={{ flex: 1, padding: "20px", overflowY: "auto" }}>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Admin;
