import express from 'express';
import { getHomepageContent, updateHomepageContent } from '../controllers/homepageController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';
import { adminMutationRateLimiter } from '../middleware/rateLimiter.js';

const router = express.Router();

router.get('/', getHomepageContent);
router.put('/', protect, adminOnly, adminMutationRateLimiter, updateHomepageContent);

export default router;
