const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  recipient: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  type: {
    type: String,
    enum: ['ALERT', 'EMERGENCY', 'REPORT', 'SYSTEM', 'INFO'],
    default: 'INFO'
  },
  title: { type: String, required: true },
  message: { type: String, required: true },
  relatedAlert: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Alert'
  },
  isRead: { type: Boolean, default: false },
  readAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

notificationSchema.index({ recipient: 1, isRead: 1 });

module.exports = mongoose.model('Notification', notificationSchema);
