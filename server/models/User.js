const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    trim: true,
    sparse: true // Allows nulls but maintains uniqueness for non-null values
  },
  password: {
    type: String,
    select: false // Don't return password by default in queries
  },
  role: {
    type: String,
    enum: ['admin', 'user'],
    default: 'user'
  },
  lastLogin: {
    type: Date,
    default: null
  },
  loginAttempts: {
    type: Number,
    default: 0
  },
  lockUntil: {
    type: Date,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true,
  versionKey: false,
  strict: true,
  validateBeforeSave: false
});

// Optimized indexes
userSchema.index({ username: 1 }, { unique: true, sparse: true });
userSchema.index({ role: 1 });
userSchema.index({ lastLogin: -1 });
userSchema.index({ isActive: 1 });

// Virtual for account lock status
userSchema.virtual('isLocked').get(function() {
  return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Pre-save middleware for password hashing and data cleaning
userSchema.pre('save', async function(next) {
  // Basic data sanitization
  if (this.username) this.username = this.username.trim().toLowerCase();
  
  // Hash password only if modified
  if (this.isModified('password') && this.password) {
    this.password = await bcrypt.hash(this.password, 12);
  }
  
  next();
});

// Enhanced password comparison with account locking
userSchema.methods.comparePassword = async function(candidatePassword) {
  try {
    const isMatch = await bcrypt.compare(candidatePassword, this.password);
    
    if (isMatch) {
      // Reset login attempts on successful login
      if (this.loginAttempts > 0) {
        await this.constructor.updateOne(
          { _id: this._id },
          {
            $unset: { loginAttempts: 1, lockUntil: 1 },
            $set: { lastLogin: new Date() }
          }
        );
      } else {
        await this.updateLastLogin();
      }
    } else {
      // Increment login attempts on failed login
      await this.incrementLoginAttempts();
    }
    
    return isMatch;
  } catch (error) {
    throw error;
  }
};

// Method to update last login
userSchema.methods.updateLastLogin = function() {
  return this.constructor.updateOne(
    { _id: this._id },
    { $set: { lastLogin: new Date() } }
  );
};

// Method to increment login attempts
userSchema.methods.incrementLoginAttempts = function() {
  const maxAttempts = 5;
  const lockTime = 2 * 60 * 60 * 1000; // 2 hours
  
  const updates = { $inc: { loginAttempts: 1 } };
  
  // Lock account after max attempts
  if (this.loginAttempts + 1 >= maxAttempts && !this.isLocked) {
    updates.$set = { lockUntil: Date.now() + lockTime };
  }
  
  return this.constructor.updateOne({ _id: this._id }, updates);
};

// Static methods
userSchema.statics.findByUsername = function(username) {
  return this.findOne({ 
    username: username?.toLowerCase()?.trim(),
    isActive: true 
  }).select('+password');
};

userSchema.statics.createUser = function(userData) {
  const user = new this({
    username: userData.username,
    password: userData.password,
    role: userData.role || 'user'
  });
  return user.save();
};

userSchema.statics.getActiveUsers = function(role = null) {
  const query = { isActive: true };
  if (role) query.role = role;
  return this.find(query).sort({ createdAt: -1 }).lean();
};

userSchema.statics.deactivateUser = function(userId) {
  return this.updateOne(
    { _id: userId },
    { $set: { isActive: false, updatedAt: new Date() } }
  );
};

// Method to reset password
userSchema.methods.resetPassword = async function(newPassword) {
  this.password = newPassword;
  this.loginAttempts = 0;
  this.lockUntil = undefined;
  return this.save();
};

// Clean JSON output (never expose password)
userSchema.set('toJSON', {
  transform: function(doc, ret) {
    delete ret.password;
    delete ret.loginAttempts;
    delete ret.lockUntil;
    return ret;
  }
});

module.exports = mongoose.model('User', userSchema);
