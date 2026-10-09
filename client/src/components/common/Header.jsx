import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Search,
  ShoppingBag,
  Heart,
  User,
  Menu,
  X,
  Truck,
  ShieldCheck,
  ChevronDown,
  LogOut,
  Package,
  Layers,
  Sparkles,
  MapPin,
  ArrowRight,
  Loader2
} from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';
import { useAuth } from '../../context/AuthContext';
import { useContent } from '../../context/ContentContext';
import { useAddress } from '../../context/AddressContext';
import { api } from '../../services/api';

export const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  // Live Animated Search State
  const [liveResults, setLiveResults] = useState([]);
  const [isLiveSearching, setIsLiveSearching] = useState(false);
  const searchInputRef = useRef(null);

  const popularKeywords = [
    { label: 'Pure Haldi', query: 'Turmeric' },
    { label: 'Garam Masala', query: 'Garam Masala' },
    { label: 'Masala Badi', query: 'Badi' },
    { label: 'Lal Mirch', query: 'Chilli' },
    { label: 'Machha Besara', query: 'Fish Curry' },
    { label: 'Panch Phoron', query: 'Panch Phoron' },
    { label: 'Jeera Powder', query: 'Jeera' }
  ];

  const { itemCount, subtotal } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const { content } = useContent();
  const navigate = useNavigate();
  const location = useLocation();

  const { defaultAddress, openAddressModal } = useAddress();

  const announcement = content?.announcementText || "Authentic Indian spices from Odisha • Free shipping on orders above ₹499";
  const showAnnouncement = content?.announcementActive !== false;

  // Scroll detection for sticky elevated header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard shortcut listener (Cmd/Ctrl + K or Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      } else if (e.key === 'Escape' && isSearchOpen) {
        setIsSearchOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isSearchOpen]);

  // Auto-focus input when search box opens
  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 80);
    }
  }, [isSearchOpen]);

  // Debounced live search preview
  useEffect(() => {
    if (!searchQuery.trim() || searchQuery.trim().length < 2) {
      setLiveResults([]);
      setIsLiveSearching(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsLiveSearching(true);
      try {
        const res = await api.getProducts(`search=${encodeURIComponent(searchQuery.trim())}&limit=5`);
        if (res.success) {
          setLiveResults(res.products || []);
        }
      } catch (err) {
        console.warn('Live search error:', err);
      } finally {
        setIsLiveSearching(false);
      }
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Close mobile drawer and search box on route change
  useEffect(() => {
    setIsMobileMenuOpen(false);
    setIsSearchOpen(false);
    setIsUserMenuOpen(false);
  }, [location.pathname]);

  const executeSearch = (queryToSearch) => {
    const q = queryToSearch !== undefined ? queryToSearch : searchQuery;
    if (q.trim()) {
      navigate(`/search?q=${encodeURIComponent(q.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery('');
      setLiveResults([]);
    }
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    executeSearch();
  };

  return (
    <>
      {/* Top Heritage Notice Bar */}
      {showAnnouncement && (
        <div className="bg-spice-crimson text-spice-sand text-xs py-1.5 px-3 font-medium tracking-wide overflow-hidden border-b border-white/10">
          {/* Mobile Auto-Scrolling Marquee (Right to Left) */}
          <div className="md:hidden flex items-center overflow-hidden whitespace-nowrap w-full">
            <div className="animate-marquee-smooth flex items-center">
              <div className="inline-flex items-center space-x-2 px-6">
                <span className="w-1.5 h-1.5 rounded-full bg-spice-yellow animate-pulse shrink-0" />
                <span className="font-semibold">{announcement}</span>
              </div>
              <div className="inline-flex items-center space-x-2 px-6">
                <span className="w-1.5 h-1.5 rounded-full bg-spice-yellow animate-pulse shrink-0" />
                <span className="font-semibold">{announcement}</span>
              </div>
              <div className="inline-flex items-center space-x-2 px-6">
                <span className="w-1.5 h-1.5 rounded-full bg-spice-yellow animate-pulse shrink-0" />
                <span className="font-semibold">{announcement}</span>
              </div>
            </div>
          </div>

          {/* Desktop Stationary Strip */}
          <div className="hidden md:flex max-w-7xl mx-auto items-center justify-between">
            <div className="flex items-center space-x-2">
              <span className="inline-block w-2 h-2 rounded-full bg-spice-yellow animate-pulse"></span>
              <span className="truncate">{announcement}</span>
            </div>
            <div className="hidden md:flex items-center space-x-5 text-xs text-spice-sand/90">
              {/* Deliver to address trigger */}
              <button
                type="button"
                onClick={openAddressModal}
                className="flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-black/25 hover:bg-black/35 text-white transition-colors text-[11px] font-medium border border-white/20"
                title="Set or update your default delivery address"
              >
                <MapPin className="w-3 h-3 text-spice-yellow shrink-0" />
                <span className="truncate max-w-[200px]">
                  {defaultAddress?.city ? `Deliver to: ${defaultAddress.city} - ${defaultAddress.pincode}` : 'Deliver to: Set Address'}
                </span>
              </button>
              <span className="text-spice-sand/40">|</span>
              <Link to="/track-order" className="hover:text-white flex items-center space-x-1 transition-colors">
                <Truck className="w-3.5 h-3.5 text-spice-yellow" />
                <span>Track Order</span>
              </Link>
              <span className="text-spice-sand/40">|</span>
              <Link to="/about" className="hover:text-white transition-colors">Our Story</Link>
              <span className="text-spice-sand/40">|</span>
              <Link to="/contact" className="hover:text-white transition-colors">Help</Link>
            </div>
          </div>
        </div>
      )}

      {/* Main Sticky Header */}
      <header
        className={`sticky top-0 z-40 transition-all duration-300 ${
          isScrolled
            ? 'bg-spice-cream/95 backdrop-blur-md shadow-md border-b border-spice-tan/50 py-2.5'
            : 'bg-spice-cream border-b border-spice-tan/40 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Left: Mobile Menu Button & Desktop Logo */}
            <div className="flex items-center space-x-3">
              <button
                type="button"
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 -ml-2 rounded-md text-spice-brown hover:text-spice-crimson hover:bg-spice-sand/40 md:hidden focus:outline-none"
                aria-label="Open navigation menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Official Brand Logo */}
              <Link to="/" className="flex items-center group space-x-3">
                <img
                  src="/images/brand/chilika-logo.jpg"
                  alt="Chilika Spices - From village to your kitchen"
                  className="h-10 sm:h-12 w-auto object-contain rounded-md shadow-sm border border-spice-gold/40 group-hover:scale-105 transition-transform duration-200"
                />
                <div className="hidden lg:block">
                  <div className="font-serif font-bold text-spice-crimson text-lg leading-tight tracking-wider uppercase">
                    CHILIKA SPICES
                  </div>
                  <div className="text-[11px] font-medium text-spice-brown/80 tracking-widest uppercase">
                    From village to your kitchen
                  </div>
                </div>
              </Link>
            </div>

            {/* Center: Desktop Navigation Links */}
            <nav className="hidden md:flex items-center space-x-8 text-sm font-semibold text-spice-brown">
              <Link
                to="/"
                className={`transition-colors hover:text-spice-crimson relative py-1 ${
                  location.pathname === '/' ? 'text-spice-crimson font-bold' : ''
                }`}
              >
                Home
                {location.pathname === '/' && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-spice-crimson rounded-full" />
                )}
              </Link>
              <Link
                to="/shop"
                className={`transition-colors hover:text-spice-crimson relative py-1 ${
                  location.pathname.startsWith('/shop') ? 'text-spice-crimson font-bold' : ''
                }`}
              >
                Shop All Spices
                {location.pathname.startsWith('/shop') && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-spice-crimson rounded-full" />
                )}
              </Link>
              <Link
                to="/categories"
                className={`transition-colors hover:text-spice-crimson relative py-1 ${
                  location.pathname === '/categories' ? 'text-spice-crimson font-bold' : ''
                }`}
              >
                Categories
              </Link>
              <Link
                to="/about"
                className={`transition-colors hover:text-spice-crimson relative py-1 ${
                  location.pathname === '/about' ? 'text-spice-crimson font-bold' : ''
                }`}
              >
                Our Story
              </Link>
              <Link
                to="/contact"
                className={`transition-colors hover:text-spice-crimson relative py-1 ${
                  location.pathname === '/contact' ? 'text-spice-crimson font-bold' : ''
                }`}
              >
                Contact
              </Link>
            </nav>

            {/* Right: Search, Wishlist, User, Cart */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Navbar Search Icon Only */}
              <button
                type="button"
                onClick={() => setIsSearchOpen(!isSearchOpen)}
                className={`p-2 rounded-full transition-all duration-200 ${
                  isSearchOpen
                    ? 'bg-spice-crimson text-white shadow-xs'
                    : 'text-spice-brown hover:text-spice-crimson hover:bg-spice-sand/50'
                }`}
                aria-label="Toggle Search"
                title="Search spices"
              >
                {isSearchOpen ? <X className="w-5 h-5" /> : <Search className="w-5 h-5" />}
              </button>

              {/* Wishlist */}
              <Link
                to="/account?tab=wishlist"
                className="p-2 text-spice-brown hover:text-spice-crimson hover:bg-spice-sand/50 rounded-full transition-colors relative hidden sm:flex items-center"
                aria-label="Wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlistCount > 0 && (
                  <span className="absolute top-0 right-0 bg-spice-crimson text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                    {wishlistCount}
                  </span>
                )}
              </Link>

              {/* User Account / Dropdown */}
              <div className="relative">
                {isAuthenticated ? (
                  <div className="relative">
                    <button
                      type="button"
                      onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                      className="flex items-center space-x-1.5 p-1.5 rounded-full hover:bg-spice-sand/60 text-spice-brown transition-colors text-xs font-semibold"
                    >
                      <div className="w-7 h-7 rounded-full bg-spice-crimson text-white flex items-center justify-center font-bold text-xs uppercase shadow-sm">
                        {user?.name?.charAt(0) || 'U'}
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 hidden md:block" />
                    </button>

                    {isUserMenuOpen && (
                      <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-spice-tan z-50 text-sm">
                        <div className="px-4 py-2 border-b border-gray-100">
                          <p className="font-semibold text-spice-brown truncate">{user.name}</p>
                          <p className="text-xs text-gray-500 truncate">{user.email}</p>
                        </div>
                        <Link
                          to="/account"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-spice-cream hover:text-spice-crimson"
                        >
                          <User className="w-4 h-4 mr-2" />
                          My Profile
                        </Link>
                        <Link
                          to="/orders"
                          onClick={() => setIsUserMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-gray-700 hover:bg-spice-cream hover:text-spice-crimson"
                        >
                          <Package className="w-4 h-4 mr-2" />
                          My Orders
                        </Link>
                        {isAdmin && (
                          <Link
                            to="/admin/dashboard"
                            onClick={() => setIsUserMenuOpen(false)}
                            className="flex items-center px-4 py-2 text-spice-crimson font-semibold hover:bg-spice-sand/50"
                          >
                            <ShieldCheck className="w-4 h-4 mr-2 text-spice-crimson" />
                            Admin Dashboard
                          </Link>
                        )}
                        <button
                          type="button"
                          onClick={() => {
                            logout();
                            setIsUserMenuOpen(false);
                            navigate('/');
                          }}
                          className="w-full flex items-center px-4 py-2 text-red-600 hover:bg-red-50 text-left"
                        >
                          <LogOut className="w-4 h-4 mr-2" />
                          Logout
                        </button>
                      </div>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="flex items-center space-x-1.5 p-2 text-spice-brown hover:text-spice-crimson hover:bg-spice-sand/50 rounded-full transition-colors"
                    aria-label="Login"
                  >
                    <User className="w-5 h-5" />
                    <span className="hidden md:inline text-xs font-semibold">Login</span>
                  </Link>
                )}
              </div>

              {/* Cart Button */}
              <Link
                to="/cart"
                className="flex items-center space-x-2 bg-spice-crimson hover:bg-spice-deepRed text-white px-3.5 py-2 rounded-full font-medium shadow-sm transition-transform active:scale-95"
                aria-label="Shopping Cart"
              >
                <div className="relative">
                  <ShoppingBag className="w-4 h-4" />
                  {itemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-spice-yellow text-spice-brown font-extrabold text-[10px] rounded-full w-4 h-4 flex items-center justify-center shadow-xs">
                      {itemCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-bold hidden sm:inline">
                  {subtotal > 0 ? `₹${subtotal}` : 'Cart'}
                </span>
              </Link>
            </div>
          </div>

          {/* Animated Search Box Opened Right in Navbar */}
          {isSearchOpen && (
            <div className="pt-3 pb-1 border-t border-spice-tan/50 mt-3 animate-search-box">
              <div className="relative flex items-center bg-white rounded-2xl border-2 border-spice-gold/60 shadow-md p-1.5 pl-3.5 space-x-2">
                <Search className="w-4 h-4 text-spice-crimson shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      executeSearch();
                    }
                  }}
                  placeholder="Search pure turmeric, garam masala, besara, badi..."
                  className="w-full bg-transparent text-xs sm:text-sm text-spice-brown placeholder-spice-brown/40 font-semibold focus:outline-none"
                  autoFocus
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => { setSearchQuery(''); setLiveResults([]); }}
                    className="p-1 text-gray-400 hover:text-gray-700 rounded-full transition-colors"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="button"
                  onClick={() => executeSearch()}
                  className="px-4 py-1.5 bg-spice-crimson hover:bg-spice-deepRed text-white text-xs font-bold rounded-xl transition-all shadow-xs shrink-0 flex items-center space-x-1"
                >
                  <span>Search</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>

              {/* Popular Searches Chips in Navbar */}
              <div className="flex items-center space-x-1.5 overflow-x-auto no-scrollbar pt-2 px-1">
                <span className="text-[10px] font-bold text-spice-brown/60 uppercase tracking-wider shrink-0">
                  Popular:
                </span>
                {popularKeywords.map((item, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      setSearchQuery(item.query);
                      executeSearch(item.query);
                    }}
                    className="px-2.5 py-0.5 rounded-full text-[11px] font-medium bg-white hover:bg-spice-crimson hover:text-white text-spice-brown border border-spice-tan/60 transition-colors shrink-0 shadow-2xs"
                  >
                    {item.label}
                  </button>
                ))}
              </div>

              {/* Live Instant Preview Dropdown in Navbar */}
              {isLiveSearching && (
                <div className="mt-2 p-2.5 bg-white rounded-xl border border-spice-tan/50 shadow-lg text-center text-xs text-spice-brown/70 flex items-center justify-center space-x-2">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-spice-turmeric" />
                  <span>Searching fresh Odisha spices...</span>
                </div>
              )}

              {!isLiveSearching && liveResults.length > 0 && (
                <div className="mt-2 p-2 bg-white rounded-2xl border border-spice-gold/40 shadow-xl max-h-64 overflow-y-auto space-y-1 divide-y divide-gray-100">
                  <div className="text-[10px] font-bold text-spice-brown/60 uppercase tracking-wider px-2 pt-1 pb-0.5">
                    Matching Spices ({liveResults.length})
                  </div>
                  {liveResults.map((product) => (
                    <Link
                      key={product._id}
                      to={`/product/${product.slug || product._id}`}
                      onClick={() => setIsSearchOpen(false)}
                      className="flex items-center space-x-2.5 p-2 rounded-xl hover:bg-spice-cream transition-colors group"
                    >
                      <img
                        src={product.productImages?.[0] || '/images/brand/chilika-logo.jpg'}
                        alt={product.name}
                        className="w-10 h-10 rounded-lg object-cover border border-spice-tan/40 group-hover:scale-105 transition-transform"
                      />
                      <div className="flex-1 min-w-0 text-left">
                        <p className="text-xs font-bold text-spice-brown group-hover:text-spice-crimson truncate">
                          {product.name}
                        </p>
                        <p className="text-[10px] text-spice-brown/60 truncate">
                          {product.weight || '100g'} • {product.origin || 'Odisha Heritage'}
                        </p>
                      </div>
                      <span className="text-xs font-bold font-serif text-spice-crimson">
                        ₹{product.price}
                      </span>
                    </Link>
                  ))}
                </div>
              )}

              {!isLiveSearching && searchQuery.trim().length >= 2 && liveResults.length === 0 && (
                <div className="mt-2 p-4 bg-white rounded-2xl border border-spice-tan/40 shadow-lg text-center text-xs text-spice-brown/70 space-y-1">
                  <p className="font-semibold">No spices found matching "{searchQuery}"</p>
                  <p className="text-[10px] text-spice-brown/50">
                    Try searching for turmeric, garam masala, chili, or fish curry blend.
                  </p>
                </div>
              )}
            </div>
          )}
        </div>
      </header>

      {/* Mobile Slide-Out Drawer Navigation */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setIsMobileMenuOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-4/5 max-w-xs bg-spice-cream h-full shadow-2xl flex flex-col justify-between overflow-y-auto border-r border-spice-tan">
            <div className="p-5">
              {/* Drawer Header with Logo & Close */}
              <div className="flex items-center justify-between pb-4 border-b border-spice-tan/60">
                <div className="flex items-center space-x-2">
                  <img
                    src="/images/brand/chilika-logo.jpg"
                    alt="Chilika Spices"
                    className="h-10 w-auto object-contain rounded-md border border-spice-gold/40"
                  />
                  <div>
                    <span className="font-serif font-bold text-spice-crimson text-sm block">CHILIKA SPICES</span>
                    <span className="text-[10px] text-spice-brown/70 font-medium">Odisha Heritage</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="p-1.5 rounded-full text-spice-brown hover:bg-spice-sand"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Default Delivery Address in Mobile Drawer */}
              <button
                type="button"
                onClick={() => {
                  setIsMobileMenuOpen(false);
                  openAddressModal();
                }}
                className="w-full mt-3 p-2.5 bg-spice-sand/50 hover:bg-spice-sand rounded-xl border border-spice-tan text-left flex items-center justify-between transition-colors"
              >
                <div className="flex items-center space-x-2 min-w-0">
                  <MapPin className="w-4 h-4 text-spice-crimson shrink-0" />
                  <div className="truncate">
                    <span className="text-[9px] uppercase tracking-wider text-spice-brown/60 block font-bold">
                      Delivery Location
                    </span>
                    <span className="text-xs font-bold text-spice-brown truncate block">
                      {defaultAddress?.city ? `${defaultAddress.city} - ${defaultAddress.pincode}` : 'Set Default Address'}
                    </span>
                  </div>
                </div>
                <span className="text-[10px] font-bold text-spice-crimson shrink-0 bg-white px-2 py-0.5 rounded border border-spice-tan">
                  Change
                </span>
              </button>

              {/* Navigation Links */}
              <div className="mt-4 space-y-1">
                <Link
                  to="/"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-spice-brown hover:bg-spice-sand hover:text-spice-crimson"
                >
                  Home
                </Link>
                <Link
                  to="/shop"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-spice-brown hover:bg-spice-sand hover:text-spice-crimson"
                >
                  Shop All Spices
                </Link>
                <Link
                  to="/categories"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-spice-brown hover:bg-spice-sand hover:text-spice-crimson"
                >
                  Shop by Category
                </Link>
                <Link
                  to="/track-order"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-spice-crimson bg-spice-lightRed/40 hover:bg-spice-lightRed"
                >
                  <Truck className="w-4 h-4 mr-2" />
                  Track Your Order
                </Link>
                <Link
                  to="/about"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-spice-brown hover:bg-spice-sand hover:text-spice-crimson"
                >
                  About Chilika Spices
                </Link>
                <Link
                  to="/contact"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-spice-brown hover:bg-spice-sand hover:text-spice-crimson"
                >
                  Contact & Support
                </Link>
                <Link
                  to="/faq"
                  className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-spice-brown hover:bg-spice-sand hover:text-spice-crimson"
                >
                  Frequently Asked Questions
                </Link>
              </div>

              {/* Account Actions */}
              <div className="mt-6 pt-5 border-t border-spice-tan/60 space-y-2">
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/account"
                      className="flex items-center justify-between px-3 py-2.5 rounded-lg bg-spice-sand/50 text-sm font-medium text-spice-brown"
                    >
                      <span className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-spice-crimson" />
                        My Account ({user.name})
                      </span>
                    </Link>
                    <Link
                      to="/orders"
                      className="flex items-center px-3 py-2.5 rounded-lg text-sm font-medium text-spice-brown hover:bg-spice-sand"
                    >
                      <Package className="w-4 h-4 mr-2" />
                      My Orders
                    </Link>
                    {isAdmin && (
                      <Link
                        to="/admin/dashboard"
                        className="flex items-center px-3 py-2.5 rounded-lg text-sm font-semibold text-spice-crimson bg-amber-50"
                      >
                        <ShieldCheck className="w-4 h-4 mr-2 text-spice-crimson" />
                        Admin Dashboard
                      </Link>
                    )}
                    <button
                      type="button"
                      onClick={() => {
                        logout();
                        setIsMobileMenuOpen(false);
                      }}
                      className="w-full flex items-center px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg text-left"
                    >
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </>
                ) : (
                  <div className="grid grid-cols-2 gap-2">
                    <Link
                      to="/login"
                      className="text-center py-2 px-3 border border-spice-crimson text-spice-crimson rounded-lg text-sm font-semibold hover:bg-spice-crimson hover:text-white transition-colors"
                    >
                      Login
                    </Link>
                    <Link
                      to="/register"
                      className="text-center py-2 px-3 bg-spice-crimson text-white rounded-lg text-sm font-semibold hover:bg-spice-deepRed transition-colors"
                    >
                      Register
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Drawer Footer */}
            <div className="p-4 bg-spice-sand/50 border-t border-spice-tan text-xs text-spice-brown/80 space-y-1">
              <p className="font-semibold text-spice-crimson">Chilika Spice Co.</p>
              <p>Authentic Odisha Spices</p>
              <p className="text-[11px] text-spice-brown/60">care@chilikaspices.com</p>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
