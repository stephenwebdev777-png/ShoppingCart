import React, { useState } from 'react';  // product page based on men women 
import './Item.css';
import { Link, useNavigate } from 'react-router-dom';

const Item = (props) => {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);   

   //discount percent
  const discountPercentage = Math.round(((props.old_price - props.new_price) / props.old_price) * 100);
  
   //delivery date to get within 7 and 10 days, use modulo 4  7+(0 to 3)
  const daysToAdd = 7 + (props.id % 4); 
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + daysToAdd);
  const deliveryDateString = deliveryDate.toLocaleDateString('en-US', { day: 'numeric', month: 'short' });

  const handleItemClick = (e) => {   
    if (!localStorage.getItem('auth-token')) {
      e.preventDefault(); 
      setShowModal(true); 
      window.scrollTo(0, 0);
    }  
  }
  const handleLoginRedirect = () => {
    navigate('/login');
  }
  return (
    <div className='item'>   
      <Link to={`/product/${props.id}`} onClick={handleItemClick}>
        <img src={props.image} alt="" />
      </Link>      
      <p>{props.name}</p>      
      <div className="item-prices">
        <div className="item-price-new">
            Rs.{props.new_price}
        </div>
        <div className="item-price-old">
            Rs.{props.old_price}
        </div>
      </div>      
      <div className="item-discount" style={{
          color: '#E53935', 
          fontSize: '16px', 
          marginTop: '5px', 
          fontWeight: '700'
      }}>
          ({discountPercentage}% Off)
      </div>    
      <div className="item-delivery-info" style={{
          color: '#424242ff', 
          fontSize: '17px', 
          fontWeight: 'bold', 
          marginTop: '5px'
      }}>
          Free Delivery <span style={{fontWeight: '900', color: '#070000ff'}}>{deliveryDateString}</span>
      </div>      
   
      {showModal && (
        <div className="login-modal-overlay">
          <div className="login-modal-content">
            <h2>Access Restricted</h2>
            <p>Login to view product details.</p>
            
            <button className="login-modal-btn" onClick={handleLoginRedirect}>
              Go to Login
            </button>            
            <br />            
            <button className="login-modal-close" onClick={() => setShowModal(false)}>
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Item;