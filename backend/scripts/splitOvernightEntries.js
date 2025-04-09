const TimeEntry = require('../models/TimeEntry');

module.exports = async function splitOvernightEntries() {
  const now = new Date();
  const today = new Date(now.setHours(0, 0, 0, 0));

  const entries = await TimeEntry.find({
    endTime: null,
    startTime: { $lt: today },
  });

  for (const entry of entries) {
    const endOfPrevDay = new Date(today.getTime() - 1);
    entry.endTime = endOfPrevDay;
    await entry.save();

    const newEntry = new TimeEntry({
      user: entry.user,
      activity: entry.activity,
      startTime: today,
      pauses: [],
      notes: entry.notes,
      continuedFrom: entry._id,
    });

    await newEntry.save();

    console.log(`⏱️ Split entry: ${entry._id} → new: ${newEntry._id}`);
  }
  console.log('[CRON] Done.');
};
