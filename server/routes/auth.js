const express = require('express');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const { authenticateToken } = require('../middleware/auth');
const router = express.Router();
// Rate limiting for auth endpoints
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { success: false, message: 'Too many login attempts. Please try again later.' },
  standardHeaders: true,
  legacyHeaders: false
});
const verifyLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50, // 50 verify requests per window
  message: { success: false, message: 'Too many verify requests.' }
});
// Basic input sanitization
const sanitizeAuth = (req, res, next) => {
  if (req.body.username) req.body.username = req.body.username.trim();
  if (req.body.password) req.body.password = req.body.password.trim();
  next();
};
// Login route (no validation)
router.post('/login', 
  authLimiter,
  sanitizeAuth,
  async (req, res) => {
    try {
      const { username, password } = req.body;

      // Basic validation
      if (!username || !password) {
        return res.status(400).json({ 
          success: false,
          message: 'Username and password required' 
        });
      }

      // Check against environment variables
      const adminUsername = process.env.ADMIN_USERNAME || 'admin';
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123';

      if (username === adminUsername && password === adminPassword) {
        // Check JWT_SECRET
        if (!process.env.JWT_SECRET) {
          return res.status(500).json({ 
            success: false,
            message: 'Server configuration error' 
          });
        }

        // Generate JWT token
        const token = jwt.sign(
          { 
            userId: 'admin-001',
            username: username,
            role: 'admin',
            loginTime: new Date()
          },
          process.env.JWT_SECRET,
          { expiresIn: '24h' }
        );

        // Successful response
        return res.json({
          success: true,
          token,
          user: {
            id: 'admin-001',
            username: username,
            role: 'admin'
          }
        });
      } else {
        // Invalid credentials
        return res.status(401).json({ 
          success: false,
          message: 'Invalid credentials' 
        });
      }

    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ 
        success: false,
        message: 'Authentication error' 
      });
    }
  }
);
// Verify token route
router.get('/verify', 
  verifyLimiter,
  authenticateToken, 
  (req, res) => {
    res.json({
      success: true,
      user: {
        id: req.user._id,
        username: req.user.username,
        role: req.user.role,
        isActive: req.user.isActive
      }
    });
  }
);
// Refresh token route
router.post('/refresh',
  verifyLimiter,
  authenticateToken,
  (req, res) => {
    try {
      // Generate new token
      const newToken = jwt.sign(
        { 
          userId: req.user._id, 
          username: req.user.username,
          role: req.user.role,
          refreshTime: new Date()
        },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );
      res.json({
        success: true,
        token: newToken,
        user: {
          id: req.user._id,
          username: req.user.username,
          role: req.user.role
        }
      });
    } catch (error) {
      res.status(500).json({ 
        success: false,
        message: 'Token refresh failed' 
      });
    }
  }
);
// Logout route
router.post('/logout', (req, res) => {
  res.json({ 
    success: true,
    message: 'Logged out successfully' 
  });
});
// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Auth service healthy',
    timestamp: new Date().toISOString()
  });
});
module.exports = router;