const Driver = require('../models/Driver');

const auth = async (req, res, next) => {
  const driverId = req.headers['x-driver-id'];
  if (!driverId) return res.status(401).json({ error: 'Driver ID required' });

  try {
    const driver = await Driver.findById(driverId);
    if (!driver) return res.status(401).json({ error: 'Invalid driver' });
    req.driver = driver;
    next();
  } catch (err) {
    if (err.name === 'CastError') return res.status(401).json({ error: 'Invalid driver ID format' });
    next(err);
  }
};

module.exports = auth;
