import mongoose from 'mongoose';

const variantSchema = new mongoose.Schema({
  size: { type: String, required: true }, // e.g. "100g", "250g", "500g", "1kg"
  price: { type: Number, required: true },
  compareAtPrice: { type: Number, default: 0 },
  discountPercent: { type: Number, default: 0 },
  stock: { type: Number, default: 50 },
  sku: { type: String }
});

const productSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String, required: true },
  shortDescription: { type: String, default: '' },
  productImages: [{ type: String, required: true }],
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category', required: true },
  subcategory: { type: String, default: '' },
  ingredients: [{ type: String }],
  availableSizes: [{ type: String }],
  variants: [variantSchema],
  price: { type: Number, required: true },
  compareAtPrice: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  stock: { type: Number, default: 100 },
  sku: { type: String, default: '' },
  weight: { type: String, default: '' },
  rating: { type: Number, default: 4.8 },
  numReviews: { type: Number, default: 12 },
  isFeatured: { type: Boolean, default: false },
  isBestSeller: { type: Boolean, default: false },
  isNewArrival: { type: Boolean, default: false },
  isActive: { type: Boolean, default: true },
  howToUse: { type: String, default: 'Add as required during cooking to enhance aroma and rich taste.' },
  storageInfo: { type: String, default: 'Store in an airtight container in a cool, dry place away from direct sunlight.' },
  origin: { type: String, default: 'Chilika & Odisha, India' }
}, {
  timestamps: true
});

productSchema.index({ name: 'text', description: 'text', subcategory: 'text' });

export const Product = mongoose.model('Product', productSchema);
