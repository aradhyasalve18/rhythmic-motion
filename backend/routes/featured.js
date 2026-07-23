const express = require('express');
const FeaturedCard = require('../models/FeaturedCard');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/featured
 * @desc    Get all featured cards
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const cards = await FeaturedCard.find().sort({ order: 1 });
    res.json({
      success: true,
      data: cards,
    });
  } catch (error) {
    console.error('Get featured cards error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching featured cards.',
    });
  }
});

/**
 * @route   PUT /api/featured
 * @desc    Bulk update all featured cards (max 4)
 * @access  Protected
 */
router.put('/', auth, async (req, res) => {
  try {
    const { cards } = req.body; // Expects an array of cards

    if (!Array.isArray(cards)) {
      return res.status(400).json({ success: false, message: 'Invalid data format' });
    }

    // Clear all existing cards
    await FeaturedCard.deleteMany({});

    // Create new ones (up to 4)
    const newCards = await FeaturedCard.insertMany(cards.slice(0, 4));

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content_updated', {
      type: 'featured',
      action: 'bulk_update',
      data: newCards,
    });

    res.json({
      success: true,
      message: 'Featured cards updated successfully.',
      data: newCards,
    });
  } catch (error) {
    console.error('Update featured cards error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while updating featured cards.',
    });
  }
});

module.exports = router;
