import mongoose from 'mongoose';

const paymentConfigSchema = new mongoose.Schema({
  upiId: {
    type: String,
    required: true,
    default: '9124160550@ybl',
    trim: true
  },
  payeeName: {
    type: String,
    required: true,
    default: 'Chilika Spices',
    trim: true
  },
  phone: {
    type: String,
    default: '9124160550',
    trim: true
  },
  isUpiEnabled: {
    type: Boolean,
    default: true
  },
  isCodEnabled: {
    type: Boolean,
    default: true
  },
  qrCustomNote: {
    type: String,
    default: 'Pure Village Spices Order'
  },
  instructions: {
    type: String,
    default: 'Scan QR with any UPI app (GPay / PhonePe / Paytm / BHIM) or tap the 1-click mobile buttons. After payment, enter your 12-digit UTR number below.'
  }
}, {
  timestamps: true
});

export const PaymentConfig = mongoose.model('PaymentConfig', paymentConfigSchema);
