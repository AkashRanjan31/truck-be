const AuditLog = require('../models/AuditLog');

const logAction = async (actorId, action, entityType, entityId, details = {}, ipAddress = '', userAgent = '') => {
  try {
    const log = await AuditLog.create({
      actor: actorId,
      action,
      entityType,
      entityId,
      details,
      ipAddress,
      userAgent
    });

    return { success: true, log };
  } catch (err) {
    console.error('Audit log error:', err.message);
    return { success: false, error: err.message };
  }
};

const getAuditLogs = async (filters = {}, limit = 100, skip = 0) => {
  try {
    const query = {};

    if (filters.actor) query.actor = filters.actor;
    if (filters.action) query.action = filters.action;
    if (filters.entityType) query.entityType = filters.entityType;

    const logs = await AuditLog.find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .populate('actor');

    return { success: true, logs };
  } catch (err) {
    console.error('Audit retrieval error:', err.message);
    return { success: false, error: err.message };
  }
};

module.exports = {
  logAction,
  getAuditLogs
};
