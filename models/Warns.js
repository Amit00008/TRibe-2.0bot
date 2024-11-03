const mongoose = require('mongoose');

const warnSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  guildId: { type: String, required: true },
  warnings: [
    {
      reason: { type: String, required: true },
      date: { type: Date, default: Date.now },
      moderator: { type: String, required: true },
    },
  ],
});

module.exports = mongoose.model('Warn', warnSchema);
