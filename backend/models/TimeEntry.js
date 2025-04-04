const mongoose = require('mongoose');

const timeEntrySchema = new mongoose.Schema(
  {
    // Reference to the user who owns this time entry
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Reference to the activity type (or you could store the name directly)
    activity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'ActivityType',
      required: true,
    },
    // Time when the activity started
    startTime: { type: Date, required: true },
    // Time when the activity ended (optional, if the session is ongoing, this can be null)
    endTime: { type: Date },
    // Duration of the session in seconds (automatically computed if startTime and endTime are provided)
    duration: { type: Number },
    // Optional notes or comments about the session
    notes: { type: String },
  },
  { timestamps: true }
);

// Pre-save hook to calculate duration automatically
// Pre-save hook to calculate duration in minutes (rounded to one decimal)
timeEntrySchema.pre('save', function (next) {
  if (this.startTime && this.endTime) {
    const diffMs = this.endTime.getTime() - this.startTime.getTime();
    // Convert milliseconds to minutes and round to one decimal
    this.duration = Math.round((diffMs / 60000) * 10) / 10;
  } else {
    this.duration = null;
  }
  next();
});

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
