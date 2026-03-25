const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const badgeSchema = new mongoose.Schema({
  id: String,
  name: String,
  description: String,
  icon: String,
  earnedAt: { type: Date, default: Date.now }
});

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3,
    maxlength: 20,
    match: /^[a-zA-Z0-9_]+$/ // Only alphanumeric + underscore
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true,
    match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
    select: false // Never returned in queries by default
  },
  xp: { type: Number, default: 0 },
  level: { type: Number, default: 1 }, // Player rank level (not game level)
  badges: [badgeSchema],
  currentGameLevel: { type: Number, default: 1 }, // Which game level unlocked
  createdAt: { type: Date, default: Date.now },
  lastLoginAt: { type: Date },
  resetToken: { type: String, select: false },
  resetTokenExpiry: { type: Date, select: false }
}, { timestamps: true });
// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// XP to rank level calculation
userSchema.methods.calculateLevel = function() {
  if (this.xp < 100) return 1;
  if (this.xp < 300) return 2;
  if (this.xp < 600) return 3;
  if (this.xp < 1000) return 4;
  return 5;
};

// Never expose sensitive fields
userSchema.methods.toSafeObject = function() {
  return {
    id: this._id,
    username: this.username,
    xp: this.xp,
    level: this.calculateLevel(),
    badges: this.badges,
    currentGameLevel: this.currentGameLevel,
    createdAt: this.createdAt
  };
};

module.exports = mongoose.model('User', userSchema);
