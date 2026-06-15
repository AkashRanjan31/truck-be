const Report = require('../models/Report');
const { createReport, getReports, updateReportStatus } = require('../services/reportService');
const { assignReportToAuthority } = require('../services/authorityRoutingService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const createReportController = async (req, res, next) => {
  try {
    const { type, severity, description, latitude, longitude, truck, driver, homeState, currentState } = req.body;

    if (!type || !latitude || !longitude || !driver) {
      return sendError(res, 'Required fields missing', 400);
    }

    const reportData = {
      type,
      severity: severity || 'medium',
      description,
      location: [longitude, latitude],
      truck,
      driverId: driver,
      homeState,
      currentState: currentState || homeState,
      status: 'active'
    };

    const result = await createReport(reportData);

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    // Assign to nearest authority in current state
    if (currentState) {
      await assignReportToAuthority(result.report._id, currentState, latitude, longitude);
    }

    // Notify via socket
    const io = req.app.get('io');
    io.emit('new_report', {
      reportId: result.report._id,
      state: currentState,
      type,
      location: { latitude, longitude }
    });

    sendSuccess(res, 'Report created successfully', result.report, 201);
  } catch (err) {
    next(err);
  }
};

const getReportsController = async (req, res, next) => {
  try {
    const { driverId, state, status, type } = req.query;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    const filters = {};
    if (driverId) filters.driverId = driverId;
    if (state) filters.state = state;
    if (status) filters.status = status;
    if (type) filters.type = type;

    const result = await getReports(filters, limit, skip);

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    sendSuccess(res, 'Reports retrieved', result);
  } catch (err) {
    next(err);
  }
};

const updateReportStatusController = async (req, res, next) => {
  try {
    const { reportId } = req.params;
    const { status } = req.body;

    if (!status) {
      return sendError(res, 'Status is required', 400);
    }

    const result = await updateReportStatus(reportId, status);

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    sendSuccess(res, 'Report status updated', result.report);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  createReportController,
  getReportsController,
  updateReportStatusController
};
