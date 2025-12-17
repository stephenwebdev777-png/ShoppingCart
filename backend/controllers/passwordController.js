const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/User");
const { hashPassword } = require("../utils/hashUtils");

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const resetToken = jwt.sign(
    { email: user.email },
    process.env.RESET_JWT_SECRET,
    { expiresIn: "1d" }
  );

  user.resetPasswordToken = resetToken;
  user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000;
  await user.save();

  const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 587,
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

  await transporter.sendMail({
    from: '"Shopper Support" <no-reply@shopper.com>',
    to: user.email,
    subject: "Reset Password",
    html: `<p>Click <a href="${resetLink}">here</a> to reset password</p>`,
  });

  res.json({ success: true, message: "Reset link sent" });
};

// RESET PASSWORD
const resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;

  const user = await User.findOne({
    resetPasswordToken: token,
    resetPasswordExpires: { $gt: Date.now() },
  });

  if (!user) {
    return res.status(400).json({ success: false, message: "Invalid token" });
  }

  user.password = await hashPassword(newPassword);
  user.resetPasswordToken = undefined;
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};

module.exports = { forgotPassword, resetPassword };
