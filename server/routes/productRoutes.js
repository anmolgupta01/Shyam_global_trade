const express = require('express');
const path = require('path');
const fs = require('fs');
const router = express.Router();
const rateLimit = require('express-rate-limit');

// Only import functions that exist in your controller
const {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  getCategories
} = require('../controllers/productController');

// Import upload middleware
const { uploadMiddleware } = require('../middleware/upload');

// Rate limiting for admin operations
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // 50 requests per window
  message: { success: false, message: 'Too many admin requests.' }
});

// Optimized image serving with caching
router.get('/image/:filename', (req, res) => {
  const filename = req.params.filename;
  const imagePath = path.join(process.cwd(), 'uploads', 'products', filename);

  // Security headers and caching
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Cross-Origin-Resource-Policy', 'cross-origin');
  res.setHeader('Cache-Control', 'public, max-age=86400'); // 1 day cache
  res.setHeader('ETag', `"${filename}"`);

  if (fs.existsSync(imagePath)) {
    const stat = fs.statSync(imagePath);
    res.setHeader('Content-Length', stat.size);
    res.setHeader('Last-Modified', stat.mtime.toUTCString());
    res.sendFile(imagePath);
  } else {
    res.status(404).json({
      success: false,
      message: 'Image not found'
    });
  }
});

// Health check endpoint
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Product routes healthy',
    timestamp: new Date().toISOString(),
    version: '1.0.0'
  });
});

// Public routes (optimized order)
// router.get('/categories/stats', getCategoryStats); // ❌ Remove - function doesn't exist
router.get('/categories', getCategories);
// router.get('/code/:code', getProductByCode);       // ❌ Remove - function doesn't exist
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin routes with rate limiting
router.post('/', 
  adminLimiter,
  uploadMiddleware, 
  createProduct
);

router.put('/:id', 
  adminLimiter,
  uploadMiddleware, 
  updateProduct
);

router.delete('/:id', 
  adminLimiter,
  deleteProduct
);



module.exports = router;
