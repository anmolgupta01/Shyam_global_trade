// Error handling middleware
const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;
  
    // Log error
    console.error('❌ Error:', err);
  
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      const message = 'Invalid ID format';
      error = { message, statusCode: 400 };
    }
  
    // Mongoose duplicate key
    if (err.code === 11000) {
      const message = 'Duplicate field value entered';
      error = { message, statusCode: 400 };
    }
  
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const message = Object.values(err.errors).map(val => val.message).join(', ');
      error = { message, statusCode: 400 };
    }
  
    // JSON parsing error
    if (err.type === 'entity.parse.failed') {
      const message = 'Invalid JSON format';
      error = { message, statusCode: 400 };
    }
  
    // Request entity too large
    if (err.type === 'entity.too.large') {
      const message = 'Request entity too large';
      error = { message, statusCode: 413 };
    }
  
    // Rate limit error
    if (err.status === 429) {
      const message = 'Too many requests, please try again later';
      error = { message, statusCode: 429 };
    }
  
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Server Error',
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
  };
  
  // 404 handler
  const notFoundHandler = (req, res) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.originalUrl} not found`,
      availableRoutes: {
        contact: [
          'POST /api/contact/submit',
          'GET /api/contact/all',
          'GET /api/contact/:id',
          'PATCH /api/contact/:id/status',
          'DELETE /api/contact/:id',
          'GET /api/contact/analytics/stats',
          'POST /api/contact/test-email'
        ],
        general: [
          'GET /',
          'GET /api/health'
        ]
      }
    });
  };
  
  // Async error wrapper
  const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
  
  // Custom error class
  class AppError extends Error {
    constructor(message, statusCode) {
      super(message);
      this.statusCode = statusCode;
      this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';
      this.isOperational = true;
  
      Error.captureStackTrace(this, this.constructor);
    }
  }
  
  // Success response helper
  const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
    const response = {
      success: true,
      message
    };
  
    if (data !== null) {
      response.data = data;
    }
  
    res.status(statusCode).json(response);
  };
  
  // Error response helper
  const sendError = (res, statusCode = 500, message = 'Server Error', errors = null) => {
    const response = {
      success: false,
      message
    };
  
    if (errors) {
      response.errors = errors;
    }
  
    res.status(statusCode).json(response);
  };
  
  module.exports = {
    errorHandler,
    notFoundHandler,
    asyncHandler,
    AppError,
    sendSuccess,
    sendError
  };