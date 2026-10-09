import mongoose from 'mongoose';

const tokenRevocationSchema = new mongoose.Schema({
  tokenHash: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  reason: {
    type: String,
    default: 'user_logout'
  },
  expiresAt: {
    type: Date,
    required: true,
    index: { expires: 0 } // MongoDB TTL index: automatically deletes document when expiresAt arrives
  }
}, {
  timestamps: true
});

export const TokenRevocation = mongoose.model('TokenRevocation', tokenRevocationSchema);
