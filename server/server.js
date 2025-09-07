const express = require('express');
const fs = require('fs');
const path = require('path');
const cors = require('cors');
const compression = require('compression');
const mongoSanitize = require('express-mongo-sanitize');
require('dotenv').config();

const { connectDB } = require('./config/database');
const { securityMiddleware } = require('./middleware/security');
const { errorHandler, notFoundHandler } = require('./utils/errorHandler');

const productRoutes = require('./routes/productRoutes');
const contactRoutes = require('./routes/contactRoutes');
const bannerRoutes = require('./routes/bannerRoutes');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const feedbackRoutes = require('./routes/feedbackRoutes');

const app = express();
const PORT = process.env.PORT || 5001;

// ✅ Trust proxy for Render/Prod
app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

// Performance optimization - Compression middleware
app.use(compression());

// Security middleware
securityMiddleware(app);

// Prevent NoSQL injection
app.use(mongoSanitize());

// Create uploads directory if missing
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// ✅ Serve uploads directory
app.use('/uploads', express.static(uploadsDir, {
  maxAge: '1d',
  etag: true,
  lastModified: true,
  setHeaders: (res) => {
    res.header('Cross-Origin-Resource-Policy', 'cross-origin');
  }
}));

// Optimized CORS setup
const corsOptions = {
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.ALLOWED_ORIGINS?.split(',') 
    : ['http://localhost:3000', 'http://localhost:3001'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Body parsing
app.use(express.json({ limit: '5mb' }));
app.use(express.urlencoded({ extended: true, limit: '5mb' }));

// ------------------- API ROUTES -------------------
app.get('/', (req, res) => {
  res.json({ 
    message: 'Shyam International Contact API',
    version: '1.0.0',
    status: 'Active'
  });
});

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    uptime: Math.floor(process.uptime())
  });
});

// Routes
app.use('/api/contact', contactRoutes);
app.use('/api/products', productRoutes);
app.use('/api/banners', bannerRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/feedback', feedbackRoutes);

// ------------------- FRONTEND SERVING -------------------
if (process.env.NODE_ENV === 'production') {
  const clientBuildPath = path.join(__dirname, '../client/build');
  app.use(express.static(clientBuildPath));

  // Handle React Router (SPA support)
  app.get('*', (req, res) => {
    res.sendFile(path.join(clientBuildPath, 'index.html'));
  });
}

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

// ------------------- SERVER START -------------------
const startServer = async () => {
  try {
    await connectDB();
    const server = app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
    });

    // Timeouts
    server.timeout = 30000;
    server.keepAliveTimeout = 65000;
    server.headersTimeout = 66000;
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};
startServer();

// Graceful shutdown
const shutdown = () => {
  console.log('Shutting down gracefully...');
  process.exit(0);
};
process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

module.exports = app;
