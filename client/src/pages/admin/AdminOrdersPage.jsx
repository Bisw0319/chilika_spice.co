import React, { useState, useEffect } from 'react';
import { Truck, Check, X, Search, Edit3, MapPin, Eye, CheckCircle2, ExternalLink, Copy, AlertCircle, ShieldCheck, FileText, Printer } from 'lucide-react';
import { api } from '../../services/api';
import { CustomerInvoiceModal } from '../../components/invoice/CustomerInvoiceModal';
import { CourierShippingLabelModal } from '../../components/invoice/CourierShippingLabelModal';

const ORDER_STATUS_OPTIONS = [
  'Order Placed',
  'Confirmed',
  'Processing',
  'Packed',
  'Shipped',
  'Out for Delivery',
  'Delivered',
  'Cancelled'
];

export const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [copiedUtr, setCopiedUtr] = useState('');

  // Customer Invoice & Courier Delivery Label Modals
  const [invoiceOrder, setInvoiceOrder] = useState(null);
  const [shippingLabelOrder, setShippingLabelOrder] = useState(null);
  const [storeSettings, setStoreSettings] = useState(null);

  // Status update modal
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [newStatus, setNewStatus] = useState('');
  const [statusMessage, setStatusMessage] = useState('');
  const [trackingNo, setTrackingNo] = useState('');
  const [updating, setUpdating] = useState(false);
  const [verifyingId, setVerifyingId] = useState(null);

  const handleVerifyPayment = async (orderId) => {
    if (!window.confirm('Have you confirmed receipt of this UPI payment in your bank/GPay/PhonePe account?')) return;
    setVerifyingId(orderId);
    try {
      const res = await api.verifyOrderPayment(orderId, 'UPI payment verified by Administrator');
      if (res.success && res.order) {
        setOrders((prev) => prev.map((o) => (o._id === orderId ? res.order : o)));
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder(res.order);
        }
      }
    } catch (err) {
      alert(err.message || 'Payment verification failed');
    } finally {
      setVerifyingId(null);
    }
  };

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminOrders();
      if (res.success) setOrders(res.orders);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
    api.getStoreSettings()
      .then((res) => {
        if (res.success && res.settings) setStoreSettings(res.settings);
      })
      .catch(() => {});
  }, []);

  const handleOpenStatusModal = (ord) => {
    setSelectedOrder(ord);
    setNewStatus(ord.orderStatus);
    setStatusMessage('');
    setTrackingNo(ord.trackingNumber || '');
  };

  const handleUpdateStatus = async (e) => {
    e.preventDefault();
    if (!selectedOrder) return;
    setUpdating(true);
    try {
      const res = await api.updateOrderStatus(selectedOrder._id, {
        status: newStatus,
        message: statusMessage || `Order status updated to ${newStatus} by admin`,
        trackingNumber: trackingNo
      });
      if (res.success && res.order) {
        setOrders(orders.map((o) => (o._id === selectedOrder._id ? res.order : o)));
        setSelectedOrder(null);
      }
    } catch (err) {
      alert(err.message);
    } finally {
      setUpdating(false);
    }
  };

  const filtered = orders.filter((o) => {
    const matchesSearch =
      o.orderId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress?.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      o.shippingAddress?.phone?.includes(searchTerm);
    const matchesStatus = statusFilter === 'all' || o.orderStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif font-bold text-2xl text-gray-900">Order Management</h1>
          <p className="text-xs text-gray-500">Track shipments, verify payments, and update fulfillment milestones</p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Order ID, customer name or phone..."
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-spice-crimson"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="bg-white border border-gray-200 rounded-xl px-3 py-2 text-xs font-bold text-gray-700"
        >
          <option value="all">All Statuses</option>
          {ORDER_STATUS_OPTIONS.map((st) => (
            <option key={st} value={st}>
              {st}
            </option>
          ))}
        </select>
      </div>

      {/* Orders Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Order ID & Date</th>
                <th className="py-3 px-4">Customer Details</th>
                <th className="py-3 px-4">Items</th>
                <th className="py-3 px-4">Total</th>
                <th className="py-3 px-4">Payment</th>
                <th className="py-3 px-4">Fulfillment Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" className="py-12 text-center text-gray-400 text-xs">
                    No customer orders yet. Incoming customer orders will appear here in real time.
                  </td>
                </tr>
              ) : (
                filtered.map((ord) => (
                  <tr key={ord._id} className="hover:bg-gray-50/80">
                  <td className="py-3 px-4">
                    <span className="font-mono font-bold text-spice-crimson block">{ord.orderId}</span>
                    <span className="text-[10px] text-gray-400">
                      {new Date(ord.createdAt).toLocaleDateString('en-IN')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <p className="font-bold text-gray-800">{ord.shippingAddress?.fullName}</p>
                    <p className="text-[10px] text-gray-500">{ord.shippingAddress?.phone}</p>
                    <p className="text-[10px] text-gray-400 truncate max-w-[160px]">
                      {ord.shippingAddress?.city}, {ord.shippingAddress?.pincode}
                    </p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-700 block">{ord.items.length} items</span>
                    <span className="text-[10px] text-gray-400 truncate max-w-[140px] block">
                      {ord.items[0]?.productName}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-bold text-gray-900">
                    ₹{ord.total}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center space-x-1.5">
                      <span className="uppercase text-[10px] font-bold block">{ord.paymentMethod}</span>
                      <span
                        className={`text-[9px] font-bold px-1.5 py-0.5 rounded ${
                          ord.paymentStatus === 'paid'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.paymentStatus}
                      </span>
                    </div>

                    {ord.paymentMethod === 'upi' && ord.paymentDetails?.utrNumber && (
                      <div className="mt-1 flex items-center space-x-1">
                        <span className="font-mono text-[10px] text-gray-700 bg-gray-100 px-1.5 py-0.5 rounded border border-gray-200">
                          UTR: {ord.paymentDetails.utrNumber}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            navigator.clipboard.writeText(ord.paymentDetails.utrNumber);
                            setCopiedUtr(ord.paymentDetails.utrNumber);
                            setTimeout(() => setCopiedUtr(''), 2000);
                          }}
                          className="text-gray-400 hover:text-spice-crimson"
                          title="Copy UTR"
                        >
                          {copiedUtr === ord.paymentDetails.utrNumber ? (
                            <Check className="w-3 h-3 text-green-600" />
                          ) : (
                            <Copy className="w-3 h-3" />
                          )}
                        </button>
                      </div>
                    )}

                    {ord.paymentMethod === 'upi' && ord.paymentStatus !== 'paid' && (
                      <button
                        type="button"
                        onClick={() => handleVerifyPayment(ord._id)}
                        disabled={verifyingId === ord._id}
                        className="mt-1.5 px-2 py-0.5 bg-green-50 hover:bg-green-100 text-green-700 border border-green-300 rounded text-[10px] font-bold flex items-center space-x-1 transition-colors"
                      >
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{verifyingId === ord._id ? 'Verifying...' : 'Verify UPI'}</span>
                      </button>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-spice-sand text-spice-brown border border-spice-tan block w-max">
                      {ord.orderStatus}
                    </span>
                    {ord.trackingNumber && (
                      <span className="text-[9px] text-gray-400 block mt-0.5 font-mono">
                        {ord.trackingNumber}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="flex items-center justify-end space-x-1.5">
                      <button
                        type="button"
                        onClick={() => setInvoiceOrder(ord)}
                        className="p-1.5 bg-gray-100 hover:bg-spice-crimson hover:text-white text-gray-700 rounded-lg transition-colors border border-gray-200"
                        title="View Customer Tax Invoice"
                      >
                        <FileText className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => setShippingLabelOrder(ord)}
                        className="p-1.5 bg-amber-50 hover:bg-amber-600 hover:text-white text-amber-900 rounded-lg transition-colors border border-amber-200"
                        title="Print Courier Shipping Label & Manifest"
                      >
                        <Truck className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleOpenStatusModal(ord)}
                        className="px-2.5 py-1.5 bg-spice-cream text-spice-crimson hover:bg-spice-crimson hover:text-white rounded-lg font-bold border border-spice-crimson/30 transition-colors"
                      >
                        Update
                      </button>
                    </div>
                  </td>
                </tr>
              )))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Status Update Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-900">
                  Update Order Fulfillment
                </h3>
                <span className="font-mono text-xs text-spice-crimson font-bold">{selectedOrder.orderId}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedOrder(null)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Payment Details Card in Modal */}
            <div className="bg-gray-50 p-3.5 rounded-2xl border border-gray-200 text-xs space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-gray-700">Payment Information:</span>
                <span
                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                    selectedOrder.paymentStatus === 'paid'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {selectedOrder.paymentStatus.toUpperCase()}
                </span>
              </div>
              <div className="text-[11px] text-gray-600 space-y-1">
                <p><strong>Method:</strong> {selectedOrder.paymentMethod.toUpperCase()}</p>
                <p><strong>Total Amount:</strong> ₹{selectedOrder.total}</p>
                {selectedOrder.paymentDetails?.utrNumber && (
                  <p className="flex items-center space-x-1.5">
                    <strong>UTR / Ref No:</strong>
                    <span className="font-mono font-bold text-spice-crimson bg-white px-1.5 py-0.5 rounded border border-gray-200">
                      {selectedOrder.paymentDetails.utrNumber}
                    </span>
                  </p>
                )}
                {selectedOrder.paymentDetails?.paymentScreenshot && (
                  <div className="pt-1">
                    <a
                      href={selectedOrder.paymentDetails.paymentScreenshot}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-spice-crimson font-bold underline flex items-center space-x-1"
                    >
                      <ExternalLink className="w-3 h-3" />
                      <span>View Payment Screenshot</span>
                    </a>
                  </div>
                )}
              </div>

              {selectedOrder.paymentStatus !== 'paid' && selectedOrder.paymentMethod === 'upi' && (
                <button
                  type="button"
                  onClick={() => handleVerifyPayment(selectedOrder._id)}
                  disabled={verifyingId === selectedOrder._id}
                  className="w-full mt-2 py-2 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold shadow-xs flex items-center justify-center space-x-1.5 transition-all"
                >
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>{verifyingId === selectedOrder._id ? 'Verifying...' : 'Confirm UPI Received (Mark as Paid)'}</span>
                </button>
              )}
              {/* Print Invoices Quick Row */}
              <div className="grid grid-cols-2 gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setInvoiceOrder(selectedOrder)}
                  className="py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-gray-300"
                >
                  <FileText className="w-3.5 h-3.5 text-spice-crimson" />
                  <span>Customer Invoice</span>
                </button>
                <button
                  type="button"
                  onClick={() => setShippingLabelOrder(selectedOrder)}
                  className="py-2 bg-amber-100 hover:bg-amber-200 text-amber-900 rounded-xl font-bold text-xs flex items-center justify-center space-x-1.5 transition-colors border border-amber-300"
                >
                  <Truck className="w-3.5 h-3.5 text-amber-700" />
                  <span>Courier Dispatch Label</span>
                </button>
              </div>
            </div>

            <form onSubmit={handleUpdateStatus} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">New Order Status *</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold"
                >
                  {ORDER_STATUS_OPTIONS.map((st) => (
                    <option key={st} value={st}>
                      {st}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Carrier Tracking Number (AWB)</label>
                <input
                  type="text"
                  value={trackingNo}
                  onChange={(e) => setTrackingNo(e.target.value)}
                  placeholder="e.g. ODISHA-EXP-992138"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-mono"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Timeline Message</label>
                <input
                  type="text"
                  value={statusMessage}
                  onChange={(e) => setStatusMessage(e.target.value)}
                  placeholder="e.g. Handed over to delivery van in Cuttack hub"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                />
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSelectedOrder(null)}
                  className="px-4 py-2 border rounded-xl font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="px-6 py-2 bg-spice-crimson text-white rounded-xl font-bold shadow-spice disabled:opacity-70"
                >
                  {updating ? 'Saving...' : 'Apply Status Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Customer Tax Invoice Modal */}
      <CustomerInvoiceModal
        order={invoiceOrder}
        isOpen={Boolean(invoiceOrder)}
        onClose={() => setInvoiceOrder(null)}
        storeSettings={storeSettings}
      />

      {/* Courier Logistics Delivery Label Modal */}
      <CourierShippingLabelModal
        order={shippingLabelOrder}
        isOpen={Boolean(shippingLabelOrder)}
        onClose={() => setShippingLabelOrder(null)}
        storeSettings={storeSettings}
      />
    </div>
  );
};
