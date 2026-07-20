const mongoose = require('mongoose');

/**
 * Testimonial Schema
 * Stores client testimonials/reviews for the wedding service.
 */
const testimonialSchema = new mongoose.Schema(
  {
    clientName: {
      type: String,
      required: [true, 'Client name is required'],
      trim: true,
      maxlength: [100, 'Client name cannot exceed 100 characters'],
    },
    text: {
      type: String,
      required: [true, 'Testimonial text is required'],
      trim: true,
      maxlength: [2000, 'Testimonial text cannot exceed 2000 characters'],
    },
    rating: {
      type: Number,
      required: [true, 'Rating is required'],
      min: [1, 'Rating must be at least 1'],
      max: [5, 'Rating cannot exceed 5'],
    },
    imageUrl: {
      type: String,
      default: '',
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('Testimonial', testimonialSchema);
