import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  userName: { type: String, required: true },
  userEmail: { type: String, default: '' },
  rating: { type: Number, required: true, min: 1, max: 5 },
  comment: { type: String, required: true },
  isVerifiedPurchase: { type: Boolean, default: true },
  isApproved: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Review = mongoose.model('Review', reviewSchema);
