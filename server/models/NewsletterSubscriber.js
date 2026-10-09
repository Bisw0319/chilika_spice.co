import mongoose from 'mongoose';

const subscriberSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  subscribedAt: { type: Date, default: Date.now },
  isActive: { type: Boolean, default: true }
});

export const NewsletterSubscriber = mongoose.model('NewsletterSubscriber', subscriberSchema);
