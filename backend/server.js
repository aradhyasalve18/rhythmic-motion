/**
 * Wedding Admin Portal - Backend Server
 *
 * Main entry point that bootstraps Express, MongoDB, Socket.io,
 * and mounts all API routes.
 */

require('dotenv').config();

const express = require('express');
const http = require('http');
const cors = require('cors');
const { Server } = require('socket.io');
const connectDB = require('./config/db');

// Import route handlers
const authRoutes = require('./routes/auth');
const serviceRoutes = require('./routes/services');
const galleryRoutes = require('./routes/gallery');
const testimonialRoutes = require('./routes/testimonials');
const uploadRoutes = require('./routes/upload');
const featuredRoutes = require('./routes/featured');

// ─────────────────────────────────────────────
// Initialize Express & HTTP Server
// ─────────────────────────────────────────────
const app = express();
const server = http.createServer(app);

// ─────────────────────────────────────────────
// CORS Configuration
// ─────────────────────────────────────────────
// Allow localhost dev servers and any Vercel deployment URLs
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:5174',
  'http://localhost:3000',
  ...(process.env.CLIENT_URLS ? process.env.CLIENT_URLS.split(',').map((url) => url.trim()) : []),
];

const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, curl, Postman, etc.)
    if (!origin) return callback(null, true);

    // Allow exact matches from the allowed list
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    // Allow any *.vercel.app subdomain
    if (origin.endsWith('.vercel.app')) {
      return callback(null, true);
    }

    callback(new Error(`Origin ${origin} not allowed by CORS`));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
};

app.use(cors(corsOptions));

// ─────────────────────────────────────────────
// Socket.io Setup
// ─────────────────────────────────────────────
const io = new Server(server, {
  cors: corsOptions,
  pingTimeout: 60000,
});

// Make the io instance accessible in route handlers via req.app.get('io')
app.set('io', io);

// Socket.io connection handler
io.on('connection', (socket) => {
  console.log(`🔌 Client connected: ${socket.id}`);

  socket.on('disconnect', (reason) => {
    console.log(`🔌 Client disconnected: ${socket.id} (${reason})`);
  });
});

// ─────────────────────────────────────────────
// Body Parsing Middleware
// ─────────────────────────────────────────────
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// ─────────────────────────────────────────────
// Request Logger (development only)
// ─────────────────────────────────────────────
if (process.env.NODE_ENV !== 'production') {
  app.use((req, _res, next) => {
    console.log(`${req.method} ${req.originalUrl}`);
    next();
  });
}

// ─────────────────────────────────────────────
// API Routes
// ─────────────────────────────────────────────
app.use('/api/auth', authRoutes);
app.use('/api/services', serviceRoutes);
app.use('/api/gallery', galleryRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/upload', uploadRoutes);
app.use('/api/featured', featuredRoutes);

// ─────────────────────────────────────────────
// Health Check Endpoint
// ─────────────────────────────────────────────
app.get('/api/health', (_req, res) => {
  res.json({
    success: true,
    message: 'Wedding Admin API is running',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// ─────────────────────────────────────────────
// 404 Handler
// ─────────────────────────────────────────────
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.',
  });
});

// ─────────────────────────────────────────────
// Global Error Handler
// ─────────────────────────────────────────────
app.use((err, _req, res, _next) => {
  console.error('❌ Unhandled error:', err.message);

  // CORS errors
  if (err.message && err.message.includes('not allowed by CORS')) {
    return res.status(403).json({
      success: false,
      message: 'CORS: Origin not allowed.',
    });
  }

  res.status(err.status || 500).json({
    success: false,
    message:
      process.env.NODE_ENV === 'production'
        ? 'Internal server error.'
        : err.message || 'Internal server error.',
  });
});

// ─────────────────────────────────────────────
// Start Server
// ─────────────────────────────────────────────
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to MongoDB first
    await connectDB();

    // Then start listening for HTTP requests
    server.listen(PORT, () => {
      console.log('');
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log(`🎉 Wedding Admin API running on port ${PORT}`);
      console.log(`📡 Socket.io ready for real-time connections`);
      console.log(`🌐 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
      console.log('');
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();

module.exports = { app, server };
