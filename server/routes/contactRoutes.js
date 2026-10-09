import express from 'express';
import { sendContactInquiryEmail } from '../services/emailService.js';

const router = express.Router();

// @desc    Submit contact form message and email it to freelixir.b@gmail.com
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

    const emailResult = await sendContactInquiryEmail({
      name: name.trim(),
      email: email.trim(),
      phone: phone ? phone.trim() : '',
      message: message.trim()
    });

    res.json({
      success: true,
      message: 'Your message has been sent to the Chilika Spices team! We will reply directly to your email shortly.',
      provider: emailResult.provider,
      previewUrl: emailResult.previewUrl || null
    });
  } catch (error) {
    console.error('[Contact Error]', error.message);
    res.status(500).json({
      success: false,
      message: 'Failed to send your message. Please try again later.'
    });
  }
});

export default router;
