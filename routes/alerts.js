const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const role = require('../middleware/roleMiddleware');
const {
  createAlertController,
  getAlertsController,
  updateAlertStatusController,
  respondToAlertController,
} = require('../controllers/alertController');

router.post('/',                  auth, createAlertController);
router.get('/',                   auth, role(['SUPER_ADMIN', 'STATE_ADMIN', 'AUTHORITY']), getAlertsController);
router.patch('/:alertId',         auth, role(['SUPER_ADMIN', 'STATE_ADMIN', 'AUTHORITY']), updateAlertStatusController);
router.post('/:alertId/respond',  auth, role(['AUTHORITY']), respondToAlertController);

module.exports = router;
