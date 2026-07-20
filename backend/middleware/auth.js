const jwt = require('jsonwebtoken');

/**
 * JWT Authentication Middleware
 *
 * Verifies the Bearer token from the Authorization header.
 * On success, attaches the decoded user payload to `req.user`.
 * On failure, returns a 401 Unauthorized response.
 */
const auth = (req, res, next) => {
  try {
    // Extract token from "Bearer <token>" format
    const authHeader = req.header('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. No token provided.',
      });
    }

    const token = authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Access denied. Invalid token format.',
      });
    }

    // Verify and decode the token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    // Distinguish between expired and invalid tokens
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Token has expired. Please log in again.',
      });
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid token. Authentication failed.',
    });
  }
};

module.exports = auth;
