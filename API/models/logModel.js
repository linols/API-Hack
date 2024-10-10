const mongoose = require('mongoose');

const logSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: false,
  },
  userEmail: {
    type: String,
    required: false,
  },
  action: {
    type: String,
    required: true,
  },
  feature: {
    type: String,
    required: true,
  },
  statusCode: {
    type: Number,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {
  timestamps: true,
});

module.exports = mongoose.model('Log', logSchema);
