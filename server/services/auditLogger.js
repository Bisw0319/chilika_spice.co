import { AuditLog } from '../models/AuditLog.js';

// Keys that should never be recorded in audit logs
const SENSITIVE_KEYS = new Set([
  'password',
  'newpassword',
  'token',
  'jwt',
  'otp',
  'secret',
  'authorization',
  'cookie',
  'adminnotificationemail',
  'orderalertemails'
]);

/**
 * Deep redaction of sensitive attributes from logged objects
 */
export const redactSensitiveData = (obj) => {
  if (!obj || typeof obj !== 'object') return obj;

  if (Array.isArray(obj)) {
    return obj.map(redactSensitiveData);
  }

  const clean = {};
  for (const [key, value] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase();
    if (SENSITIVE_KEYS.has(lowerKey) || lowerKey.includes('password') || lowerKey.includes('token')) {
      clean[key] = '[REDACTED]';
    } else if (value && typeof value === 'object') {
      clean[key] = redactSensitiveData(value);
    } else {
      clean[key] = value;
    }
  }
  return clean;
};

/**
 * Record an immutable security audit log entry
 */
export const logAudit = async (req, {
  action,
  resourceType,
  resourceId = null,
  details = {},
  status = 'SUCCESS'
}) => {
  try {
    const ipAddress = (req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || 'unknown')
      .toString()
      .split(',')[0]
      .trim();

    const userAgent = req.headers['user-agent'] || 'unknown';

    const userId = req.user?._id || null;
    const userEmail = req.user?.email || (req.body?.email ? req.body.email.toLowerCase().trim() : 'anonymous');
    const userRole = req.user?.role || 'guest';

    const sanitizedDetails = redactSensitiveData(details);

    await AuditLog.create({
      userId,
      userEmail,
      userRole,
      action,
      resourceType,
      resourceId: resourceId ? String(resourceId) : null,
      details: sanitizedDetails,
      status,
      ipAddress,
      userAgent
    });
  } catch (error) {
    // Non-blocking: never crash the primary request if logging encounters a filesystem/DB warning
    console.warn('[AuditLog] Warning recording audit event:', error.message);
  }
};
