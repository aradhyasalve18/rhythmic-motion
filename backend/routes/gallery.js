const express = require('express');
const GalleryImage = require('../models/GalleryImage');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   GET /api/gallery
 * @desc    Get all gallery images (optionally filter by category)
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { category } = req.query;
    const filter = category ? { category } : {};

    const images = await GalleryImage.find(filter).sort({ createdAt: -1 });

    res.json({
      success: true,
      count: images.length,
      data: images,
    });
  } catch (error) {
    console.error('Get gallery error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching gallery images.',
    });
  }
});

/**
 * @route   GET /api/gallery/:id
 * @desc    Get a single gallery image by ID
 * @access  Public
 */
router.get('/:id', async (req, res) => {
  try {
    const image = await GalleryImage.findById(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found.',
      });
    }

    res.json({
      success: true,
      data: image,
    });
  } catch (error) {
    console.error('Get gallery image error:', error.message);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while fetching gallery image.',
    });
  }
});

/**
 * @route   POST /api/gallery
 * @desc    Add a new gallery image
 * @access  Protected
 */
router.post('/', auth, async (req, res) => {
  try {
    const { title, category, imageUrl } = req.body;

    const image = await GalleryImage.create({
      title,
      category,
      imageUrl,
    });

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content_updated', {
      type: 'gallery',
      action: 'create',
      data: image,
    });

    res.status(201).json({
      success: true,
      message: 'Gallery image added successfully.',
      data: image,
    });
  } catch (error) {
    console.error('Create gallery image error:', error.message);

    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while adding gallery image.',
    });
  }
});

/**
 * @route   PUT /api/gallery/:id
 * @desc    Update a gallery image
 * @access  Protected
 */
router.put('/:id', auth, async (req, res) => {
  try {
    const { title, category, imageUrl } = req.body;

    const image = await GalleryImage.findByIdAndUpdate(
      req.params.id,
      { title, category, imageUrl },
      { new: true, runValidators: true }
    );

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found.',
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content_updated', {
      type: 'gallery',
      action: 'update',
      data: image,
    });

    res.json({
      success: true,
      message: 'Gallery image updated successfully.',
      data: image,
    });
  } catch (error) {
    console.error('Update gallery image error:', error.message);

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
        message: 'Gallery image not found.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while updating gallery image.',
    });
  }
});

/**
 * @route   DELETE /api/gallery/:id
 * @desc    Delete a gallery image
 * @access  Protected
 */
router.delete('/:id', auth, async (req, res) => {
  try {
    const image = await GalleryImage.findByIdAndDelete(req.params.id);

    if (!image) {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found.',
      });
    }

    // Emit real-time update
    const io = req.app.get('io');
    io.emit('content_updated', {
      type: 'gallery',
      action: 'delete',
      data: { _id: req.params.id },
    });

    res.json({
      success: true,
      message: 'Gallery image deleted successfully.',
      data: { _id: req.params.id },
    });
  } catch (error) {
    console.error('Delete gallery image error:', error.message);

    if (error.kind === 'ObjectId') {
      return res.status(404).json({
        success: false,
        message: 'Gallery image not found.',
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error while deleting gallery image.',
    });
  }
});

module.exports = router;
