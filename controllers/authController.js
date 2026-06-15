const User = require('../models/User');
const Driver = require('../models/Driver');
const {
  registerUser, loginAny, loginDriver, loginUser, verifyUserEmail
} = require('../services/authService');
const { createOTP, resendOTP } = require('../services/otpService');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const validators = require('../utils/validators');

// POST /api/auth/register
const registerController = async (req, res, next) => {
  try {
    const { email, phone, password, name, role = 'DRIVER' } = req.body;

    if (!email || !phone || !password || !name)
      return sendError(res, 'All fields are required', 400);
    if (!validators.isValidEmail(email))
      return sendError(res, 'Invalid email format', 400);
    if (!validators.isValidPhone(phone))
      return sendError(res, 'Invalid phone format', 400);
    if (!validators.isValidPassword(password))
      return sendError(res, 'Password must be at least 6 characters', 400);

    const result = await registerUser(email, phone, name, password, role);
    if (!result.success) return sendError(res, result.error, 400);

    // Send OTP for email verification
    const otpResult = await createOTP(email);
    if (!otpResult.success)
      return sendError(res, `Registration succeeded but OTP failed: ${otpResult.error}`, 500);

    sendSuccess(res, 'Registration successful. OTP sent to email.', {
      userId: result.user._id,
      email: result.user.email,
    }, 201);
  } catch (err) { next(err); }
};

// POST /api/auth/verify-otp
const verifyOTPController = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp) return sendError(res, 'Email and OTP are required', 400);

    const result = await verifyUserEmail(email, otp);
    if (!result.success) return sendError(res, result.error, 400);

    sendSuccess(res, 'Email verified successfully', {
      user: result.user,
      token: result.token,
      redirect: result.redirect,
    });
  } catch (err) { next(err); }
};

// POST /api/auth/resend-otp
const resendOTPController = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, 'Email is required', 400);

    const result = await resendOTP(email);
    if (!result.success) return sendError(res, result.error, 400);

    sendSuccess(res, 'OTP resent successfully');
  } catch (err) { next(err); }
};

// POST /api/auth/login
// Accepts: { identifier, password } — identifier can be email or phone
// Auto-detects role, returns token + redirect path
const loginController = async (req, res, next) => {
  try {
    const { email, phone, password, identifier } = req.body;
    const id = identifier || email || phone;

    if (!id || !password)
      return sendError(res, 'Email/phone and password are required', 400);

    const result = await loginAny(id, password);
    if (!result.success) return sendError(res, result.error, 401);

    const userData = result.user || result.driver;

    sendSuccess(res, 'Login successful', {
      user: userData,
      token: result.token,
      role: userData.role || 'DRIVER',
      redirect: result.redirect,
    });
  } catch (err) { next(err); }
};

// GET /api/auth/profile
const getUserProfileController = async (req, res, next) => {
  try {
    const userId = req.user?.id || req.userId;
    if (!userId) return sendError(res, 'Not authenticated', 401);

    let user;
    if (req.user?.role === 'DRIVER') {
      user = await Driver.findById(userId)
        .select('-password')
        .populate('homeState currentState');
    } else {
      user = await User.findById(userId)
        .select('-password')
        .populate('assignedState');
    }

    if (!user) return sendError(res, 'User not found', 404);
    sendSuccess(res, 'Profile retrieved', user);
  } catch (err) { next(err); }
};

// GET /api/auth/me — lightweight token check + role
const getMeController = async (req, res, next) => {
  try {
    const { id, role } = req.user;
    sendSuccess(res, 'Authenticated', {
      id,
      role,
      redirect: require('../services/authService').getDashboardRoute(role),
    });
  } catch (err) { next(err); }
};

module.exports = {
  registerController,
  verifyOTPController,
  resendOTPController,
  loginController,
  getUserProfileController,
  getMeController,
};
