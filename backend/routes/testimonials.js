const express = require('express');
const Testimonial = require('../models/Testimonial');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/testimonials
 * @desc    Get all testimonials
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const testimonials = await Testimonial.find().sort({ createdAt: -1 });

    res.json({
      success: true,
      count: testimonials.length,
      data: testimonials,
    });
  } catch (error) {
    console.error('Get testimonials error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching testimonials.',
    });
  }
});

/**
 * @route   GET /api/testimonials/:id
 * @desc    Get a single testimonial by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const testimonial = await Testimonial.findById(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });
    }

    res.json({
      success: true,
      data: testimonial,
    });
  } catch (error) {
    console.error('Get testimonial error:', error.message);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching testimonial.',
    });
  }
});

/**
 * @route   POST /api/testimonials
 * @desc    Create a new testimonial
 * @access  Protected
 */
router.post('/', auth, async (req, res) => {
  try {
    const { clientName, text, rating, imageUrl } = req.body;

    const testimonial = await Testimonial.create({
      clientName,
      text,
      rating,
      imageUrl,
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content_updated', {
      type: 'testimonials',
      action: 'create',
      data: testimonial,
    });

    res.status(201).json({
      success: true,
      message: 'Testimonial created successfully.',
      data: testimonial,
    });
  } catch (error) {
    console.error('Create testimonial error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating testimonial.',
    });
  }
});

/**
 * @route   PUT /api/testimonials/:id
 * @desc    Update a testimonial
 * @access  Protected
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { clientName, text, rating, imageUrl } = req.body;

    const testimonial = await Testimonial.findByIdAndUpdate(
      req.params.id,
      { clientName, text, rating, imageUrl },
      { new: true, runValidators: true }
    );

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content_updated', {
      type: 'testimonials',
      action: 'update',
      data: testimonial,
    });

    res.json({
      success: true,
      message: 'Testimonial updated successfully.',
      data: testimonial,
    });
  } catch (error) {
    console.error('Update testimonial error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating testimonial.',
    });
  }
});

/**
 * @route   DELETE /api/testimonials/:id
 * @desc    Delete a testimonial
 * @access  Protected
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const testimonial = await Testimonial.findByIdAndDelete(req.params.id);

    if (!testimonial) {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content_updated', {
      type: 'testimonials',
      action: 'delete',
      data: { _id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Testimonial deleted successfully.',
      data: { _id: req.params.id },
    });
  } catch (error) {
    console.error('Delete testimonial error:', error.message);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Testimonial not found.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting testimonial.',
    });
  }
});

module.exports = router;
