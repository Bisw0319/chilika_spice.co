import express from 'express';
import {
  applyCoupon,
  getCoupons,
  createCoupon,
  updateCoupon,
  deleteCoupon
} from '../controllers/couponController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/securitySanitizer.js';
import { adminMutationRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.post('/apply', applyCoupon);

// Admin routes with strict RBAC, validation, and mutation limiting
router.get('/', protect, adminOnly, getCoupons);
router.post('/', protect, adminOnly, adminMutationRateLimiter, createCoupon);
router.put('/:id', protect, adminOnly, validateObjectId('id'), adminMutationRateLimiter, updateCoupon);
router.delete('/:id', protect, adminOnly, validateObjectId('id'), adminMutationRateLimiter, deleteCoupon);

export default router;
