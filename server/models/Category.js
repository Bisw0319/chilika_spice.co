import mongoose from 'mongoose';

const categorySchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, unique: true },
  slug: { type: String, required: true, trim: true, lowercase: true, unique: true },
  description: { type: String, default: '' },
  image: { type: String, default: '' },
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
});

export const Category = mongoose.model('Category', categorySchema);
