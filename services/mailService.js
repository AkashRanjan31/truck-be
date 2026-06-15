const nodemailer = require('nodemailer');
const config = require('../config/env');

// Create transporter with explicit Gmail configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: config.EMAIL_USER,
    pass: config.EMAIL_PASSWORD
  }
});

// Verify connection on startup
transporter.verify((error, success) => {
  if (error) {
    console.error('❌ Email configuration error:', error.message);
    console.error('   Email:', config.EMAIL_USER);
    console.error('   Please check your .env file EMAIL_USER and EMAIL_PASSWORD');
  } else {
    console.log('✅ Email service verified and ready to send');
  }
});

const sendOTPEmail = async (email, otp) => {
  try {
    console.log('📧 Sending OTP email to:', email);
    
    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: 'Truck Alert - OTP Verification',
      html: `
        <h2>Hello,</h2>
        <p>Your OTP for verification is:</p>
        <h1 style="color: #007bff; letter-spacing: 2px;">${otp}</h1>
        <p><strong>Valid for 10 minutes</strong></p>
        <p>⚠️ Do not share this OTP with anyone.</p>
        <hr/>
        <p>If you did not request this OTP, please ignore this email.</p>
        <br/>
        <p>Regards,<br/><strong>Truck Alert Team</strong></p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ OTP email sent successfully:', info.messageId);
    return true;
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    console.error('   Error code:', err.code);
    console.error('   Details:', err.response);
    throw err; // Throw error so caller knows it failed
  }
};

const sendAlertNotificationEmail = async (email, alertData) => {
  try {
    console.log('📧 Sending alert notification to:', email);
    
    const mailOptions = {
      from: config.EMAIL_USER,
      to: email,
      subject: 'Truck Alert - New Alert Notification',
      html: `
        <h2>Alert Notification</h2>
        <p><strong>Type:</strong> ${alertData.type}</p>
        <p><strong>Severity:</strong> ${alertData.severity}</p>
        <p><strong>Location:</strong> ${alertData.location || 'N/A'}</p>
        <p><strong>Description:</strong> ${alertData.description}</p>
        <hr/>
        <p>Please take necessary action.</p>
        <br/>
        <p>Regards,<br/><strong>Truck Alert Team</strong></p>
      `
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('✅ Alert email sent successfully:', info.messageId);
    return true;
  } catch (err) {
    console.error('❌ Email sending failed:', err.message);
    throw err;
  }
};

module.exports = {
  sendOTPEmail,
  sendAlertNotificationEmail,
  transporter
};
