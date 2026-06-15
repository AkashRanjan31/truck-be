const User = require('../models/User');
const Authority = require('../models/Authority');
const Alert = require('../models/Alert');
const { createNotification } = require('../services/notificationService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const getAssignedAlertsController = async (req, res, next) => {
  try {
    const authorityId = req.user?.id || req.userId;
    const { status } = req.query;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const query = { assignedAuthority: authorityId };
    if (status) query.status = status;

    const alerts = await Alert.find(query)
      .populate(['driver', 'truck', 'state'])
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Alert.countDocuments(query);

    sendSuccess(res, 'Assigned alerts retrieved', { alerts, total });
  } catch (err) {
    next(err);
  }
};

const respondToAlertController = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const authorityId = req.user?.id || req.userId;
    const { response } = req.body;

    const alert = await Alert.findById(alertId);
    if (!alert) {
      return sendError(res, 'Alert not found', 404);
    }

    alert.responders.push({
      authority: authorityId,
      respondedAt: new Date()
    });
    alert.status = 'RESPONDED';
    await alert.save();

    await alert.populate(['driver', 'truck', 'state', 'assignedAuthority']);

    sendSuccess(res, 'Alert response recorded', alert);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAssignedAlertsController,
  respondToAlertController
};
