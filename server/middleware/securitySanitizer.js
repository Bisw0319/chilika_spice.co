import mongoose from 'mongoose';

/**
 * Deep check and removal of NoSQL injection vectors ($ keys and dot keys)
 */
const sanitizeObject = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(sanitizeObject);
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    // Strip operators starting with $ (e.g., $gt, $ne, $where) and dotted paths
    if (key.startsWith('$') || key.includes('.')) {
      continue;
    }

    if (value && typeof value === 'object') {
      clean[key] = sanitizeObject(value);
    } else if (typeof value === 'string') {
      // Basic XSS neutralization: strip raw script tags and javascript: URIs
      clean[key] = value
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '');
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

/**
 * Global Middleware: Sanitize req.body, req.query, and req.params against NoSQL injection
 */
export const noSqlSanitizer = (req, res, next) => {
  if (req.body) {
    req.body = sanitizeObject(req.body);
  }
  if (req.query) {
    req.query = sanitizeObject(req.query);
  }
  if (req.params) {
    req.params = sanitizeObject(req.params);
  }
  next();
};

/**
 * Route Middleware: Validate that req.params[paramName] is a valid MongoDB ObjectId
 */
export const validateObjectId = (paramName = 'id') => {
  return (req, res, next) => {
    const id = req.params[paramName];
    if (id && !mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: `Invalid format for resource identifier: ${paramName}`
      });
    }
    next();
  };
};
