import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Package, Truck, ExternalLink, Calendar, MapPin, FileText } from 'lucide-react';
import { api } from '../services/api';
import { CustomerInvoiceModal } from '../components/invoice/CustomerInvoiceModal';

export const OrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedInvoiceOrder, setSelectedInvoiceOrder] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await api.getMyOrders();
        if (res.success) setOrders(res.orders);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-spice-cream py-8 sm:py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-8">
          <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
            Order Records
          </span>
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown">
            My Orders
          </h1>
          <p className="text-xs sm:text-sm text-spice-brown/70 mt-1">
            Review status and trace shipments for your Chilika spice purchases.
          </p>
        </div>

        {loading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-40 animate-pulse border border-spice-tan" />
            ))}
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-spice-tan/60 shadow-sm space-y-4">
            <Package className="w-12 h-12 text-spice-brown/30 mx-auto" />
            <h3 className="font-serif font-bold text-lg text-spice-brown">No Orders Yet</h3>
            <p className="text-xs text-spice-brown/70 max-w-sm mx-auto">
              Your kitchen is waiting for fresh, fragrant Odisha spices.
            </p>
            <Link
              to="/shop"
              className="inline-block bg-spice-crimson text-white px-6 py-2.5 rounded-full text-xs font-bold shadow-spice"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-5">
            {orders.map((ord) => (
              <div
                key={ord._id}
                className="bg-white rounded-3xl p-6 border border-spice-tan/60 shadow-sm space-y-4"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-spice-tan/40 gap-2">
                  <div>
                    <span className="font-mono font-bold text-sm text-spice-crimson">
                      {ord.orderId}
                    </span>
                    <span className="text-xs text-spice-brown/60 ml-3">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric'
                      })}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-spice-sand text-spice-brown border border-spice-tan">
                      {ord.orderStatus}
                    </span>
                    <span className="font-serif font-bold text-base text-spice-brown">
                      ₹{ord.total}
                    </span>
                  </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                  {ord.items.map((item, idx) => (
                    <div key={idx} className="flex items-center space-x-3 text-xs text-spice-brown">
                      <img
                        src={item.image}
                        alt=""
                        className="w-12 h-12 rounded-xl object-cover bg-spice-sand/30 shrink-0 border border-spice-tan/40"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-spice-brown truncate">{item.productName}</p>
                        <p className="text-spice-brown/60 text-[11px]">{item.size} • Qty: {item.quantity}</p>
                      </div>
                      <span className="font-bold">₹{item.subtotal}</span>
                    </div>
                  ))}
                </div>

                <div className="pt-3 border-t border-spice-tan/40 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                  <div className="text-spice-brown/70 flex items-center space-x-1">
                    <MapPin className="w-3.5 h-3.5 text-spice-crimson shrink-0" />
                    <span>Shipping to: {ord.shippingAddress.fullName}, {ord.shippingAddress.city}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={() => setSelectedInvoiceOrder(ord)}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-spice-brown hover:text-spice-crimson bg-spice-sand/50 hover:bg-spice-sand px-2.5 py-1 rounded-lg border border-spice-tan transition-colors"
                    >
                      <FileText className="w-3.5 h-3.5 text-spice-crimson" />
                      <span>Tax Invoice</span>
                    </button>
                    <Link
                      to={`/track-order?orderId=${ord.orderId}`}
                      className="inline-flex items-center space-x-1 text-xs font-bold text-spice-crimson hover:underline"
                    >
                      <Truck className="w-4 h-4" />
                      <span>Track Live →</span>
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Customer Tax Invoice Modal */}
      <CustomerInvoiceModal
        order={selectedInvoiceOrder}
        isOpen={Boolean(selectedInvoiceOrder)}
        onClose={() => setSelectedInvoiceOrder(null)}
      />
    </div>
  );
};
