import express from 'express';
import { sendContactInquiryEmail } from '../services/emailService.js';
import { ContactMessage } from '../models/ContactMessage.js';
import { protect, adminOnly } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Submit contact form message, persist to DB and forward via email
// @route   POST /api/contact
router.post('/', async (req, res) => {
  try {
    const { name, email, phone, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, and message are required.'
      });
    }

    // 1. Always persist safely in MongoDB Atlas
    const savedDoc = await ContactMessage.create({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      message: message.trim()
    });

    // 2. Attempt email dispatch if email service configured
    let emailResult = { provider: 'database-saved' };
    try {
      emailResult = await sendContactInquiryEmail({
        name: name.trim(),
        email: email.trim(),
        phone: phone ? phone.trim() : '',
        message: message.trim()
      });
    } catch (mailErr) {
      console.warn('[Contact] Mail dispatch notice:', mailErr.message);
    }

    res.json({
      success: true,
      message: 'Your message has been received by the Chilika Spices team! We will reply to your email shortly.',
      inquiryId: savedDoc._id,
      provider: emailResult?.provider || 'database-saved'
    });
  } catch (error) {
    console.error('[Contact Error]', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to record your message. Please try again later.'
    });
  }
});

// @desc    Get all contact messages (Admin only)
// @route   GET /api/contact
router.get('/', protect, adminOnly, async (req, res) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 }).limit(100);
    res.json({ success: true, count: messages.length, messages });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

export default router;

