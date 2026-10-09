import { NewsletterSubscriber } from '../models/NewsletterSubscriber.js';

export const subscribeNewsletter = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email || !email.includes('@')) {
      return res.status(400).json({ success: false, message: 'Please provide a valid email address' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existing = await NewsletterSubscriber.findOne({ email: cleanEmail });
    if (existing) {
      return res.json({ success: true, message: 'You are already subscribed to Chilika Spices updates!' });
    }

    await NewsletterSubscriber.create({ email: cleanEmail });
    res.status(201).json({ success: true, message: 'Thank you for subscribing to traditional flavours!' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getSubscribers = async (req, res) => {
  try {
    const subscribers = await NewsletterSubscriber.find().sort({ subscribedAt: -1 });
    res.json({ success: true, subscribers });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
