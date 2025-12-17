const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const { generateToken } = require("../utils/jwtUtils");
const { hashPassword, comparePassword } = require("../utils/hashUtils");

const signup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ success: false, message: "User exists" });

    // Use your utility function 
    const hashed = await hashPassword(password);
    
    // Initialize empty cartData to avoid null errors later 
    const user = await User.create({ 
        username, 
        email, 
        password: hashed, 
        role: role || "user",
        cartData: {} 
    });

    const token = generateToken({ email: user.email, role: user.role });
    res.json({ success: true, token, role: user.role });
  } catch (error) {
    res.status(500).json({ success: false, message: "Signup failed" });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) return res.json({ success: false });

  const match = await bcrypt.compare(password, user.password);
  if (!match) return res.json({ success: false });

  const token = jwt.sign({ email, role: user.role }, process.env.JWT_SECRET);
  res.json({ success: true, token, role: user.role });
};

const logout = (req, res) => {
  res.json({ success: true });
};

module.exports = { signup, login, logout };
