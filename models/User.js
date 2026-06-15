const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, trim: true, lowercase: true },
  password: { type: String, required: true },
  phone: { type: String, required: true, unique: true, trim: true },
  name: { type: String, required: true, trim: true },
  role: {
    type: String,
    enum: ['SUPER_ADMIN', 'STATE_ADMIN', 'AUTHORITY', 'DRIVER'],
    default: 'DRIVER'
  },
  assignedState: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'State'
  },
  isVerified: { type: Boolean, default: false },
  profilePicture: { type: String, default: null },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
}, { timestamps: true });

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};

module.exports = mongoose.model('User', userSchema);
