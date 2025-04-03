const mongoose = require('mongoose');

const activityTypeSchema = new mongoose.Schema(
  {
    // Reference to the user who created this activity type
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    // Name of the activity type (e.g., Work, Rest, Reading)
    name: { type: String, required: true, trim: true },
    // Optional description of the activity type
    description: { type: String, trim: true },
    // Optional icon URL or identifier for visual representation
    icon: { type: String },
    // Optional color code for the activity (e.g., #ff0000)
    color: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model('ActivityType', activityTypeSchema);
