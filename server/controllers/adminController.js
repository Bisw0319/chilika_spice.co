import { Order } from '../models/Order.js';
import { Product } from '../models/Product.js';
import { User } from '../models/User.js';
import { AuditLog } from '../models/AuditLog.js';

export const getDashboardStats = async (req, res) => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const [
      totalOrders,
      todayOrders,
      totalRevenueResult,
      totalCustomers,
      totalProducts,
      lowStockProducts,
      recentOrders
    ] = await Promise.all([
      Order.countDocuments(),
      Order.countDocuments({ createdAt: { $gte: today } }),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'Cancelled' } } },
        { $group: { _id: null, total: { $sum: '$total' } } }
      ]),
      User.countDocuments({ role: 'customer' }),
      Product.countDocuments(),
      Product.find({ stock: { $lte: 15 } }).select('name stock price productImages'),
      Order.find().sort({ createdAt: -1 }).limit(8)
    ]);

    const revenue = totalRevenueResult.length > 0 ? totalRevenueResult[0].total : 0;

    // Real 7-day dynamic sales aggregation from Order collection
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const salesChart = [];
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 6);
    sevenDaysAgo.setHours(0, 0, 0, 0);

    const pastOrders = await Order.find({
      createdAt: { $gte: sevenDaysAgo },
      orderStatus: { $ne: 'Cancelled' }
    });

    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const dayStart = new Date(d);
      dayStart.setHours(0, 0, 0, 0);
      const dayEnd = new Date(d);
      dayEnd.setHours(23, 59, 59, 999);

      const dayOrders = pastOrders.filter(
        (o) => o.createdAt && o.createdAt >= dayStart && o.createdAt <= dayEnd
      );
      const daySales = dayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
      salesChart.push({
        name: days[d.getDay()],
        sales: daySales,
        orders: dayOrders.length
      });
    }

    res.json({
      success: true,
      stats: {
        totalOrders,
        todayOrders,
        revenue,
        totalCustomers,
        totalProducts,
        lowStockCount: lowStockProducts.length,
        lowStockProducts,
        recentOrders,
        salesChart
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getCustomers = async (req, res) => {
  try {
    const customers = await User.find({ role: 'customer' })
      .select('-password')
      .sort({ createdAt: -1 });

    // Aggregate order counts for each customer
    const customerList = await Promise.all(
      customers.map(async (c) => {
        const orderCount = await Order.countDocuments({ user: c._id });
        const orders = await Order.find({ user: c._id }).select('orderId total createdAt orderStatus');
        return {
          ...c.toObject(),
          orderCount,
          orders
        };
      })
    );

    res.json({ success: true, customers: customerList });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get immutable security audit logs (Admin only)
// @route   GET /api/admin/audit-logs
export const getAuditLogs = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = Math.min(parseInt(req.query.limit) || 25, 100);
    const skip = (page - 1) * limit;

    const query = {};
    if (req.query.action) query.action = req.query.action;
    if (req.query.resourceType) query.resourceType = req.query.resourceType;
    if (req.query.status) query.status = req.query.status;

    const [logs, total] = await Promise.all([
      AuditLog.find(query)
        .sort({ timestamp: -1 })
        .skip(skip)
        .limit(limit),
      AuditLog.countDocuments(query)
    ]);

    res.json({
      success: true,
      logs,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
