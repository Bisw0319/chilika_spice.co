import express from 'express';
import {
  createOrder,
  trackOrder,
  getMyOrders,
  getOrderById,
  getAllOrders,
  updateOrderStatus
} from '../controllers/orderController.js';
import { protect, optionalAuth, adminOnly } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/securitySanitizer.js';
import { adminMutationRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

// Order creation strictly requires authentication
router.post('/', protect, createOrder);
router.get('/track/:orderId', trackOrder);
router.get('/my-orders', protect, getMyOrders);
router.get('/:id', validateObjectId('id'), optionalAuth, getOrderById);

// Admin routes
router.get('/', protect, adminOnly, getAllOrders);
router.put('/:id/status', protect, adminOnly, validateObjectId('id'), adminMutationRateLimiter, updateOrderStatus);

export default router;
