const Report = require('../models/Report');
const Alert = require('../models/Alert');
const Notification = require('../models/Notification');

const createAlert = async (alertData) => {
  try {
    const alert = await Alert.create(alertData);
    await alert.populate(['truck', 'driver', 'state', 'assignedAuthority']);

    return { success: true, alert };
  } catch (err) {
    console.error('Alert creation error:', err.message);
    return { success: false, error: err.message };
  }
};

const getAlerts = async (filters = {}, limit = 50, skip = 0) => {
  try {
    const query = {};

    if (filters.state) query.state = filters.state;
    if (filters.status) query.status = filters.status;
    if (filters.type) query.type = filters.type;
    if (filters.assignedAuthority) query.assignedAuthority = filters.assignedAuthority;

    const alerts = await Alert.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate(['truck', 'driver', 'state', 'assignedAuthority']);

    const total = await Alert.countDocuments(query);

    return { success: true, alerts, total };
  } catch (err) {
    console.error('Alert retrieval error:', err.message);
    return { success: false, error: err.message };
  }
};

const updateAlertStatus = async (alertId, newStatus) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { status: newStatus, ...(newStatus === 'RESOLVED' && { resolvedAt: new Date() }) },
      { new: true }
    ).populate(['truck', 'driver', 'state', 'assignedAuthority']);

    return { success: true, alert };
  } catch (err) {
    console.error('Alert update error:', err.message);
    return { success: false, error: err.message };
  }
};

const respondToAlert = async (alertId, authorityId) => {
  try {
    const alert = await Alert.findByIdAndUpdate(
      alertId,
      {
        $push: {
          responders: {
            authority: authorityId,
            respondedAt: new Date()
          }
        },
        status: 'RESPONDED'
      },
      { new: true }
    );

    return { success: true, alert };
  } catch (err) {
    console.error('Alert response error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  createAlert,
  getAlerts,
  updateAlertStatus,
  respondToAlert
};
