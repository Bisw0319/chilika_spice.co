import express from 'express';
import {
  registerUser,
  loginUser,
  adminLogin,
  getMe,
  updateProfile,
  setDefaultAddress,
  sendVerificationOTP,
  verifyEmailOTP,
  forgotPassword,
  verifyResetOtp,
  resetPassword,
  logoutUser
} from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import {
  authRateLimiter,
  adminLoginRateLimiter,
  checkExponentialBackoff,
  authenticatedRateLimiter
} from '../middleware/rateLimiter.js';

const router = express.Router();

// Customer Authentication Routes
router.post('/register', authRateLimiter, registerUser);
router.post('/login', authRateLimiter, checkExponentialBackoff, loginUser);

// Dedicated Stricter Admin Portal Authentication
router.post('/admin-login', adminLoginRateLimiter, checkExponentialBackoff, adminLogin);

// Server-Side Logout (Blacklists active token and increments tokenVersion)
router.post('/logout', protect, logoutUser);

// Authenticated user actions with looser limits
router.get('/me', protect, authenticatedRateLimiter, getMe);
router.put('/profile', protect, authenticatedRateLimiter, updateProfile);
router.put('/default-address', protect, authenticatedRateLimiter, setDefaultAddress);

// Email Verification & Password Recovery Endpoints with strict protection & exponential backoff
router.post('/send-verification-otp', authRateLimiter, sendVerificationOTP);
router.post('/verify-email-otp', authRateLimiter, verifyEmailOTP);
router.post('/forgot-password', authRateLimiter, checkExponentialBackoff, forgotPassword);
router.post('/verify-reset-otp', authRateLimiter, checkExponentialBackoff, verifyResetOtp);
router.post('/reset-password', authRateLimiter, checkExponentialBackoff, resetPassword);

export default router;
