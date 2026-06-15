const Location = require('../models/Location');
const Truck = require('../models/Truck');
const State = require('../models/State');
const { calculateDistance } = require('../utils/distanceCalculator');

const saveLocation = async (truck, driver, latitude, longitude, state = null) => {
  try {
    const location = new Location({
      truck,
      driver,
      coordinates: [longitude, latitude],
      state,
      timestamp: new Date()
    });

    await location.save();

    // Update truck's current location
    if (truck) {
      await Truck.findByIdAndUpdate(truck, {
        currentLocation: [longitude, latitude],
        lastLocationUpdate: new Date()
      });
    }

    return { success: true, location };
  } catch (err) {
    console.error('Location save error:', err.message);
    return { success: false, error: err.message };
  }
};

const getLocationHistory = async (truck, limit = 50, skip = 0) => {
  try {
    const locations = await Location.find({ truck })
      .sort({ timestamp: -1 })
      .limit(limit)
      .skip(skip)
      .populate('state');

    return { success: true, locations };
  } catch (err) {
    console.error('Location history error:', err.message);
    return { success: false, error: err.message };
  }
};

const getNearbyLocations = async (latitude, longitude, radiusKm = 5) => {
  try {
    const locations = await Location.find({
      coordinates: {
        $near: {
          $geometry: { type: 'Point', coordinates: [longitude, latitude] },
          $maxDistance: radiusKm * 1000 // Convert km to meters
        }
      }
    }).populate('truck driver state').limit(50);

    return { success: true, locations };
  } catch (err) {
    console.error('Nearby locations error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  saveLocation,
  getLocationHistory,
  getNearbyLocations
};
