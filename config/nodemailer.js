const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false,
  auth: {
    user: "87e75b002@smtp-brevo.com",
    pass: "DXksJdVBv427ZMWh",
  },
});

module.exports = transporter;
