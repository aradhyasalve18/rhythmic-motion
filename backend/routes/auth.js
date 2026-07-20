const express = require('express');
const jwt = require('jsonwebtoken');
const AdminUser = require('../models/AdminUser');
const auth = require('../middleware/auth');

const router = express.Router();

/**
 * @route   POST /api/auth/login
 * @desc    Authenticate admin and return JWT token
 * @access  Public
 */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      });
    }

    // Find user by username
    const user = await AdminUser.findOne({ username: username.toLowerCase() });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Verify password
    const isMatch = await user.comparePassword(password);

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials.',
      });
    }

    // Generate JWT token (expires in 7 days)
    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      success: true,
      message: 'Login successful.',
      token,
      user: {
        id: user._id,
        username: user.username,
      },
    });
  } catch (error) {
    console.error('Login error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error during login.',
    });
  }
});

/**
 * @route   POST /api/auth/register
 * @desc    Register a new admin user (first-time setup or protected)
 * @access  Public if no admins exist, otherwise Protected
 *
 * Design: The first admin can be created without auth. Subsequent admins
 * require a valid JWT — this prevents unauthorized account creation
 * while allowing initial setup without the seed script.
 */
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validate input
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: 'Username and password are required.',
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters.',
      });
    }

    // Check if any admins exist
    const adminCount = await AdminUser.countDocuments();

    // If admins already exist, require authentication
    if (adminCount > 0) {
      // Manually run the auth check
      const authHeader = req.header('Authorization');

      if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(403).json({
          success: false,
          message: 'Admin already exists. Authentication required to create more admins.',
        });
      }

      try {
        const token = authHeader.split(' ')[1];
        jwt.verify(token, process.env.JWT_SECRET);
      } catch {
        return res.status(401).json({
          success: false,
          message: 'Invalid or expired token.',
        });
      }
    }

    // Check if username already taken
    const existingUser = await AdminUser.findOne({ username: username.toLowerCase() });

    if (existingUser) {
      return res.status(409).json({
        success: false,
        message: 'Username already exists.',
      });
    }

    // Create new admin
    const newAdmin = await AdminUser.create({
      username: username.toLowerCase(),
      password,
    });

    // Generate token for the new admin
    const token = jwt.sign(
      { id: newAdmin._id, username: newAdmin.username },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      success: true,
      message: 'Admin registered successfully.',
      token,
      user: {
        id: newAdmin._id,
        username: newAdmin.username,
      },
    });
  } catch (error) {
    console.error('Registration error:', error.message);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e) => e.message);
      return res.status(400).json({
        success: false,
        message: messages.join(', '),
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during registration.',
    });
  }
});

/**
 * @route   GET /api/auth/me
 * @desc    Get the currently authenticated admin's info
 * @access  Protected
 */
router.get('/me', auth, async (req, res) => {
  try {
    const user = await AdminUser.findById(req.user.id).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found.',
      });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error('Get user error:', error.message);
    res.status(500).json({
      success: false,
      message: 'Server error.',
    });
  }
});

/**
 * @route   PUT /api/auth/change-password
 * @desc    Change the current admin's password
 * @access  Protected
 */
router.put('/change-password', auth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, message: 'Current and new password are required.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, message: 'New password must be at least 6 characters.' });
    }

    const user = await AdminUser.findById(req.user.id);
    const isMatch = await user.comparePassword(currentPassword);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Current password is incorrect.' });
    }

    user.password = newPassword;
    await user.save(); // pre-save hook auto-hashes

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (error) {
    console.error('Change password error:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
});

module.exports = router;
