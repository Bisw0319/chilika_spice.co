import mongoose from 'mongoose';

const otpTokenSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true
  },
  otp: {
    type: String,
    required: true
  },
  purpose: {
    type: String,
    enum: ['verification', 'password_reset'],
    required: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // Automatically expires and cleans up in MongoDB
  }
}, {
  timestamps: true
});

export const OtpToken = mongoose.model('OtpToken', otpTokenSchema);
