const { verifyToken } = require("../utils/jwtUtils");

const fetchUser = (req, res, next) => {
  const token = req.header("auth-token");
  if (!token) {
    return res.status(401).json({ success: false, message: "Login required" });
  }

  try {
    const data = verifyToken(token);
    req.user = data.email;
    req.role = data.role;
    next();
  } catch {
    res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = fetchUser;
