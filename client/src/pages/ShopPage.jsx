import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Filter, SlidersHorizontal, X, Star, Check } from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCardSkeleton } from '../components/common/ProductCardSkeleton';

export const ShopPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isFilterSheetOpen, setIsFilterSheetOpen] = useState(false);

  // Filter States
  const categoryParam = searchParams.get('category') || 'all';
  const sortParam = searchParams.get('sort') || 'popular';
  const inStockParam = searchParams.get('inStock') === 'true';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const ratingParam = searchParams.get('rating') || '';

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCats();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const queryStr = searchParams.toString();
        const res = await api.getProducts(queryStr);
        if (res.success) setProducts(res.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [searchParams]);

  const updateFilter = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (!value || value === 'all' || value === false) {
      newParams.delete(key);
    } else {
      newParams.set(key, value);
    }
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
    setIsFilterSheetOpen(false);
  };

  return (
    <div className="min-h-screen bg-spice-cream py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Breadcrumb & Controls */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-spice-tan/50 gap-4">
          <div>
            <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
              Pure Spice Collection
            </span>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown tracking-tight">
              All Odisha Spices
            </h1>
            <p className="text-xs sm:text-sm text-spice-brown/70 mt-1">
              {loading ? (
                <span className="inline-block w-32 h-4 bg-spice-sand/70 rounded animate-pulse align-middle" />
              ) : (
                `Showing ${products.length} ${products.length === 1 ? 'handcrafted spice' : 'handcrafted spices'}`
              )}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            {/* Mobile Filter Button */}
            <button
              type="button"
              onClick={() => setIsFilterSheetOpen(true)}
              className="lg:hidden flex items-center space-x-2 px-3.5 py-2 bg-white border border-spice-tan rounded-xl text-xs font-bold text-spice-brown hover:bg-spice-sand shadow-2xs"
            >
              <SlidersHorizontal className="w-4 h-4 text-spice-crimson" />
              <span>Filters</span>
            </button>

            {/* Sort Dropdown */}
            <div className="flex items-center space-x-2">
              <label htmlFor="sort-select" className="text-xs font-semibold text-spice-brown/70 hidden sm:inline">
                Sort by:
              </label>
              <select
                id="sort-select"
                value={sortParam}
                onChange={(e) => updateFilter('sort', e.target.value)}
                className="bg-white border border-spice-tan rounded-xl text-xs font-bold text-spice-brown px-3 py-2 focus:outline-none focus:border-spice-crimson shadow-2xs cursor-pointer"
              >
                <option value="popular">Popular / Best Sellers</option>
                <option value="newest">Newest First</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="rating">Highest Rated</option>
              </select>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
          {/* Desktop Filter Sidebar */}
          <aside className="hidden lg:block space-y-6 bg-white p-5 rounded-2xl border border-spice-tan/50 shadow-sm self-start">
            <div className="flex items-center justify-between pb-3 border-b border-spice-tan/40">
              <h3 className="font-serif font-bold text-base text-spice-brown flex items-center space-x-2">
                <Filter className="w-4 h-4 text-spice-crimson" />
                <span>Filter Spices</span>
              </h3>
              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs text-spice-crimson hover:underline font-semibold"
              >
                Reset
              </button>
            </div>

            {/* Categories */}
            <div>
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-spice-brown mb-2.5">
                Categories
              </h4>
              <div className="space-y-1.5 text-xs">
                <button
                  type="button"
                  onClick={() => updateFilter('category', 'all')}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                    categoryParam === 'all'
                      ? 'bg-spice-crimson text-white font-bold'
                      : 'text-spice-brown/80 hover:bg-spice-sand'
                  }`}
                >
                  All Spices
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat._id}
                    type="button"
                    onClick={() => updateFilter('category', cat.slug)}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg font-medium transition-colors ${
                      categoryParam === cat.slug
                        ? 'bg-spice-crimson text-white font-bold'
                        : 'text-spice-brown/80 hover:bg-spice-sand'
                    }`}
                  >
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div className="pt-2 border-t border-spice-tan/40">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-spice-brown mb-2.5">
                Price Range (₹)
              </h4>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <input
                  type="number"
                  placeholder="Min ₹"
                  value={minPriceParam}
                  onChange={(e) => updateFilter('minPrice', e.target.value)}
                  className="bg-spice-cream border border-spice-tan rounded-lg px-2.5 py-1.5 text-spice-brown focus:outline-none focus:border-spice-crimson"
                />
                <input
                  type="number"
                  placeholder="Max ₹"
                  value={maxPriceParam}
                  onChange={(e) => updateFilter('maxPrice', e.target.value)}
                  className="bg-spice-cream border border-spice-tan rounded-lg px-2.5 py-1.5 text-spice-brown focus:outline-none focus:border-spice-crimson"
                />
              </div>
            </div>

            {/* Availability */}
            <div className="pt-2 border-t border-spice-tan/40">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-spice-brown mb-2.5">
                Availability
              </h4>
              <label className="flex items-center space-x-2 text-xs text-spice-brown cursor-pointer">
                <input
                  type="checkbox"
                  checked={inStockParam}
                  onChange={(e) => updateFilter('inStock', e.target.checked)}
                  className="rounded text-spice-crimson focus:ring-spice-crimson"
                />
                <span>In Stock Only</span>
              </label>
            </div>

            {/* Minimum Rating */}
            <div className="pt-2 border-t border-spice-tan/40">
              <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-spice-brown mb-2.5">
                Customer Rating
              </h4>
              <div className="space-y-1 text-xs">
                {[4.5, 4.0, 3.5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => updateFilter('rating', ratingParam === String(star) ? '' : String(star))}
                    className={`w-full flex items-center justify-between px-2 py-1 rounded-md transition-colors ${
                      ratingParam === String(star) ? 'bg-spice-sand font-bold text-spice-crimson' : 'text-spice-brown/80 hover:bg-spice-sand/50'
                    }`}
                  >
                    <span className="flex items-center text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-current mr-1" />
                      <span className="text-spice-brown">{star} & above</span>
                    </span>
                    {ratingParam === String(star) && <Check className="w-3.5 h-3.5 text-spice-crimson" />}
                  </button>
                ))}
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <main className="lg:col-span-3">
            {loading ? (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
                {[...Array(6)].map((_, i) => (
                  <ProductCardSkeleton key={i} />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="bg-white rounded-2xl p-12 text-center border border-spice-tan/50 shadow-sm">
                <span className="text-4xl block mb-3">🌿</span>
                <h3 className="font-serif font-bold text-lg text-spice-brown mb-1">
                  No Spices Found
                </h3>
                <p className="text-xs sm:text-sm text-spice-brown/70 max-w-sm mx-auto mb-4">
                  We couldn't find any spices matching your selected filters. Try resetting the filters.
                </p>
                <button
                  type="button"
                  onClick={clearAllFilters}
                  className="bg-spice-crimson text-white px-5 py-2 rounded-full text-xs font-bold hover:bg-spice-deepRed transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3.5 sm:gap-5">
                {products.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filter Bottom Sheet */}
      {isFilterSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end lg:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsFilterSheetOpen(false)}
          />
          <div className="relative w-full max-h-[85vh] bg-white rounded-t-3xl p-6 shadow-2xl z-10 flex flex-col justify-between overflow-y-auto border-t border-spice-tan">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-spice-tan">
                <h3 className="font-serif font-bold text-base text-spice-brown">
                  Filter Spices
                </h3>
                <button
                  type="button"
                  onClick={() => setIsFilterSheetOpen(false)}
                  className="p-1.5 rounded-full text-gray-500 hover:bg-gray-100"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Categories */}
              <div className="mt-4">
                <h4 className="font-serif font-bold text-xs uppercase tracking-wider text-spice-brown mb-2">
                  Category
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  <button
                    type="button"
                    onClick={() => updateFilter('category', 'all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                      categoryParam === 'all'
                        ? 'bg-spice-crimson text-white'
                        : 'bg-spice-cream text-spice-brown border border-spice-tan'
                    }`}
                  >
                    All
                  </button>
                  {categories.map((c) => (
                    <button
                      key={c._id}
                      type="button"
                      onClick={() => updateFilter('category', c.slug)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                        categoryParam === c.slug
                          ? 'bg-spice-crimson text-white'
                          : 'bg-spice-cream text-spice-brown border border-spice-tan'
                      }`}
                    >
                      {c.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Availability */}
              <div className="mt-5 pt-3 border-t border-spice-tan/50">
                <label className="flex items-center space-x-2 text-xs font-medium text-spice-brown">
                  <input
                    type="checkbox"
                    checked={inStockParam}
                    onChange={(e) => updateFilter('inStock', e.target.checked)}
                    className="rounded text-spice-crimson focus:ring-spice-crimson"
                  />
                  <span>Show In-Stock Only</span>
                </label>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-spice-tan flex gap-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="w-1/2 py-2.5 rounded-xl border border-spice-tan text-xs font-bold text-spice-brown hover:bg-spice-sand"
              >
                Reset All
              </button>
              <button
                type="button"
                onClick={() => setIsFilterSheetOpen(false)}
                className="w-1/2 py-2.5 rounded-xl bg-spice-crimson text-white text-xs font-bold shadow-md hover:bg-spice-deepRed"
              >
                Apply Filters
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
