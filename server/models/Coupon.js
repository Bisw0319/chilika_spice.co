import mongoose from 'mongoose';

const couponSchema = new mongoose.Schema({
  code: { type: String, required: true, unique: true, uppercase: true, trim: true },
  discountType: { type: String, enum: ['percentage', 'fixed'], default: 'percentage' },
  discountValue: { type: Number, required: true },
  minOrderValue: { type: Number, default: 0 },
  maxDiscountAmount: { type: Number, default: 0 }, // 0 means no cap
  validUntil: { type: Date },
  usageLimit: { type: Number, default: 1000 },
  usedCount: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Coupon = mongoose.model('Coupon', couponSchema);
