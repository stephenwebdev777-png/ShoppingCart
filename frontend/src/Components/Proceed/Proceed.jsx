/* eslint-disable react-hooks/set-state-in-effect */
import React, { useState, useEffect } from "react"; //proceed to checkout page
import { useNavigate } from "react-router-dom";
import "./Proceed.css";

const Proceed = () => {
  const navigate = useNavigate();
  const [userName, setUserName] = useState("");
  const [address, setAddress] = useState(
    "1/189, T.Nagar, Chennai-600017, Tamil Nadu, India"
  );
  const [isEditing, setIsEditing] = useState(false); 
  const [paymentMethod, setPaymentMethod] = useState(null); //UPI,COD 
  const [showLoginPopup, setShowLoginPopup] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [notificationMessage, setNotificationMessage] = useState("");
  const [showSuccessBanner, setShowSuccessBanner] = useState(false);

  const displayNotification = (message) => {
    setNotificationMessage(message);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };
  const handleLoginRedirect = () => {
    navigate("/login");
  };
  const handleCancel = () => {
    setShowLoginPopup(false);
    navigate("/cart");
  };
  useEffect(() => {
    const token = localStorage.getItem("auth-token");
    if (!token) {
      setShowLoginPopup(true);
      return;
    }
    const fetchUserData = async () => {
      try {
        const response = await fetch("http://localhost:3000/getuserinfo", {
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
          console.error("Failed to fetch user name:", data.error);
          setUserName("Registered User");
        }
      } catch (error) {
        console.error("Network error fetching user data:", error);
        setUserName("Network Error User");
      }
    };
    fetchUserData();
  }, []);

  const handleContinue = () => {
    if (address.trim() === "") {
      displayNotification("Please enter your delivery address.", "error");
      return;
    }
    if (isEditing) {
      setIsEditing(false);
      displayNotification("Delivery address saved.", "success");
      return;
    }
  };

  const handlePlaceOrder = () => {
    if (!paymentMethod) {
      displayNotification("Please select a payment method.", "error");
      return;
    }
    setShowSuccessBanner(true);
  };

  const handleBannerDismiss = () => {
    setShowSuccessBanner(false);
    navigate("/");
  };

  return (
    <div style={{ position: "relative" }}>
      {showLoginPopup && (
        <div
          className="login-modal-overlay"
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            zIndex: 3000,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            className="login-modal-content"
            style={{
              backgroundColor: "white",
              padding: "40px",
              borderRadius: "10px",
              boxShadow: "0 5px 15px rgba(0,0,0,0.5)",
              textAlign: "center",
              maxWidth: "400px",
            }}
          >
            <h2
              style={{
                color: "#ff4141",
                fontSize: "24px",
                marginBottom: "15px",
              }}
            >
              Please Login
            </h2>
            <p style={{ fontSize: "18px", margin: "20px 0" }}>
              You must be logged in to proceed to checkout.
            </p>
            <div
              style={{
                marginTop: "30px",
                display: "flex",
                justifyContent: "space-around",
              }}
            >
              <button
                onClick={handleLoginRedirect}
                style={{
                  padding: "10px 25px",
                  backgroundColor: "#ff4141",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontWeight: "bold",
                  fontSize: "16px",
                }}
              >
                Login
              </button>

              <button
                onClick={handleCancel}
                style={{
                  padding: "10px 25px",
                  backgroundColor: "#ccc",
                  color: "#333",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "16px",
                }}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      <div
        style={{
          position: "fixed",
          top: showSuccessBanner ? "0" : "-100px",
          left: 0,
          width: "100%",
          backgroundColor: "#32adf5ff",
          color: "white",
          padding: "15px 0",
          textAlign: "center",
          boxShadow: "0 4px 10px rgba(0, 0, 0, 0.2)",
          zIndex: 2000,
          transition: "top 0.5s ease-in-out",
        }}
      >
        <div
          style={{
            maxWidth: "800px",
            margin: "0 auto",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "0 20px",
          }}
        >
          <h3 style={{ margin: 0, fontWeight: "700" }}>
            Order Placed! Your Order is Confirmed
          </h3>
          <button
            onClick={handleBannerDismiss}
            style={{
              background: "transparent",
              border: "1px solid white",
              color: "white",
              padding: "5px 15px",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "bold",
            }}
          >
            Continue Shopping &rarr;
          </button>
        </div>
      </div>
      {!showLoginPopup && (
        <div
          className="checkout-page-container"
          style={{
            opacity: showSuccessBanner ? 0.4 : 1,
            pointerEvents: showSuccessBanner ? "none" : "auto",
            transition: "opacity 0.3s",
          }}
        >
          <h1 className="checkout-title">Final Checkout</h1>

          <div className="delivery-section">
            <h2>1. Delivery Address</h2>

            <div className="delivery-info">
              <p>
                Delivering to:{" "}
                <span className="user-name-display">{userName}</span>
              </p>

              {isEditing ? (
                <textarea
                  className="address-input"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter full delivery address..."
                  rows="4"
                />
              ) : (
                <p className="current-address">{address}</p>
              )}
            </div>

            <div className="address-actions">
              <button
                onClick={() => setIsEditing(!isEditing)}
                className="change-address-btn"
              >
                {isEditing ? "Confirm Address" : "Change Delivery Address"}
              </button>

              {!isEditing && (
                <button onClick={handleContinue} className="continue-btn">
                  Continue
                </button>
              )}
            </div>
          </div>

          {!isEditing && (
            <div className="payment-section">
              <h2>2. Select Payment Method</h2>

              <div className="payment-options">
                <label
                  className={`payment-option ${
                    paymentMethod === "UPI" ? "selected" : ""
                  }`}
                  onClick={() => setPaymentMethod("UPI")}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="UPI"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    checked={paymentMethod === "UPI"}
                  />
                  Pay on UPI (Google Pay, PhonePe, etc.)
                </label>
                <label
                  className={`payment-option ${
                    paymentMethod === "Card" ? "selected" : ""
                  }`}
                  onClick={() => setPaymentMethod("Card")}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="Card"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    checked={paymentMethod === "Card"}
                  />
                  Credit or Debit Card
                </label>

                <label
                  className={`payment-option ${
                    paymentMethod === "COD" ? "selected" : ""
                  }`}
                  onClick={() => setPaymentMethod("COD")}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="COD"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    checked={paymentMethod === "COD"}
                  />
                  Cash On Delivery
                </label>
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
      )}

      {showNotification && (
        <div
          style={{
            position: "fixed",
            bottom: "20px",
            right: "20px",
            padding: "15px 25px",
            borderRadius: "8px",
            color: "white",
            fontWeight: "bold",
            zIndex: 1000,
            transition: "opacity 0.3s ease-in-out",
            backgroundColor: "#dc3545",
            boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
          }}
        >
          {notificationMessage}
        </div>
      )}
    </div>
  );
};

export default Proceed;
