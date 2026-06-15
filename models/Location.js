const mongoose = require('mongoose');

const locationSchema = new mongoose.Schema({
  truck: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Truck',
    required: true
  },
  driver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  coordinates: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true }
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  speed: { type: Number, default: 0 },
  heading: { type: Number, default: 0 },
  accuracy: { type: Number, default: 0 },
  timestamp: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

locationSchema.index({ coordinates: '2dsphere' });
locationSchema.index({ truck: 1, createdAt: -1 });

module.exports = mongoose.model('Location', locationSchema);
