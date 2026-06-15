const mongoose = require('mongoose');

const alertSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['ACCIDENT', 'HAZARD', 'REPORT', 'EMERGENCY', 'TRAFFIC_JAM'],
    default: 'HAZARD'
  },
  truck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck'
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  assignedAuthority: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Authority'
  },
  description: { type: String, trim: true },
  severity: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  status: {
    type: String,
    enum: ['ACTIVE', 'RESPONDED', 'RESOLVED'],
    default: 'ACTIVE'
  },
  responders: [{
    authority: mongoose.Schema.Types.ObjectId,
    respondedAt: Date
  }],
  image: { type: String, default: null },
  createdAt: { type: Date, default: Date.now },
  resolvedAt: { type: Date, default: null }
}, { timestamps: true });

alertSchema.index({ location: '2dsphere' });
alertSchema.index({ state: 1, status: 1 });

module.exports = mongoose.model('Alert', alertSchema);
