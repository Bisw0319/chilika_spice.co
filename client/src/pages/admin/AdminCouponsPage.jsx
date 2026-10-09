import React, { useState, useEffect } from 'react';
import { Plus, Trash2, Edit2, TicketPercent, X, Check } from 'lucide-react';
import { api } from '../../services/api';

export const AdminCouponsPage = () => {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    code: '',
    discountType: 'percentage',
    discountValue: 10,
    minOrderValue: 299,
    maxDiscountAmount: 100,
    isActive: true
  });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminCoupons();
      if (res.success) setCoupons(res.coupons);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      code: '',
      discountType: 'percentage',
      discountValue: 10,
      minOrderValue: 299,
      maxDiscountAmount: 100,
      isActive: true
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (c) => {
    setEditingId(c._id);
    setFormData({
      code: c.code,
      discountType: c.discountType,
      discountValue: c.discountValue,
      minOrderValue: c.minOrderValue,
      maxDiscountAmount: c.maxDiscountAmount || 0,
      isActive: c.isActive
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete coupon?')) return;
    try {
      await api.deleteCoupon(id);
      setCoupons(coupons.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.updateCoupon(editingId, formData);
        if (res.success) {
          setCoupons(coupons.map((c) => (c._id === editingId ? res.coupon : c)));
        }
      } else {
        const res = await api.createCoupon(formData);
        if (res.success) {
          setCoupons([res.coupon, ...coupons]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif font-bold text-2xl text-gray-900">Discount Coupons</h1>
          <p className="text-xs text-gray-500">Create promotional discount codes for festival sales and discounts</p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 bg-spice-crimson hover:bg-spice-deepRed text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-spice"
        >
          <Plus className="w-4 h-4" />
          <span>Create New Coupon</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {coupons.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-3xl p-6 border border-gray-200 shadow-2xs space-y-4 flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono font-extrabold text-base text-spice-crimson bg-spice-lightRed px-3 py-1 rounded-xl border border-spice-crimson/20">
                  {c.code}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    c.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-600'
                  }`}
                >
                  {c.isActive ? 'Active' : 'Disabled'}
                </span>
              </div>

              <div className="mt-4 space-y-1 text-xs text-gray-600">
                <p className="font-bold text-gray-900 text-sm">
                  {c.discountType === 'percentage' ? `${c.discountValue}% OFF` : `Flat ₹${c.discountValue} OFF`}
                </p>
                <p>Min Order: ₹{c.minOrderValue}</p>
                {c.maxDiscountAmount > 0 && <p>Max Discount: ₹{c.maxDiscountAmount}</p>}
                <p className="text-gray-400">Used: {c.usedCount} times</p>
              </div>
            </div>

            <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
              <span className="text-[11px] text-gray-400">Chilika Offer</span>
              <div className="flex space-x-2">
                <button
                  type="button"
                  onClick={() => handleOpenEdit(c)}
                  className="p-1.5 text-gray-500 hover:text-spice-crimson"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(c._id)}
                  className="p-1.5 text-gray-400 hover:text-red-600"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-serif font-bold text-lg text-gray-900">
                {editingId ? 'Edit Coupon' : 'Create Coupon'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Coupon Code *</label>
                <input
                  type="text"
                  required
                  value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value.toUpperCase() })}
                  placeholder="e.g. TRADITION20"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 uppercase font-mono font-bold"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Discount Type</label>
                  <select
                    value={formData.discountType}
                    onChange={(e) => setFormData({ ...formData, discountType: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-bold"
                  >
                    <option value="percentage">Percentage (%)</option>
                    <option value="fixed">Flat Amount (₹)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Value *</label>
                  <input
                    type="number"
                    required
                    value={formData.discountValue}
                    onChange={(e) => setFormData({ ...formData, discountValue: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Min Order Value (₹)</label>
                  <input
                    type="number"
                    value={formData.minOrderValue}
                    onChange={(e) => setFormData({ ...formData, minOrderValue: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Max Discount Cap (₹)</label>
                  <input
                    type="number"
                    value={formData.maxDiscountAmount}
                    onChange={(e) => setFormData({ ...formData, maxDiscountAmount: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>

              <div className="pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="rounded text-spice-crimson focus:ring-spice-crimson"
                  />
                  <span className="font-bold text-gray-700">Coupon Active</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border rounded-xl font-bold text-gray-600"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-spice-crimson text-white rounded-xl font-bold shadow-spice"
                >
                  Save Coupon
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
