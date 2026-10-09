import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Check, X, Search, Package, Star, Upload, Loader2, Image as ImageIcon } from 'lucide-react';
import { api } from '../../services/api';

export const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: 65,
    compareAtPrice: 85,
    stock: 50,
    shortDescription: '',
    description: '',
    productImages: ['/images/products/turmeric.jpg'],
    origin: 'Kandhamal & Chilika, Odisha',
    isBestSeller: false,
    isFeatured: false
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [prodRes, catRes] = await Promise.all([
        api.getProducts(),
        api.getCategories()
      ]);
      if (prodRes.success) setProducts(prodRes.products);
      if (catRes.success) {
        setCategories(catRes.categories);
        if (catRes.categories.length > 0 && !formData.category) {
          setFormData((prev) => ({ ...prev, category: catRes.categories[0]._id }));
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleOpenAdd = () => {
    setEditingId(null);
    setFormData({
      name: '',
      category: categories[0]?._id || '',
      price: 75,
      compareAtPrice: 95,
      stock: 50,
      shortDescription: '',
      description: '',
      productImages: ['/images/products/turmeric.jpg'],
      origin: 'Odisha, India',
      isBestSeller: false,
      isFeatured: false
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (p) => {
    setEditingId(p._id);
    setFormData({
      name: p.name,
      category: p.category?._id || p.category || '',
      price: p.price,
      compareAtPrice: p.compareAtPrice || 0,
      stock: p.stock,
      shortDescription: p.shortDescription || '',
      description: p.description,
      productImages: p.productImages && p.productImages.length > 0 ? p.productImages : ['/images/products/turmeric.jpg'],
      origin: p.origin || 'Odisha, India',
      isBestSeller: !!p.isBestSeller,
      isFeatured: !!p.isFeatured
    });
    setUrlInput('');
    setIsModalOpen(true);
  };

  const handleFileUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    setUploading(true);
    try {
      const res = await api.uploadImages(files);
      if (res.success && res.urls) {
        setFormData((prev) => {
          // If only default placeholder was present, replace it with uploaded image(s)
          const isOnlyDefault = prev.productImages.length === 1 && prev.productImages[0] === '/images/products/turmeric.jpg';
          const baseList = isOnlyDefault ? [] : prev.productImages;
          return {
            ...prev,
            productImages: [...baseList, ...res.urls]
          };
        });
      }
    } catch (err) {
      alert(`Image upload failed: ${err.message}`);
    } finally {
      setUploading(false);
      e.target.value = '';
    }
  };

  const handleRemoveImage = (indexToRemove) => {
    setFormData((prev) => {
      const updated = prev.productImages.filter((_, idx) => idx !== indexToRemove);
      return {
        ...prev,
        productImages: updated.length > 0 ? updated : ['/images/products/turmeric.jpg']
      };
    });
  };

  const handleSetMainImage = (indexToMain) => {
    setFormData((prev) => {
      const target = prev.productImages[indexToMain];
      const remaining = prev.productImages.filter((_, idx) => idx !== indexToMain);
      return {
        ...prev,
        productImages: [target, ...remaining]
      };
    });
  };

  const handleAddUrlImage = () => {
    if (!urlInput.trim()) return;
    setFormData((prev) => {
      const isOnlyDefault = prev.productImages.length === 1 && prev.productImages[0] === '/images/products/turmeric.jpg';
      const baseList = isOnlyDefault ? [] : prev.productImages;
      return {
        ...prev,
        productImages: [...baseList, urlInput.trim()]
      };
    });
    setUrlInput('');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this spice?')) return;
    try {
      await api.deleteProduct(id);
      setProducts(products.filter((p) => p._id !== id));
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        const res = await api.updateProduct(editingId, formData);
        if (res.success) {
          setProducts(products.map((p) => (p._id === editingId ? res.product : p)));
        }
      } else {
        const res = await api.createProduct(formData);
        if (res.success) {
          setProducts([res.product, ...products]);
        }
      }
      setIsModalOpen(false);
    } catch (err) {
      alert(err.message);
    }
  };

  const filtered = products.filter((p) =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif font-bold text-2xl text-gray-900">Spice Catalog Management</h1>
          <p className="text-xs text-gray-500">Add, edit, or adjust pricing and inventory for Chilika Spices</p>
        </div>
        <button
          type="button"
          onClick={handleOpenAdd}
          className="inline-flex items-center space-x-2 bg-spice-crimson hover:bg-spice-deepRed text-white px-4 py-2.5 rounded-xl text-xs font-bold shadow-spice transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Spice</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="max-w-md relative">
        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Filter by spice name..."
          className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-3.5 py-2 text-xs text-gray-800 focus:outline-none focus:border-spice-crimson"
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-gray-50 text-gray-500 font-bold uppercase tracking-wider border-b border-gray-200">
              <tr>
                <th className="py-3 px-4">Spice</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price / MRP</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Flags</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((p) => (
                <tr key={p._id} className="hover:bg-gray-50/80">
                  <td className="py-3 px-4 flex items-center space-x-3">
                    <img
                      src={p.productImages?.[0] || '/images/products/turmeric.jpg'}
                      alt=""
                      className="w-10 h-10 rounded-lg object-cover border border-gray-200 shrink-0"
                    />
                    <div>
                      <p className="font-bold text-gray-900">{p.name}</p>
                      <p className="text-[10px] text-gray-400 truncate max-w-[200px]">{p.origin}</p>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-gray-600 font-medium">
                    {p.category?.name || 'Spice'}
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-bold text-spice-crimson">₹{p.price}</span>
                    {p.compareAtPrice > p.price && (
                      <span className="text-gray-400 line-through ml-1 text-[11px]">
                        ₹{p.compareAtPrice}
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                        p.stock <= 15
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-green-100 text-green-800'
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4 space-x-1">
                    {p.isBestSeller && (
                      <span className="bg-amber-100 text-amber-800 text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Best Seller
                      </span>
                    )}
                    {p.isFeatured && (
                      <span className="bg-spice-lightRed text-spice-crimson text-[9px] font-bold px-1.5 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right space-x-2">
                    <button
                      type="button"
                      onClick={() => handleOpenEdit(p)}
                      className="p-1.5 text-gray-500 hover:text-spice-crimson hover:bg-gray-100 rounded-lg"
                      title="Edit"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDelete(p._id)}
                      className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg"
                      title="Delete"
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

      {/* Add / Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
          <div className="bg-white rounded-3xl p-6 sm:p-8 max-w-lg w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-200">
            <div className="flex items-center justify-between pb-3 border-b border-gray-100 mb-4">
              <h3 className="font-serif font-bold text-lg text-gray-900">
                {editingId ? 'Edit Spice Details' : 'Add New Spice'}
              </h3>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3.5 text-xs">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Spice Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Pure Kandhamal Turmeric Powder"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Category *</label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  >
                    {categories.map((c) => (
                      <option key={c._id} value={c._id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Place of Origin</label>
                  <input
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    placeholder="e.g. Kandhamal, Odisha"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Base Price (₹) *</label>
                  <input
                    type="number"
                    required
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Compare MRP (₹)</label>
                  <input
                    type="number"
                    value={formData.compareAtPrice}
                    onChange={(e) => setFormData({ ...formData, compareAtPrice: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1">Stock Units *</label>
                  <input
                    type="number"
                    required
                    value={formData.stock}
                    onChange={(e) => setFormData({ ...formData, stock: Number(e.target.value) })}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              {/* Product Images & Local Upload */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="block font-bold text-gray-700">
                    Product Images ({formData.productImages.length})
                  </label>
                  <span className="text-[10px] text-gray-500 font-medium">
                    Upload local files or enter image link
                  </span>
                </div>

                {/* Upload Button & Dropzone */}
                <div className="border-2 border-dashed border-gray-300 hover:border-spice-crimson rounded-2xl p-4 bg-gray-50/70 text-center transition-colors">
                  <input
                    type="file"
                    id="spice-image-upload"
                    accept="image/*"
                    multiple
                    disabled={uploading}
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <label
                    htmlFor="spice-image-upload"
                    className="cursor-pointer flex flex-col items-center justify-center space-y-1.5"
                  >
                    {uploading ? (
                      <div className="flex items-center space-x-2 text-spice-crimson font-bold text-xs py-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading images from your computer...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-spice-crimson/10 text-spice-crimson flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs text-spice-crimson hover:underline">
                          Choose Local Images From Computer
                        </span>
                        <p className="text-[10px] text-gray-500">
                          Supports multiple photos: JPG, PNG, WEBP, GIF up to 10MB each
                        </p>
                      </>
                    )}
                  </label>
                </div>

                {/* Thumbnail Previews of Attached Images */}
                {formData.productImages.length > 0 && (
                  <div className="grid grid-cols-4 sm:grid-cols-5 gap-2 pt-1">
                    {formData.productImages.map((imgUrl, idx) => (
                      <div
                        key={idx}
                        className="group relative aspect-square rounded-xl overflow-hidden border border-gray-200 bg-gray-100 shadow-2xs"
                      >
                        <img
                          src={imgUrl}
                          alt={`Uploaded preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {/* Main Image Badge */}
                        {idx === 0 && (
                          <span className="absolute top-1 left-1 bg-amber-500 text-white text-[8px] font-extrabold uppercase px-1.5 py-0.5 rounded shadow-2xs">
                            Main
                          </span>
                        )}

                        {/* Hover Overlay Controls */}
                        <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 p-1">
                          {idx !== 0 && (
                            <button
                              type="button"
                              onClick={() => handleSetMainImage(idx)}
                              className="text-[9px] bg-white/90 hover:bg-white text-gray-800 font-bold px-1.5 py-0.5 rounded shadow-xs cursor-pointer"
                              title="Set as Main Image"
                            >
                              Make Main
                            </button>
                          )}
                          <button
                            type="button"
                            onClick={() => handleRemoveImage(idx)}
                            className="text-[9px] bg-red-600 hover:bg-red-700 text-white font-bold p-1 rounded-full shadow-xs cursor-pointer"
                            title="Remove Photo"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* Fallback URL input */}
                <div className="flex gap-2 pt-1">
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddUrlImage();
                      }
                    }}
                    placeholder="Or paste external image URL..."
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-1.5 text-[11px] text-gray-800 font-mono"
                  />
                  <button
                    type="button"
                    onClick={handleAddUrlImage}
                    className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl text-[11px] font-bold border border-gray-200 cursor-pointer"
                  >
                    Add URL
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Short Description</label>
                <input
                  type="text"
                  value={formData.shortDescription}
                  onChange={(e) => setFormData({ ...formData, shortDescription: e.target.value })}
                  placeholder="One sentence summary for product card"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Detailed Description *</label>
                <textarea
                  rows={3}
                  required
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Craft, culinary notes, and traditional village processing details..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                />
              </div>

              <div className="flex gap-4 pt-1">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isBestSeller}
                    onChange={(e) => setFormData({ ...formData, isBestSeller: e.target.checked })}
                    className="rounded text-spice-crimson focus:ring-spice-crimson"
                  />
                  <span className="font-semibold text-gray-700">Best Seller Carousel</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isFeatured}
                    onChange={(e) => setFormData({ ...formData, isFeatured: e.target.checked })}
                    className="rounded text-spice-crimson focus:ring-spice-crimson"
                  />
                  <span className="font-semibold text-gray-700">Featured Showcase</span>
                </label>
              </div>

              <div className="pt-3 border-t border-gray-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl font-bold shadow-spice"
                >
                  {editingId ? 'Save Changes' : 'Create Spice'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
