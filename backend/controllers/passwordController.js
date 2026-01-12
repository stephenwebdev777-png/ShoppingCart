const jwt = require("jsonwebtoken");
const nodemailer = require("nodemailer");
const User = require("../model/User");
const { hashPassword } = require("../utils/hashUtils");
const transporter = require("../config/mail");

// FORGOT PASSWORD
const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const resetToken = jwt.sign(
      { email: user.email },
      process.env.RESET_JWT_SECRET,
      { expiresIn: "1h" }
    );

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 3600000; 
    await user.save();

    const resetLink = `${process.env.FRONTEND_URL}/reset-password/${resetToken}`;

    // Send the email using the IMPORTED transporter
    await transporter.sendMail({
      from: '"Shopper Support" <no-reply@shopper.com>',
      to: user.email,
      subject: "Reset Password",
      html: `<p>You requested a password reset. Click <a href="${resetLink}">here</a> to reset it. This link expires in 1 hour.</p>`,
    });

    res.json({ success: true, message: "Reset link sent to your email" });
  } catch (error) {
    console.error("Email Error:", error);
    res.status(500).json({ success: false, message: "Failed to send email. Please try again later." });
  }
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
  user.resetPasswordToken = undefined;  //Clears reset token
  user.resetPasswordExpires = undefined;
  await user.save();

  res.json({ success: true, message: "Password reset successful" });
};

module.exports = { forgotPassword, resetPassword };
