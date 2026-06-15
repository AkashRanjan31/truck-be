const express = require('express');
const router = express.Router();
const State = require('../models/State');
const auth = require('../middleware/auth');
const roleMiddleware = require('../middleware/roleMiddleware');
const { sendSuccess, sendError } = require('../utils/responseHandler');

// GET /api/states — public (used by frontend dropdowns)
router.get('/', async (req, res, next) => {
  try {
    const states = await State.find({ isActive: true }).select('name code latitude longitude').sort({ name: 1 });
    sendSuccess(res, 'States retrieved', states);
  } catch (err) { next(err); }
});

// GET /api/states/:id
router.get('/:id', async (req, res, next) => {
  try {
    const state = await State.findById(req.params.id);
    if (!state) return sendError(res, 'State not found', 404);
    sendSuccess(res, 'State retrieved', state);
  } catch (err) { next(err); }
});

// POST /api/states — SuperAdmin only
router.post('/', auth, roleMiddleware(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    const { name, code, latitude, longitude } = req.body;
    if (!name || !code) return sendError(res, 'Name and code are required', 400);
    const state = await State.create({ name, code, latitude, longitude });
    sendSuccess(res, 'State created', state, 201);
  } catch (err) { next(err); }
});

// DELETE /api/states/:id — SuperAdmin only
router.delete('/:id', auth, roleMiddleware(['SUPER_ADMIN']), async (req, res, next) => {
  try {
    await State.findByIdAndUpdate(req.params.id, { isActive: false });
    sendSuccess(res, 'State deactivated');
  } catch (err) { next(err); }
});

module.exports = router;
