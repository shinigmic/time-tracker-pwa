const ActivityType = require('./ActivityType'); // Activity model
const TimeEntry = require('./TimeEntry'); // Time entry model

/**
 * Get all activity types for a given user.
 * @param {String} userId - User ID.
 * @returns {Promise<Array>}
 */
const getAllActivities = async (userId) => {
  return await ActivityType.find({ user: userId });
};

/**
 * Add a new activity type.
 * @param {Object} activityData - Data for the new activity.
 * @returns {Promise<Object>}
 */
const addActivity = async (activityData) => {
  return await ActivityType.create(activityData);
};

/**
 * Update an activity type.
 * @param {String} activityId - Activity ID.
 * @param {Object} updateData - Data for updating.
 * @returns {Promise<Object>}
 */
const updateActivity = async (activityId, updateData) => {
  return await ActivityType.findByIdAndUpdate(activityId, updateData, {
    new: true,
  });
};

/**
 * Delete an activity type belonging to a user.
 * @param {String} activityId - Activity ID.
 * @param {String} userId - User ID.
 * @returns {Promise<Object>}
 */
const deleteActivity = async (activityId, userId) => {
  return await ActivityType.findOneAndDelete({ _id: activityId, user: userId });
};

/**
 * Create a new time entry for an activity.
 * @param {Object} timeEntryData - Data for the time entry.
 * @returns {Promise<Object>}
 */
const createTimeEntry = async (timeEntryData) => {
  return await TimeEntry.create(timeEntryData);
};

/**
 * Get time entries for a user within a specific date range.
 * @param {String} userId - User ID.
 * @param {Date} startDate - Start date of the period.
 * @param {Date} endDate - End date of the period.
 * @returns {Promise<Array>}
 */
const getTimeEntriesByPeriod = async (userId, startDate, endDate) => {
  return await TimeEntry.find({
    user: userId,
    startTime: { $gte: startDate, $lte: endDate },
  });
};

module.exports = {
  getAllActivities,
  addActivity,
  updateActivity,
  deleteActivity,
  createTimeEntry,
  getTimeEntriesByPeriod,
};
