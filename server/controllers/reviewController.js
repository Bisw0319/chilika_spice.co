import { Review } from '../models/Review.js';
import { Product } from '../models/Product.js';

// @desc    Get reviews for a product
// @route   GET /api/reviews/product/:productId
export const getProductReviews = async (req, res) => {
  try {
    const reviews = await Review.find({
      product: req.params.productId,
      isApproved: true
    }).sort({ createdAt: -1 });

    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get top approved reviews for homepage carousel
// @route   GET /api/reviews/featured
export const getFeaturedReviews = async (req, res) => {
  try {
    const reviews = await Review.find({ isApproved: true })
      .populate('product', 'name slug')
      .sort({ rating: -1, createdAt: -1 })
      .limit(10);
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Submit review
// @route   POST /api/reviews
export const createReview = async (req, res) => {
  try {
    const { productId, rating, comment, userName, userEmail } = req.body;
    if (!productId || !rating || !comment) {
      return res.status(400).json({ success: false, message: 'Please provide rating and review comment' });
    }

    const review = await Review.create({
      product: productId,
      user: req.user ? req.user._id : undefined,
      userName: userName || (req.user ? req.user.name : 'Customer'),
      userEmail: userEmail || (req.user ? req.user.email : ''),
      rating: Number(rating),
      comment,
      isVerifiedPurchase: true,
      isApproved: true // auto-approve by default for friendly experience
    });

    // Update product rating and numReviews
    const allProductReviews = await Review.find({ product: productId, isApproved: true });
    const avg = allProductReviews.reduce((acc, item) => item.rating + acc, 0) / allProductReviews.length;
    await Product.findByIdAndUpdate(productId, {
      rating: Number(avg.toFixed(1)),
      numReviews: allProductReviews.length
    });

    res.status(201).json({ success: true, review, message: 'Thank you! Your review has been added.' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Get all reviews
// @route   GET /api/reviews
export const getAllReviews = async (req, res) => {
  try {
    const reviews = await Review.find()
      .populate('product', 'name slug')
      .sort({ createdAt: -1 });
    res.json({ success: true, reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Approve/Toggle review
// @route   PUT /api/reviews/:id/approve
export const toggleApproveReview = async (req, res) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });

    review.isApproved = !review.isApproved;
    await review.save();
    res.json({ success: true, review, message: `Review ${review.isApproved ? 'approved' : 'hidden'}` });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Delete review
// @route   DELETE /api/reviews/:id
export const deleteReview = async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.id);
    if (!review) return res.status(404).json({ success: false, message: 'Review not found' });
    res.json({ success: true, message: 'Review deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
