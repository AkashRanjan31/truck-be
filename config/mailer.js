const nodemailer = require('nodemailer');
const config = require('./env');

const transporter = nodemailer.createTransport({
  service: config.EMAIL_SERVICE,
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD
  }
});

// Test connection
transporter.verify((error, success) => {
  if (error) {
    console.warn('⚠️ Email configuration warning:', error.message);
  } else {
    console.log('✅ Email service ready');
  }
});

module.exports = transporter;
