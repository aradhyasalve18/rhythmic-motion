const express = require('express');
const multer = require('multer');
const cloudinary = require('../config/cloudinary');
const streamifier = require('streamifier');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * Multer configuration: use memory storage so we get the file as a
 * Buffer instead of writing to disk. This buffer is then streamed
 * directly to Cloudinary.
 */
const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10 MB max file size
  },
  fileFilter: (_req, file, cb) => {
    // Allow only image files
    const allowedMimes = [
      'image/jpeg',
      'image/jpg',
      'image/png',
      'image/gif',
      'image/webp',
      'image/svg+xml',
    ];

    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('Invalid file type. Only JPEG, PNG, GIF, WebP, and SVG images are allowed.'));
    }
  },
});

/**
 * Stream a buffer to Cloudinary using their upload_stream API.
 * Returns a promise that resolves with the Cloudinary upload result.
 *
 * @param {Buffer} buffer - The file buffer from multer
 * @param {string} folder - The Cloudinary folder to upload into
 * @returns {Promise<Object>} Cloudinary upload result
 */
const streamUpload = (buffer, folder) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: `wedding-admin/${folder}`,
        resource_type: 'image',
        transformation: [
          { quality: 'auto', fetch_format: 'auto' }, // Auto-optimize
        ],
      },
      (error, result) => {
        if (result) {
          resolve(result);
        } else {
          reject(error);
        }
      }
    );

    // Pipe the buffer into the Cloudinary upload stream
    streamifier.createReadStream(buffer).pipe(stream);
  });
};

/**
 * @route   POST /api/upload
 * @desc    Upload an image to Cloudinary
 * @access  Protected
 *
 * Accepts a single file with field name "image".
 * Optional query param `folder` to organize uploads (default: "general").
 * Returns the Cloudinary secure URL and public ID.
 */
router.post('/', auth, upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        message: 'No image file provided. Use field name "image".',
      });
    }

    // Determine the folder from query param or default to "general"
    const folder = req.query.folder || 'general';

    // Stream the buffer to Cloudinary
    const result = await streamUpload(req.file.buffer, folder);

    res.status(200).json({
      success: true,
      message: 'Image uploaded successfully.',
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        width: result.width,
        height: result.height,
        format: result.format,
        bytes: result.bytes,
      },
    });
  } catch (error) {
    console.error('Upload error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during image upload.',
    });
  }
});

/**
 * @route   DELETE /api/upload/:publicId
 * @desc    Delete an image from Cloudinary by its public ID
 * @access  Protected
 *
 * The publicId should be URL-encoded if it contains slashes.
 * Example: wedding-admin/services/abc123 → wedding-admin%2Fservices%2Fabc123
 */
router.delete('/:publicId(*)', auth, async (req, res) => {
  try {
    const { publicId } = req.params;

    if (!publicId) {
      return res.status(400).json({
        success: false,
        message: 'Public ID is required.',
      });
    }

    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result === 'ok') {
      res.json({
        success: true,
        message: 'Image deleted from Cloudinary.',
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Image not found on Cloudinary or already deleted.',
      });
    }
  } catch (error) {
    console.error('Delete image error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting image.',
    });
  }
});

// Error handling for multer errors (file too large, invalid type, etc.)
router.use((error, _req, res, _next) => {
  if (error instanceof multer.MulterError) {
    if (error.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({
        success: false,
        message: 'File is too large. Maximum size is 10 MB.',
      });
    }
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error.message) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  res.status(500).json({
    success: false,
    message: 'An unexpected error occurred during upload.',
  });
});

module.exports = router;
