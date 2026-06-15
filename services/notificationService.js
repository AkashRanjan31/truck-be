const Notification = require('../models/Notification');

const createNotification = async (recipientId, type, title, message, relatedAlert = null) => {
  try {
    const notification = await Notification.create({
      recipient: recipientId,
      type,
      title,
      message,
      relatedAlert
    });

    return { success: true, notification };
  } catch (err) {
    console.error('Notification creation error:', err.message);
    return { success: false, error: err.message };
  }
};

const getNotifications = async (recipientId, limit = 50, skip = 0) => {
  try {
    const notifications = await Notification.find({ recipient: recipientId })
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('relatedAlert');

    const unread = await Notification.countDocuments({ recipient: recipientId, isRead: false });

    return { success: true, notifications, unread };
  } catch (err) {
    console.error('Notification retrieval error:', err.message);
    return { success: false, error: err.message };
  }
};

const markAsRead = async (notificationId) => {
  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true, readAt: new Date() },
      { new: true }
    );

    return { success: true, notification };
  } catch (err) {
    console.error('Mark as read error:', err.message);
    return { success: false, error: err.message };
  }
};

const markAllAsRead = async (recipientId) => {
  try {
    await Notification.updateMany(
      { recipient: recipientId, isRead: false },
      { isRead: true, readAt: new Date() }
    );

    return { success: true };
  } catch (err) {
    console.error('Mark all read error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  createNotification,
  getNotifications,
  markAsRead,
  markAllAsRead
};
