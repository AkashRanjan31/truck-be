const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getAdminDashboardController,
  getStateAdminDashboardController,
  getStatesController,
  getDriversController,
  getReportsAdminController,
  getAlertsAdminController,
} = require('../controllers/adminController');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// ── Legacy password-based admin auth (keeps existing frontend working) ──
const legacyAdminAuth = (req, res, next) => {
  if (req.headers['x-admin-password'] !== process.env.ADMIN_PASSWORD)
    return res.status(403).json({ error: 'Admin access required' });
  next();
};

// POST /api/admin/login — legacy
router.post('/login', (req, res) => {
  const { password } = req.body;
  if (!password || password !== process.env.ADMIN_PASSWORD)
    return res.status(401).json({ error: 'Invalid password' });
  res.json({ success: true });
});

// POST /api/admin/change-password — legacy
router.post('/change-password', legacyAdminAuth, (req, res) => {
  const { newPassword } = req.body;
  if (!newPassword || newPassword.length < 4)
    return res.status(400).json({ error: 'Password must be at least 4 characters' });
  if (newPassword === process.env.ADMIN_PASSWORD)
    return res.status(400).json({ error: 'New password must differ from current password' });
  process.env.ADMIN_PASSWORD = newPassword;
  res.json({ success: true });
});

// ── JWT-based admin dashboard routes (new architecture) ──

// GET /api/admin/dashboard — SuperAdmin
router.get('/dashboard', auth, roleMiddleware(['SUPER_ADMIN']), getAdminDashboardController);

// GET /api/admin/state-dashboard — SuperAdmin or StateAdmin
router.get('/state-dashboard', auth, roleMiddleware(['SUPER_ADMIN', 'STATE_ADMIN']), getStateAdminDashboardController);

// GET /api/admin/states
router.get('/states', auth, roleMiddleware(['SUPER_ADMIN', 'STATE_ADMIN']), getStatesController);

// GET /api/admin/drivers
router.get('/drivers', auth, roleMiddleware(['SUPER_ADMIN', 'STATE_ADMIN']), getDriversController);

// GET /api/admin/reports
router.get('/reports', auth, roleMiddleware(['SUPER_ADMIN', 'STATE_ADMIN', 'AUTHORITY']), getReportsAdminController);

// GET /api/admin/alerts
router.get('/alerts', auth, roleMiddleware(['SUPER_ADMIN', 'STATE_ADMIN', 'AUTHORITY']), getAlertsAdminController);

// PATCH /api/admin/drivers/:id/deactivate — SuperAdmin only
router.patch('/drivers/:id/deactivate', auth, roleMiddleware(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const Driver = require('../models/Driver');
    const driver = await Driver.findByIdAndUpdate(req.params.id, { isActive: false }, { new: true });
    if (!driver) return sendError(res, 'Driver not found', 404);
    sendSuccess(res, 'Driver deactivated', driver);
  } catch (err) { next(err); }
});

module.exports = router;
