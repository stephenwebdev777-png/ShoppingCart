/* cite: Shop.jsx */
import React, { useState } from "react";
import Popular from "../Components/Popular/Popular";
import NewCollections from "../Components/NewCollections/NewCollections";
import Sample from "../Components/Sample/Sample";
import Offer from "../Components/Offers/Offer";
import NewsLetter from "../Components/NewsLetter/NewsLetter";
import { useNavigate } from "react-router-dom";

const Shop = () => {
  const [showModal, setShowModal] = useState(false);
  const [redirectPath, setRedirectPath] = useState("");
  const navigate = useNavigate();

  // FORMULA: (old-new)/new ratio mapped to 4-10 days
  const calculateDeliveryDate = (oldPrice, newPrice) => {
    const difference = Math.abs(oldPrice - newPrice);
    const ratio = (difference / newPrice) * 100;

    // We use modulo 7 to get a variance of 0 to 6
    let variance = Math.round(ratio) % 7;

    // Base 4 + Variance (0 to 6) = 4 to 10 days
    const daysToAdd = 4 + variance;

    const deliveryDate = new Date();
    deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);

    return deliveryDate.toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
    });
  };

  const triggerModal = (path) => {
    setRedirectPath(path);
    setShowModal(true);
  };

  return (
    <div>
      {showModal && (
        <div className="auth-modal-overlay">
          <div className="auth-modal">
            <h2>Login Required</h2>
            <p>Please login to view product details and continue shopping.</p>
            <div className="modal-buttons">
              <button
                className="btn-login"
                onClick={() =>
                  navigate(
                    `/login?redirect=${encodeURIComponent(redirectPath)}`
                  )
                }
              >
                Go to Login
              </button>
              <button className="btn-close" onClick={() => setShowModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
      <Sample />
      <Popular onItemClick={triggerModal} getDelivery={calculateDeliveryDate} />
      <Offer />
      <NewCollections
        onItemClick={triggerModal}
        getDelivery={calculateDeliveryDate}
      />
      <NewsLetter />
    </div>
  );
};

export default Shop;
