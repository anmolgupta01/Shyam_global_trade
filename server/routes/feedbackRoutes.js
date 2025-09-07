const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const rateLimit = require('express-rate-limit');
const Feedback =require("../models/Feedback")

// Simplified Feedback Schema - No validation

// Optimized rate limiting
const feedbackLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  message: { 
    success: false, 
    error: 'Too many requests. Please try again later.',
    code: 'RATE_LIMIT_EXCEEDED'
  }
});

// Helper function for client IP
const getClientIP = (req) => {
  return req.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
         req.ip || 
         req.connection?.remoteAddress || 
         'unknown';
};

// Basic input sanitization
const sanitizeInput = (req, res, next) => {
  if (req.body?.message) {
    req.body.message = req.body.message.trim();
  }
  next();
};

// Stats endpoint (optimized single aggregation)
router.get('/stats', async (req, res) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [stats] = await Feedback.aggregate([
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                recent: { $sum: { $cond: [{ $gte: ['$submittedAt', weekAgo] }, 1, 0] } },
                today: { $sum: { $cond: [{ $gte: ['$submittedAt', today] }, 1, 0] } }
              }
            }
          ]
        }
      }
    ]);

    const overview = stats.overview[0] || { total: 0, recent: 0, today: 0 };

    res.json({
      success: true,
      data: { overview }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching statistics',
      code: 'SERVER_ERROR'
    });
  }
});

// Health check
router.get('/health', async (req, res) => {
  try {
    const dbState = mongoose.connection.readyState;
    const dbStatus = ['disconnected', 'connected', 'connecting', 'disconnecting'][dbState] || 'unknown';
    
    const feedbackCount = await Feedback.estimatedDocumentCount(); // Faster than countDocuments

    res.json({
      success: true,
      status: 'healthy',
      timestamp: new Date().toISOString(),
      database: {
        status: dbStatus,
        connected: dbState === 1,
        feedbackCount
      },
      version: '1.0.0'
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      error: error.message,
      code: 'HEALTH_CHECK_FAILED'
    });
  }
});

// Submit feedback (no validation)
router.post('/', 
  feedbackLimiter,
  sanitizeInput,
  async (req, res) => {
    try {
      const { message, submittedAt, userAgent, page } = req.body;
      const clientIP = getClientIP(req);

      // Create feedback (no validation)
      const feedbackData = {
        message: message || '',
        submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
        userAgent: userAgent || req.get('User-Agent') || '',
        page: page || 'unknown',
        ipAddress: clientIP
      };

      const newFeedback = new Feedback(feedbackData);
      const savedFeedback = await newFeedback.save();

      res.status(201).json({
        success: true,
        message: 'Feedback submitted successfully',
        data: {
          id: savedFeedback._id,
          submittedAt: savedFeedback.submittedAt
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        error: 'Error saving feedback',
        code: 'SERVER_ERROR'
      });
    }
  }
);

// Get all feedback with optimized pagination
router.get('/', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, parseInt(req.query.limit) || 10));
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    
    const skip = (page - 1) * limit;
    
    // Optimized parallel queries with lean
    const [feedback, totalCount] = await Promise.all([
      Feedback.find()
        .sort({ submittedAt: sortOrder })
        .skip(skip)
        .limit(limit)
        .select('message submittedAt createdAt')
        .lean(),
      Feedback.estimatedDocumentCount() // Faster than countDocuments
    ]);

    const totalPages = Math.ceil(totalCount / limit);

    res.json({
      success: true,
      data: {
        feedback,
        pagination: {
          page,
          limit,
          total: totalCount,
          pages: totalPages,
          hasNext: page < totalPages,
          hasPrev: page > 1
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching feedback',
      code: 'SERVER_ERROR'
    });
  }
});

// Get specific feedback by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Basic ObjectId validation (minimal)
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        code: 'INVALID_ID'
      });
    }

    const feedback = await Feedback.findById(id)
      .select('message submittedAt createdAt')
      .lean();

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found',
        code: 'NOT_FOUND'
      });
    }

    res.json({
      success: true,
      data: feedback
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error fetching feedback',
      code: 'SERVER_ERROR'
    });
  }
});

// Delete feedback
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid ID format',
        code: 'INVALID_ID'
      });
    }

    const feedback = await Feedback.findByIdAndDelete(id).lean();

    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found',
        code: 'NOT_FOUND'
      });
    }

    res.json({
      success: true,
      message: 'Feedback deleted successfully',
      data: {
        id: feedback._id,
        deletedAt: new Date()
      }
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      error: 'Error deleting feedback',
      code: 'SERVER_ERROR'
    });
  }
});

module.exports = router;
