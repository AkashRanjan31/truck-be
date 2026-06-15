const mongoose = require('mongoose');

const truckSchema = new mongoose.Schema({
  registrationNumber: { type: String, required: true, unique: true, trim: true, uppercase: true },
  model: { type: String, trim: true },
  owner: { type: String, trim: true },
  currentDriver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  homeState: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  currentLocation: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  currentState: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  lastLocationUpdate: { type: Date, default: null },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

truckSchema.index({ currentLocation: '2dsphere' });

module.exports = mongoose.model('Truck', truckSchema);
