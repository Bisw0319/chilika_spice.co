import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import {
  Truck,
  Search,
  CheckCircle2,
  Clock,
  Package,
  MapPin,
  Calendar,
  AlertCircle,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../services/api';

const ORDER_STAGES = [
  { status: 'Order Placed', desc: 'Order received and verified' },
  { status: 'Confirmed', desc: 'Fresh spices batch allocated' },
  { status: 'Processing', desc: 'Slow-ground and weighed' },
  { status: 'Packed', desc: 'Vacuum sealed in aroma-guard box' },
  { status: 'Shipped', desc: 'Dispatched via express partner' },
  { status: 'Out for Delivery', desc: 'Courier out for doorstep drop' },
  { status: 'Delivered', desc: 'Safely delivered to your kitchen' }
];

export const TrackOrderPage = () => {
  const [searchParams] = useSearchParams();
  const initialOrderId = searchParams.get('orderId') || '';
  const initialPhone = searchParams.get('phone') || '';

  const [orderId, setOrderId] = useState(initialOrderId);
  const [contactQuery, setContactQuery] = useState(initialPhone);
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [copied, setCopied] = useState(false);

  const fetchTrackOrder = async (id, query) => {
    if (!id.trim()) {
      setError('Please enter a valid Order ID (e.g. CHL-2026-000001)');
      return;
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.trackOrder(id.trim(), query.trim());
      if (res.success && res.order) {
        setOrder(res.order);
      } else {
        setError(res.message || 'Order not found.');
        setOrder(null);
      }
    } catch (err) {
      setError(err.message || 'Unable to find order matching your details.');
      setOrder(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialOrderId) {
      fetchTrackOrder(initialOrderId, initialPhone);
    }
  }, [initialOrderId, initialPhone]);

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchTrackOrder(orderId, contactQuery);
  };

  const getCurrentStageIndex = () => {
    if (!order) return -1;
    if (order.orderStatus === 'Cancelled') return -2;
    return ORDER_STAGES.findIndex((s) => s.status.toLowerCase() === order.orderStatus.toLowerCase());
  };

  const copyOrderId = () => {
    if (order?.orderId) {
      navigator.clipboard.writeText(order.orderId);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const currentStageIdx = getCurrentStageIndex();

  return (
    <div className="min-h-screen bg-spice-cream py-8 sm:py-14">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <div className="w-12 h-12 rounded-full bg-spice-sand border border-spice-tan text-spice-crimson flex items-center justify-center mx-auto mb-3 shadow-2xs">
            <Truck className="w-6 h-6" />
          </div>
          <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
            Live Order Tracking
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown tracking-tight">
            Track Your Spice Parcel
          </h1>
          <p className="text-xs sm:text-sm text-spice-brown/70 mt-1.5">
            Follow the journey of your authentic freshly packed spices from Odisha villages to your kitchen door.
          </p>
        </div>

        {/* Input Form Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-spice-tan/60 shadow-sm mb-8">
          <form onSubmit={handleSubmit} className="grid grid-cols-1 sm:grid-cols-12 gap-3 sm:gap-4 items-end">
            <div className="sm:col-span-5">
              <label htmlFor="order-id-input" className="block text-xs font-bold text-spice-brown mb-1.5">
                Order ID *
              </label>
              <input
                id="order-id-input"
                type="text"
                required
                value={orderId}
                onChange={(e) => setOrderId(e.target.value.toUpperCase())}
                placeholder="e.g. CHL-2026-000001"
                className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-spice-brown uppercase focus:outline-none focus:border-spice-crimson"
              />
            </div>

            <div className="sm:col-span-4">
              <label htmlFor="phone-email-input" className="block text-xs font-bold text-spice-brown mb-1.5">
                Phone Number or Email (Optional)
              </label>
              <input
                id="phone-email-input"
                type="text"
                value={contactQuery}
                onChange={(e) => setContactQuery(e.target.value)}
                placeholder="Used during checkout"
                className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3.5 py-2.5 text-xs text-spice-brown focus:outline-none focus:border-spice-crimson"
              />
            </div>

            <div className="sm:col-span-3">
              <button
                type="submit"
                disabled={loading}
                className="w-full py-2.5 px-4 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold shadow-spice transition-all flex items-center justify-center space-x-1.5 disabled:opacity-70 active:scale-95"
              >
                <Search className="w-3.5 h-3.5" />
                <span>{loading ? 'Locating...' : 'Track Parcel'}</span>
              </button>
            </div>
          </form>

          {/* Quick Demo Hint */}
          <div className="mt-4 pt-3 border-t border-spice-tan/40 flex flex-wrap items-center justify-between text-xs text-spice-brown/70">
            <span>Try sample demo tracking:</span>
            <button
              type="button"
              onClick={() => {
                setOrderId('CHL-2026-000001');
                fetchTrackOrder('CHL-2026-000001', '');
              }}
              className="text-spice-crimson font-bold hover:underline font-mono"
            >
              CHL-2026-000001
            </button>
          </div>
        </div>

        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 text-xs font-medium rounded-2xl flex items-center space-x-2 mb-8">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Tracking Details Display */}
        {order && (
          <div className="space-y-6">
            {/* Status Header Overview Card */}
            <div className="bg-white rounded-3xl p-6 sm:p-8 border border-spice-tan/60 shadow-sm">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-spice-tan/40 gap-3">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="font-serif font-bold text-lg text-spice-brown">
                      Order #{order.orderId}
                    </span>
                    <button
                      type="button"
                      onClick={copyOrderId}
                      className="p-1 rounded-md text-gray-400 hover:text-spice-crimson"
                      title="Copy Order ID"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  </div>
                  <p className="text-xs text-spice-brown/60 mt-0.5">
                    Placed on {new Date(order.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>

                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <span className="text-[10px] text-spice-brown/60 block uppercase">Current Status</span>
                    <span className="inline-block bg-spice-lightRed text-spice-crimson font-serif font-bold text-xs px-3 py-1 rounded-full border border-spice-crimson/20">
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              </div>

              {/* Courier tracking number pill */}
              {order.trackingNumber && (
                <div className="mt-4 p-3 bg-spice-cream rounded-xl border border-spice-tan/50 flex flex-col sm:flex-row sm:items-center justify-between text-xs text-spice-brown gap-1">
                  <span>
                    <strong>Carrier Tracking AWB:</strong> <span className="font-mono">{order.trackingNumber}</span>
                  </span>
                  <span className="text-spice-green font-semibold">
                    Live updates via Odisha Express Logistics
                  </span>
                </div>
              )}

              {/* Visual 7-Stage Timeline */}
              <div className="mt-8 pt-2">
                <h3 className="font-serif font-bold text-sm text-spice-brown mb-6">
                  Delivery Progress Timeline
                </h3>

                <div className="relative">
                  {/* Progress Line */}
                  <div className="hidden sm:block absolute top-4 left-6 right-6 h-1 bg-spice-tan/70 -z-0">
                    <div
                      className="h-1 bg-spice-crimson transition-all duration-500"
                      style={{
                        width: `${Math.max(0, Math.min(100, (currentStageIdx / (ORDER_STAGES.length - 1)) * 100))}%`
                      }}
                    />
                  </div>

                  {/* Desktop Stage Nodes */}
                  <div className="hidden sm:grid sm:grid-cols-7 gap-2 relative z-10 text-center">
                    {ORDER_STAGES.map((st, i) => {
                      const isCompleted = i <= currentStageIdx;
                      const isCurrent = i === currentStageIdx;

                      return (
                        <div key={i} className="flex flex-col items-center">
                          <div
                            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold mb-2 transition-all ${
                              isCompleted
                                ? 'bg-spice-crimson text-white shadow-xs'
                                : 'bg-white text-spice-brown/40 border border-spice-tan'
                            } ${isCurrent ? 'ring-4 ring-spice-crimson/20 scale-110' : ''}`}
                          >
                            {isCompleted ? <Check className="w-4 h-4" /> : i + 1}
                          </div>
                          <span className={`text-[11px] font-bold leading-tight block ${isCompleted ? 'text-spice-brown' : 'text-gray-400'}`}>
                            {st.status}
                          </span>
                          <span className="text-[9px] text-spice-brown/50 mt-0.5 leading-tight">
                            {st.desc}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Mobile Vertical Timeline */}
                  <div className="sm:hidden space-y-4 relative pl-6 before:content-[''] before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-spice-tan">
                    {ORDER_STAGES.map((st, i) => {
                      const isCompleted = i <= currentStageIdx;
                      const isCurrent = i === currentStageIdx;

                      return (
                        <div key={i} className="relative flex items-start space-x-3">
                          <div
                            className={`absolute -left-6 top-0 w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${
                              isCompleted
                                ? 'bg-spice-crimson text-white'
                                : 'bg-white text-gray-400 border border-spice-tan'
                            } ${isCurrent ? 'ring-2 ring-spice-crimson/30' : ''}`}
                          >
                            {isCompleted ? <Check className="w-3 h-3" /> : i + 1}
                          </div>
                          <div>
                            <p className={`text-xs font-bold ${isCompleted ? 'text-spice-brown' : 'text-gray-400'}`}>
                              {st.status}
                            </p>
                            <p className="text-[10px] text-spice-brown/60">{st.desc}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </div>

            {/* Order Items & Shipping Address Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Shipping Address */}
              <div className="bg-white rounded-3xl p-6 border border-spice-tan/60 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-spice-tan/40 text-spice-brown font-serif font-bold text-sm">
                  <MapPin className="w-4 h-4 text-spice-crimson" />
                  <span>Delivery Address</span>
                </div>
                <div className="text-xs text-spice-brown/80 space-y-1">
                  <p className="font-bold text-spice-brown">{order.shippingAddress.fullName}</p>
                  <p>{order.shippingAddress.street}</p>
                  <p>{order.shippingAddress.city}, {order.shippingAddress.state} - {order.shippingAddress.pincode}</p>
                  <p className="pt-1 text-spice-brown/60">Phone: {order.shippingAddress.phone}</p>
                </div>
              </div>

              {/* Items Summary */}
              <div className="bg-white rounded-3xl p-6 border border-spice-tan/60 shadow-sm space-y-3">
                <div className="flex items-center space-x-2 pb-2 border-b border-spice-tan/40 text-spice-brown font-serif font-bold text-sm">
                  <Package className="w-4 h-4 text-spice-crimson" />
                  <span>Parcel Contents ({order.items.length})</span>
                </div>
                <div className="space-y-2 max-h-48 overflow-y-auto no-scrollbar pr-1">
                  {order.items.map((it, idx) => (
                    <div key={idx} className="flex items-center justify-between text-xs">
                      <div className="flex items-center space-x-2 truncate">
                        <img src={it.image} alt="" className="w-8 h-8 rounded object-cover shrink-0" />
                        <span className="truncate">{it.productName} ({it.size}) × {it.quantity}</span>
                      </div>
                      <span className="font-bold ml-2">₹{it.subtotal}</span>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-spice-tan/40 flex justify-between font-serif font-bold text-sm text-spice-brown">
                  <span>Total Paid</span>
                  <span className="text-spice-crimson">₹{order.total}</span>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
