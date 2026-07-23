const mongoose = require('mongoose');

const featuredCardSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Card title is required'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Card description is required'],
    },
    imageUrl: {
      type: String,
      required: [true, 'Image URL is required'],
    },
    linkedCategory: {
      type: String,
      required: [true, 'Linked category is required'],
      default: 'All',
    },
    order: {
      type: Number,
      required: true,
      default: 0,
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model('FeaturedCard', featuredCardSchema);
