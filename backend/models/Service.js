const mongoose = require('mongoose');

/**
 * Service Schema
 * Represents a wedding service offered (e.g., photography, catering, décor).
 */
const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Service name is required'],
      trim: true,
      maxlength: [100, 'Service name cannot exceed 100 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    duration: {
      type: String,
      trim: true,
      default: '',
    },
    tag: {
      type: String,
      trim: true,
      default: '',
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
    reviews: [
      {
        customerName: { type: String, required: true },
        contactInfo: { type: String, required: true },
        rating: { type: Number, required: true, min: 1, max: 5 },
        text: { type: String },
        imageUrl: { type: String },
        adminAcknowledged: { type: Boolean, default: false },
        createdAt: { type: Date, default: Date.now }
      }
    ]
  },
  {
    timestamps: true, // Adds createdAt and updatedAt automatically
  }
);

// Index for faster queries by category
serviceSchema.index({ category: 1 });

module.exports = mongoose.model('Service', serviceSchema);
