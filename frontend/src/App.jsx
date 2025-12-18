/* cite: App.jsx, authController.js, isAdmin.js */
import React, { useEffect } from "react";
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
import Proceed from "./Components/Proceed/Proceed";
import ResetPassword from "./Pages/ResetPassword";
import banner_women from "./Components/Assets/banner_women.png";
import banner_mens from "./Components/Assets/banner_mens.png";

// Built-in Scroll Fix
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    const currentPathValid = [
      "/",
      "/mens",
      "/womens",
      "/login",
      "/signup",
      "/forgotpassword",
      "/cart",
      "/checkout",
      "/admin",
    ].some(
      (path) =>
        pathname === path ||
        pathname.includes("/product/") ||
        pathname.includes("/admin/")
    );

    if (currentPathValid) {
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
};

// ROLE-BASED PROTECTED ROUTE
/* cite: App.jsx */
const RoleProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("auth-token");
  const userRole = localStorage.getItem("user-role");
  const location = useLocation();

  if (!token) {
    // PASS THE FULL CURRENT PATH to redirect back exactly here after login
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (allowedRole === "admin" && userRole !== "admin") {
    return <Navigate to="/" replace />;
  }

  if (allowedRole === "user" && userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

// Standalone 404 Component
const NotFoundPage = () => {
  useEffect(() => {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh";
    return () => {
      document.body.style.overflow = "auto";
      document.body.style.height = "auto";
    };
  }, []);

  return (
    <div
      style={{
        fontFamily: "system-ui, sans-serif",
        padding: "8% 12%",
        height: "100vh",
        backgroundColor: "#fff",
      }}
    >
      <h1 style={{ fontSize: "35px", color: "#202124" }}>
        This Shopper page can’t be found
      </h1>
      <p style={{ fontSize: "24px" }}>
        No webpage found for:{" "}
        <span style={{ color: "#1a73e8" }}>{window.location.href}</span>
      </p>
      <p style={{ fontSize: "17px", color: "#70757a", marginTop: "20px" }}>
        HTTP ERROR 404
      </p>
    </div>
  );
};

/* cite: App.jsx */
function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<NavbarWrapper />}>
          {/* PUBLIC ROUTES: Anyone can see these */}
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

          {/* PROTECTED ROUTES: Only users can view products or checkout */}
          <Route
            path="mens/product/:productId"
            element={
              <RoleProtectedRoute allowedRole="user">
                <Product />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="womens/product/:productId"
            element={
              <RoleProtectedRoute allowedRole="user">
                <Product />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="cart"
            element={
              <RoleProtectedRoute allowedRole="user">
                <Cart />
              </RoleProtectedRoute>
            }
          />
          <Route
            path="checkout"
            element={
              <RoleProtectedRoute allowedRole="user">
                <Proceed />
              </RoleProtectedRoute>
            }
          />
        </Route>

        {/* Admin Dashboard */}
        <Route
          path="/admin"
          element={
            <RoleProtectedRoute allowedRole="admin">
              <Admin />
            </RoleProtectedRoute>
          }
        >
          <Route index element={<Navigate to="addproduct" replace />} />
          <Route path="addproduct" element={<Addproduct />} />
          <Route path="listproduct" element={<Listproduct />} />
        </Route>

        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

const NavbarWrapper = () => {
  const location = useLocation();
  const hideLayout = [
    "/login",
    "/signup",
    "/forgotpassword",
    "/checkout",
  ].includes(location.pathname);
  return (
    <>
      {!hideLayout && <Navbar />}
      <Outlet />
      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
