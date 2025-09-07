const Feedback = require('../models/Feedback');

// Get all feedback (optimized)
const getAllFeedback = async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;
    const skip = (page - 1) * limit;
    
    // Parallel queries for better performance
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
          currentPage: page,
          totalPages,
          totalItems: totalCount,
          itemsPerPage: limit,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1
        }
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error fetching feedback'
    });
  }
};

// Submit feedback (no validation)
const submitFeedback = async (req, res) => {
  try {
    const { message, submittedAt, userAgent, page } = req.body;
    
    // Accept any feedback (no validation)
    const clientIP = req.headers['x-forwarded-for']?.split(',')[0]?.trim() || 
                    req.ip || 
                    req.connection?.remoteAddress || 
                    'unknown';
    
    const feedbackData = {
      message: message || '', // Accept empty messages
      submittedAt: submittedAt ? new Date(submittedAt) : new Date(),
      userAgent: userAgent || req.get('User-Agent') || '',
      page: page || 'unknown',
      ipAddress: clientIP
    };
    
    const savedFeedback = await Feedback.create(feedbackData);
    
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
      error: 'Error submitting feedback'
    });
  }
};

// Get feedback by ID (optimized)
const getFeedbackById = async (req, res) => {
  try {
    const feedback = await Feedback.findById(req.params.id)
      .select('message submittedAt createdAt')
      .lean();
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found'
      });
    }
    
    res.json({
      success: true,
      data: feedback
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error fetching feedback'
    });
  }
};

// Delete feedback (optimized)
const deleteFeedback = async (req, res) => {
  try {
    const feedback = await Feedback.findByIdAndDelete(req.params.id).lean();
    
    if (!feedback) {
      return res.status(404).json({
        success: false,
        error: 'Feedback not found'
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
      error: 'Error deleting feedback'
    });
  }
};

// Get feedback statistics (optimized single aggregation)
const getFeedbackStats = async (req, res) => {
  try {
    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Single aggregation for all stats
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
      data: {
        overview,
        timestamp: new Date().toISOString()
      }
    });
    
  } catch (error) {
    res.status(500).json({ 
      success: false,
      error: 'Error fetching statistics'
    });
  }
};

// Health check
const healthCheck = (req, res) => {
  res.json({ 
    success: true,
    status: 'OK', 
    timestamp: new Date().toISOString(),
    service: 'Feedback API',
    version: '1.0.0'
  });
};

module.exports = {
  getAllFeedback,
  submitFeedback,
  getFeedbackById,
  deleteFeedback,
  getFeedbackStats,
  healthCheck
};
