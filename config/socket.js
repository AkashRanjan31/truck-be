const { registerLocationSocket } = require('../sockets/locationSocket');
const { registerAlertSocket } = require('../sockets/alertSocket');

const setupSockets = (io) => {
  registerLocationSocket(io);
  registerAlertSocket(io);

  console.log('✅ Socket.IO handlers registered');
};

module.exports = { setupSockets };
