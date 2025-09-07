const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');
const Contact = require('../models/Contact');
const emailService = require('../services/emailService');

// Rate limiters (simplified)
const contactFormLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { success: false, message: 'Too many submissions, please try again later.' },
  validate: {
    trustProxy: false // ✅ Add this to disable trust proxy validation
  }
});

const adminLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: { success: false, message: 'Too many requests.' },
  validate: {
    trustProxy: false // ✅ Add this to disable trust proxy validation
  }
});

// Basic input sanitization (not validation)
const sanitizeInput = (req, res, next) => {
  if (req.body) {
    Object.keys(req.body).forEach(key => {
      if (typeof req.body[key] === 'string') {
        req.body[key] = req.body[key].trim();
      }
    });
  }
  next();
};

// Submit contact form
router.post('/submit', 
  contactFormLimiter,
  sanitizeInput,
  async (req, res) => {
    try {
      const { name, email, phone, company, message } = req.body;

      // Optional duplicate check (no validation)
      const recentSubmission = await Contact.checkDuplicate(email, 5);
      if (recentSubmission) {
        return res.status(429).json({
          success: false,
          message: 'Please wait before submitting another form.',
          lastSubmission: recentSubmission.createdAt
        });
      }

      // Create contact (no validation)
      const newContact = new Contact({
        name,
        email,
        phone,
        company: company || '',
        message,
        status: 'new',
        ipAddress: req.ip,
        userAgent: req.get('User-Agent')
      });

      await newContact.save();

      // Send emails (optimized error handling)
      try {
        const emailResults = await emailService.sendContactEmails(newContact);
        
        if (emailResults.success) {
          await newContact.markEmailSent();
          newContact.emailMetadata = {
            ...emailResults.summary,
            sentAt: new Date()
          };
          await newContact.save();
        } else {
          await newContact.markEmailError(emailResults.errors.join('; '));
        }
      } catch (emailError) {
        await newContact.markEmailError(emailError.message);
      }

      res.status(201).json({
        success: true,
        message: 'Thank you for your message!',
        data: {
          id: newContact._id,
          submittedAt: newContact.createdAt,
          emailSent: newContact.emailSent
        }
      });

    } catch (error) {
      res.status(500).json({
        success: false,
        message: 'Server error. Please try again later.'
      });
    }
  }
);

// Test email endpoint
router.post('/test-email', async (req, res) => {
  try {
    const emailResults = await emailService.sendTestEmails();
    res.json({
      success: emailResults.success,
      message: emailResults.success ? 'Test emails sent!' : 'Some emails failed',
      details: emailResults.summary
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to send test emails',
      error: error.message
    });
  }
});

// Get all contacts with optimized queries
router.get('/submissions', adminLimiter, async (req, res) => {
  try {
    const page = Math.max(1, parseInt(req.query.page) || 1);
    const limit = Math.min(50, Math.max(1, parseInt(req.query.limit) || 10));
    const status = req.query.status;
    const search = req.query.search;
    const skip = (page - 1) * limit;

    // Build filter
    const filter = {};
    if (status && ['new', 'read', 'responded', 'closed'].includes(status)) {
      filter.status = status;
    }

    // Search filter
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { company: { $regex: search, $options: 'i' } }
      ];
    }

    // Optimized parallel queries
    const [contacts, total] = await Promise.all([
      Contact.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select('-ipAddress -userAgent -emailMetadata')
        .lean(),
      Contact.countDocuments(filter)
    ]);

    res.json({
      success: true,
      data: {
        contacts,
        pagination: {
          page,
          pages: Math.ceil(total / limit),
          total,
          hasNext: page < Math.ceil(total / limit),
          hasPrev: page > 1,
          limit
        }
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contacts'
    });
  }
});

// Get single contact
router.get('/:id', adminLimiter, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id).lean();
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      data: contact
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching contact'
    });
  }
});

// Update contact status
router.patch('/:id/status', adminLimiter, async (req, res) => {
  try {
    const { status } = req.body;

    const updatedContact = await Contact.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: new Date() },
      { new: true, lean: true }
    );

    if (!updatedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Status updated successfully',
      data: {
        id: updatedContact._id,
        status: updatedContact.status,
        updatedAt: updatedContact.updatedAt
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating status'
    });
  }
});

// Delete contact
router.delete('/:id', adminLimiter, async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id).lean();
    
    if (!deletedContact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    res.json({
      success: true,
      message: 'Contact deleted successfully',
      data: {
        id: deletedContact._id,
        name: deletedContact.name,
        email: deletedContact.email
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting contact'
    });
  }
});

// Get statistics with optimized aggregation
router.get('/admin/stats', adminLimiter, async (req, res) => {
  try {
    const now = new Date();
    const today = new Date(now.setHours(0, 0, 0, 0));
    const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const month = new Date(now.getFullYear(), now.getMonth(), 1);

    // Single aggregation for all stats
    const [stats] = await Contact.aggregate([
      {
        $facet: {
          overview: [
            {
              $group: {
                _id: null,
                total: { $sum: 1 },
                today: { $sum: { $cond: [{ $gte: ['$createdAt', today] }, 1, 0] } },
                week: { $sum: { $cond: [{ $gte: ['$createdAt', week] }, 1, 0] } },
                month: { $sum: { $cond: [{ $gte: ['$createdAt', month] }, 1, 0] } }
              }
            }
          ],
          byStatus: [
            {
              $group: {
                _id: '$status',
                count: { $sum: 1 }
              }
            }
          ],
          emailStats: [
            {
              $group: {
                _id: null,
                emailsSent: { $sum: { $cond: ['$emailSent', 1, 0] } },
                emailsFailed: { $sum: { $cond: ['$emailError', 1, 0] } }
              }
            }
          ]
        }
      }
    ]);

    const overview = stats.overview[0] || { total: 0, today: 0, week: 0, month: 0 };
    const statusBreakdown = stats.byStatus.reduce((acc, stat) => {
      acc[stat._id || 'new'] = stat.count;
      return acc;
    }, {});
    const emailStats = stats.emailStats[0] || { emailsSent: 0, emailsFailed: 0 };

    res.json({
      success: true,
      data: {
        overview,
        byStatus: statusBreakdown,
        emailStats
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching statistics'
    });
  }
});

// Resend emails
router.post('/:id/resend-emails', adminLimiter, async (req, res) => {
  try {
    const contact = await Contact.findById(req.params.id);
    
    if (!contact) {
      return res.status(404).json({
        success: false,
        message: 'Contact not found'
      });
    }

    const emailResults = await emailService.sendContactEmails(contact);
    
    if (emailResults.success) {
      await contact.markEmailSent();
      contact.emailMetadata = {
        ...emailResults.summary,
        resentAt: new Date()
      };
      await contact.save();
    } else {
      await contact.markEmailError(emailResults.errors.join('; '));
    }

    res.json({
      success: emailResults.success,
      message: emailResults.success ? 'Emails resent successfully!' : 'Failed to resend emails',
      data: emailResults.summary
    });

  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error resending emails'
    });
  }
});

module.exports = router;
