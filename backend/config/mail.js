const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST|| "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});
transporter.verify((error, success) => {
  if (error) {
    console.log("Transporter connection error:", error);
  } else {
    console.log("Server is ready to send emails");
  }
});

module.exports = transporter;
