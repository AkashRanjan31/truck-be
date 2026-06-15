const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const driverSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  email: { type: String, unique: true, sparse: true, trim: true, lowercase: true },
  phone: { type: String, required: true, unique: true, trim: true },
  truckNumber: { type: String, required: false, trim: true, uppercase: true },
  truck: { type: mongoose.Schema.Types.ObjectId, ref: 'Truck' },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], default: [0, 0] },
  },
  locationSet: { type: Boolean, default: false },
  lastLocationUpdate: { type: Date, default: null },
  homeState: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  currentState: { type: mongoose.Schema.Types.ObjectId, ref: 'State' },
  password: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  licenseNumber: { type: String, unique: true, sparse: true },
  licenseExpiry: { type: Date },
  emergencyContact: { type: String },
  emergencyContactPhone: { type: String },
  lastLogin: { type: Date, default: null },
}, { timestamps: true });

driverSchema.index({ location: '2dsphere' });
driverSchema.index({ phone: 1 });
driverSchema.index({ email: 1 });

driverSchema.pre('save', async function (next) {
  if (!this.isModified('password') || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

driverSchema.methods.comparePassword = function (plain) {
  if (!this.password) return Promise.resolve(false);
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('Driver', driverSchema);

