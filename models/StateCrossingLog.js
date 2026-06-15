const mongoose = require('mongoose');

const stateCrossingLogSchema = new mongoose.Schema({
  truck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  fromState: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  toState: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  crossedAt: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

stateCrossingLogSchema.index({ truck: 1, crossedAt: -1 });

module.exports = mongoose.model('StateCrossingLog', stateCrossingLogSchema);
