const jwt = require('jsonwebtoken');
const config = require('./env');

const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role || 'DRIVER'
    },
    config.JWT_SECRET,
    { expiresIn: config.JWT_EXPIRY }
  );
};

const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.JWT_SECRET);
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
