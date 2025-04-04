const TimeEntry = require('../models/TimeEntry');
const ActivityType = require('../models/ActivityType');

/**
 * GET /time-entries
 * Retrieve all time entries for the authenticated user.
 */
const getAllTimeEntries = async (req, res) => {
  try {
    // Find all time entries belonging to the authenticated user
    const timeEntries = await TimeEntry.find({ user: req.user._id });
    res.json(timeEntries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /time-entries/:id
 * Retrieve a single time entry by its ID for the authenticated user.
 */
const getTimeEntryById = async (req, res) => {
  try {
    const timeEntry = await TimeEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!timeEntry) {
      return res.status(404).json({ message: 'Time entry not found' });
    }
    res.json(timeEntry);
  } catch (error) {
    console.error('Error fetching time entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * POST /time-entries
 * Create a new time entry for the authenticated user.
 */
const createTimeEntry = async (req, res) => {
  try {
    const { activity, startTime, endTime, notes } = req.body;

    // Check if the provided activity exists and belongs to the current user
    const activityExists = await ActivityType.findOne({
      _id: activity,
      user: req.user._id,
    });
    if (!activityExists) {
      return res.status(400).json({
        message:
          'Invalid activity. Please choose a valid activity from your available list.',
      });
    }

    // Prepare time entry data; if endTime is not provided, set it to null
    const timeEntryData = {
      user: req.user._id,
      activity,
      startTime,
      endTime: endTime ? endTime : null,
      notes,
    };

    // Create a new time entry and associate it with the current user
    const newTimeEntry = new TimeEntry(timeEntryData);
    await newTimeEntry.save();

    res.status(201).json(newTimeEntry);
  } catch (error) {
    console.error('Error creating time entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PUT /time-entries/:id
 * Update an existing time entry for the authenticated user.
 */
const updateTimeEntry = async (req, res) => {
  try {
    const { activity, startTime, endTime, duration, notes } = req.body;
    const updatedTimeEntry = await TimeEntry.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { activity, startTime, endTime, duration, notes },
      { new: true }
    );
    if (!updatedTimeEntry) {
      return res.status(404).json({ message: 'Time entry not found' });
    }
    res.json(updatedTimeEntry);
  } catch (error) {
    console.error('Error updating time entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * DELETE /time-entries/:id
 * Delete a time entry for the authenticated user.
 */
const deleteTimeEntry = async (req, res) => {
  try {
    const deletedTimeEntry = await TimeEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deletedTimeEntry) {
      return res.status(404).json({ message: 'Time entry not found' });
    }
    res.json({ message: 'Time entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting time entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllTimeEntries,
  getTimeEntryById,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
};
