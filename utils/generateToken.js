const jwt = require('jsonwebtoken');

const generateToken = (user, expiresIn = '7d') => {
  const token = jwt.sign(
    {
      id: user._id,
      email: user.email,
      phone: user.phone,
      role: user.role || 'DRIVER',
      assignedState: user.assignedState || user.homeState
    },
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn }
  );
  return token;
};

const verifyToken = (token) => {
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    return decoded;
  } catch (err) {
    return null;
  }
};

module.exports = {
  generateToken,
  verifyToken
};
