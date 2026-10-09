import rateLimit from 'express-rate-limit';

/**
 * Exponential Backoff In-Memory Tracker for Authentication Routes
 * Tracks failed attempts per IP and per account (email).
 * Delays or throttles requests exponentially without a permanent hard lockout.
 */
class ExponentialBackoffTracker {
  constructor() {
    this.attempts = new Map();

    // Auto-clean records older than 30 minutes every 10 minutes
    setInterval(() => {
      const now = Date.now();
      for (const [key, record] of this.attempts.entries()) {
        if (now - record.lastAttempt > 30 * 60 * 1000) {
          this.attempts.delete(key);
        }
      }
    }, 10 * 60 * 1000);
  }

  getKey(ip, email) {
    const cleanEmail = email ? email.toLowerCase().trim() : '';
    return cleanEmail ? `acct:${cleanEmail}` : `ip:${ip}`;
  }

  /**
   * Get backoff delay in seconds
   * 1-2 failures: 0s (no penalty)
   * 3 failures: 2s
   * 4 failures: 4s
   * 5 failures: 8s
   * 6 failures: 16s
   * 7 failures: 32s
   * 8+ failures: up to 120s max
   */
  getBackoffDelaySeconds(failures) {
    if (failures <= 2) return 0;
    return Math.min(Math.pow(2, failures - 2), 120);
  }

  checkWaitTime(ip, email) {
    const now = Date.now();
    const keysToCheck = [this.getKey(ip, email)];
    if (email) keysToCheck.push(this.getKey(ip, '')); // Check IP too

    for (const key of keysToCheck) {
      const record = this.attempts.get(key);
      if (record && record.failures > 2) {
        const delayMs = this.getBackoffDelaySeconds(record.failures) * 1000;
        const elapsed = now - record.lastAttempt;
        if (elapsed < delayMs) {
          const remainingSeconds = Math.ceil((delayMs - elapsed) / 1000);
          return remainingSeconds;
        }
      }
    }
    return 0;
  }

  recordFailure(ip, email) {
    const now = Date.now();
    const keysToRecord = [this.getKey(ip, email)];
    if (email) keysToRecord.push(this.getKey(ip, ''));

    for (const key of keysToRecord) {
      const existing = this.attempts.get(key) || { failures: 0, lastAttempt: now };
      existing.failures += 1;
      existing.lastAttempt = now;
      this.attempts.set(key, existing);
    }
  }

  recordSuccess(ip, email) {
    if (email) this.attempts.delete(this.getKey(ip, email));
    this.attempts.delete(this.getKey(ip, ''));
  }
}

export const backoffTracker = new ExponentialBackoffTracker();

/**
 * Middleware: Check exponential backoff prior to processing auth route
 */
export const checkExponentialBackoff = (req, res, next) => {
  const ip = req.ip || req.connection?.remoteAddress || 'unknown';
  const email = req.body?.email || req.query?.email || '';

  const waitSeconds = backoffTracker.checkWaitTime(ip, email);
  if (waitSeconds > 0) {
    res.setHeader('Retry-After', waitSeconds);
    return res.status(429).json({
      success: false,
      message: `Too many unsuccessful authentication attempts. Please wait ${waitSeconds} second(s) before trying again.`,
      retryAfter: waitSeconds
    });
  }

  next();
};

/**
 * Configurable Environment Variable Thresholds
 */
const AUTH_WINDOW_MS = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const AUTH_MAX = Number(process.env.AUTH_RATE_LIMIT_MAX) || 20;

const ADMIN_LOGIN_WINDOW_MS = Number(process.env.ADMIN_LOGIN_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const ADMIN_LOGIN_MAX = Number(process.env.ADMIN_LOGIN_RATE_LIMIT_MAX) || 6;

const ADMIN_MUTATION_WINDOW_MS = Number(process.env.ADMIN_MUTATION_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const ADMIN_MUTATION_MAX = Number(process.env.ADMIN_MUTATION_RATE_LIMIT_MAX) || 45;

const PUBLIC_WINDOW_MS = Number(process.env.PUBLIC_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const PUBLIC_MAX = Number(process.env.PUBLIC_RATE_LIMIT_MAX) || 150;

const AUTHENTICATED_WINDOW_MS = Number(process.env.AUTHENTICATED_RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000;
const AUTHENTICATED_MAX = Number(process.env.AUTHENTICATED_RATE_LIMIT_MAX) || 400;

/**
 * Tier 1A: Customer Auth Routes (Login, Signup, OTP, Password Reset)
 */
export const authRateLimiter = rateLimit({
  windowMs: AUTH_WINDOW_MS,
  max: AUTH_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many authentication requests from this network. Please try again after 15 minutes.'
  }
});

/**
 * Tier 1B: Strict Admin Portal Login Limiter
 */
export const adminLoginRateLimiter = rateLimit({
  windowMs: ADMIN_LOGIN_WINDOW_MS,
  max: ADMIN_LOGIN_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Excessive administrator login attempts. Access temporarily throttled for security.'
  }
});

/**
 * Tier 2: Sensitive Admin Mutations (Create, Update, Delete Products/Coupons/Settings)
 */
export const adminMutationRateLimiter = rateLimit({
  windowMs: ADMIN_MUTATION_WINDOW_MS,
  max: ADMIN_MUTATION_MAX,
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.ip || 'admin-mutation';
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many administrative mutations submitted. Please wait before executing further changes.'
  }
});

/**
 * Tier 3: Moderate rate limits on public endpoints
 */
export const publicRateLimiter = rateLimit({
  windowMs: PUBLIC_WINDOW_MS,
  max: PUBLIC_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this network. Please slow down.'
  }
});

/**
 * Tier 4: Looser limits on authenticated customer actions
 */
export const authenticatedRateLimiter = rateLimit({
  windowMs: AUTHENTICATED_WINDOW_MS,
  max: AUTHENTICATED_MAX,
  keyGenerator: (req) => {
    return req.user?._id?.toString() || req.ip || 'authenticated-user';
  },
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Rate limit exceeded for user operations. Please wait a moment.'
  }
});
