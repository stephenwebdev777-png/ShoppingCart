const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "default_session_secret";

const isAdmin = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: Admin login required" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    if (data.role !== "admin") {
      return res.status(403).json({ success: false, message: "Access denied: Admins only" });
    }
    req.user = data.email;
    req.role = data.role;
    next();
  } catch {
    res.status(401).json({ success: false, errors: "Invalid token" });
  }
};

module.exports = isAdmin;
