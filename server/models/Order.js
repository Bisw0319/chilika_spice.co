import mongoose from 'mongoose';

const orderItemSchema = new mongoose.Schema({
  product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
  productName: { type: String, required: true },
  image: { type: String, required: true },
  size: { type: String, default: '100g' },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true, min: 1 },
  subtotal: { type: Number, required: true }
});

const statusTimelineSchema = new mongoose.Schema({
  status: { type: String, required: true },
  message: { type: String, default: '' },
  timestamp: { type: Date, default: Date.now }
});

const orderSchema = new mongoose.Schema({
  orderId: { type: String, required: true, unique: true },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  guestUser: {
    name: { type: String },
    email: { type: String },
    phone: { type: String }
  },
  items: [orderItemSchema],
  shippingAddress: {
    fullName: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, default: 'Odisha' },
    pincode: { type: String, required: true },
    country: { type: String, default: 'India' }
  },
  paymentMethod: { type: String, enum: ['cod', 'razorpay', 'upi', 'whatsapp'], default: 'upi' },
  paymentStatus: { type: String, enum: ['pending', 'paid', 'failed'], default: 'pending' },
  paymentDetails: {
    upiId: { type: String, default: '' },
    utrNumber: { type: String, default: '' },
    paymentScreenshot: { type: String, default: '' },
    verifiedAt: { type: Date },
    verifiedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  },
  orderStatus: {
    type: String,
    enum: [
      'Order Placed',
      'Confirmed',
      'Processing',
      'Packed',
      'Shipped',
      'Out for Delivery',
      'Delivered',
      'Cancelled'
    ],
    default: 'Order Placed'
  },
  statusTimeline: [statusTimelineSchema],
  subtotal: { type: Number, required: true },
  shippingCost: { type: Number, default: 0 },
  discount: { type: Number, default: 0 },
  couponApplied: {
    code: { type: String },
    discountAmount: { type: Number, default: 0 }
  },
  total: { type: Number, required: true },
  trackingNumber: { type: String, default: '' },
  courierPartner: { type: String, default: 'Express Logistics' },
  invoiceNumber: { type: String, default: '' },
  invoiceDate: { type: Date, default: Date.now },
  expectedDeliveryDate: { type: Date }
}, {
  timestamps: true
});

export const Order = mongoose.model('Order', orderSchema);
