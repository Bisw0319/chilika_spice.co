import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { TokenRevocation } from '../models/TokenRevocation.js';

/**
 * Generate SHA-256 hash of JWT for efficient revocation lookup
 */
export const hashToken = (token) => {
  return crypto.createHash('sha256').update(token).digest('hex');
};

/**
 * Primary Authentication Middleware
 * Enforces valid signature, token revocation blacklist check, active account status,
 * and tokenVersion matching against database state.
 */
export const protect = async (req, res, next) => {
  let token;

  // Extract from Authorization header or secure cookie
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.chilika_token) {
    token = req.cookies.chilika_token;
  }

  if (!token) {
    return res.status(401).json({
      success: false,
      message: 'Access denied: Authentication token required'
    });
  }

  try {
    // 1. Check server-side token revocation / logout blacklist
    const tokenHash = hashToken(token);
    const isRevoked = await TokenRevocation.findOne({ tokenHash });
    if (isRevoked) {
      return res.status(401).json({
        success: false,
        message: 'Session has been invalidated or logged out. Please log in again.'
      });
    }

    // 2. Cryptographic signature and expiration check
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || 'chilika_spices_super_secret_jwt_key_2026_odisha'
    );

    // 3. Verify user identity against database
    let user = null;
    if (decoded.id) {
      user = await User.findById(decoded.id).select('-password');
    }

    // Fallback search by email if ID lookup fails
    if (!user && decoded.email) {
      user = await User.findOne({ email: decoded.email.toLowerCase() }).select('-password');
    }

    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Account not found or has been removed'
      });
    }

    // 4. Verify account is active
    if (user.isActive === false) {
      return res.status(403).json({
        success: false,
        message: 'Account has been deactivated. Please contact support.'
      });
    }

    // 5. Invalidate tokens issued prior to a password change or session reset
    if (
      decoded.tokenVersion !== undefined &&
      user.tokenVersion !== undefined &&
      decoded.tokenVersion < user.tokenVersion
    ) {
      return res.status(401).json({
        success: false,
        message: 'Session invalidated due to password change or security update. Please log in again.'
      });
    }

    // Attach verified user and token metadata to request
    req.user = user;
    req.token = token;
    req.tokenHash = tokenHash;

    return next();
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({
        success: false,
        message: 'Session expired. Please log in again.'
      });
    }
    return res.status(401).json({
      success: false,
      message: 'Authentication failed: Invalid or tampered token'
    });
  }
};

/**
 * Optional Authentication Middleware
 * Populates req.user if valid token provided; does not reject unauthenticated visitors.
 */
export const optionalAuth = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    token = req.headers.authorization.split(' ')[1];
  } else if (req.cookies && req.cookies.chilika_token) {
    token = req.cookies.chilika_token;
  }

  if (token) {
    try {
      const tokenHash = hashToken(token);
      const isRevoked = await TokenRevocation.findOne({ tokenHash });
      if (!isRevoked) {
        const decoded = jwt.verify(
          token,
          process.env.JWT_SECRET || 'chilika_spices_super_secret_jwt_key_2026_odisha'
        );
        if (decoded.id) {
          const user = await User.findById(decoded.id).select('-password');
          if (user && user.isActive !== false) {
            req.user = user;
            req.token = token;
            req.tokenHash = tokenHash;
          }
        }
      }
    } catch {
      // Ignored for optional authentication
    }
  }
  next();
};

/**
 * Strict Role-Based Access Control (RBAC): Administrator Only
 * Confirms user role directly against database-backed identity.
 */
export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    return next();
  }
  return res.status(403).json({
    success: false,
    message: 'Access denied: Administrator privileges required'
  });
};
