
import React from 'react'
import './Sidebar.css'
import { Link, useLocation } from 'react-router-dom' 
import add_product_icon from '../../assets/Product_cart.svg' 
import list_product_icon from '../../assets/Product_list_icon.svg'

const Sidebar = () => {
  const location = useLocation(); 
  const isActive = (path) => {    
      return location.pathname.startsWith(path);
  }

  return (
    <>
    <div className="sidebar">   
      <Link to={'/admin/addproduct'} style={{ textDecoration: 'none' }} >
        <div className={`sidebar-item ${isActive('/admin/addproduct') ? 'active' : ''}`}> 
          <img src={add_product_icon} alt='Add Product Icon'/>
          <p>Add Product</p>
        </div>
      </Link>
      
      <Link to={'/admin/listproduct'} style={{ textDecoration: 'none' }} >
        <div className={`sidebar-item ${isActive('/admin/listproduct') ? 'active' : ''}`}> 
          <img src={list_product_icon} alt='List Product Icon'/>
          <p>List Product</p>
        </div>
      </Link>
      <Link to={'/admin/bulkproducts'} style={{ textDecoration: 'none' }} >
        <div className={`sidebar-item ${isActive('/admin/bulkproducts') ? 'active' : ''}`}> 
          <img src={list_product_icon} alt='List Product Icon'/>
          <p>Bulk Products</p>
        </div>
      </Link>
      
    </div>
    </>
  )
}

export default Sidebar