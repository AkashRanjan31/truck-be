const Report = require('../models/Report');
const User = require('../models/User');
const Driver = require('../models/Driver');

const createReport = async (reportData) => {
  try {
    const report = await Report.create(reportData);
    await report.populate(['driverId', 'truck', 'homeState', 'currentState', 'assignedAuthority']);

    return { success: true, report };
  } catch (err) {
    console.error('Report creation error:', err.message);
    return { success: false, error: err.message };
  }
};

const getReports = async (filters = {}, limit = 50, skip = 0) => {
  try {
    const query = {};

    if (filters.driverId) query.driverId = filters.driverId;
    if (filters.state) query.currentState = filters.state;
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;

    const reports = await Report.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate(['driverId', 'truck', 'homeState', 'currentState', 'assignedAuthority']);

    const total = await Report.countDocuments(query);

    return { success: true, reports, total };
  } catch (err) {
    console.error('Report retrieval error:', err.message);
    return { success: false, error: err.message };
  }
};

const updateReportStatus = async (reportId, newStatus) => {
  try {
    const report = await Report.findByIdAndUpdate(
      reportId,
      {
        status: newStatus,
        ...(newStatus === 'resolved' && { resolvedAt: new Date() })
      },
      { new: true }
    ).populate(['driverId', 'truck', 'homeState', 'currentState', 'assignedAuthority']);

    return { success: true, report };
  } catch (err) {
    console.error('Report update error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  createReport,
  getReports,
  updateReportStatus
};
