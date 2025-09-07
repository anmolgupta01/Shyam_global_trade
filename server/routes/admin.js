const express = require('express');
const rateLimit = require('express-rate-limit');
const User = require('../models/User');
const Contact = require('../models/Contact');
const Product = require('../models/Product');
const Feedback = require('../models/Feedback');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// Rate limiting for admin operations
const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 admin requests per window
  message: { success: false, message: 'Too many admin requests.' }
});

// Apply middleware to all admin routes
router.use(authenticateToken);
router.use(requireAdmin);
router.use(adminLimiter);

// Enhanced admin dashboard with real data
router.get('/dashboard', async (req, res) => {
  try {
    // Parallel execution for better performance
    const [userStats, contactStats, productStats, feedbackStats] = await Promise.all([
      User.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            active: { $sum: { $cond: ['$isActive', 1, 0] } }
          }
        }
      ]),
      Contact.aggregate([
        {
          $group: {
            _id: null,
            total: { $sum: 1 },
            new: { $sum: { $cond: [{ $eq: ['$status', 'new'] }, 1, 0] } }
          }
        }
      ]),
      Product.estimatedDocumentCount(),
      Feedback.estimatedDocumentCount()
    ]);

    res.json({
      success: true,
      data: {
        users: userStats[0] || { total: 0, active: 0 },
        contacts: contactStats[0] || { total: 0, new: 0 },
        products: { total: productStats },
        feedback: { total: feedbackStats },
        systemInfo: {
          uptime: Math.floor(process.uptime()),
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching dashboard data' 
    });
  }
});

// Get all users (optimized)
router.get('/users', async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 20));
    const skip = (page - 1) * limit;

    const [users, totalUsers] = await Promise.all([
      User.find()
        .select('-password -loginAttempts -lockUntil')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .lean(),
      User.countDocuments()
    ]);

    res.json({
      success: true,
      data: {
        users,
        pagination: {
          page,
          limit,
          total: totalUsers,
          pages: Math.ceil(totalUsers / limit)
        }
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching users' 
    });
  }
});

// Get user by ID
router.get('/users/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id)
      .select('-password -loginAttempts -lockUntil')
      .lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      data: user
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching user' 
    });
  }
});

// Deactivate user (better than delete)
router.patch('/users/:id/deactivate', async (req, res) => {
  try {
    const user = await User.deactivateUser(req.params.id);
    
    if (!user.matchedCount) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deactivated successfully'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deactivating user' 
    });
  }
});

// Reactivate user
router.patch('/users/:id/activate', async (req, res) => {
  try {
    const user = await User.updateOne(
      { _id: req.params.id },
      { $set: { isActive: true, updatedAt: new Date() } }
    );
    
    if (!user.matchedCount) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User activated successfully'
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error activating user' 
    });
  }
});

// Delete user (hard delete)
router.delete('/users/:id', async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id).lean();
    
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User deleted successfully',
      data: {
        id: user._id,
        username: user.username
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error deleting user' 
    });
  }
});

// System statistics
router.get('/stats', async (req, res) => {
  try {
    const [systemStats] = await Promise.all([
      Promise.all([
        User.aggregate([
          {
            $facet: {
              userStats: [
                { $group: { _id: '$role', count: { $sum: 1 } } }
              ],
              contactStats: [
                { $lookup: { from: 'contacts', pipeline: [], as: 'contacts' } },
                { $unwind: '$contacts' },
                { $group: { _id: '$contacts.status', count: { $sum: 1 } } }
              ]
            }
          }
        ])
      ])
    ]);

    res.json({
      success: true,
      data: {
        system: {
          uptime: process.uptime(),
          memory: process.memoryUsage(),
          timestamp: new Date().toISOString()
        }
      }
    });

  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Error fetching statistics' 
    });
  }
});

// Health check
router.get('/health', (req, res) => {
  res.json({
    success: true,
    message: 'Admin service healthy',
    timestamp: new Date().toISOString(),
    user: {
      id: req.user._id,
      role: req.user.role
    }
  });
});

module.exports = router;
