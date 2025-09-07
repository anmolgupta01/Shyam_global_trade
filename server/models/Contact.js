const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true,
    lowercase: true
  },
  emailMetadata: {
    type: Object,
    default: null
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  message: {
    type: String,
    trim: true
  },
  ipAddress: {
    type: String,
    default: null
  },
  userAgent: {
    type: String,
    default: null
  },
  status: {
    type: String,
    enum: ['new', 'read', 'responded', 'closed'],
    default: 'new'
  },
  emailSent: {
    type: Boolean,
    default: false
  },
  emailError: {
    type: String,
    default: null
  }
}, {
  timestamps: true, // Automatically handles createdAt and updatedAt
  versionKey: false,
  strict: true,
  validateBeforeSave: false
});

// Optimized indexes for better performance
contactSchema.index({ email: 1, createdAt: -1 });
contactSchema.index({ status: 1 });
contactSchema.index({ emailSent: 1 });
contactSchema.index({ createdAt: -1 }); // For recent contacts

// Pre-save middleware for basic data cleaning (not validation)
contactSchema.pre('save', function(next) {
  // Basic data sanitization without validation
  if (this.email) this.email = this.email.toLowerCase().trim();
  if (this.name) this.name = this.name.trim();
  if (this.phone) this.phone = this.phone.trim();
  if (this.company) this.company = this.company.trim();
  if (this.message) this.message = this.message.trim();
  next();
});

// Static method to check for duplicate submission (performance optimized)
contactSchema.statics.checkDuplicate = function(email, timeWindow = 5) {
  return this.findOne({
    email: email?.toLowerCase()?.trim(),
    createdAt: { $gte: new Date(Date.now() - timeWindow * 60 * 1000) }
  }).lean(); // Use lean() for better performance
};

// Static method for bulk operations
contactSchema.statics.bulkCreateContacts = function(contacts) {
  return this.insertMany(contacts, { ordered: false });
};

// Static method to get contacts by status with pagination
contactSchema.statics.getByStatus = function(status, page = 1, limit = 20) {
  const skip = (page - 1) * limit;
  return this.find({ status })
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();
};

// Instance method to mark as email sent (optimized)
contactSchema.methods.markEmailSent = function() {
  return this.constructor.updateOne(
    { _id: this._id },
    { $set: { emailSent: true, updatedAt: new Date() } }
  );
};

// Instance method to mark email error (optimized)
contactSchema.methods.markEmailError = function(error) {
  return this.constructor.updateOne(
    { _id: this._id },
    { $set: { emailError: error, updatedAt: new Date() } }
  );
};

// Instance method to update status (optimized)
contactSchema.methods.updateStatus = function(newStatus) {
  return this.constructor.updateOne(
    { _id: this._id },
    { $set: { status: newStatus, updatedAt: new Date() } }
  );
};

// Virtual for formatted created date
contactSchema.virtual('formattedDate').get(function() {
  return this.createdAt?.toLocaleString() || 'N/A';
});

// Virtual to get contact summary
contactSchema.virtual('summary').get(function() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    status: this.status,
    createdAt: this.createdAt
  };
});

const Contact = mongoose.model('Contact', contactSchema);

module.exports = Contact;
