const express = require('express');
const Service = require('../models/Service');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/services
 * @desc    Get all services (optionally filter by category)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const services = await Service.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: services.length,
      data: services,
    });
  } catch (error) {
    console.error('Get services error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching services.',
    });
  }
});

/**
 * @route   GET /api/services/:id
 * @desc    Get a single service by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    res.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error('Get service error:', error.message);

    // Handle invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching service.',
    });
  }
});

/**
 * @route   POST /api/services
 * @desc    Create a new service
 * @access  Protected
 */
router.post('/', auth, async (req, res) => {
  try {
    const { name, category, price, duration, tag, description, imageUrl } = req.body;

    const service = await Service.create({
      name,
      category,
      price,
      duration,
      tag,
      description,
      imageUrl,
    });

    // Emit real-time update to all connected clients
    const io = req.app.get('io');
    io.emit('content_updated', {
      type: 'services',
      action: 'create',
      data: service,
    });

    res.status(201).json({
      success: true,
      message: 'Service created successfully.',
      data: service,
    });
  } catch (error) {
    console.error('Create service error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while creating service.',
    });
  }
});

/**
 * @route   PUT /api/services/:id
 * @desc    Update an existing service
 * @access  Protected
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { name, category, price, duration, tag, description, imageUrl } = req.body;

    const service = await Service.findByIdAndUpdate(
      req.params.id,
      { name, category, price, duration, tag, description, imageUrl },
      { new: true, runValidators: true }
    );

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content_updated', {
      type: 'services',
      action: 'update',
      data: service,
    });

    res.json({
      success: true,
      message: 'Service updated successfully.',
      data: service,
    });
  } catch (error) {
    console.error('Update service error:', error.message);

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
        message: 'Service not found.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating service.',
    });
  }
});

/**
 * @route   DELETE /api/services/:id
 * @desc    Delete a service
 * @access  Protected
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const service = await Service.findByIdAndDelete(req.params.id);

    if (!service) {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content_updated', {
      type: 'services',
      action: 'delete',
      data: { _id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Service deleted successfully.',
      data: { _id: req.params.id },
    });
  } catch (error) {
    console.error('Delete service error:', error.message);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Service not found.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting service.',
    });
  }
});

/**
 * @route   POST /api/services/:id/reviews
 * @desc    Add a review to a service
 * @access  Public
 */
router.post('/:id/reviews', async (req, res) => {
  try {
    const { customerName, contactInfo, rating, text, imageUrl } = req.body;

    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const newReview = { customerName, contactInfo, rating, text, imageUrl };
    service.reviews.push(newReview);
    await service.save();

    const io = req.app.get('io');
    io.emit('content_updated', { type: 'services', action: 'update', data: service });

    res.status(201).json({ success: true, message: 'Review added.', data: service });
  } catch (error) {
    console.error('Add review error:', error.message);
    res.status(500).json({ success: false, message: 'Server error while adding review.' });
  }
});

/**
 * @route   PUT /api/services/:id/reviews/:reviewId
 * @desc    Acknowledge a review
 * @access  Protected
 */
router.put('/:id/reviews/:reviewId', auth, async (req, res) => {
  try {
    const service = await Service.findById(req.params.id);
    if (!service) {
      return res.status(404).json({ success: false, message: 'Service not found.' });
    }

    const review = service.reviews.id(req.params.reviewId);
    if (!review) {
      return res.status(404).json({ success: false, message: 'Review not found.' });
    }

    review.adminAcknowledged = true;
    await service.save();

    const io = req.app.get('io');
    io.emit('content_updated', { type: 'services', action: 'update', data: service });

    res.json({ success: true, message: 'Review acknowledged.', data: service });
  } catch (error) {
    console.error('Acknowledge review error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
