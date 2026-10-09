import { Coupon } from '../models/Coupon.js';

// @desc    Validate / apply coupon
// @route   POST /api/coupons/apply
export const applyCoupon = async (req, res) => {
  try {
    const { code, cartTotal } = req.body;
    if (!code) {
      return res.status(400).json({ success: false, message: 'Please enter a coupon code' });
    }

    const coupon = await Coupon.findOne({ code: code.toUpperCase().trim(), isActive: true });
    if (!coupon) {
      return res.status(404).json({ success: false, message: 'Invalid or inactive coupon code' });
    }

    if (coupon.validUntil && new Date(coupon.validUntil) < new Date()) {
      return res.status(400).json({ success: false, message: 'Coupon code has expired' });
    }

    if (coupon.minOrderValue && cartTotal < coupon.minOrderValue) {
      return res.status(400).json({
        success: false,
        message: `This coupon requires a minimum cart value of ₹${coupon.minOrderValue}`
      });
    }

    let discount = 0;
    if (coupon.discountType === 'percentage') {
      discount = Math.round((cartTotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
        discount = Math.min(discount, coupon.maxDiscountAmount);
      }
    } else {
      discount = coupon.discountValue;
    }

    discount = Math.min(discount, cartTotal);

    res.json({
      success: true,
      message: `Coupon ${coupon.code} applied successfully!`,
      coupon: {
        code: coupon.code,
        discountType: coupon.discountType,
        discountValue: coupon.discountValue,
        discountAmount: discount
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Get all coupons
// @route   GET /api/coupons
export const getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({ createdAt: -1 });
    res.json({ success: true, coupons });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Create coupon
// @route   POST /api/coupons
export const createCoupon = async (req, res) => {
  try {
    const { code, discountType, discountValue, minOrderValue, maxDiscountAmount, validUntil, usageLimit, isActive } = req.body;
    const existing = await Coupon.findOne({ code: code.toUpperCase() });
    if (existing) {
      return res.status(400).json({ success: false, message: 'Coupon code already exists' });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      discountType,
      discountValue: Number(discountValue),
      minOrderValue: Number(minOrderValue) || 0,
      maxDiscountAmount: Number(maxDiscountAmount) || 0,
      validUntil: validUntil || undefined,
      usageLimit: Number(usageLimit) || 1000,
      isActive: isActive !== undefined ? isActive : true
    });

    res.status(201).json({ success: true, coupon, message: 'Coupon created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Update coupon
// @route   PUT /api/coupons/:id
export const updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });

    Object.assign(coupon, req.body);
    if (req.body.code) coupon.code = req.body.code.toUpperCase();
    await coupon.save();

    res.json({ success: true, coupon, message: 'Coupon updated' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Delete coupon
// @route   DELETE /api/coupons/:id
export const deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndDelete(req.params.id);
    if (!coupon) return res.status(404).json({ success: false, message: 'Coupon not found' });
    res.json({ success: true, message: 'Coupon deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
