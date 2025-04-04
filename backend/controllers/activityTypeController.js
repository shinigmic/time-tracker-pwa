const ActivityType = require('../models/ActivityType');

/**
 * GET /activity-types
 * Retrieve all activity types for the authenticated user.
 */
const getAllActivityTypes = async (req, res) => {
  try {
    // Assuming req.user._id contains the authenticated user's ID
    const activityTypes = await ActivityType.find({ user: req.user._id });
    res.json(activityTypes);
  } catch (error) {
    console.error('Error fetching activity types:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /activity-types/:id
 * Retrieve a single activity type by ID.
 */
const getActivityTypeById = async (req, res) => {
  try {
    const activityType = await ActivityType.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!activityType) {
      return res.status(404).json({ message: 'Activity type not found' });
    }
    res.json(activityType);
  } catch (error) {
    console.error('Error fetching activity type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /activity-types
 * Create a new activity type.
 */
const createActivityType = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    console.log(name, description, icon, color);
    // Create a new activity type and attach the current user as the owner
    const newActivityType = new ActivityType({
      user: req.user._id,
      name,
      description,
      icon,
      color,
    });
    await newActivityType.save();
    res.status(201).json(newActivityType);
  } catch (error) {
    console.error('Error creating activity type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PUT /activity-types/:id
 * Update an existing activity type.
 */
const updateActivityType = async (req, res) => {
  try {
    const { name, description, icon, color } = req.body;
    const updatedActivityType = await ActivityType.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { name, description, icon, color },
      { new: true }
    );
    if (!updatedActivityType) {
      return res.status(404).json({ message: 'Activity type not found' });
    }
    res.json(updatedActivityType);
  } catch (error) {
    console.error('Error updating activity type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * DELETE /activity-types/:id
 * Delete an activity type.
 */
const deleteActivityType = async (req, res) => {
  try {
    const deletedActivityType = await ActivityType.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deletedActivityType) {
      return res.status(404).json({ message: 'Activity type not found' });
    }
    res.json({ message: 'Activity type deleted successfully' });
  } catch (error) {
    console.error('Error deleting activity type:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllActivityTypes,
  getActivityTypeById,
  createActivityType,
  updateActivityType,
  deleteActivityType,
};
