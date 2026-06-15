const User = require('../models/User');
const Driver = require('../models/Driver');
const { generateToken } = require('../utils/generateToken');
const { verifyOTP } = require('./otpService');

// ── Register a new User (non-driver roles) ───────────────────────────────────
const registerUser = async (email, phone, name, password, role = 'DRIVER') => {
  try {
    const existing = await User.findOne({ $or: [{ email }, { phone }] });
    if (existing) return { success: false, error: 'Email or phone already registered' };

    const user = await User.create({ email, phone, name, password, role, isVerified: false });
    const token = generateToken(user);
    return { success: true, user: user.toObject(), token };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ── Login for SUPER_ADMIN / STATE_ADMIN / AUTHORITY (email + password) ───────
const loginUser = async (email, password) => {
  try {
    const user = await User.findOne({ email }).populate('assignedState');
    if (!user) return { success: false, error: 'User not found' };

    // Seeded admin accounts skip email verification
    const skipVerify = ['SUPER_ADMIN', 'STATE_ADMIN', 'AUTHORITY'].includes(user.role);
    if (!skipVerify && !user.isVerified)
      return { success: false, error: 'Please verify your email first' };

    if (!user.isActive) return { success: false, error: 'Account is inactive' };

    const valid = await user.comparePassword(password);
    if (!valid) return { success: false, error: 'Invalid password' };

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);
    // Return dashboard redirect hint based on role
    const redirect = getDashboardRoute(user.role);
    return { success: true, user: sanitize(user), token, redirect };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ── Login for DRIVER (phone + optional password, or phone-only legacy) ────────
const loginDriver = async (phoneOrEmail, password) => {
  try {
    // Support both phone and email lookup
    const driver = await Driver.findOne({
      $or: [{ phone: phoneOrEmail }, { email: phoneOrEmail }],
    }).populate('homeState currentState');

    if (!driver) return { success: false, error: 'Driver not found' };
    if (!driver.isActive) return { success: false, error: 'Account is inactive' };

    // If driver has a password set, verify it; otherwise allow phone-only login (legacy)
    if (driver.password && password) {
      const valid = await driver.comparePassword(password);
      if (!valid) return { success: false, error: 'Invalid password' };
    } else if (driver.password && !password) {
      return { success: false, error: 'Password required' };
    }

    driver.lastLogin = new Date();
    await driver.save();

    const token = generateToken(driver);
    return { success: true, driver: sanitize(driver), token, redirect: '/dashboard/driver' };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ── Unified login — auto-detects role from email/phone ───────────────────────
const loginAny = async (identifier, password) => {
  // Try User model first (admin/authority roles)
  const user = await User.findOne({
    $or: [{ email: identifier }, { phone: identifier }],
  }).populate('assignedState');

  if (user) return loginUser(identifier, password);

  // Fall back to Driver model
  return loginDriver(identifier, password);
};

// ── OTP email verification ────────────────────────────────────────────────────
const verifyUserEmail = async (email, otp) => {
  try {
    const result = await verifyOTP(email, otp);
    if (!result.success) return result;

    const user = await User.findOne({ email });
    if (!user) return { success: false, error: 'User not found' };

    user.isVerified = true;
    await user.save();

    const token = generateToken(user);
    return { success: true, user: sanitize(user), token, redirect: getDashboardRoute(user.role) };
  } catch (err) {
    return { success: false, error: err.message };
  }
};

// ── Helpers ───────────────────────────────────────────────────────────────────
const getDashboardRoute = (role) => {
  const routes = {
    SUPER_ADMIN: '/dashboard/super-admin',
    STATE_ADMIN: '/dashboard/state-admin',
    AUTHORITY:   '/dashboard/authority',
    DRIVER:      '/dashboard/driver',
  };
  return routes[role] || '/';
};

const sanitize = (doc) => {
  const obj = doc.toObject ? doc.toObject() : { ...doc };
  delete obj.password;
  return obj;
};

module.exports = {
  registerUser,
  loginUser,
  loginDriver,
  loginAny,
  verifyUserEmail,
  getDashboardRoute,
};
