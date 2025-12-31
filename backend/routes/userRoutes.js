const express = require("express"); 
const fetchUser = require("../middleware/fetchUser"); 
const {
  addToCart,
  removeFromCart,
  getCart,
  updateCart,
  getUserInfo,
  removeEntireItem
} = require("../controllers/cartController"); 

const router = express.Router(); 

router.post("/addtocart", fetchUser, addToCart); 
router.post("/removefromcart", fetchUser, removeFromCart);
router.post("/getcart", fetchUser, getCart); 
router.post("/updatecart", fetchUser, updateCart); 
router.post("/getuserinfo", fetchUser, getUserInfo); 
router.post("/removeentireitem", fetchUser, removeEntireItem);

module.exports = router; 