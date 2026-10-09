import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { Coupon } from '../models/Coupon.js';
import { StoreSettings } from '../models/StoreSettings.js';
import {
  sendNewOrderAdminAlertEmail,
  sendCustomerOrderConfirmationEmail
} from '../services/emailService.js';
import { logAudit } from '../services/auditLogger.js';

// Helper to generate sequential order ID: CHL-2026-XXXXXX
const generateOrderId = async () => {
  const count = await Order.countDocuments();
  const sequence = String(count + 1).padStart(6, '0');
  const year = new Date().getFullYear();
  return `CHL-${year}-${sequence}`;
};

// @desc    Create new order
// @route   POST /api/orders
export const createOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      paymentDetails,
      couponCode,
      notes
    } = req.body;

    // Strictly require login before order placement
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'Account login required. Please log in or create an account to place an order.'
      });
    }

    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, message: 'Your cart is empty' });
    }

    if (!shippingAddress || !shippingAddress.fullName || !shippingAddress.phone || !shippingAddress.street || !shippingAddress.pincode) {
      return res.status(400).json({ success: false, message: 'Please provide full shipping details' });
    }

    // Calculate subtotal from database or provided items
    let subtotal = 0;
    const orderItems = [];

    for (const item of items) {
      const lineSubtotal = Number(item.price) * Number(item.quantity);
      subtotal += lineSubtotal;

      orderItems.push({
        product: item.productId || item._id,
        productName: item.name,
        image: item.image,
        size: item.size || '100g',
        price: Number(item.price),
        quantity: Number(item.quantity),
        subtotal: lineSubtotal
      });

      // Update stock if product exists
      if (item.productId || item._id) {
        await Product.findByIdAndUpdate(item.productId || item._id, {
          $inc: { stock: -Number(item.quantity) }
        }).catch(() => null);
      }
    }

    // Fetch live store delivery settings configured in admin panel
    const storeSettings = await StoreSettings.findOne() || {
      standardShippingFee: 49,
      freeShippingThreshold: 499,
      codExtraFee: 0,
      courierPartner: 'Express Logistics'
    };

    const standardFee = Number(storeSettings.standardShippingFee ?? 49);
    const freeThreshold = Number(storeSettings.freeShippingThreshold ?? 499);
    let shippingCost = subtotal >= freeThreshold ? 0 : standardFee;
    if (paymentMethod === 'cod' && Number(storeSettings.codExtraFee) > 0) {
      shippingCost += Number(storeSettings.codExtraFee);
    }
    let discount = 0;
    let couponApplied = null;

    // Check coupon
    if (couponCode) {
      const coupon = await Coupon.findOne({ code: couponCode.toUpperCase(), isActive: true });
      if (coupon) {
        if (!coupon.minOrderValue || subtotal >= coupon.minOrderValue) {
          if (coupon.discountType === 'percentage') {
            discount = Math.round((subtotal * coupon.discountValue) / 100);
            if (coupon.maxDiscountAmount && coupon.maxDiscountAmount > 0) {
              discount = Math.min(discount, coupon.maxDiscountAmount);
            }
          } else {
            discount = coupon.discountValue;
          }
          couponApplied = { code: coupon.code, discountAmount: discount };
          coupon.usedCount += 1;
          await coupon.save();
        }
      }
    }

    const total = Math.max(0, subtotal + shippingCost - discount);
    const orderId = await generateOrderId();

    // Estimate delivery date: 4 to 6 business days from now
    const expectedDelivery = new Date();
    expectedDelivery.setDate(expectedDelivery.getDate() + 5);

    const initialTimeline = [
      {
        status: 'Order Placed',
        message: 'Your order has been received and is being prepared with fresh spices.',
        timestamp: new Date()
      }
    ];

    const order = await Order.create({
      orderId,
      user: req.user ? req.user._id : undefined,
      guestUser: !req.user ? {
        name: shippingAddress.fullName,
        email: shippingAddress.email,
        phone: shippingAddress.phone
      } : undefined,
      items: orderItems,
      shippingAddress,
      paymentMethod: paymentMethod || 'upi',
      paymentStatus: 'pending',
      paymentDetails: paymentDetails || {},
      orderStatus: 'Order Placed',
      statusTimeline: [
        ...initialTimeline,
        ...(paymentMethod === 'upi' && paymentDetails?.utrNumber ? [{
          status: 'UPI Payment Submitted',
          message: `Customer submitted UPI UTR: ${paymentDetails.utrNumber}. Verification pending by Chilika Spices team.`,
          timestamp: new Date()
        }] : [])
      ],
      subtotal,
      shippingCost,
      discount,
      couponApplied,
      total,
      expectedDeliveryDate: expectedDelivery,
      trackingNumber: `ODISHA-EXP-${Math.floor(100000 + Math.random() * 900000)}`,
      courierPartner: storeSettings.courierPartner || 'Express Logistics',
      invoiceNumber: `INV-${orderId}`,
      invoiceDate: new Date()
    });

    // Send email notifications controlled by admin
    if (storeSettings.sendAdminOrderAlert !== false) {
      sendNewOrderAdminAlertEmail({ order, settings: storeSettings }).catch((e) =>
        console.error('[Admin Order Alert Error]', e.message)
      );
    }
    if (storeSettings.sendCustomerReceipt !== false && shippingAddress.email) {
      sendCustomerOrderConfirmationEmail({ order, settings: storeSettings }).catch((e) =>
        console.error('[Customer Receipt Error]', e.message)
      );
    }

    res.status(201).json({
      success: true,
      message: 'Order placed successfully!',
      orderId: order.orderId,
      order
    });
  } catch (error) {
    console.error('[CreateOrder] Error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Track order by Order ID and Phone / Email
// @route   GET /api/orders/track/:orderId
export const trackOrder = async (req, res) => {
  try {
    const { orderId } = req.params;
    const { query } = req.query; // phone or email (optional verification)

    const order = await Order.findOne({ orderId: orderId.trim().toUpperCase() });
    if (!order) {
      return res.status(404).json({ success: false, message: `No order found with ID: ${orderId}` });
    }

    // If query provided, verify against phone or email
    if (query) {
      const q = query.trim().toLowerCase();
      const phoneMatch = order.shippingAddress.phone.toLowerCase().includes(q);
      const emailMatch = order.shippingAddress.email.toLowerCase() === q;
      if (!phoneMatch && !emailMatch) {
        return res.status(403).json({ success: false, message: 'Order ID and phone/email combination do not match.' });
      }
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get current logged in user orders
// @route   GET /api/orders/my-orders
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ user: req.user._id }).sort({ createdAt: -1 });
    res.json({ success: true, orders });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get order details by internal ID
// @route   GET /api/orders/:id
export const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    // Ensure user or admin
    if (req.user && req.user.role !== 'admin' && String(order.user) !== String(req.user._id)) {
      return res.status(403).json({ success: false, message: 'Not authorized to view this order' });
    }

    res.json({ success: true, order });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Get all orders
// @route   GET /api/orders
export const getAllOrders = async (req, res) => {
  try {
    const { status, search, page = 1, limit = 50 } = req.query;
    const filter = {};

    if (status && status !== 'all') {
      filter.orderStatus = status;
    }

    if (search) {
      filter.$or = [
        { orderId: { $regex: search, $options: 'i' } },
        { 'shippingAddress.fullName': { $regex: search, $options: 'i' } },
        { 'shippingAddress.phone': { $regex: search, $options: 'i' } },
        { 'shippingAddress.email': { $regex: search, $options: 'i' } }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter).sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      Order.countDocuments(filter)
    ]);

    res.json({ success: true, orders, total, page: Number(page) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Update order status & timeline
// @route   PUT /api/orders/:id/status
export const updateOrderStatus = async (req, res) => {
  try {
    const { status, message, trackingNumber, paymentStatus } = req.body;
    const order = await Order.findById(req.params.id);
    if (!order) {
      return res.status(404).json({ success: false, message: 'Order not found' });
    }

    if (status) {
      order.orderStatus = status;
      order.statusTimeline.push({
        status,
        message: message || `Status updated to ${status}`,
        timestamp: new Date()
      });
    }

    if (trackingNumber) {
      order.trackingNumber = trackingNumber;
    }

    if (paymentStatus) {
      order.paymentStatus = paymentStatus;
    }

    await order.save();

    await logAudit(req, {
      action: 'ORDER_STATUS_UPDATED',
      resourceType: 'Order',
      resourceId: order._id,
      details: {
        orderId: order.orderId,
        newStatus: order.orderStatus,
        paymentStatus: order.paymentStatus,
        trackingNumber: order.trackingNumber
      }
    });

    res.json({ success: true, order, message: 'Order status updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
