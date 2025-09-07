const { body, validationResult, param } = require('express-validator');

// Contact form validation rules
const validateContactForm = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters')
    .matches(/^[a-zA-Z\s\u00C0-\u017F]+$/)
    .withMessage('Name can only contain letters, spaces, and basic accented characters'),
  
  body('email')
    .trim()
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail()
    .isLength({ max: 254 })
    .withMessage('Email is too long'),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required')
    .matches(/^[\+]?[1-9][\d]{0,15}$/)
    .withMessage('Please provide a valid phone number')
    .isLength({ min: 7, max: 17 })
    .withMessage('Phone number must be between 7 and 17 characters'),
  
  body('company')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Company name cannot exceed 200 characters')
    .custom((value) => {
      if (value && value.trim().length < 2) {
        throw new Error('Company name must be at least 2 characters');
      }
      return true;
    }),
  
  body('message')
    .trim()
    .notEmpty()
    .withMessage('Message is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Message must be between 10 and 1000 characters')
];

// Status update validation
const validateStatusUpdate = [
  param('id')
    .isMongoId()
    .withMessage('Invalid contact ID format'),
    
  body('status')
    .isIn(['new', 'read', 'responded', 'closed'])
    .withMessage('Status must be one of: new, read, responded, closed')
];

// Pagination validation
const validatePagination = [
  body('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
    
  body('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
    
  body('status')
    .optional()
    .isIn(['new', 'read', 'responded', 'closed'])
    .withMessage('Status must be one of: new, read, responded, closed')
];

// Middleware to handle validation results
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  
  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map(error => ({
      field: error.path,
      message: error.msg,
      value: error.value
    }));

    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: formattedErrors
    });
  }
  
  next();
};

// Sanitization middleware for contact form
const sanitizeContactForm = (req, res, next) => {
  if (req.body.name) {
    req.body.name = req.body.name.trim().replace(/\s+/g, ' ');
  }
  
  if (req.body.company) {
    req.body.company = req.body.company.trim().replace(/\s+/g, ' ');
  }
  
  if (req.body.message) {
    req.body.message = req.body.message.trim().replace(/\s+/g, ' ');
  }
  
  next();
};

module.exports = {
  validateContactForm,
  validateStatusUpdate,
  validatePagination,
  handleValidationErrors,
  sanitizeContactForm
};