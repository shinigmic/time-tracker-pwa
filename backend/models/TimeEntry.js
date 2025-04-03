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
    // Duration of the session in seconds (can be computed dynamically or stored)
    duration: { type: Number, required: true },
    // Optional notes or comments about the session
    notes: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('TimeEntry', timeEntrySchema);
