const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleMiddleware');
const {
  getAssignedAlertsController,
  respondToAlertController
} = require('../controllers/authorityController');

// GET /api/authority/alerts — get alerts assigned to this authority
router.get('/alerts', auth, roleMiddleware(['AUTHORITY', 'SUPER_ADMIN', 'STATE_ADMIN']), getAssignedAlertsController);

// POST /api/authority/alerts/:alertId/respond — respond to alert
router.post('/alerts/:alertId/respond', auth, roleMiddleware(['AUTHORITY']), respondToAlertController);

module.exports = router;
