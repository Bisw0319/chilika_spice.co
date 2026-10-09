import mongoose from 'mongoose';

const storeSettingsSchema = new mongoose.Schema({
  // Delivery & Shipping Fee Controls
  standardShippingFee: {
    type: Number,
    required: true,
    default: 49,
    min: 0
  },
  freeShippingThreshold: {
    type: Number,
    required: true,
    default: 499,
    min: 0
  },
  expressShippingFee: {
    type: Number,
    default: 99,
    min: 0
  },
  codExtraFee: {
    type: Number,
    default: 0,
    min: 0
  },
  estimatedDeliveryDays: {
    type: String,
    default: '3–5 Business Days'
  },
  shippingNotice: {
    type: String,
    default: 'Free Express Shipping on all orders above ₹499 across India'
  },

  // Store-wide Offers & Announcement Banners
  announcementActive: {
    type: Boolean,
    default: true
  },
  announcementText: {
    type: String,
    default: 'Authentic spices inspired by the kitchens of Odisha • Free shipping on orders above ₹499'
  },
  topBannerOfferCode: {
    type: String,
    default: 'CHILIKA10'
  },
  topBannerOfferText: {
    type: String,
    default: 'Flat 10% OFF on your spice order with coupon code CHILIKA10'
  },
  isOfferActive: {
    type: Boolean,
    default: true
  },

  // Logistics & Courier Delivery Configuration (Format based on standard logistics label)
  courierPartner: {
    type: String,
    default: 'Express Logistics'
  },
  shipperName: {
    type: String,
    default: 'Chilika Spices Pvt. Ltd.'
  },
  shipperPhone: {
    type: String,
    default: '+91 96686 59633'
  },
  shipperAddress: {
    type: String,
    default: 'Plot 108, Chilika Coastal Road, Balugaon, Dist: Khordha'
  },
  shipperCity: {
    type: String,
    default: 'Chilika'
  },
  shipperState: {
    type: String,
    default: 'Odisha'
  },
  shipperPincode: {
    type: String,
    default: '752030'
  },
  gstNumber: {
    type: String,
    default: '21AABCC1234D1Z8'
  },
  fssaiNumber: {
    type: String,
    default: '12026001000888'
  },
  hubCode: {
    type: String,
    default: 'HUB-OD-BBI01'
  },

  // Pincode Serviceability Control
  pincodeControlMode: {
    type: String,
    enum: ['all_india', 'restricted'],
    default: 'all_india'
  },
  serviceablePincodes: {
    type: [String],
    default: ['751001', '751002', '751003', '751024', '752030', '752054', '753001', '756001', '760001']
  },
  serviceablePrefixes: {
    type: [String],
    default: ['75', '76'] // 75 & 76 cover entire state of Odisha
  },
  serviceableMessage: {
    type: String,
    default: '✓ Express delivery available (3–5 business days)'
  },
  nonServiceableMessage: {
    type: String,
    default: '✕ Delivery is currently not available to this pincode'
  },

  // Admin Notification Email Configuration
  adminNotificationEmail: {
    type: String,
    default: 'freelixir.b@gmail.com'
  },
  orderAlertEmails: {
    type: String,
    default: 'freelixir.b@gmail.com, biswajitbaral193@gmail.com'
  },
  supportEmail: {
    type: String,
    default: 'care@chilikaspices.com'
  },
  sendCustomerReceipt: {
    type: Boolean,
    default: true
  },
  sendAdminOrderAlert: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

export const StoreSettings = mongoose.model('StoreSettings', storeSettingsSchema);
