import express from 'express';
import { getDashboardStats, getCustomers, getAuditLogs } from '../controllers/adminController.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/dashboard', protect, adminOnly, getDashboardStats);
router.get('/customers', protect, adminOnly, getCustomers);
router.get('/audit-logs', protect, adminOnly, getAuditLogs);

export default router;
