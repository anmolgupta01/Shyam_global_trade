const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const rateLimit = require('express-rate-limit');
const {
  getBanners,
  getBannerById,
  createBanner,
  updateBanner,
  deleteBanner
} = require('../controllers/bannerController');

// Ensure upload directory exists
const uploadDir = 'uploads/banners/';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Optimized multer configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname).toLowerCase();
    cb(null, `banner-${uniqueSuffix}${extension}`);
  }
});

// Basic file filter (no validation, just basic safety)
const fileFilter = (req, file, cb) => {
  // Accept any file (no validation as requested)
  cb(null, true);
};

const upload = multer({
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // Increased to 10MB
    files: 1
  }
});

// Rate limiting for banner uploads
const uploadLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 uploads per window
  message: { message: 'Too many upload attempts, please try again later' },
  standardHeaders: true,
  legacyHeaders: false
});

// Simplified error handling
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    const errorMessages = {
      'LIMIT_FILE_SIZE': 'File too large (max 10MB)',
      'LIMIT_UNEXPECTED_FILE': 'Unexpected file field',
      'LIMIT_FILE_COUNT': 'Too many files'
    };
    
    return res.status(400).json({ 
      success: false,
      message: errorMessages[err.code] || 'Upload error'
    });
  }
  
  if (err) {
    return res.status(400).json({ 
      success: false,
      message: 'File upload failed'
    });
  }
  
  next();
};

// Middleware to handle file cleanup on errors
const cleanupOnError = (req, res, next) => {
  const originalSend = res.send;
  const originalJson = res.json;
  
  const cleanup = () => {
    if (req.file && req.file.path && fs.existsSync(req.file.path)) {
      fs.unlinkSync(req.file.path);
    }
  };
  
  res.send = function(...args) {
    if (res.statusCode >= 400) cleanup();
    originalSend.apply(res, args);
  };
  
  res.json = function(...args) {
    if (res.statusCode >= 400) cleanup();
    originalJson.apply(res, args);
  };
  
  next();
};

// Public routes (cached)
router.get('/', getBanners);
router.get('/:id', getBannerById);

// Admin routes with optimizations
router.post('/', 
  uploadLimit,
  upload.single('image'),
  cleanupOnError,
  handleUploadError,
  createBanner
);

router.put('/:id',
  uploadLimit,
  upload.single('image'),
  cleanupOnError,
  handleUploadError,
  updateBanner
);

router.delete('/:id', deleteBanner);

module.exports = router;
