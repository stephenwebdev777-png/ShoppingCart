const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const { resetJwtSecret, mailUser, mailPass } = require('../config/server');

// Forgot Password
exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ success: false, errors: 'User not found' });

    const resetToken = jwt.sign({ email: user.email }, resetJwtSecret, { expiresIn: '1d' });
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = Date.now() + 24 * 60 * 60 * 1000;
    await user.save();

    const transporter = nodemailer.createTransport({
      host: 'sandbox.smtp.mailtrap.io',
      port: 587,
      auth: { user: mailUser, pass: mailPass },
    });

    const resetLink = `http://localhost:5173/reset-password/${resetToken}`;
    await transporter.sendMail({
      from: '"Shopper Support" <no-reply@shopper.com>',
      to: user.email,
      subject: 'Reset your password',
      html: `<h2>Password Reset</h2><p>Click the link below to reset your password:</p><a href="${resetLink}">${resetLink}</a>`,
    });

    res.json({ success: true, message: 'Password reset link sent to your email' });
  } catch (error) {
    res.status(500).json({ success: false, errors: 'Internal server error' });
  }
};

// Reset Password
exports.resetPassword = async (req, res) => {
  const { token, newPassword } = req.body;
  try {
    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });
    if (!user) return res.status(400).json({ success: false, errors: 'Token is invalid or expired' });

    user.password = await bcrypt.hash(newPassword, 10);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ success: true, message: 'Password has been reset' });
  } catch (error) {
    res.status(500).json({ success: false, errors: 'Internal server error' });
  }
};
