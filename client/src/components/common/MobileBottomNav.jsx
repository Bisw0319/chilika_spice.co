import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, Layers, Search, Package, ShoppingBag, X } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const MobileBottomNav = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { itemCount } = useCart();
  const { wishlistCount } = useWishlist();
  const [isSearchSheetOpen, setIsSearchSheetOpen] = useState(false);
  const [searchVal, setSearchVal] = useState('');

  // Hide on admin routes to give full screen to admin dashboard
  if (location.pathname.startsWith('/admin')) {
    return null;
  }

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchVal.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchVal.trim())}`);
      setIsSearchSheetOpen(false);
      setSearchVal('');
    }
  };

  return (
    <>
      {/* Flipkart-Style Mobile Bottom App Bar */}
      <nav aria-label="Mobile Bottom Navigation" className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-spice-tan/50 shadow-2xl px-1.5 py-1.5 safe-area-bottom">
        <div className="grid grid-cols-5 items-center text-center">
          {/* Home */}
          <Link
            to="/"
            className={`flex flex-col items-center justify-center py-1 transition-all active:scale-90 relative ${
              location.pathname === '/' ? 'text-spice-crimson font-black' : 'text-spice-brown/70 hover:text-spice-crimson'
            }`}
          >
            {location.pathname === '/' && (
              <span className="w-1.5 h-1.5 rounded-full bg-spice-crimson absolute -top-1" />
            )}
            <Home className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Home</span>
          </Link>

          {/* Categories (Flipkart style) */}
          <Link
            to="/categories"
            className={`flex flex-col items-center justify-center py-1 transition-all active:scale-90 relative ${
              location.pathname.startsWith('/categories') ? 'text-spice-crimson font-black' : 'text-spice-brown/70 hover:text-spice-crimson'
            }`}
          >
            {location.pathname.startsWith('/categories') && (
              <span className="w-1.5 h-1.5 rounded-full bg-spice-crimson absolute -top-1" />
            )}
            <Layers className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Categories</span>
          </Link>

          {/* Search */}
          <button
            type="button"
            onClick={() => setIsSearchSheetOpen(true)}
            className="flex flex-col items-center justify-center py-1 text-spice-brown/70 hover:text-spice-crimson transition-all active:scale-90"
          >
            <Search className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Search</span>
          </button>

          {/* Orders (Flipkart style) */}
          <Link
            to="/orders"
            className={`flex flex-col items-center justify-center py-1 relative transition-all active:scale-90 ${
              location.pathname.startsWith('/orders') ? 'text-spice-crimson font-black' : 'text-spice-brown/70 hover:text-spice-crimson'
            }`}
          >
            {location.pathname.startsWith('/orders') && (
              <span className="w-1.5 h-1.5 rounded-full bg-spice-crimson absolute -top-1" />
            )}
            <Package className="w-5 h-5 mb-0.5" />
            <span className="text-[10px] tracking-tight">Orders</span>
          </Link>

          {/* Cart with Vibrant Count Badge */}
          <Link
            to="/cart"
            className={`flex flex-col items-center justify-center py-1 relative transition-all active:scale-90 ${
              location.pathname === '/cart' ? 'text-spice-crimson font-black' : 'text-spice-brown/70 hover:text-spice-crimson'
            }`}
          >
            {location.pathname === '/cart' && (
              <span className="w-1.5 h-1.5 rounded-full bg-spice-crimson absolute -top-1" />
            )}
            <div className="relative">
              <ShoppingBag className="w-5 h-5 mb-0.5" />
              {itemCount > 0 && (
                <span className="absolute -top-1.5 -right-2.5 bg-spice-crimson text-white text-[10px] font-black rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                  {itemCount}
                </span>
              )}
            </div>
            <span className="text-[10px] tracking-tight font-medium">Cart</span>
          </Link>
        </div>
      </nav>

      {/* Quick Search Bottom Modal on Mobile */}
      {isSearchSheetOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">
          <div
            className="fixed inset-0 bg-black/50 backdrop-blur-xs"
            onClick={() => setIsSearchSheetOpen(false)}
          />
          <div className="relative w-full bg-white rounded-t-2xl p-5 shadow-2xl border-t border-spice-tan z-10 animate-slideUp">
            <div className="flex items-center justify-between pb-3">
              <h3 className="font-serif font-bold text-spice-crimson text-base">Search Spices</h3>
              <button
                type="button"
                onClick={() => setIsSearchSheetOpen(false)}
                className="p-1 rounded-full text-gray-500 hover:bg-gray-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleSearch} className="relative mt-2">
              <input
                type="text"
                value={searchVal}
                onChange={(e) => setSearchVal(e.target.value)}
                placeholder="Try 'Turmeric', 'Garam Masala', 'Panch Phoron'..."
                autoFocus
                className="w-full bg-spice-cream border border-spice-tan rounded-xl py-3 pl-4 pr-12 text-sm text-spice-brown focus:outline-none focus:border-spice-crimson"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 bg-spice-crimson text-white p-2 rounded-lg text-xs font-semibold"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
            <div className="mt-3 flex flex-wrap gap-2 text-xs">
              <span className="text-gray-400 self-center">Popular:</span>
              <button
                type="button"
                onClick={() => { navigate('/search?q=Turmeric'); setIsSearchSheetOpen(false); }}
                className="px-2.5 py-1 bg-spice-sand/60 text-spice-brown rounded-full hover:bg-spice-sand"
              >
                Turmeric
              </button>
              <button
                type="button"
                onClick={() => { navigate('/search?q=Garam+Masala'); setIsSearchSheetOpen(false); }}
                className="px-2.5 py-1 bg-spice-sand/60 text-spice-brown rounded-full hover:bg-spice-sand"
              >
                Garam Masala
              </button>
              <button
                type="button"
                onClick={() => { navigate('/search?q=Panch+Phoron'); setIsSearchSheetOpen(false); }}
                className="px-2.5 py-1 bg-spice-sand/60 text-spice-brown rounded-full hover:bg-spice-sand"
              >
                Panch Phoron
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
