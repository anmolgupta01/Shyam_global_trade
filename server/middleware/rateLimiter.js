const rateLimit = require('express-rate-limit');

// General API rate limiter
const generalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again later.',
    retryAfter: Math.ceil(15 * 60 * 1000 / 1000) // in seconds
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Strict limiter for contact form submissions
const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 3, // limit each IP to 3 contact form submissions per windowMs
  message: {
    success: false,
    message: 'Too many contact form submissions from this IP. Please try again later.',
    retryAfter: Math.ceil(15 * 60 * 1000 / 1000)
  },
  standardHeaders: true,
  legacyHeaders: false,
  keyGenerator: (req) => {
    // Use IP address as the key
    return req.ip;
  }
});

// Very strict limiter for email testing (development)
const emailTestLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // limit each IP to 5 email tests per hour
  message: {
    success: false,
    message: 'Too many email test requests. Please try again later.',
    retryAfter: Math.ceil(60 * 60 * 1000 / 1000)
  },
  skip: (req) => {
    // Skip rate limiting in development mode
    return process.env.NODE_ENV === 'development';
  }
});

// Admin operations limiter (should be used with authentication)
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // limit each IP to 50 admin operations per windowMs
  message: {
    success: false,
    message: 'Too many admin requests from this IP.',
    retryAfter: Math.ceil(15 * 60 * 1000 / 1000)
  }
});

module.exports = {
  generalLimiter,
  contactFormLimiter,
  emailTestLimiter,
  adminLimiter
};