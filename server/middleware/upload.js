const multer = require('multer');
const path = require('path');

// Use memory storage for Cloudinary upload (not disk storage)
const storage = multer.memoryStorage();

// File filter for images
const fileFilter = (req, file, cb) => {
  // Accept image files only
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed!'), false);
  }
};

// Multer configuration for Cloudinary
const upload = multer({
  storage: storage, // Memory storage for Cloudinary
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
    files: 1,
    fields: 10,
    fieldSize: 1024 * 1024
  },
  fileFilter: fileFilter
});

// Single file upload middleware for Cloudinary
const uploadMiddleware = (req, res, next) => {
  upload.single('image')(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      const errorMessages = {
        'LIMIT_FILE_SIZE': 'File too large (max 10MB)',
        'LIMIT_FILE_COUNT': 'Too many files',
        'LIMIT_FIELD_COUNT': 'Too many fields',
        'LIMIT_UNEXPECTED_FILE': 'Unexpected file field'
      };
      
      return res.status(400).json({
        success: false,
        message: errorMessages[err.code] || 'Upload error',
        code: err.code
      });
    }
    
    if (err) {
      return res.status(400).json({
        success: false,
        message: 'File upload failed: ' + err.message
      });
    }
    
  
    
    next();
  });
};

module.exports = {
  uploadMiddleware
};
