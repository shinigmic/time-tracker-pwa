const mongoose = require('mongoose');

// Subdocument schema for individual pause entries
const pauseSchema = new mongoose.Schema(
  {
    pauseStart: { type: Date, required: true },
    pauseEnd: { type: Date }, // Can be null if the pause is still ongoing
  },
  { _id: false }
);

// Main TimeEntry schema
const timeEntrySchema = new mongoose.Schema(
  {
    // Reference to the user who owns this time entry
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

    // Reference to the activity type
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ActivityType',
      required: true,
    },

    // Start and end time of the activity
    startTime: { type: Date, required: true },
    endTime: { type: Date },

    // Duration of the session in minutes (automatically computed)
    duration: { type: Number },

    // Optional notes
    notes: { type: String },

    // Array of pauses (start and optional end time)
    pauses: [pauseSchema],
  },
  { timestamps: true }
);

// Pre-save hook to calculate duration in minutes (excluding pause time)
timeEntrySchema.pre('save', function (next) {
  if (this.startTime && this.endTime) {
    const totalMs = this.endTime.getTime() - this.startTime.getTime();

    // Calculate total paused time in milliseconds
    const pausedMs =
      this.pauses?.reduce((acc, pause) => {
        if (pause.pauseStart && pause.pauseEnd) {
          return acc + (pause.pauseEnd.getTime() - pause.pauseStart.getTime());
        }
        return acc;
      }, 0) || 0;

    const activeMs = totalMs - pausedMs;

    // Convert milliseconds to minutes and round to 1 decimal place
    this.duration = Math.round((activeMs / 60000) * 10) / 10;
  } else {
    this.duration = null;
  }

  next();
});

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
