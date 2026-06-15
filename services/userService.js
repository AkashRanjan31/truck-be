const User = require('../models/User');
const Driver = require('../models/Driver');

const getUserProfile = async (userId, role) => {
  try {
    let user;
    if (role === 'DRIVER') {
      user = await Driver.findById(userId).populate('truck homeState currentState');
    } else {
      user = await User.findById(userId).populate('assignedState');
    }

    if (!user) return { success: false, error: 'User not found' };

    return { success: true, user };
  } catch (err) {
    console.error('Profile retrieval error:', err.message);
    return { success: false, error: err.message };
  }
};

const updateUserProfile = async (userId, role, updateData) => {
  try {
    let user;
    if (role === 'DRIVER') {
      user = await Driver.findByIdAndUpdate(userId, updateData, { new: true }).populate('truck homeState currentState');
    } else {
      user = await User.findByIdAndUpdate(userId, updateData, { new: true }).populate('assignedState');
    }

    if (!user) return { success: false, error: 'User not found' };

    return { success: true, user };
  } catch (err) {
    console.error('Profile update error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  getUserProfile,
  updateUserProfile
};
