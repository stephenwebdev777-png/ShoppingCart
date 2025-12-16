const express = require("express");
const { getAllProducts, addProduct, getNewCollections, getPopularInWomen } = require("../controllers/productController.js");
const { isAdmin } = require("../middleware/isAdmin");
const router = express.Router();

// Public routes
router.get("/newcollections", getNewCollections); // No auth required for new collections
router.get("/popularinwomen", getPopularInWomen); // No auth required for popular in women

// Admin-only routes
router.get("/allproduct", isAdmin, getAllProducts); // Admin only
router.post("/addproduct", isAdmin, addProduct); // Admin only

module.exports = router;
