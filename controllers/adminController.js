const User = require('../models/User');
const Alert = require('../models/Alert');
const Report = require('../models/Report');
const State = require('../models/State');
const Driver = require('../models/Driver');
const { sendSuccess, sendError } = require('../utils/responseHandler');
const { getAnalytics, getStateAnalytics } = require('../services/analyticsService');

const getAdminDashboardController = async (req, res, next) => {
  try {
    const { state, startDate, endDate } = req.query;

    const filters = {};
    if (state) filters.state = state;
    if (startDate || endDate) {
      filters.startDate = startDate;
      filters.endDate = endDate;
    }

    const result = await getAnalytics(filters);

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    sendSuccess(res, 'Dashboard data retrieved', result.analytics);
  } catch (err) {
    next(err);
  }
};

const getStateAdminDashboardController = async (req, res, next) => {
  try {
    const stateId = req.user?.assignedState || req.query.state;

    if (!stateId) {
      return sendError(res, 'State not assigned', 403);
    }

    const result = await getStateAnalytics(stateId);

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    sendSuccess(res, 'State dashboard retrieved', result.analytics);
  } catch (err) {
    next(err);
  }
};

const getStatesController = async (req, res, next) => {
  try {
    const states = await State.find({ isActive: true });
    sendSuccess(res, 'States retrieved', states);
  } catch (err) {
    next(err);
  }
};

const getDriversController = async (req, res, next) => {
  try {
    const { state } = req.query;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const query = { isActive: true };
    if (state) query.homeState = state;

    const drivers = await Driver.find(query)
      .populate('homeState currentState truck')
      .limit(limit)
      .skip(skip);

    const total = await Driver.countDocuments(query);

    sendSuccess(res, 'Drivers retrieved', { drivers, total });
  } catch (err) {
    next(err);
  }
};

const getReportsAdminController = async (req, res, next) => {
  try {
    const { state, status } = req.query;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const query = {};
    if (state) query.currentState = state;
    if (status) query.status = status;

    const reports = await Report.find(query)
      .populate(['driverId', 'truck', 'currentState', 'assignedAuthority'])
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Report.countDocuments(query);

    sendSuccess(res, 'Reports retrieved', { reports, total });
  } catch (err) {
    next(err);
  }
};

const getAlertsAdminController = async (req, res, next) => {
  try {
    const { state, status } = req.query;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const query = {};
    if (state) query.state = state;
    if (status) query.status = status;

    const alerts = await Alert.find(query)
      .populate(['driver', 'truck', 'state', 'assignedAuthority'])
      .limit(limit)
      .skip(skip)
      .sort({ createdAt: -1 });

    const total = await Alert.countDocuments(query);

    sendSuccess(res, 'Alerts retrieved', { alerts, total });
  } catch (err) {
    next(err);
  }
};

module.exports = {
  getAdminDashboardController,
  getStateAdminDashboardController,
  getStatesController,
  getDriversController,
  getReportsAdminController,
  getAlertsAdminController
};
