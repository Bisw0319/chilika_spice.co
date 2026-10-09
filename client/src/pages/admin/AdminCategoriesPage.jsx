import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, X, Upload, Loader2 } from 'lucide-react';
import { api } from '../../services/api';

export const AdminCategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    image: '/images/categories/ground-spices.jpg',
    order: 0
  });

  const fetchCats = async () => {
    setLoading(true);
    try {
      const res = await api.getCategories();
      if (res.success) setCategories(res.categories);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCats();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      description: '',
      image: '/images/categories/ground-spices.jpg',
      order: categories.length + 1
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (cat) => {
    setEditingId(cat._id);
    setFormData({
      name: cat.name,
      description: cat.description,
      image: cat.image,
      order: cat.order || 0
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this category?')) return;
    try {
      await api.deleteCategory(id);
      setCategories(categories.filter((c) => c._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);
    try {
      const res = await api.uploadImages(file);
      if (res.success && res.url) {
        setFormData((prev) => ({ ...prev, image: res.url }));
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.updateCategory(editingId, formData);
        if (res.success) {
          setCategories(categories.map((c) => (c._id === editingId ? res.category : c)));
        }
      } else {
        const res = await api.createCategory(formData);
        if (res.success) {
          setCategories([...categories, res.category]);
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
          <h1 className="font-serif font-bold text-2xl text-gray-900">Category Management</h1>
          <p className="text-xs text-gray-500">Organize spices into collections and dietary blends</p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 bg-spice-crimson hover:bg-spice-deepRed text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-spice"
        >
          <Plus className="w-4 h-4" />
          <span>Create Category</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categories.map((c) => (
          <div
            key={c._id}
            className="bg-white rounded-3xl border border-gray-200 overflow-hidden shadow-2xs flex flex-col justify-between"
          >
            <div className="relative aspect-[16/9] overflow-hidden bg-gray-100">
              <img src={c.image} alt={c.name} className="w-full h-full object-cover" />
            </div>
            <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
              <div>
                <h3 className="font-serif font-bold text-base text-gray-900">{c.name}</h3>
                <p className="text-xs text-gray-500 mt-1 leading-relaxed">{c.description}</p>
              </div>
              <div className="pt-3 border-t border-gray-100 flex items-center justify-between">
                <span className="text-[11px] font-mono text-gray-400">Order: {c.order}</span>
                <div className="flex space-x-2">
                  <button
                    type="button"
                    onClick={() => handleOpenEdit(c)}
                    className="p-1.5 text-gray-500 hover:text-spice-crimson rounded-lg"
                  >
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(c._id)}
                    className="p-1.5 text-gray-400 hover:text-red-600 rounded-lg"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
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
                {editingId ? 'Edit Category' : 'Create Category'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Category Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Coastal Odisha Blends"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Summary for category card"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                />
              </div>

              <div className="space-y-2">
                <label className="block font-bold text-gray-700">Category Image</label>
                
                {/* Upload Button */}
                <div className="border border-dashed border-gray-300 hover:border-spice-crimson rounded-xl p-3 bg-gray-50/70 text-center transition-colors">
                  <input
                    type="file"
                    id="cat-image-upload"
                    accept="image/*"
                    disabled={uploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="cat-image-upload"
                    className="cursor-pointer flex items-center justify-center space-x-2 text-xs font-bold text-spice-crimson hover:underline"
                  >
                    {uploading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Uploading from computer...</span>
                      </>
                    ) : (
                      <>
                        <Upload className="w-4 h-4" />
                        <span>Choose Local Image File</span>
                      </>
                    )}
                  </label>
                </div>

                {/* Preview & URL fallback */}
                <div className="flex items-center space-x-2">
                  {formData.image && (
                    <img
                      src={formData.image}
                      alt="Category preview"
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                  )}
                  <input
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    placeholder="/images/categories/ground-spices.jpg"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 font-mono text-[11px]"
                  />
                </div>
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
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
