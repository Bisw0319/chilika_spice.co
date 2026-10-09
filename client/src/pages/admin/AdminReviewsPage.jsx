import React, { useState, useEffect } from 'react';
import { Star, Check, X, Trash2, Eye } from 'lucide-react';
import { api } from '../../services/api';

export const AdminReviewsPage = () => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const res = await api.getAdminReviews();
      if (res.success) setReviews(res.reviews);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const handleToggleApprove = async (id) => {
    try {
      const res = await api.toggleApproveReview(id);
      if (res.success) {
        setReviews(reviews.map((r) => (r._id === id ? res.review : r)));
      }
    } catch (err) {
      alert(err.message);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete review permanently?')) return;
    try {
      await api.deleteReview(id);
      setReviews(reviews.filter((r) => r._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif font-bold text-2xl text-gray-900">Customer Reviews Moderation</h1>
          <p className="text-xs text-gray-500">Approve, verify, or remove user ratings</p>
        </div>
      </div>

      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Author</th>
                <th className="py-3 px-4">Spice Product</th>
                <th className="py-3 px-4">Rating</th>
                <th className="py-3 px-4">Comment</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {reviews.map((r) => (
                <tr key={r._id} className="hover:bg-gray-50/80">
                  <td className="py-3 px-4 font-bold text-gray-900">
                    <p>{r.userName}</p>
                    <span className="text-[10px] text-gray-400 font-normal">{r.userEmail || 'Customer'}</span>
                  </td>
                  <td className="py-3 px-4 text-gray-700 font-medium">
                    {r.product?.name || 'Chilika Spice'}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3.5 h-3.5 ${
                            i < r.rating ? 'fill-current' : 'text-gray-300'
                          }`}
                        />
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4 max-w-sm">
                    <p className="text-gray-700 line-clamp-2">{r.comment}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        r.isApproved ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {r.isApproved ? 'Approved' : 'Hidden'}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleToggleApprove(r._id)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-bold ${
                        r.isApproved ? 'bg-amber-50 text-amber-700' : 'bg-green-50 text-green-700'
                      }`}
                    >
                      {r.isApproved ? 'Hide' : 'Approve'}
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(r._id)}
                      className="p-1 text-gray-400 hover:text-red-600"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
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
