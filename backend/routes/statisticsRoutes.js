const express = require('express');
const router = express.Router();

// Import statistics controller functions
const {
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  getYearlyStats,
  getTableStats,
} = require('../controllers/statisticsController');

router.get('/daily', getDailyStats);
router.get('/weekly', getWeeklyStats);
router.get('/monthly', getMonthlyStats);
router.get('/yearly', getYearlyStats);
router.get('/table', getTableStats);

module.exports = router;
