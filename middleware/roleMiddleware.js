/**
 * roleMiddleware — must be used AFTER auth middleware.
 * auth middleware already populates req.user with decoded JWT + DB user.
 * This middleware just checks if the role is in the allowed list.
 */
const roleMiddleware = (allowedRoles) => (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const userRole = req.user.role;

  if (!allowedRoles.includes(userRole)) {
    return res.status(403).json({
      error: `Access denied. Required: [${allowedRoles.join(', ')}]. Your role: ${userRole}`,
    });
  }

  next();
};

module.exports = roleMiddleware;
