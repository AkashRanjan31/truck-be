const mongoose = require('mongoose');

const otpVerificationSchema = new mongoose.Schema({
  email: { type: String, required: true, trim: true, lowercase: true },
  otp: { type: String, required: true },
  expiresAt: { type: Date, required: true },
  attempts: { type: Number, default: 0 },
  maxAttempts: { type: Number, default: 5 },
  isVerified: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

// Auto-delete after expiration
otpVerificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model('OTPVerification', otpVerificationSchema);
