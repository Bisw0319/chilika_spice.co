import express from 'express';
import {
  getPaymentConfig,
  updatePaymentConfig,
  verifyOrderUpiPayment
} from '../controllers/paymentController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/securitySanitizer.js';
import { adminMutationRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public: Get payment settings for checkout (UPI ID, payee name, QR info)
router.get('/config', getPaymentConfig);

// Admin: Update UPI settings (UPI ID, phone, name, toggles)
router.put('/config', protect, adminOnly, adminMutationRateLimiter, updatePaymentConfig);

// Admin: 1-click verify order UPI payment
router.put('/verify-order/:id', protect, adminOnly, validateObjectId('id'), adminMutationRateLimiter, verifyOrderUpiPayment);

export default router;
