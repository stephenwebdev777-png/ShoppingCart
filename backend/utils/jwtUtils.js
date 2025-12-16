const jwt = require('jsonwebtoken');
const { jwtSecret } = require('../config/server');

const generateToken = (user) => {
  return jwt.sign({ email: user.email, role: user.role }, jwtSecret);
};

module.exports = { generateToken };
