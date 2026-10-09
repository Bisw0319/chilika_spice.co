import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema({
  timestamp: {
    type: Date,
    default: Date.now,
    required: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
    index: true
  },
  userEmail: {
    type: String,
    default: 'anonymous',
    index: true
  },
  userRole: {
    type: String,
    default: 'guest'
  },
  action: {
    type: String,
    required: true,
    index: true
    // Examples: ADMIN_LOGIN_SUCCESS, ADMIN_LOGIN_FAILED, ORDER_STATUS_UPDATE,
    // PRODUCT_CREATED, PRODUCT_UPDATED, PRODUCT_DELETED, SETTINGS_UPDATED,
    // PAYMENT_CONFIG_UPDATED, COUPON_CREATED, COUPON_DELETED, FILE_UPLOAD
  },
  resourceType: {
    type: String,
    required: true
    // Examples: Order, Product, Category, StoreSettings, PaymentConfig, Coupon, User, System
  },
  resourceId: {
    type: String,
    default: null
  },
  details: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  status: {
    type: String,
    enum: ['SUCCESS', 'FAILURE', 'WARNING'],
    default: 'SUCCESS'
  },
  ipAddress: {
    type: String,
    default: 'unknown'
  },
  userAgent: {
    type: String,
    default: 'unknown'
  }
}, {
  timestamps: false,
  versionKey: false
});

// Compound index for fast timeline queries
auditLogSchema.index({ timestamp: -1, action: 1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
