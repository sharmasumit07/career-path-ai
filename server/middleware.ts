import { Request, Response, NextFunction } from 'express';
import { rateLimit } from 'express-rate-limit';

// Rate limiting middleware
export const createRateLimiter = (windowMs: number, max: number, message: string) => {
  return rateLimit({
    windowMs,
    max,
    message: {
      error: message,
      code: 'RATE_LIMIT_EXCEEDED'
    },
    standardHeaders: true,
    legacyHeaders: false,
  });
};

// API rate limiters
export const generalApiLimiter = createRateLimiter(
  15 * 60 * 1000, // 15 minutes
  100, // limit each IP to 100 requests per windowMs
  'Too many requests from this IP, please try again later.'
);

export const assessmentLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  5, // limit each IP to 5 assessment requests per minute
  'Too many assessment submissions, please wait before submitting again.'
);

export const chatLimiter = createRateLimiter(
  60 * 1000, // 1 minute
  20, // limit each IP to 20 chat messages per minute
  'Too many chat messages, please slow down.'
);

// Input sanitization middleware
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
  // Recursively sanitize strings in request body
  const sanitizeObject = (obj: any): any => {
    if (typeof obj === 'string') {
      // Remove potential XSS and injection attempts
      return obj
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .trim();
    }
    
    if (Array.isArray(obj)) {
      return obj.map(sanitizeObject);
    }
    
    if (typeof obj === 'object' && obj !== null) {
      const sanitized: any = {};
      for (const [key, value] of Object.entries(obj)) {
        sanitized[key] = sanitizeObject(value);
      }
      return sanitized;
    }
    
    return obj;
  };

  if (req.body) {
    req.body = sanitizeObject(req.body);
  }

  if (req.query) {
    req.query = sanitizeObject(req.query);
  }

  next();
};

// Session validation middleware
export const validateSession = (req: Request, res: Response, next: NextFunction) => {
  const sessionId = req.body?.sessionId || req.params?.sessionId || req.query?.sessionId;
  
  if (!sessionId) {
    return res.status(400).json({
      message: 'Session ID is required',
      code: 'MISSING_SESSION_ID'
    });
  }

  // Validate session ID format (should be like: session_timestamp_randomstring)
  const sessionPattern = /^session_\d+_[a-zA-Z0-9]+$/;
  if (!sessionPattern.test(sessionId)) {
    return res.status(400).json({
      message: 'Invalid session ID format',
      code: 'INVALID_SESSION_FORMAT'
    });
  }

  next();
};

// Content type validation middleware
export const requireJsonContent = (req: Request, res: Response, next: NextFunction) => {
  if (!req.is('application/json')) {
    return res.status(400).json({
      message: 'Content-Type must be application/json',
      code: 'INVALID_CONTENT_TYPE'
    });
  }
  next();
};

// Request size validation middleware
export const validateRequestSize = (maxSizeKB: number) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const contentLength = parseInt(req.get('content-length') || '0');
    const maxSizeBytes = maxSizeKB * 1024;
    
    if (contentLength > maxSizeBytes) {
      return res.status(413).json({
        message: `Request too large. Maximum size is ${maxSizeKB}KB`,
        code: 'REQUEST_TOO_LARGE'
      });
    }
    
    next();
  };
};

// Error handling middleware
export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Unhandled error:', err);

  // Default error response
  let status = 500;
  let message = 'Internal server error';
  let code = 'INTERNAL_ERROR';

  // Handle specific error types
  if (err.name === 'ValidationError') {
    status = 400;
    message = 'Validation error';
    code = 'VALIDATION_ERROR';
  } else if (err.name === 'UnauthorizedError') {
    status = 401;
    message = 'Unauthorized';
    code = 'UNAUTHORIZED';
  } else if (err.status) {
    status = err.status;
  }

  res.status(status).json({
    message,
    code,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

// Health check middleware
export const healthCheck = (req: Request, res: Response) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: process.env.npm_package_version || '1.0.0'
  });
};