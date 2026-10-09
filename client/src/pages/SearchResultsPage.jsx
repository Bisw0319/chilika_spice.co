import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Search, Sparkles } from 'lucide-react';
import { api } from '../services/api';
import { ProductCard } from '../components/common/ProductCard';

export const SearchResultsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const query = searchParams.get('q') || '';
  const [searchInput, setSearchInput] = useState(query);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  // Suggestions
  const popularKeywords = ['Turmeric', 'Chilli', 'Garam Masala', 'Panch Phoron', 'Dhania', 'Bhuna Jeera', 'Besara'];

  useEffect(() => {
    setSearchInput(query);
    const fetchSearch = async () => {
      if (!query.trim()) {
        setProducts([]);
        return;
      }
      setLoading(true);
      try {
        const res = await api.getProducts(`search=${encodeURIComponent(query.trim())}`);
        if (res.success) setProducts(res.products);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchSearch();
  }, [query]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchInput.trim()) {
      setSearchParams({ q: searchInput.trim() });
    }
  };

  return (
    <div className="min-h-screen bg-spice-cream py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Search Bar Header */}
        <div className="max-w-2xl mx-auto text-center mb-8">
          <h1 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown mb-4">
            Search Chilika Spices
          </h1>
          <form onSubmit={handleSearchSubmit} className="relative">
            <Search className="w-5 h-5 text-spice-brown/40 absolute left-4 top-3.5" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Search by spice name, blend, or ingredient..."
              className="w-full bg-white border border-spice-tan rounded-2xl pl-11 pr-28 py-3 text-sm text-spice-brown focus:outline-none focus:border-spice-crimson shadow-sm"
            />
            <button
              type="submit"
              className="absolute right-2 top-2 bg-spice-crimson hover:bg-spice-deepRed text-white text-xs font-bold px-5 py-2 rounded-xl transition-colors shadow-xs"
            >
              Search
            </button>
          </form>

          {/* Quick Suggestions */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-2 text-xs">
            <span className="text-spice-brown/60">Popular:</span>
            {popularKeywords.map((kw) => (
              <button
                key={kw}
                type="button"
                onClick={() => setSearchParams({ q: kw })}
                className="px-2.5 py-1 bg-white border border-spice-tan/60 rounded-full text-spice-brown hover:bg-spice-sand transition-colors"
              >
                {kw}
              </button>
            ))}
          </div>
        </div>

        {/* Results */}
        {query && (
          <div className="mb-6 flex items-center justify-between border-b border-spice-tan/40 pb-3">
            <p className="text-xs sm:text-sm text-spice-brown/80 font-medium">
              Found {products.length} {products.length === 1 ? 'spice' : 'spices'} for <span className="text-spice-crimson font-bold">"{query}"</span>
            </p>
          </div>
        )}

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-64 animate-pulse border border-spice-tan" />
            ))}
          </div>
        ) : products.length === 0 && query ? (
          <div className="bg-white rounded-3xl p-12 text-center border border-spice-tan/60 max-w-md mx-auto shadow-sm">
            <span className="text-4xl block mb-2">🔍</span>
            <h3 className="font-serif font-bold text-lg text-spice-brown mb-1">
              No Matching Spices
            </h3>
            <p className="text-xs text-spice-brown/70 mb-4">
              We couldn't find any results for "{query}". Try checking your spelling or search for "Turmeric" or "Garam Masala".
            </p>
            <Link
              to="/shop"
              className="inline-block bg-spice-crimson text-white px-5 py-2 rounded-full text-xs font-bold"
            >
              View All Spices
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-5">
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
