const express = require("express");
const { signup, login, logout } = require("../controllers/authController");
const {
  forgotPassword,
  resetPassword,
} = require("../controllers/passwordController");

const router = express.Router();

router.post("/signup", signup);
router.post("/login", login);
router.post("/logout", logout);
router.post("/forgotpassword", forgotPassword);
router.post("/resetpassword", resetPassword);

module.exports = router;
