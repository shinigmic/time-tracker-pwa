const express = require('express');
const router = express.Router();

// Import time entry controller functions
const {
  getAllTimeEntries,
  getTimeEntryById,
  createTimeEntry,
  updateTimeEntry,
  deleteTimeEntry,
} = require('../controllers/timeEntryController');

// If needed, you can add an authentication middleware here (e.g., checkToken)
// router.use(checkToken);

/**
 * GET /time-entries
 * Retrieve all time entries for the authenticated user.
 */
router.get('/', getAllTimeEntries);

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

module.exports = router;
