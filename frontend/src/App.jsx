import React from 'react'; //outlet -inside a parent route to show the child routes.
import { BrowserRouter , Routes, Route, Outlet, Navigate } from 'react-router-dom'; 
import Navbar from './Components/Navbar/Navbar'; 
import Footer from './Components/Footer/Footer'; 

import Shop from './Pages/Shop'; 
import ShopCategory from './Pages/ShopCategory'; 
import Product from './Pages/Product'; 
import Cart from './Pages/Cart'; 
import LoginSignup from './Pages/LoginSignup'; 

import Admin from './Pages/Admin/Admin'; 
import Addproduct from './Components/Addproduct/Addproduct'; 
import Listproduct from './Components/Listproduct/Listproduct'; 
import Proceed from './Components/Proceed/Proceed';
import banner_women from "./Components/Assets/banner_women.png";
import banner_mens from "./Components/Assets/banner_mens.png";
import ResetPassword from "./Pages/ResetPassword";

function App() {
  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<NavbarWrapper />}>
            <Route index element={<Shop />} />
            <Route path="cart" element={<Cart />} />
            <Route path="mens" element={<ShopCategory category="men" banner={banner_mens}/>} />
            <Route path="womens" element={<ShopCategory category="women" banner={banner_women} />} />
            <Route path="product">
              <Route path=":productId" element={<Product />} />
            </Route>
          </Route>

          <Route path="/login" element={<LoginSignup mode="login" />} />
          <Route path="/signup" element={<LoginSignup mode="signup" />} /> 
          <Route path="/forgotpassword" element={<LoginSignup mode="forgot" />} />     
          <Route path="/reset-password/:token" element={<ResetPassword />} />   
          <Route path="/admin" element={<Admin />}>
            <Route index element={<Navigate to="addproduct" replace />} />  {/*replace to /admin/addproduct*/}
            <Route path="addproduct" element={<Addproduct />} />
            <Route path="listproduct" element={<Listproduct />} />
          </Route>
          <Route path="/checkout" element={<Proceed />} />
        </Routes>
      </BrowserRouter>
    </div>
  );
}
const NavbarWrapper = () => (
  <>
    <Navbar />
    <div >
      <Outlet />
    </div>
    <Footer />
  </>
);

export default App;
