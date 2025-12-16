const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "default_session_secret";

const fetchUser = async (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ success: false, message: "Unauthorized: Please login first" });
  }

  try {
    const data = jwt.verify(token, JWT_SECRET);
    req.user = data.email;
    req.role = data.role;
    next();
  } catch {
    res.status(401).json({ success: false, errors: "Invalid token" });
  }
};

module.exports = fetchUser;
