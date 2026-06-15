const express = require('express');
const router = express.Router();
const {
  registerController,
  verifyOTPController,
  resendOTPController,
  loginController,
  getUserProfileController,
  getMeController,
} = require('../controllers/authController');
const auth = require('../middleware/auth');
const { loginLimiter, otpLimiter, apiLimiter } = require('../middleware/rateLimitMiddleware');

// Public
router.post('/register',    apiLimiter,   registerController);
router.post('/verify-otp',  otpLimiter,   verifyOTPController);
router.post('/resend-otp',  otpLimiter,   resendOTPController);
router.post('/login',       loginLimiter, loginController);

// Protected
router.get('/profile', auth, getUserProfileController);
router.get('/me',      auth, getMeController);  // lightweight role check

module.exports = router;
