import express from 'express';
import {
  getProductReviews,
  getFeaturedReviews,
  createReview,
  getAllReviews,
  toggleApproveReview,
  deleteReview
} from '../controllers/reviewController.js';
import { protect, optionalAuth, adminOnly } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/securitySanitizer.js';
import { adminMutationRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/featured', getFeaturedReviews);
router.get('/product/:productId', validateObjectId('productId'), getProductReviews);
router.post('/', optionalAuth, createReview);

// Admin routes with strict RBAC, ID validation, and mutation limiting
router.get('/', protect, adminOnly, getAllReviews);
router.put('/:id/approve', protect, adminOnly, validateObjectId('id'), adminMutationRateLimiter, toggleApproveReview);
router.delete('/:id', protect, adminOnly, validateObjectId('id'), adminMutationRateLimiter, deleteReview);

export default router;
