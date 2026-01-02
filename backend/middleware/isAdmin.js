
const { verifyToken } = require("../utils/jwtUtils");
const Blacklist = require("../model/Blacklist");

const isAdmin = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  try {
    const isBlacklisted = await Blacklist.findOne({ token: token });
    if (isBlacklisted) {
      return res.status(401).json({ 
        success: false, 
        message: "Token blacklisted. Please login again." 
      });
    }
    const data = verifyToken(token);
    if (data.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admins only" });
    }
    req.user = data.email;
    req.role = data.role;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid token.Login" });
  }
};

module.exports = isAdmin;