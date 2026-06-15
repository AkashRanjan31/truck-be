const Authority = require('../models/Authority');
const Alert = require('../models/Alert');
const Report = require('../models/Report');
const { calculateDistance } = require('../utils/distanceCalculator');

const findRelevantAuthorities = async (latitude, longitude, stateId) => {
  try {
    // Find authorities for the current state within radius
    const authorities = await Authority.find({
      state: stateId,
      jurisdiction: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: 100 * 1000 // 100km in meters
        }
      }
    });

    return authorities;
  } catch (err) {
    console.error('Authority search error:', err.message);
    return [];
  }
};

const assignAlertToAuthority = async (alertId, stateId, latitude, longitude) => {
  try {
    const authorities = await findRelevantAuthorities(latitude, longitude, stateId);

    if (authorities.length === 0) {
      return { success: false, error: 'No authorities found for this area' };
    }

    // Assign to the nearest authority
    const nearestAuthority = authorities[0];

    const alert = await Alert.findByIdAndUpdate(
      alertId,
      { assignedAuthority: nearestAuthority._id },
      { new: true }
    );

    return { success: true, alert, authority: nearestAuthority };
  } catch (err) {
    console.error('Alert assignment error:', err.message);
    return { success: false, error: err.message };
  }
};

const assignReportToAuthority = async (reportId, stateId, latitude, longitude) => {
  try {
    const authorities = await findRelevantAuthorities(latitude, longitude, stateId);

    if (authorities.length === 0) {
      return { success: false, error: 'No authorities found for this area' };
    }

    // Assign to the nearest authority
    const nearestAuthority = authorities[0];

    const report = await Report.findByIdAndUpdate(
      reportId,
      { assignedAuthority: nearestAuthority._id },
      { new: true }
    );

    return { success: true, report, authority: nearestAuthority };
  } catch (err) {
    console.error('Report assignment error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  findRelevantAuthorities,
  assignAlertToAuthority,
  assignReportToAuthority
};
