import React , { useContext }from "react";
import "./Footer.css";
import { ShopContext } from "../../Context/ShopContext";

const Footer = () => {
  const { cartItems } = useContext(ShopContext);
  const hasItems = cartItems.some((item) => item.quantity > 0);

  if (!hasItems) {
    return null;
  }
  return (
    <div className="footer">
      <div className="footer-logo">
        <img src="/logo_big.png" alt="" />
        <p>SHOPPER</p>
      </div>
      <ul className="footer-links">
        <li>Company</li>
        <li>Products</li>
        <li>Offices</li>
        <li>About</li>
        <li>Contact</li>
      </ul>
      <div className="footer-social-icon">
        <div className="footer-icons-container">
          <img src="/instagram_icon.png" alt="" />{" "}
        </div>
        <div className="footer-icons-container">
          <img src="/pintester_icon.png" alt="" />{" "}
        </div>
        <div className="footer-icons-container">
          <img src="/whatsapp_icon.png" alt="" />
        </div>
      </div>
      <div className="footer-copyright">
        <hr />
        <p>Copyright @2025- All Rights Reserved </p>
      </div>
    </div>
  );
};

export default Footer;
