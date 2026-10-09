import express from 'express';
import {
  getStoreSettings,
  updateStoreSettings,
  checkPincodeServiceability,
  sendTestEmailController
} from '../controllers/storeSettingsController.js';
import { protect, adminOnly, optionalAuth } from '../middleware/authMiddleware.js';
import { adminMutationRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Public: Get current shipping fees, thresholds, offers, logistics metadata (sanitized for public)
router.get('/', optionalAuth, getStoreSettings);

// Public: Check whether customer pincode is serviceable
router.get('/check-pincode/:pincode', checkPincodeServiceability);

// Admin: Update delivery fees, free delivery threshold, offers, logistics, pincodes, emails
router.put('/', protect, adminOnly, adminMutationRateLimiter, updateStoreSettings);

// Admin: Send test verification email to admin-configured address
router.post('/test-email', protect, adminOnly, adminMutationRateLimiter, sendTestEmailController);

export default router;
