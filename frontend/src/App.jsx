import React from "react";
import {
  BrowserRouter,
  Routes,
  Route,
  Navigate,
  Outlet,
  useLocation,
} from "react-router-dom";
import Navbar from "./Components/Navbar/Navbar";
import Footer from "./Components/Footer/Footer";
import Shop from "./Pages/Shop";
import ShopCategory from "./Pages/ShopCategory";
import Product from "./Pages/Product";
import Cart from "./Pages/Cart";
import LoginSignup from "./Pages/LoginSignup";
import Admin from "./Pages/Admin/Admin";
import Addproduct from "./Components/Addproduct/Addproduct";
import Listproduct from "./Components/Listproduct/Listproduct";
import banner_women from "./Components/Assets/banner_women.png";
import banner_mens from "./Components/Assets/banner_mens.png";
import ResetPassword from "./Pages/ResetPassword";

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem("auth-token");
  const location = useLocation();

  if (!token) {
    // Redirect with a state message so LoginSignup can show a popup
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        state={{ message: "Please login to continue." }}
        replace
      />
    );
  }
  return children;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NavbarWrapper />}>
          {/* PUBLIC: Everyone can see these */}
          <Route index element={<Shop />} />
          <Route
            path="mens"
            element={<ShopCategory category="men" banner={banner_mens} />}
          />
          <Route
            path="womens"
            element={<ShopCategory category="women" banner={banner_women} />}
          />
          <Route path="login" element={<LoginSignup mode="login" />} />
          <Route path="signup" element={<LoginSignup mode="signup" />} />
          <Route
            path="forgotpassword"
            element={<LoginSignup mode="forgot" />}
          />
          <Route path="reset-password/:token" element={<ResetPassword />} />

          {/* PRIVATE: Must be logged in to view these specific product paths */}
          <Route
            path="mens/product/:productId"
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />
          <Route
            path="womens/product/:productId"
            element={
              <ProtectedRoute>
                <Product />
              </ProtectedRoute>
            }
          />

          <Route
            path="cart"
            element={
              <ProtectedRoute>
                <Cart />
              </ProtectedRoute>
            }
          />
        </Route>

        {/* ADMIN: Private and specific */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Admin />
            </ProtectedRoute>
          }
        >
          <Route index element={<Navigate to="addproduct" replace />} />
          <Route path="addproduct" element={<Addproduct />} />
          <Route path="listproduct" element={<Listproduct />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

const NavbarWrapper = () => {
  const location = useLocation();
  // Hide Navbar on Login, Signup, and ForgotPassword pages to prevent double logo
  const hideNavbar = ["/login", "/signup", "/forgotpassword"].includes(
    location.pathname
  );

  return (
    <>
      {!hideNavbar && <Navbar />}
      <Outlet />
      {!hideNavbar && <Footer />}
    </>
  );
};

export default App;
