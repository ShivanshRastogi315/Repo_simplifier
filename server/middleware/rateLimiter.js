const rateLimit = require('express-rate-limit');
const { RATE_LIMIT_WINDOW_MS, RATE_LIMIT_MAX_REQUESTS } = require('../config/constants');
const logger = require('../utils/logger');

/**
 * Rate limiter for analyze endpoint
 * Prevents abuse by limiting requests per IP
 */
const analyzeRateLimiter = rateLimit({
  windowMs: RATE_LIMIT_WINDOW_MS,
  max: RATE_LIMIT_MAX_REQUESTS,
  message: {
    success: false,
    error: 'Too many analysis requests from this IP, please try again later',
    code: 'RATE_LIMIT_EXCEEDED',
    retryAfter: RATE_LIMIT_WINDOW_MS / 1000, // in seconds
  },
  standardHeaders: true, // Return rate limit info in `RateLimit-*` headers
  legacyHeaders: false, // Disable `X-RateLimit-*` headers
  handler: (req, res) => {
    logger.warn('Rate limit exceeded', {
      ip: req.ip,
      url: req.originalUrl,
    });
    
    res.status(429).json({
      success: false,
      error: 'Too many analysis requests from this IP, please try again later',
      code: 'RATE_LIMIT_EXCEEDED',
      retryAfter: Math.ceil(RATE_LIMIT_WINDOW_MS / 1000),
    });
  },
  skip: (req) => {
    // Skip rate limiting in development for easier testing
    return process.env.NODE_ENV === 'development' && process.env.SKIP_RATE_LIMIT === 'true';
  },
});

/**
 * General API rate limiter (more lenient)
 */
const generalRateLimiter = rateLimit({
  windowMs: 60000, // 1 minute
  max: 30, // 30 requests per minute
  message: {
    success: false,
    error: 'Too many requests, please slow down',
    code: 'RATE_LIMIT_EXCEEDED',
  },
  standardHeaders: true,
  legacyHeaders: false,
});

module.exports = {
  analyzeRateLimiter,
  generalRateLimiter,
};

// Made with Bob
