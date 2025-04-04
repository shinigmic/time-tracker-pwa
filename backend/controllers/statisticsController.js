const mongoose = require('mongoose');
const TimeEntry = require('../models/TimeEntry');

// Helper function: Aggregates daily statistics for the given user
const aggregateDailyStats = async (userId) => {
  const dailyStats = await TimeEntry.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: {
          year: { $year: '$startTime' },
          month: { $month: '$startTime' },
          day: { $dayOfMonth: '$startTime' },
          activity: '$activity',
        },
        totalDuration: { $sum: '$duration' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          year: '$_id.year',
          month: '$_id.month',
          day: '$_id.day',
        },
        overallTotal: { $sum: '$totalDuration' },
        groups: {
          $push: {
            activity: '$_id.activity',
            totalDuration: '$totalDuration',
            count: '$count',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        date: {
          $concat: [
            { $toString: '$_id.year' },
            '-',
            {
              $cond: [
                { $lt: ['$_id.month', 10] },
                { $concat: ['0', { $toString: '$_id.month' }] },
                { $toString: '$_id.month' },
              ],
            },
            '-',
            {
              $cond: [
                { $lt: ['$_id.day', 10] },
                { $concat: ['0', { $toString: '$_id.day' }] },
                { $toString: '$_id.day' },
              ],
            },
          ],
        },
        overallTotal: 1,
        groups: 1,
      },
    },
    { $sort: { date: -1 } },
  ]);
  return dailyStats;
};

// Helper function: Aggregates weekly statistics for the given user (using ISO week)
const aggregateWeeklyStats = async (userId) => {
  const weeklyStats = await TimeEntry.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: {
          year: { $isoWeekYear: '$startTime' },
          week: { $isoWeek: '$startTime' },
          activity: '$activity',
        },
        totalDuration: { $sum: '$duration' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          year: '$_id.year',
          week: '$_id.week',
        },
        overallTotal: { $sum: '$totalDuration' },
        groups: {
          $push: {
            activity: '$_id.activity',
            totalDuration: '$totalDuration',
            count: '$count',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        week: {
          year: '$_id.year',
          week: '$_id.week',
        },
        overallTotal: 1,
        groups: 1,
      },
    },
    { $sort: { 'week.year': -1, 'week.week': -1 } },
  ]);
  return weeklyStats;
};

// Helper function: Aggregates monthly statistics for the given user
const aggregateMonthlyStats = async (userId) => {
  const monthlyStats = await TimeEntry.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: {
          year: { $year: '$startTime' },
          month: { $month: '$startTime' },
          activity: '$activity',
        },
        totalDuration: { $sum: '$duration' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: {
          year: '$_id.year',
          month: '$_id.month',
        },
        overallTotal: { $sum: '$totalDuration' },
        groups: {
          $push: {
            activity: '$_id.activity',
            totalDuration: '$totalDuration',
            count: '$count',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        month: {
          year: '$_id.year',
          month: {
            $cond: [
              { $lt: ['$_id.month', 10] },
              { $concat: ['0', { $toString: '$_id.month' }] },
              { $toString: '$_id.month' },
            ],
          },
        },
        overallTotal: 1,
        groups: 1,
      },
    },
    { $sort: { 'month.year': -1, 'month.month': -1 } },
  ]);
  return monthlyStats;
};

// Helper function: Aggregates yearly statistics for the given user
const aggregateYearlyStats = async (userId) => {
  const yearlyStats = await TimeEntry.aggregate([
    { $match: { user: userId } },
    {
      $group: {
        _id: {
          year: { $year: '$startTime' },
          activity: '$activity',
        },
        totalDuration: { $sum: '$duration' },
        count: { $sum: 1 },
      },
    },
    {
      $group: {
        _id: { year: '$_id.year' },
        overallTotal: { $sum: '$totalDuration' },
        groups: {
          $push: {
            activity: '$_id.activity',
            totalDuration: '$totalDuration',
            count: '$count',
          },
        },
      },
    },
    {
      $project: {
        _id: 0,
        year: { $toString: '$_id.year' },
        overallTotal: 1,
        groups: 1,
      },
    },
    { $sort: { year: -1 } },
  ]);
  return yearlyStats;
};

// Individual route handlers

const getDailyStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const daily = await aggregateDailyStats(userId);
    res.json(daily);
  } catch (error) {
    console.error('Error fetching daily stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getWeeklyStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const weekly = await aggregateWeeklyStats(userId);
    res.json(weekly);
  } catch (error) {
    console.error('Error fetching weekly stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getMonthlyStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const monthly = await aggregateMonthlyStats(userId);
    res.json(monthly);
  } catch (error) {
    console.error('Error fetching monthly stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

const getYearlyStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const yearly = await aggregateYearlyStats(userId);
    res.json(yearly);
  } catch (error) {
    console.error('Error fetching yearly stats:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

// Aggregated handler that returns all stats in one object
const getTableStats = async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.user._id);
    const [daily, weekly, monthly, yearly] = await Promise.all([
      aggregateDailyStats(userId),
      aggregateWeeklyStats(userId),
      aggregateMonthlyStats(userId),
      aggregateYearlyStats(userId),
    ]);
    res.json({
      daily,
      weekly,
      monthly,
      yearly,
    });
  } catch (error) {
    console.error('Error fetching table statistics:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};

module.exports = {
  getDailyStats,
  getWeeklyStats,
  getMonthlyStats,
  getYearlyStats,
  getTableStats,
};
