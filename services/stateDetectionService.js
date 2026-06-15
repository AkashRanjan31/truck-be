const State = require('../models/State');
const Truck = require('../models/Truck');
const StateCrossingLog = require('../models/StateCrossingLog');

const detectStateFromCoordinates = async (latitude, longitude) => {
  try {
    // Query states by proximity - simplified approach
    // In production, use proper GeoJSON polygon intersection
    const state = await State.findOne({
      boundaryGeometry: {
        $geoIntersects: {
          $geometry: {
            type: 'Point',
            coordinates: [longitude, latitude]
          }
        }
      }
    });

    return state || null;
  } catch (err) {
    console.error('State detection error:', err.message);
    return null;
  }
};

const updateTruckState = async (truckId, newStateId, latitude, longitude) => {
  try {
    const truck = await Truck.findById(truckId);
    if (!truck) return { success: false, error: 'Truck not found' };

    const previousState = truck.currentState;

    // Update current state
    truck.currentState = newStateId;
    truck.lastLocationUpdate = new Date();
    await truck.save();

    // Log state crossing if state changed
    if (previousState && previousState.toString() !== newStateId.toString()) {
      await StateCrossingLog.create({
        truck: truckId,
        driver: truck.currentDriver,
        fromState: previousState,
        toState: newStateId,
        location: [longitude, latitude],
        crossedAt: new Date()
      });
    }

    return { success: true, truck };
  } catch (err) {
    console.error('State update error:', err.message);
    return { success: false, error: err.message };
  }
};

const getStateCrossingHistory = async (truck, limit = 50) => {
  try {
    const crossings = await StateCrossingLog.find({ truck })
      .sort({ crossedAt: -1 })
      .limit(limit)
      .populate('fromState toState');

    return { success: true, crossings };
  } catch (err) {
    console.error('Crossing history error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  detectStateFromCoordinates,
  updateTruckState,
  getStateCrossingHistory
};
