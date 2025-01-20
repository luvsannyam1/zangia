const nodemailer = require("nodemailer");
const transport = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: 587,
  auth: {
    user: "api",
    pass: process.env.SMTP_PASSWORD,
  },
});

module.exports = transport;
