/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Proceed.css";

const Proceed = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState(
    "1/189, T.Nagar, Chennai-600017, Tamil Nadu, India"
  );
  const [isEditing, setIsEditing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState(null);
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const displayNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      setShowLoginPopup(true);
      return;
    }

    const fetchUserData = async () => {
      try {
        // FIX: Added /user prefix to match backend index.js
        const response = await fetch("http://localhost:3000/user/getuserinfo", {
          method: "POST",
          headers: {
            Accept: "application/json",
            "auth-token": token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({}),
        });
        const data = await response.json();

        if (data.success) {
          setUserName(data.username);
        } else {
          setUserName("Registered User");
        }
      } catch (error) {
        setUserName("Shopper User");
      }
    };
    fetchUserData();
  }, []);

  const handlePlaceOrder = async () => {
    if (!paymentMethod) {
      displayNotification("Please select a payment method.");
      return;
    }

    const token = localStorage.getItem("auth-token");
    try {
      // FIX: Added /user prefix and clearcart endpoint
      const response = await fetch("http://localhost:3000/user/clearcart", {
        method: "POST",
        headers: {
          "auth-token": token,
          "Content-Type": "application/json",
        },
      });
      const data = await response.json();

      if (data.success) {
        setShowSuccessBanner(true);
      } else {
        displayNotification("Failed to finalize order. Try again.");
      }
    } catch (error) {
      displayNotification("Network error. Please try again.");
    }
  };

  const handleBannerDismiss = () => {
    setShowSuccessBanner(false);
    window.location.replace("/"); // Hard refresh to ensure ShopContext cart clears
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Login Popup for logged out users accessing via URL directly */}
      {showLoginPopup && (
        <div className="login-modal-overlay">
          <div className="login-modal-content">
            <h2 style={{ color: "#ff4141" }}>Login Required</h2>
            <p>You must be logged in to proceed to checkout.</p>
            <button onClick={() => navigate("/login")}>Go to Login</button>
            <button
              onClick={() => navigate("/cart")}
              style={{ backgroundColor: "#ccc", marginLeft: "10px" }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Order Success Banner */}
      <div
        className={`success-banner ${showSuccessBanner ? "show" : ""}`}
        style={{
          position: "fixed",
          top: showSuccessBanner ? "0" : "-100px",
          width: "100%",
          backgroundColor: "#32adf5",
          color: "white",
          padding: "20px",
          textAlign: "center",
          zIndex: 2000,
          transition: "0.5s",
        }}
      >
        <h3 style={{ display: "inline-block", marginRight: "20px" }}>
          Order Placed Successfully!
        </h3>
        <button
          onClick={handleBannerDismiss}
          style={{ padding: "5px 15px", cursor: "pointer" }}
        >
          Continue Shopping
        </button>
      </div>

      <div
        className="checkout-page-container"
        style={{ opacity: showSuccessBanner ? 0.3 : 1 }}
      >
        <h1 className="checkout-title">Final Checkout</h1>

        <div className="delivery-section">
          <h2>1. Delivery Address</h2>
          <div className="delivery-info">
            <p>
              Delivering to: <strong>{userName}</strong>
            </p>
            {isEditing ? (
              <textarea
                className="address-input"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                rows="3"
              />
            ) : (
              <p className="current-address">{address}</p>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="change-address-btn"
            >
              {isEditing ? "Confirm" : "Change Address"}
            </button>
          </div>
        </div>

        {!isEditing && (
          <div className="payment-section">
            <h2>2. Payment Method</h2>
            <div className="payment-options">
              {["UPI", "Card", "COD"].map((method) => (
                <label
                  key={method}
                  className={`payment-option ${
                    paymentMethod === method ? "selected" : ""
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value={method}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                  />
                  {method === "COD" ? "Cash on Delivery" : `Pay via ${method}`}
                </label>
              ))}
            </div>
            <button
              onClick={handlePlaceOrder}
              className="place-order-btn"
              disabled={!paymentMethod}
            >
              PLACE ORDER NOW
            </button>
          </div>
        )}
      </div>

      {showNotification && (
        <div
          className="notification-toast"
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            background: "#ff4141",
            color: "white",
            padding: "10px 20px",
            borderRadius: "5px",
          }}
        >
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default Proceed;
