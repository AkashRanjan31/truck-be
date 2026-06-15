const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleMiddleware');
const { getAnalytics, getStateAnalytics } = require('../services/analyticsService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// GET /api/analytics — SuperAdmin only
router.get('/', auth, roleMiddleware(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { state, startDate, endDate } = req.query;
    const result = await getAnalytics({ state, startDate, endDate });
    if (!result.success) return sendError(res, result.error, 500);
    sendSuccess(res, 'Analytics retrieved', result.analytics);
  } catch (err) { next(err); }
});

// GET /api/analytics/state — SuperAdmin or StateAdmin
router.get('/state', auth, roleMiddleware(['SUPER_ADMIN', 'STATE_ADMIN']), async (req, res, next) => {
  try {
    const stateId = req.user?.assignedState || req.query.stateId;
    if (!stateId) return sendError(res, 'State not assigned or provided', 400);
    const result = await getStateAnalytics(stateId);
    if (!result.success) return sendError(res, result.error, 500);
    sendSuccess(res, 'State analytics retrieved', result.analytics);
  } catch (err) { next(err); }
});

module.exports = router;
