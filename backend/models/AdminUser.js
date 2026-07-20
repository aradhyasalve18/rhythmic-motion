const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * AdminUser Schema
 * Stores admin credentials for the wedding portal.
 * Passwords are automatically hashed before saving.
 */
const adminUserSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: [true, 'Username is required'],
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [3, 'Username must be at least 3 characters'],
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [6, 'Password must be at least 6 characters'],
    },
  },
  {
    timestamps: true,
  }
);

/**
 * Pre-save hook: hash the password if it has been modified.
 * Uses bcrypt with a salt factor of 12 for strong hashing.
 */
adminUserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Instance method: compare a candidate password against the stored hash.
 * @param {string} candidatePassword - The plaintext password to verify
 * @returns {Promise<boolean>} True if the password matches
 */
adminUserSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Ensure password is never returned in JSON responses
adminUserSchema.methods.toJSON = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

module.exports = mongoose.model('AdminUser', adminUserSchema);
