const express = require('express');
const {
  getAllActivityTypes,
  getActivityTypeById,
  createActivityType,
  updateActivityType,
  deleteActivityType,
} = require('../controllers/activityTypeController');

const router = express.Router();

// GET all activity types for the authenticated user
router.get('/', getAllActivityTypes);

// GET a single activity type by ID
router.get('/:id', getActivityTypeById);

// POST create a new activity type
router.post('/', createActivityType);

// PUT update an existing activity type
router.put('/:id', updateActivityType);

// DELETE an activity type
router.delete('/:id', deleteActivityType);

module.exports = router;
