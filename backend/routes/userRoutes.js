const express = require("express");
const {
  getCart,
  updateCart,
  addToCart,
  removeFromCart,
  getUserInfo,
} = require("../controllers/cartController");
const fetchUser = require("../middleware/fetchUser");
const router = express.Router();

router.post("/getcart", fetchUser, getCart); // Get user's cart
router.post("/updatecart", fetchUser, updateCart); // Update user's cart
router.post("/addtocart", fetchUser, addToCart); // Add product to cart
router.post("/removefromcart", fetchUser, removeFromCart); // Remove product from cart
router.post("/getuserinfo", fetchUser, getUserInfo); // Get user's info

module.exports = router;
