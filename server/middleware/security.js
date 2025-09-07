const cors = require('cors');
const helmet = require('helmet');
const express = require('express');
const mongoSanitize = require('express-mongo-sanitize');

const securityMiddleware = (app) => {
  // Enhanced helmet configuration with better security
  app.use(helmet({
    contentSecurityPolicy: {
      directives: {
        defaultSrc: ["'self'"],
        styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
        scriptSrc: ["'self'", "'unsafe-eval'"], // Allow eval for better performance in dev
        imgSrc: ["'self'", "data:", "https:", "http:"],
        fontSrc: ["'self'", "https://fonts.gstatic.com"],
        connectSrc: ["'self'", "https:", "wss:"],
        mediaSrc: ["'self'"],
        objectSrc: ["'none'"],
        frameSrc: ["'none'"]
      },
    },
    hsts: {
      maxAge: 31536000, // 1 year
      includeSubDomains: true,
      preload: true
    },
    crossOriginEmbedderPolicy: false, // Disable for better compatibility
    crossOriginResourcePolicy: { policy: "cross-origin" }
  }));

  // NoSQL injection protection (since validation is removed)
  app.use(mongoSanitize({
    replaceWith: '_', // Replace prohibited characters
    onSanitize: ({ req, key }) => {
      console.warn(`Sanitized key: ${key} in ${req.method} ${req.path}`);
    }
  }));

  // Enhanced CORS configuration
  const corsOptions = {
    origin: function (origin, callback) {
      // Allow requests with no origin (mobile apps, etc.)
      if (!origin) return callback(null, true);
      
      const allowedOrigins = [
        process.env.FRONTEND_URL,
        'http://localhost:3000',
        'http://localhost:3001',
        'http://127.0.0.1:3000',
        'http://127.0.0.1:3001'
      ].filter(Boolean);
      
      // In production, be more restrictive
      if (process.env.NODE_ENV === 'production') {
        return callback(null, allowedOrigins.includes(origin));
      }
      
      // In development, allow all origins
      callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: [
      'Content-Type', 
      'Authorization', 
      'X-Requested-With',
      'Accept',
      'Origin'
    ],
    exposedHeaders: ['Content-Length', 'X-Foo', 'X-Bar'],
    maxAge: 86400, // 24 hours
    optionsSuccessStatus: 200 // Support legacy browsers
  };

  app.use(cors(corsOptions));

  // Enhanced body parsing (no validation, but with security limits)
  app.use(express.json({ 
    limit: '5mb', // Reduced from 10mb for better security
    type: ['application/json', 'application/*+json'],
    strict: false // Accept any JSON-like content (no validation)
  }));
  
  app.use(express.urlencoded({ 
    extended: true,
    limit: '5mb',
    parameterLimit: 1000 // Prevent parameter pollution
  }));

  // Raw body parser for webhooks (if needed)
  app.use('/api/webhooks', express.raw({ 
    type: 'application/json',
    limit: '1mb'
  }));

  // Trust proxy configuration
  app.set('trust proxy', process.env.NODE_ENV === 'production' ? 1 : false);

  // Additional security headers middleware
  app.use((req, res, next) => {
    // Security headers not covered by helmet
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');
    res.setHeader('X-XSS-Protection', '1; mode=block');
    res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
    res.setHeader('Permissions-Policy', 'geolocation=(), microphone=(), camera=()');
    
    // Performance headers
    res.setHeader('X-DNS-Prefetch-Control', 'off');
    res.setHeader('X-Download-Options', 'noopen');
    
    // Custom security header
    res.setHeader('X-Powered-By', 'Shyam International API');
    
    next();
  });

  // Request logging middleware (simplified)
  if (process.env.NODE_ENV !== 'production') {
    app.use((req, res, next) => {
     
      next();
    });
  }

  // IP and user agent tracking (for security monitoring)
  app.use((req, res, next) => {
    req.clientInfo = {
      ip: req.ip || req.connection?.remoteAddress || 'unknown',
      userAgent: req.get('User-Agent') || 'unknown',
      timestamp: new Date(),
      method: req.method,
      path: req.path
    };
    next();
  });
};

module.exports = { securityMiddleware };
