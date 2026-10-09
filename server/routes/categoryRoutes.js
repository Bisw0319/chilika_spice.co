import express from 'express';
import {
  getCategories,
  getCategoryBySlug,
  createCategory,
  updateCategory,
  deleteCategory
} from '../controllers/categoryController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { validateObjectId } from '../middleware/securitySanitizer.js';
import { adminMutationRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getCategories);
router.get('/:slug', getCategoryBySlug);

// Admin routes with strict RBAC, validation, and mutation limiting
router.post('/', protect, adminOnly, adminMutationRateLimiter, createCategory);
router.put('/:id', protect, adminOnly, validateObjectId('id'), adminMutationRateLimiter, updateCategory);
router.delete('/:id', protect, adminOnly, validateObjectId('id'), adminMutationRateLimiter, deleteCategory);

export default router;
