const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../model/User");
const transporter = require("../config/mail");

// Signup
const signup = async (req, res) => {
  const { email, password, username, role } = req.body;
  const existingUser = await User.findOne({ email });

  if (existingUser) {
    return res.json({ success: false, errors: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({
    username,
    email,
    password: hashedPassword,
    role,
    cartData: {},
  });

  await user.save();
  const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET);
  res.json({ success: true, token, role: user.role });
};

// Login
const login = async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.json({ success: false, errors: "Invalid email or password" });
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return res.status(401).json({ success: false, errors: "Invalid email or password" });
  }

  const token = jwt.sign({ email: user.email, role: user.role }, process.env.JWT_SECRET);
  res.json({ success: true, token, role: user.role });
};

// Logout
const logout = (req, res) => {
  res.json({ success: true, message: "Logged out successfully" });
};

// Forgot Password
const forgotPassword = async (req, res) => {
  const { email } = req.body;
  const user = await User.findOne({ email });
  if (!user) {
    return res.json({ success: false, errors: "User not found" });
  }

  const resetToken = jwt.sign({ email: user.email }, process.env.RESET_JWT_SECRET, { expiresIn: "1d" });
  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: '"Shopper Support" <no-reply@shopper.com>',
    to: user.email,
    subject: "Reset your password",
    html: `<h2>Password Reset</h2><p>Click <a href="${resetLink}">here</a> to reset your password. This link expires in 1 day.</p>`,
  });

  res.json({ success: true, message: "Password reset link sent to your email" });
};

// Reset Password
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token || !newPassword) {
    return res.status(400).json({ success: false, errors: "Token and new password are required." });
  }

  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, errors: "Token is invalid or expired." });
    }

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: "Your password has been successfully updated." });
  } catch (error) {
    res.status(500).json({ success: false, errors: "Internal server error." });
  }
};

module.exports = { signup, login, logout, forgotPassword, resetPassword };
