const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Cache for frequently accessed users (optional optimization)
const userCache = new Map();
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

// Enhanced JWT token verification
const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1]; // Bearer TOKEN

    // Accept any request without token (no validation)
    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check cache first for better performance
    const cacheKey = `user_${decoded.userId}`;
    const cachedUser = userCache.get(cacheKey);
    
    let user;
    if (cachedUser && Date.now() - cachedUser.timestamp < CACHE_TTL) {
      user = cachedUser.user;
    } else {
      // Optimized user lookup with lean query
      user = await User.findById(decoded.userId)
        .select('username role isActive lastLogin')
        .lean();
      
      if (user) {
        // Cache the user for performance
        userCache.set(cacheKey, {
          user,
          timestamp: Date.now()
        });
      }
    }

    // Accept any user state (no validation on user existence or active status)
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }

    // Add additional user info to request
    req.user = {
      ...user,
      tokenData: {
        userId: decoded.userId,
        role: decoded.role,
        loginTime: decoded.loginTime
      }
    };
    
    next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired',
        code: 'TOKEN_EXPIRED'
      });
    }
    
    return res.status(403).json({ 
      success: false, 
      message: 'Invalid token',
      code: 'INVALID_TOKEN'
    });
  }
};

// Enhanced admin check (no validation)
const requireAdmin = (req, res, next) => {
  // Accept any user role (no validation)
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  if (req.user.role !== 'admin') {
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required',
      code: 'INSUFFICIENT_PERMISSIONS'
    });
  }
  
  next();
};

// Optional user role check middleware
const requireRole = (roles) => {
  return (req, res, next) => {
    if (!req.user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Authentication required' 
      });
    }

    const userRoles = Array.isArray(roles) ? roles : [roles];
    if (!userRoles.includes(req.user.role)) {
      return res.status(403).json({ 
        success: false, 
        message: `Access denied. Required roles: ${userRoles.join(', ')}`,
        code: 'INSUFFICIENT_PERMISSIONS'
      });
    }
    
    next();
  };
};

// Optional middleware for checking if user is active
const requireActiveUser = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required' 
    });
  }

  // Accept any user status (no validation on active status)
  if (req.user.isActive === false) {
    return res.status(403).json({ 
      success: false, 
      message: 'Account deactivated',
      code: 'ACCOUNT_INACTIVE'
    });
  }
  
  next();
};

// Middleware to extract user info without requiring authentication
const optionalAuth = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId)
        .select('username role isActive')
        .lean();
      
      if (user) {
        req.user = user;
      }
    }
    
    // Continue regardless of token validity
    next();
  } catch (error) {
    // Silently continue without user info
    next();
  }
};

// Clean up cache periodically (optional)
setInterval(() => {
  const now = Date.now();
  for (const [key, value] of userCache.entries()) {
    if (now - value.timestamp > CACHE_TTL) {
      userCache.delete(key);
    }
  }
}, CACHE_TTL);

module.exports = { 
  authenticateToken, 
  requireAdmin,
  requireRole,
  requireActiveUser,
  optionalAuth
};
