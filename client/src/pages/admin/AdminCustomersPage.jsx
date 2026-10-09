import React, { useState, useEffect } from 'react';
import { Users, Mail, Phone, ShoppingBag, Eye, X } from 'lucide-react';
import { api } from '../../services/api';

export const AdminCustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCustomer, setSelectedCustomer] = useState(null);

  useEffect(() => {
    const fetchCust = async () => {
      setLoading(true);
      try {
        const res = await api.getAdminCustomers();
        if (res.success) setCustomers(res.customers);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCust();
  }, []);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif font-bold text-2xl text-gray-900">Customer Accounts</h1>
          <p className="text-xs text-gray-500">Registered home cooks and repeat buyers</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Customer Name</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Phone</th>
                <th className="py-3 px-4">Addresses</th>
                <th className="py-3 px-4">Orders Placed</th>
                <th className="py-3 px-4 text-right">Order History</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {customers.map((c) => (
                <tr key={c._id} className="hover:bg-gray-50/80">
                  <td className="py-3 px-4 font-bold text-gray-900 flex items-center space-x-2">
                    <div className="w-7 h-7 rounded-full bg-spice-cream text-spice-crimson font-bold flex items-center justify-center border border-spice-tan">
                      {c.name?.charAt(0) || 'U'}
                    </div>
                    <span>{c.name}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-600">{c.email}</td>
                  <td className="py-3 px-4 text-gray-600">{c.phone || '—'}</td>
                  <td className="py-3 px-4 text-gray-600">
                    {c.addresses && c.addresses.length > 0 ? (
                      <span className="truncate max-w-[160px] block">
                        {c.addresses[0].city}, {c.addresses[0].pincode}
                      </span>
                    ) : (
                      '—'
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className="bg-spice-sand text-spice-brown px-2 py-0.5 rounded-full font-bold">
                      {c.orderCount || 0} orders
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right">
                    <button
                      type="button"
                      onClick={() => setSelectedCustomer(c)}
                      className="px-3 py-1 bg-gray-100 hover:bg-spice-sand text-spice-brown rounded-lg font-bold"
                    >
                      View
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* View Customer Details Modal */}
      {selectedCustomer && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-lg w-full shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <div>
                <h3 className="font-serif font-bold text-lg text-gray-900">
                  Customer Profile: {selectedCustomer.name}
                </h3>
                <span className="text-xs text-gray-500">{selectedCustomer.email}</span>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCustomer(null)}
                className="p-1 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <h4 className="font-bold text-gray-700 uppercase tracking-wider mb-2">
                  Order History ({selectedCustomer.orders?.length || 0})
                </h4>
                {selectedCustomer.orders && selectedCustomer.orders.length > 0 ? (
                  <div className="space-y-2 max-h-48 overflow-y-auto">
                    {selectedCustomer.orders.map((o) => (
                      <div
                        key={o._id}
                        className="p-2.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between"
                      >
                        <div>
                          <span className="font-mono font-bold text-spice-crimson">{o.orderId}</span>
                          <span className="text-[10px] text-gray-400 ml-2">
                            {new Date(o.createdAt).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-gray-800">₹{o.total}</span>
                          <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-spice-sand text-spice-brown">
                            {o.orderStatus}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-400">No past orders found.</p>
                )}
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end">
                <button
                  type="button"
                  onClick={() => setSelectedCustomer(null)}
                  className="px-5 py-2 bg-gray-100 text-gray-700 font-bold rounded-xl"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
