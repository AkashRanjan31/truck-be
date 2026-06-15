const jwt = require('jsonwebtoken');
const Driver = require('../models/Driver');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    // Support both JWT token and legacy x-driver-id header
    const token = req.headers.authorization?.split(' ')[1];
    const driverId = req.headers['x-driver-id'];

    if (token) {
      // JWT token authentication
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
      
      // Load user based on role
      let user;
      if (decoded.role === 'DRIVER') {
        user = await Driver.findById(decoded.id).populate('truck homeState currentState');
      } else {
        user = await User.findById(decoded.id).populate('assignedState');
      }

      if (!user) return res.status(401).json({ error: 'User not found' });
      if (!user.isActive) return res.status(401).json({ error: 'User account is inactive' });

      req.user = { ...decoded, ...user.toObject() };
      req.userId = decoded.id;
      return next();
    } else if (driverId) {
      // Legacy driver ID authentication
      const driver = await Driver.findById(driverId);
      if (!driver) return res.status(401).json({ error: 'Invalid driver' });
      req.driver = driver;
      req.user = { id: driver._id, role: 'DRIVER' };
      return next();
    }

    res.status(401).json({ error: 'No authentication provided' });
  } catch (err) {
    if (err.name === 'JsonWebTokenError') return res.status(401).json({ error: 'Invalid token' });
    if (err.name === 'TokenExpiredError') return res.status(401).json({ error: 'Token expired' });
    if (err.name === 'CastError') return res.status(401).json({ error: 'Invalid ID format' });
    next(err);
  }
};

module.exports = auth;

