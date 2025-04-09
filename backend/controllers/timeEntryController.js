const TimeEntry = require('../models/TimeEntry');
const ActivityType = require('../models/ActivityType');

/**
 * GET /time-entries
 * Retrieve all time entries for the authenticated user.
 */
const getAllTimeEntries = async (req, res) => {
  try {
    const timeEntries = await TimeEntry.find({ user: req.user._id });
    res.json(timeEntries);
  } catch (error) {
    console.error('Error fetching time entries:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /time-entries/today
 * Returns all time entries started today for the authenticated user.
 */
const getTodayTimeEntries = async (req, res) => {
  try {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999);
    const entries = await TimeEntry.find({
      user: req.user._id,
      startTime: {
        $gte: startOfDay,
        $lte: endOfDay,
      },
    }).sort({ startTime: 1 }); // Optional: sort by start time

    res.status(200).json(entries);
  } catch (error) {
    console.error("Error fetching today's time entries:", error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /time-entries/:id
 * Retrieve a single time entry by its ID.
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
 * Create a new time entry.
 */
const createTimeEntry = async (req, res) => {
  try {
    const { activity, startTime, endTime, notes } = req.body;

    const activityExists = await ActivityType.findOne({
      _id: activity,
      user: req.user._id,
    });
    if (!activityExists) {
      return res.status(400).json({
        message: 'Invalid activity. Please choose a valid activity.',
      });
    }

    const newTimeEntry = new TimeEntry({
      user: req.user._id,
      activity,
      startTime,
      endTime: endTime || null,
      notes,
    });

    await newTimeEntry.save();
    res.status(201).json(newTimeEntry);
  } catch (error) {
    console.error('Error creating time entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PUT /time-entries/:id
 * Update an existing time entry.
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
 * Delete a time entry.
 */
const deleteTimeEntry = async (req, res) => {
  try {
    const deleted = await TimeEntry.findOneAndDelete({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!deleted) {
      return res.status(404).json({ message: 'Time entry not found' });
    }
    res.json({ message: 'Time entry deleted successfully' });
  } catch (error) {
    console.error('Error deleting time entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PUT /time-entries/:id/pause-start
 * Add a new pause with only start time.
 */
const startPause = async (req, res) => {
  try {
    const entry = await TimeEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry)
      return res.status(404).json({ message: 'Time entry not found' });

    if (!entry.pauses) entry.pauses = [];

    // Prevent starting another pause if previous one is still open
    const lastPause = entry.pauses[entry.pauses.length - 1];
    if (lastPause && !lastPause.pauseEnd) {
      return res
        .status(400)
        .json({ message: 'Previous pause is not ended yet' });
    }

    entry.pauses.push({ pauseStart: new Date() });
    await entry.save();
    res.json(entry);
  } catch (error) {
    console.error('Error starting pause:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PUT /time-entries/:id/pause-end
 * Close the latest open pause.
 */
const endPause = async (req, res) => {
  try {
    const entry = await TimeEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry || !entry.pauses || entry.pauses.length === 0) {
      return res.status(404).json({ message: 'No pause to end' });
    }

    const lastPause = entry.pauses[entry.pauses.length - 1];
    if (!lastPause || lastPause.pauseEnd) {
      return res
        .status(400)
        .json({ message: 'Last pause already ended or not found' });
    }

    lastPause.pauseEnd = new Date();
    await entry.save();
    res.json(entry);
  } catch (error) {
    console.error('Error ending pause:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * PUT /time-entries/:id/stop
 * Set end time and calculate duration minus pauses.
 */
const stopTimeEntry = async (req, res) => {
  try {
    const entry = await TimeEntry.findOne({
      _id: req.params.id,
      user: req.user._id,
    });
    if (!entry) {
      return res.status(404).json({ message: 'Time entry not found' });
    }

    const now = new Date();
    entry.endTime = now;

    // Calculate total pause duration
    let pauseDurationMs = 0;
    if (entry.pauses && entry.pauses.length > 0) {
      for (const pause of entry.pauses) {
        if (pause.pauseStart && pause.pauseEnd) {
          pauseDurationMs +=
            new Date(pause.pauseEnd) - new Date(pause.pauseStart);
        }
      }
    }

    const totalDurationMs = now - entry.startTime - pauseDurationMs;
    entry.duration = Math.round((totalDurationMs / 60000) * 10) / 10;

    await entry.save();
    res.json(entry);
  } catch (error) {
    console.error('Error stopping time entry:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

/**
 * GET /time-entries/current
 * Returns all active (not finished) time entries for the authenticated user
 */
const getCurrentTimeEntries = async (req, res) => {
  try {
    const activeEntries = await TimeEntry.find({
      user: req.user._id,
      endTime: null,
    });
    res.json(activeEntries);
  } catch (error) {
    console.error('Error fetching current time entries:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getAllTimeEntries,
  getTimeEntryById,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
  startPause,
  endPause,
  stopTimeEntry,
  getCurrentTimeEntries,
  getTodayTimeEntries,
};
