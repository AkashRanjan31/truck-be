const Location = require('../models/Location');
const Truck = require('../models/Truck');
const { saveLocation, getLocationHistory, getNearbyLocations } = require('../services/locationService');
const { detectStateFromCoordinates, updateTruckState } = require('../services/stateDetectionService');
const { sendSuccess, sendError } = require('../utils/responseHandler');

const updateLocationController = async (req, res, next) => {
  try {
    const { latitude, longitude, speed = 0, heading = 0, accuracy = 0 } = req.body;
    const truckId = req.params.truckId || req.body.truckId;
    const driverId = req.user?.id || req.userId;

    if (!latitude || !longitude || !truckId) {
      return sendError(res, 'Latitude, longitude, and truck ID are required', 400);
    }

    // Detect current state
    const currentState = await detectStateFromCoordinates(latitude, longitude);

    // Update truck state if changed
    if (currentState) {
      await updateTruckState(truckId, currentState._id, latitude, longitude);
    }

    // Save location
    const result = await saveLocation(truckId, driverId, latitude, longitude, currentState?._id);

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    sendSuccess(res, 'Location updated', {
      location: result.location,
      currentState: currentState ? { _id: currentState._id, name: currentState.name } : null
    });
  } catch (err) {
    next(err);
  }
};

const getLocationHistoryController = async (req, res, next) => {
  try {
    const truckId = req.params.truckId;
    const limit = parseInt(req.query.limit) || 50;
    const skip = parseInt(req.query.skip) || 0;

    if (!truckId) {
      return sendError(res, 'Truck ID is required', 400);
    }

    const result = await getLocationHistory(truckId, limit, skip);

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    sendSuccess(res, 'Location history retrieved', result);
  } catch (err) {
    next(err);
  }
};

const getNearbyLocationsController = async (req, res, next) => {
  try {
    const { latitude, longitude, radius = 5 } = req.query;

    if (!latitude || !longitude) {
      return sendError(res, 'Latitude and longitude are required', 400);
    }

    const result = await getNearbyLocations(parseFloat(latitude), parseFloat(longitude), parseFloat(radius));

    if (!result.success) {
      return sendError(res, result.error, 500);
    }

    sendSuccess(res, 'Nearby locations retrieved', result);
  } catch (err) {
    next(err);
  }
};

module.exports = {
  updateLocationController,
  getLocationHistoryController,
  getNearbyLocationsController
};
