const stateAccessMiddleware = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ error: 'No token provided' });

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key');
    req.user = decoded;

    // Super Admin can access all states
    if (decoded.role === 'SUPER_ADMIN') {
      return next();
    }

    // State Admin and Authority can only access their assigned state
    if (decoded.role === 'STATE_ADMIN' || decoded.role === 'AUTHORITY') {
      if (!decoded.assignedState) {
        return res.status(403).json({ error: 'No state assigned' });
      }
      // Validate that the requested state matches assigned state
      const requestedState = req.query.state || req.body.state || req.params.state;
      if (requestedState && requestedState !== decoded.assignedState.toString()) {
        return res.status(403).json({ error: 'Cannot access data from other states' });
      }
    }

    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = stateAccessMiddleware;
