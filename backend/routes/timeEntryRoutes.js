const express = require('express');
const router = express.Router();

const {
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
} = require('../controllers/timeEntryController');

const { checkToken } = require('../middleware/checkToken');

// Apply token check for all routes
router.use(checkToken);

/**
 * GET /time-entries
 * Retrieve all time entries for the authenticated user.
 */
router.get('/', getAllTimeEntries);

/**
 * GET /time-entries/current
 * Returns all active (not finished) time entries for the authenticated user
 */

router.get('/current', getCurrentTimeEntries);

/**
 * GET /time-entries/today
 *  * Returns all time entries created today by the authenticated user
 */

router.get('/today', getTodayTimeEntries);

/**
 * GET /time-entries/:id
 * Retrieve a single time entry by its ID.
 */
router.get('/:id', getTimeEntryById);

/**
 * POST /time-entries
 * Create a new time entry.
 */
router.post('/', createTimeEntry);

/**
 * PUT /time-entries/:id
 * Update an existing time entry.
 */
router.put('/:id', updateTimeEntry);

/**
 * DELETE /time-entries/:id
 * Delete a time entry.
 */
router.delete('/:id', deleteTimeEntry);

/**
 * PUT /time-entries/:id/pause-start
 * Start a pause for an ongoing time entry.
 */
router.put('/:id/pause-start', startPause);

/**
 * PUT /time-entries/:id/pause-end
 * End the last pause of a time entry.
 */
router.put('/:id/pause-end', endPause);

/**
 * PUT /time-entries/:id/stop
 * Stop a running time entry and calculate total duration excluding pauses.
 */
router.put('/:id/stop', stopTimeEntry);

module.exports = router;
