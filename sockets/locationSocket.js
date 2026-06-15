const Location = require('../models/Location');
const Truck = require('../models/Truck');
const { detectStateFromCoordinates, updateTruckState } = require('../services/stateDetectionService');

const registerLocationSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('Driver connected for location tracking:', socket.id);

    // Driver sends their location
    socket.on('update_location', async (data) => {
      try {
        const { driverId, truckId, latitude, longitude } = data;

        if (!driverId || !latitude || !longitude) {
          socket.emit('location_error', { error: 'Missing required fields' });
          return;
        }

        // Save location
        const location = new Location({
          truck: truckId,
          driver: driverId,
          coordinates: [longitude, latitude],
          timestamp: new Date()
        });
        await location.save();

        // Detect current state
        const currentState = await detectStateFromCoordinates(latitude, longitude);
        if (currentState && truckId) {
          await updateTruckState(truckId, currentState._id, latitude, longitude);
        }

        // Broadcast to nearby trucks
        io.emit('location_update', {
          truckId,
          driverId,
          latitude,
          longitude,
          state: currentState ? currentState._id : null
        });

        socket.emit('location_saved', { success: true });
      } catch (err) {
        console.error('Location update error:', err.message);
        socket.emit('location_error', { error: err.message });
      }
    });

    // Driver registers to broadcast group
    socket.on('register_driver', (data) => {
      const { driverId, truckId } = data;
      socket.join(`driver_${driverId}`);
      socket.join(`truck_${truckId}`);
      console.log(`Driver ${driverId} registered for updates`);
    });

    socket.on('disconnect', () => {
      console.log('Driver disconnected:', socket.id);
    });
  });
};

module.exports = { registerLocationSocket };
