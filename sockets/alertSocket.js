const Alert = require('../models/Alert');

const registerAlertSocket = (io) => {
  io.on('connection', (socket) => {
    console.log('User connected for alert updates:', socket.id);

    // Register user/authority to receive alerts
    socket.on('register_alert_listener', (data) => {
      const { userId, role, state } = data;
      socket.join(`user_${userId}`);
      if (state) {
        socket.join(`state_${state}`);
      }
      if (role === 'AUTHORITY' || role === 'STATE_ADMIN' || role === 'SUPER_ADMIN') {
        socket.join(`authority_alerts`);
      }
      console.log(`User ${userId} registered for alerts`);
    });

    // Receive new alert notification
    socket.on('new_alert', (data) => {
      const { alertId, state, type, severity, assignedAuthority } = data;

      // Broadcast to state admins
      io.to(`state_${state}`).emit('alert_notification', {
        alertId,
        type,
        severity,
        message: `New ${type} alert with ${severity} severity`
      });

      // Broadcast to assigned authority
      if (assignedAuthority) {
        io.to(`user_${assignedAuthority}`).emit('alert_assigned', {
          alertId,
          type,
          severity
        });
      }

      // Broadcast to all authorities
      io.to('authority_alerts').emit('alert_broadcast', {
        alertId,
        type,
        severity,
        state
      });
    });

    // Alert status update
    socket.on('alert_status_update', (data) => {
      const { alertId, status, state } = data;

      io.to(`state_${state}`).emit('alert_status_changed', {
        alertId,
        status,
        message: `Alert ${alertId} status changed to ${status}`
      });
    });

    socket.on('disconnect', () => {
      console.log('Alert listener disconnected:', socket.id);
    });
  });
};

module.exports = { registerAlertSocket };
