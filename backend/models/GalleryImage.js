const mongoose = require('mongoose');

/**
 * GalleryImage Schema
 * Stores gallery images showcasing past weddings and events.
 */
const galleryImageSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Image title is required'],
      trim: true,
      maxlength: [150, 'Title cannot exceed 150 characters'],
    },
    category: {
      type: String,
      required: [true, 'Category is required'],
      trim: true,
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
  },
  {
    timestamps: true,
  }
);

// Index for faster queries by category
galleryImageSchema.index({ category: 1 });

module.exports = mongoose.model('GalleryImage', galleryImageSchema);
