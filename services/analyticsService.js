const Alert = require('../models/Alert');
const Report = require('../models/Report');
const Truck = require('../models/Truck');
const User = require('../models/User');

const getAnalytics = async (filters = {}) => {
  try {
    const queryFilters = {};
    if (filters.state) queryFilters.state = filters.state;
    if (filters.startDate || filters.endDate) {
      queryFilters.createdAt = {};
      if (filters.startDate) queryFilters.createdAt.$gte = new Date(filters.startDate);
      if (filters.endDate) queryFilters.createdAt.$lte = new Date(filters.endDate);
    }

    const alertCount = await Alert.countDocuments(queryFilters);
    const reportCount = await Report.countDocuments(queryFilters);
    const activeTrucks = await Truck.countDocuments({ isActive: true });
    const activeDoctors = await User.countDocuments({ role: 'DRIVER', isActive: true });

    // Alert breakdown by type
    const alertsByType = await Alert.aggregate([
      { $match: queryFilters },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    // Alert breakdown by severity
    const alertsBySeverity = await Alert.aggregate([
      { $match: queryFilters },
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);

    // Report breakdown by type
    const reportsByType = await Report.aggregate([
      { $match: queryFilters },
      { $group: { _id: '$type', count: { $sum: 1 } } }
    ]);

    return {
      success: true,
      analytics: {
        alertCount,
        reportCount,
        activeTrucks,
        activeDrivers: activeDoctors,
        alertsByType,
        alertsBySeverity,
        reportsByType
      }
    };
  } catch (err) {
    console.error('Analytics error:', err.message);
    return { success: false, error: err.message };
  }
};

const getStateAnalytics = async (stateId) => {
  try {
    const queryFilters = { state: stateId };

    const alertCount = await Alert.countDocuments(queryFilters);
    const reportCount = await Report.countDocuments(queryFilters);

    const alertsByStatus = await Alert.aggregate([
      { $match: queryFilters },
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);

    const reportsResolved = await Report.countDocuments({ ...queryFilters, status: 'resolved' });

    return {
      success: true,
      analytics: {
        totalAlerts: alertCount,
        totalReports: reportCount,
        alertsByStatus,
        reportsResolved
      }
    };
  } catch (err) {
    console.error('State analytics error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  getAnalytics,
  getStateAnalytics
};
