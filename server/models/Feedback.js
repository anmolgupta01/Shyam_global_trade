const mongoose = require('mongoose');


const feedbackSchema = new mongoose.Schema({
  message: {
    type: String,
    trim: true
  },
  submittedAt: {
    type: Date,
    default: Date.now
  },
  userAgent: {
    type: String,
    default: ''
  },
  page: {
    type: String,
    default: 'unknown'
  },
  ipAddress: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  versionKey: false,
  strict: true,
  validateBeforeSave: false
});

// Optimized indexes
feedbackSchema.index({ submittedAt: -1 });
feedbackSchema.index({ createdAt: -1 });

module.exports  = mongoose.model('Feedback', feedbackSchema);
