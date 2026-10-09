import mongoose from 'mongoose';
import { PaymentConfig } from '../models/PaymentConfig.js';
import { Order } from '../models/Order.js';
import { logAudit } from '../services/auditLogger.js';

// Helper to ensure config exists
const getOrCreateDefaultConfig = async () => {
  let config = await PaymentConfig.findOne();
  if (!config) {
    config = await PaymentConfig.create({
      upiId: '9124160550@ybl',
      payeeName: 'Chilika Spices',
      phone: '9124160550',
      isUpiEnabled: true,
      isCodEnabled: true,
      qrCustomNote: 'Chilika Spices Fresh Order',
      instructions: 'Scan QR with any UPI app (GPay / PhonePe / Paytm / BHIM) or tap the mobile buttons. After payment, enter the 12-digit UPI Reference / UTR Number to confirm.'
    });
  }
  return config;
};

// @desc    Get public payment settings for checkout
// @route   GET /api/payment/config
export const getPaymentConfig = async (req, res) => {
  try {
    const config = await getOrCreateDefaultConfig();
    res.json({
      success: true,
      config: {
        upiId: config.upiId,
        payeeName: config.payeeName,
        phone: config.phone,
        isUpiEnabled: config.isUpiEnabled,
        isCodEnabled: config.isCodEnabled,
        qrCustomNote: config.qrCustomNote,
        instructions: config.instructions
      }
    });
  } catch (error) {
    console.error('[getPaymentConfig] Error:', error);
    res.status(500).json({ success: false, message: 'Failed to load payment configuration' });
  }
};

// @desc    Update payment settings (UPI ID, name, toggles)
// @route   PUT /api/payment/config
// @access  Admin only
export const updatePaymentConfig = async (req, res) => {
  try {
    const { upiId, payeeName, phone, isUpiEnabled, isCodEnabled, qrCustomNote, instructions } = req.body;

    let config = await PaymentConfig.findOne();
    if (!config) {
      config = new PaymentConfig();
    }

    if (upiId !== undefined) config.upiId = upiId.trim();
    if (payeeName !== undefined) config.payeeName = payeeName.trim();
    if (phone !== undefined) config.phone = phone.trim();
    if (isUpiEnabled !== undefined) config.isUpiEnabled = Boolean(isUpiEnabled);
    if (isCodEnabled !== undefined) config.isCodEnabled = Boolean(isCodEnabled);
    if (qrCustomNote !== undefined) config.qrCustomNote = qrCustomNote.trim();
    if (instructions !== undefined) config.instructions = instructions.trim();

    await config.save();

    await logAudit(req, {
      action: 'PAYMENT_CONFIG_UPDATED',
      resourceType: 'PaymentConfig',
      resourceId: config._id,
      details: {
        upiId: config.upiId,
        payeeName: config.payeeName,
        isUpiEnabled: config.isUpiEnabled,
        isCodEnabled: config.isCodEnabled
      }
    });

    res.json({
      success: true,
      message: 'Payment settings updated successfully',
      config
    });
  } catch (error) {
    console.error('[updatePaymentConfig] Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Failed to update payment settings' });
  }
};

// @desc    Verify UPI payment for an order by Admin
// @route   PUT /api/payment/verify-order/:id
// @access  Admin only
export const verifyOrderUpiPayment = async (req, res) => {
  try {
    const { id } = req.params;
    const { note } = req.body;

    let order = null;
    if (mongoose.isValidObjectId(id)) {
      order = await Order.findById(id);
    }
    if (!order) {
      order = await Order.findOne({ orderId: id });
    }
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    order.paymentStatus = 'paid';
    if (order.orderStatus === 'Order Placed') {
      order.orderStatus = 'Confirmed';
    }

    if (!order.paymentDetails) {
      order.paymentDetails = {};
    }
    order.paymentDetails.verifiedAt = new Date();
    order.paymentDetails.verifiedBy = req.user?._id;

    order.statusTimeline.push({
      status: 'Payment Verified',
      message: note || `UPI Payment verified by Administrator. UTR: ${order.paymentDetails?.utrNumber || 'Verified'}`,
      timestamp: new Date()
    });

    await order.save();

    await logAudit(req, {
      action: 'ORDER_UPI_PAYMENT_VERIFIED',
      resourceType: 'Order',
      resourceId: order._id,
      details: {
        orderId: order.orderId,
        paymentStatus: order.paymentStatus,
        utrNumber: order.paymentDetails?.utrNumber
      }
    });

    res.json({
      success: true,
      message: `Order ${order.orderId} payment verified successfully`,
      order
    });
  } catch (error) {
    console.error('[verifyOrderUpiPayment] Error:', error);
    res.status(500).json({ success: false, message: error.message || 'Payment verification failed' });
  }
};
