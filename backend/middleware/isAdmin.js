const { verifyToken } = require("../utils/jwtUtils");

const isAdmin = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ success: false, message: "Token missing" });
  }

  try {
    const data = verifyToken(token);
    if (data.role !== "admin") {
      return res.status(403).json({ success: false, message: "Admins only" });
    }

    req.user = data.email;
    req.role = data.role;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = isAdmin;
