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
      //Scrolls page to top when route changes.
      window.scrollTo(0, 0);
    }
  }, [pathname]);
  return null;
};

const RoleProtectedRoute = ({ children, allowedRole }) => {
  const token = localStorage.getItem("auth-token");
  const userRole = localStorage.getItem("user-role");
  const location = useLocation();

  if (!token) {
    return (
      <Navigate
        to={`/login?redirect=${encodeURIComponent(location.pathname)}`}
        replace
      />
    );
  }

  if (allowedRole === "admin" && userRole !== "admin") {
    //Non-admin trying admin page
    return <Navigate to="/" replace />;
  }

  if (allowedRole === "user" && userRole === "admin") {
    return <Navigate to="/admin" replace />;
  }

  return children;
};

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
        This Shopper page can't be found
      </h1>
      <p style={{ fontSize: "24px" }}>
        No webpage found for:{" "}
        <span style={{ color: "#1a73e8" }}>{window.location.href}</span>
      </p>
      <p style={{ fontSize: "17px", color: "#70757a", marginTop: "20px" }}>
        HTTP ERROR 404
      </p>
      <button
        onClick={() => window.location.reload()}
        style={{
          marginTop: "40px",
          padding: "10px 24px",
          backgroundColor: "#1a73e8",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
          fontSize: "14px",
          fontWeight: "500",
          boxShadow:
            "0 1px 2px 0 rgba(60,64,67,0.30), 0 1px 3px 1px rgba(60,64,67,0.15)",
        }}
      >
        Refresh
      </button>
    </div>
  );
};

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<NavbarWrapper />}>
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
          <Route path="mens/product/:productId" element={<Product />} />
          <Route path="womens/product/:productId" element={<Product />} />
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
          <Route path="/reset-password/:token" element={<ResetPassword />} />
        </Route>

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
  const hideLayout =
    ["/login", "/signup", "/forgotpassword", "/checkout"].includes(
      location.pathname
    ) || location.pathname.startsWith("/reset-password/");
  return (
    <>
      {!hideLayout && <Navbar />}
      <Outlet />
      {!hideLayout && <Footer />}
    </>
  );
};

export default App;
