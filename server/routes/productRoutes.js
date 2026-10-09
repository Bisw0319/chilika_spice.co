import express from 'express';
import {
  getProducts,
  getBestSellers,
  getFeaturedProducts,
  getProductBySlug,
  getProductById,
  getRelatedProducts,
  createProduct,
  updateProduct,
  deleteProduct
} from '../controllers/productController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/securitySanitizer.js';
import { adminMutationRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getProducts);
router.get('/bestsellers', getBestSellers);
router.get('/featured', getFeaturedProducts);
router.get('/slug/:slug', getProductBySlug);
router.get('/related/:id', validateObjectId('id'), getRelatedProducts);
router.get('/:id', validateObjectId('id'), getProductById);

// Admin routes with strict RBAC, ID validation, and mutation rate limiting
router.post('/', protect, adminOnly, adminMutationRateLimiter, createProduct);
router.put('/:id', protect, adminOnly, validateObjectId('id'), adminMutationRateLimiter, updateProduct);
router.delete('/:id', protect, adminOnly, validateObjectId('id'), adminMutationRateLimiter, deleteProduct);

export default router;
