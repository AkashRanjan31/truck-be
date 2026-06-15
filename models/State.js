const mongoose = require('mongoose');

const stateSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true, trim: true },
  code: { type: String, required: true, unique: true, uppercase: true },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  boundaryGeometry: {
    type: { type: String, default: 'Polygon' },
    coordinates: [[[[Number]]]] // GeoJSON polygon format
  },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

stateSchema.index({ boundaryGeometry: '2dsphere' });

module.exports = mongoose.model('State', stateSchema);
