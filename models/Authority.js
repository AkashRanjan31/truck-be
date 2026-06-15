const mongoose = require('mongoose');

const authoritySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  type: {
    type: String,
    enum: ['POLICE', 'EMERGENCY', 'TRAFFIC', 'AMBULANCE'],
    default: 'POLICE'
  },
  state: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State',
    required: true
  },
  area: { type: String, trim: true }, // City/district within state
  phone: { type: String, required: true },
  email: { type: String, trim: true },
  latitude: { type: Number, default: 0 },
  longitude: { type: Number, default: 0 },
  jurisdiction: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] }
  },
  radiusKm: { type: Number, default: 50 },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
}, { timestamps: true });

authoritySchema.index({ jurisdiction: '2dsphere' });

module.exports = mongoose.model('Authority', authoritySchema);
