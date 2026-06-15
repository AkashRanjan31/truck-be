const Alert = require('../models/Alert');
const { createAlert, getAlerts, updateAlertStatus, respondToAlert } = require('../services/alertService');
const { assignAlertToAuthority } = require('../services/authorityRoutingService');
const { createNotification } = require('../services/notificationService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const createAlertController = async (req, res, next) => {
  try {
    const { type, severity, description, latitude, longitude, truck, driver, state } = req.body;

    if (!type || !latitude || !longitude || !state) {
      return sendError(res, 'Required fields missing', 400);
    }

    const alertData = {
      type,
      severity: severity || 'MEDIUM',
      description: description || '',
      location: [longitude, latitude],
      truck,
      driver,
      state,
      status: 'ACTIVE'
    };

    const result = await createAlert(alertData);

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    // Assign to nearest authority
    await assignAlertToAuthority(result.alert._id, state, latitude, longitude);

    // Notify via socket
    const io = req.app.get('io');
    io.emit('new_alert', {
      alertId: result.alert._id,
      state,
      type,
      severity
    });

    sendSuccess(res, 'Alert created successfully', result.alert, 201);
  } catch (err) {
    next(err);
  }
};

const getAlertsController = async (req, res, next) => {
  try {
    const { state, status, type, authority } = req.query;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const filters = {};
    if (state) filters.state = state;
    if (status) filters.status = status;
    if (type) filters.type = type;
    if (authority) filters.assignedAuthority = authority;

    const result = await getAlerts(filters, limit, skip);

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    sendSuccess(res, 'Alerts retrieved', result);
  } catch (err) {
    next(err);
  }
};

const updateAlertStatusController = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const { status } = req.body;

    if (!status) {
      return sendError(res, 'Status is required', 400);
    }

    const result = await updateAlertStatus(alertId, status);

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    // Notify via socket
    const io = req.app.get('io');
    io.emit('alert_status_updated', {
      alertId,
      status,
      state: result.alert.state
    });

    sendSuccess(res, 'Alert status updated', result.alert);
  } catch (err) {
    next(err);
  }
};

const respondToAlertController = async (req, res, next) => {
  try {
    const { alertId } = req.params;
    const authorityId = req.user?.id || req.userId;

    if (!authorityId) {
      return sendError(res, 'Authority not authenticated', 401);
    }

    const result = await respondToAlert(alertId, authorityId);

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    sendSuccess(res, 'Alert response recorded', result.alert);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createAlertController,
  getAlertsController,
  updateAlertStatusController,
  respondToAlertController
};
