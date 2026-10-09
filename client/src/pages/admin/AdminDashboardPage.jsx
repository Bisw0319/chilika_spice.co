import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  ShoppingBag,
  TrendingUp,
  Users,
  Package,
  AlertTriangle,
  Clock,
  ArrowRight,
  PlusCircle,
  Truck
} from 'lucide-react';
import { api } from '../../services/api';

export const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        const res = await api.getAdminStats();
        if (res.success) setStats(res.stats);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  if (loading) {
    return (
      <div className="p-8 text-center text-sm font-semibold text-gray-500">
        Loading Admin Analytics...
      </div>
    );
  }

  const {
    totalOrders = 0,
    todayOrders = 0,
    revenue = 0,
    totalCustomers = 0,
    totalProducts = 0,
    lowStockCount = 0,
    lowStockProducts = [],
    recentOrders = [],
    salesChart = []
  } = stats || {};

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-gray-900">
            Store Performance Overview
          </h1>
          <p className="text-xs sm:text-sm text-gray-500 mt-0.5">
            Real-time analytics and management controls for Chilika Spices
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <Link
            to="/admin/products"
            className="inline-flex items-center space-x-2 bg-spice-crimson hover:bg-spice-deepRed text-white px-4 py-2 rounded-xl text-xs font-bold shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            <span>Add New Spice</span>
          </Link>
        </div>
      </div>

      {/* 6 Key Stat Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {/* Total Orders */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Orders</span>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif font-bold text-2xl text-gray-900">{totalOrders}</span>
            <span className="text-[10px] text-green-600 font-semibold">+100%</span>
          </div>
        </div>

        {/* Today's Orders */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Today's Orders</span>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif font-bold text-2xl text-spice-crimson">{todayOrders}</span>
            <span className="text-[10px] text-gray-400">Live</span>
          </div>
        </div>

        {/* Revenue */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Total Revenue</span>
          <div className="flex items-baseline space-x-1">
            <span className="font-serif font-bold text-2xl text-green-700">₹{revenue}</span>
          </div>
        </div>

        {/* Customers */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Customers</span>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif font-bold text-2xl text-gray-900">{totalCustomers}</span>
            <span className="text-[10px] text-spice-turmeric font-semibold">Active</span>
          </div>
        </div>

        {/* Products */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Active Spices</span>
          <div className="flex items-baseline space-x-2">
            <span className="font-serif font-bold text-2xl text-gray-900">{totalProducts}</span>
          </div>
        </div>

        {/* Low Stock Alert */}
        <div className="bg-white p-4 rounded-2xl border border-gray-200 shadow-2xs space-y-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-gray-500">Low Stock</span>
          <div className="flex items-baseline space-x-2">
            <span className={`font-serif font-bold text-2xl ${lowStockCount > 0 ? 'text-amber-600' : 'text-gray-900'}`}>
              {lowStockCount}
            </span>
            {lowStockCount > 0 && (
              <span className="text-[10px] text-amber-600 font-semibold">Need refill</span>
            )}
          </div>
        </div>
      </div>

      {/* Visual Sales & Order Distribution Chart Section */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Weekly Revenue Graph Representation */}
        <div className="lg:col-span-8 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-gray-100">
            <div>
              <h3 className="font-serif font-bold text-base text-gray-900">Weekly Revenue Trends</h3>
              <p className="text-xs text-gray-500">Daily gross orders and sales</p>
            </div>
            <span className="text-xs font-bold text-green-700 bg-green-50 px-2.5 py-1 rounded-full border border-green-200">
              Avg ₹8,700/day
            </span>
          </div>

          <div className="pt-4 flex items-end justify-between h-48 space-x-3 px-2">
            {salesChart.map((day, i) => {
              const maxVal = 16000;
              const heightPct = Math.round((day.sales / maxVal) * 100);
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                  <span className="text-[10px] text-gray-400 group-hover:text-spice-crimson font-bold transition-colors">
                    ₹{day.sales}
                  </span>
                  <div className="w-full bg-spice-cream rounded-t-xl overflow-hidden h-36 flex items-end">
                    <div
                      className="w-full bg-gradient-to-t from-spice-crimson to-spice-turmeric rounded-t-lg transition-all duration-500 group-hover:brightness-110"
                      style={{ height: `${heightPct}%` }}
                    />
                  </div>
                  <span className="text-[11px] font-bold text-gray-600">{day.name}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Low Stock Items Warning Panel */}
        <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center space-x-2 pb-3 border-b border-gray-100">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <h3 className="font-serif font-bold text-base text-gray-900">Inventory Status</h3>
            </div>
            <div className="mt-3 space-y-2.5">
              {lowStockProducts.length === 0 ? (
                <p className="text-xs text-green-600 font-medium py-4">All spice stock levels healthy!</p>
              ) : (
                lowStockProducts.map((p) => (
                  <div key={p._id} className="flex items-center justify-between text-xs p-2 rounded-xl bg-amber-50 border border-amber-200">
                    <span className="font-semibold text-gray-800 truncate max-w-[140px]">{p.name}</span>
                    <span className="font-bold text-amber-800">{p.stock} units remaining</span>
                  </div>
                ))
              )}
            </div>
          </div>

          <Link
            to="/admin/products"
            className="w-full text-center py-2.5 bg-spice-cream text-spice-brown hover:bg-spice-sand text-xs font-bold rounded-xl border border-spice-tan transition-colors"
          >
            Manage Product Inventory →
          </Link>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-gray-100">
          <div>
            <h3 className="font-serif font-bold text-base text-gray-900">Recent Customer Orders</h3>
            <p className="text-xs text-gray-500">Live order stream requiring processing and dispatch</p>
          </div>
          <Link
            to="/admin/orders"
            className="text-xs font-bold text-spice-crimson hover:underline"
          >
            View All Orders →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-gray-200 text-gray-500 font-bold uppercase tracking-wider">
                <th className="py-2.5 px-3">Order ID</th>
                <th className="py-2.5 px-3">Customer</th>
                <th className="py-2.5 px-3">Destination</th>
                <th className="py-2.5 px-3">Items</th>
                <th className="py-2.5 px-3">Total</th>
                <th className="py-2.5 px-3">Status</th>
                <th className="py-2.5 px-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((ord) => (
                <tr key={ord._id} className="hover:bg-gray-50">
                  <td className="py-3 px-3 font-mono font-bold text-spice-crimson">{ord.orderId}</td>
                  <td className="py-3 px-3 font-medium text-gray-800">{ord.shippingAddress?.fullName || 'Guest'}</td>
                  <td className="py-3 px-3 text-gray-500">{ord.shippingAddress?.city}, {ord.shippingAddress?.state}</td>
                  <td className="py-3 px-3 text-gray-500">{ord.items.length} items</td>
                  <td className="py-3 px-3 font-bold text-gray-900">₹{ord.total}</td>
                  <td className="py-3 px-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-spice-sand text-spice-brown border border-spice-tan">
                      {ord.orderStatus}
                    </span>
                  </td>
                  <td className="py-3 px-3">
                    <Link
                      to="/admin/orders"
                      className="text-xs font-bold text-spice-crimson hover:underline"
                    >
                      Update
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
