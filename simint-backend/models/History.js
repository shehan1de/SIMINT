const mongoose = require('mongoose');

const historySchema = new mongoose.Schema({
  userInput: { type: String, required: true },
  cypherQuery: { type: String, required: true },
  results: { type: mongoose.Schema.Types.Mixed, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('History', historySchema);
