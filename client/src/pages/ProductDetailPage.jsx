import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Heart,
  ShoppingBag,
  Zap,
  Truck,
  ShieldCheck,
  RotateCcw,
  CheckCircle2,
  ChevronRight,
  ChevronLeft,
  Plus,
  Minus,
  MessageSquare,
  Maximize2,
  X,
  Sparkles,
  Shuffle
} from 'lucide-react';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { useWishlist } from '../context/WishlistContext';
import { ProductCard } from '../components/common/ProductCard';
import { ProductCarousel } from '../components/common/ProductCarousel';

export const ProductDetailPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();

  const [product, setProduct] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [selectedSize, setSelectedSize] = useState('100g');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [addedToast, setAddedToast] = useState(false);

  // Gallery interactive states
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomOrigin, setZoomOrigin] = useState({ x: 50, y: 50 });
  const touchStartRef = useRef(null);

  // Review Form state
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewComment, setReviewComment] = useState('');
  const [reviewerName, setReviewerName] = useState('');
  const [reviewSubmitting, setReviewSubmitting] = useState(false);
  const [reviewMessage, setReviewMessage] = useState('');

  useEffect(() => {
    const fetchProductDetails = async () => {
      setLoading(true);
      try {
        const res = await api.getProductBySlug(slug);
        if (res.success && res.product) {
          setProduct(res.product);
          setSelectedImageIndex(0);

          // Set initial size
          if (res.product.variants && res.product.variants.length > 0) {
            setSelectedSize(res.product.variants[0].size);
          } else if (res.product.availableSizes && res.product.availableSizes.length > 0) {
            setSelectedSize(res.product.availableSizes[0]);
          }

          // Fetch reviews & related suggestions
          const [revRes, relRes] = await Promise.all([
            api.getProductReviews(res.product._id),
            api.getRelatedProducts(res.product._id)
          ]);
          if (revRes.success) setReviews(revRes.reviews);
          if (relRes.success && relRes.products && relRes.products.length > 0) {
            setRelated(relRes.products);
          } else {
            // Fallback: fetch other products and randomly shuffle
            const allRes = await api.getProducts('limit=12');
            if (allRes.success && allRes.products) {
              const shuffled = allRes.products
                .filter((p) => p._id !== res.product._id)
                .sort(() => 0.5 - Math.random());
              setRelated(shuffled);
            }
          }
        }
      } catch (err) {
        console.error('Error fetching product:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductDetails();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShuffleSuggestions = async () => {
    if (!product) return;
    try {
      const relRes = await api.getRelatedProducts(product._id);
      if (relRes.success && relRes.products && relRes.products.length > 0) {
        setRelated(relRes.products.sort(() => 0.5 - Math.random()));
      } else {
        const allRes = await api.getProducts('limit=12');
        if (allRes.success && allRes.products) {
          const shuffled = allRes.products
            .filter((p) => p._id !== product._id)
            .sort(() => 0.5 - Math.random());
          setRelated(shuffled);
        }
      }
    } catch (err) {
      console.error('Shuffle error:', err);
    }
  };

  // Keyboard navigation for Lightbox
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!lightboxOpen) return;
      if (e.key === 'Escape') setLightboxOpen(false);
      if (e.key === 'ArrowRight') handleNextImage();
      if (e.key === 'ArrowLeft') handlePrevImage();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-spice-cream py-16 flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-3 border-spice-crimson border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="font-serif font-semibold text-sm text-spice-brown">Opening Spice Jar...</p>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-spice-cream py-20 text-center">
        <h2 className="font-serif font-bold text-2xl text-spice-brown mb-2">Spice Not Found</h2>
        <p className="text-sm text-spice-brown/70 mb-4">The spice you are looking for may have moved or is unavailable.</p>
        <Link to="/shop" className="bg-spice-crimson text-white px-6 py-2.5 rounded-full text-xs font-bold">
          Explore All Spices
        </Link>
      </div>
    );
  }

  // Variant calculations
  let currentPrice = product.price;
  let currentCompareAt = product.compareAtPrice;
  let currentDiscount = product.discount;
  let currentStock = product.stock;

  if (product.variants && product.variants.length > 0) {
    const v = product.variants.find((item) => item.size === selectedSize);
    if (v) {
      currentPrice = v.price;
      currentCompareAt = v.compareAtPrice || 0;
      currentDiscount = v.discountPercent || (currentCompareAt > currentPrice ? Math.round(((currentCompareAt - currentPrice) / currentCompareAt) * 100) : 0);
      currentStock = v.stock;
    }
  }

  const isFavorited = isInWishlist(product._id);
  const images = (product.productImages && product.productImages.length > 0)
    ? product.productImages
    : ['/images/products/turmeric.jpg'];

  const handleNextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % images.length);
  };

  const handlePrevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  // Interactive Mouse Hover Zoom & Pan handlers
  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setZoomOrigin({ x, y });
  };

  const handleMouseEnter = () => setIsZoomed(true);
  const handleMouseLeave = () => {
    setIsZoomed(false);
    setZoomOrigin({ x: 50, y: 50 });
  };

  // Mobile swipe gestures
  const handleTouchStart = (e) => {
    touchStartRef.current = e.touches[0].clientX;
  };

  const handleTouchEnd = (e) => {
    if (touchStartRef.current === null) return;
    const diff = touchStartRef.current - e.changedTouches[0].clientX;
    if (diff > 45) {
      handleNextImage(); // Swipe left -> next
    } else if (diff < -45) {
      handlePrevImage(); // Swipe right -> prev
    }
    touchStartRef.current = null;
  };

  const handleAddToCart = () => {
    addToCart(product, selectedSize, quantity);
    setAddedToast(true);
    setTimeout(() => setAddedToast(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, selectedSize, quantity);
    navigate('/checkout');
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!reviewComment.trim()) return;
    setReviewSubmitting(true);
    try {
      const res = await api.submitReview({
        productId: product._id,
        rating: reviewRating,
        comment: reviewComment,
        userName: reviewerName || 'Verified Home Cook'
      });
      if (res.success) {
        setReviewMessage('Thank you! Your review has been added.');
        setReviewComment('');
        setReviews([res.review, ...reviews]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setReviewSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-spice-cream py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <nav className="flex items-center space-x-2 text-xs text-spice-brown/60 mb-6 truncate">
          <Link to="/" className="hover:text-spice-crimson">Home</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link to="/shop" className="hover:text-spice-crimson">Shop</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          {product.category && (
            <>
              <Link to={`/shop?category=${product.category.slug}`} className="hover:text-spice-crimson">
                {product.category.name}
              </Link>
              <ChevronRight className="w-3.5 h-3.5" />
            </>
          )}
          <span className="text-spice-brown font-semibold truncate">{product.name}</span>
        </nav>

        {/* Main Product Container */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 bg-white rounded-3xl p-5 sm:p-8 border border-spice-tan/50 shadow-sm">
          {/* Left Column: Horizontal Slide Gallery & Video Showcase */}
          <div className="lg:col-span-6 space-y-4">
            {/* Primary Main Viewport */}
            <div
              onMouseMove={handleMouseMove}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              onTouchStart={handleTouchStart}
              onTouchEnd={handleTouchEnd}
              className="relative aspect-square rounded-2xl overflow-hidden bg-spice-sand/20 border border-spice-tan/60 flex items-center justify-center group shadow-xs select-none"
            >
              {/* Badges Overlays */}
              <span className="veg-badge absolute top-3.5 left-3.5 z-20 pointer-events-none" title="100% Pure & Vegetarian" />
              {currentDiscount > 0 && (
                <span className="absolute top-3.5 left-10 z-20 bg-spice-crimson text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full shadow-xs pointer-events-none">
                  {currentDiscount}% OFF
                </span>
              )}

              {/* Wishlist Button */}
              <button
                type="button"
                onClick={() => toggleWishlist(product)}
                aria-label="Wishlist"
                className={`absolute top-3.5 right-3.5 z-30 p-2.5 rounded-full backdrop-blur-md transition-all shadow-xs ${
                  isFavorited
                    ? 'bg-red-50 text-red-600'
                    : 'bg-white/90 text-spice-brown/70 hover:text-spice-crimson hover:bg-white hover:scale-105'
                }`}
              >
                <Heart className={`w-5 h-5 ${isFavorited ? 'fill-current' : ''}`} />
              </button>

              {/* Zoom Trigger Button */}
              <button
                type="button"
                onClick={() => setLightboxOpen(true)}
                title="Expand to Fullscreen"
                className="absolute bottom-3.5 left-3.5 z-30 p-2 rounded-full bg-white/90 hover:bg-white text-spice-brown/80 hover:text-spice-crimson backdrop-blur-md shadow-xs opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Maximize2 className="w-4 h-4" />
              </button>

              {/* PHOTO SLIDE VIEW WITH DYNAMIC MOUSE HOVER ZOOM */}
              <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
                <img
                  key={selectedImageIndex}
                  src={images[selectedImageIndex]}
                  alt={`${product.name} - Photo ${selectedImageIndex + 1}`}
                  onClick={() => setLightboxOpen(true)}
                  style={{
                    transformOrigin: `${zoomOrigin.x}% ${zoomOrigin.y}%`,
                    transform: isZoomed ? 'scale(2.1)' : 'scale(1)',
                    transition: isZoomed ? 'transform 0.1s ease-out' : 'transform 0.35s ease-out, transform-origin 0.35s ease-out'
                  }}
                  className="w-full h-full object-cover cursor-crosshair will-change-transform transition-all duration-300"
                />

                {/* Subtle Interactive Lighting Highlight Following Cursor */}
                {isZoomed && (
                  <div
                    className="pointer-events-none absolute inset-0 z-10 opacity-70 transition-opacity duration-200"
                    style={{
                      background: `radial-gradient(circle 180px at ${zoomOrigin.x}% ${zoomOrigin.y}%, rgba(255,255,255,0.28) 0%, rgba(255,255,255,0) 80%)`
                    }}
                  />
                )}

                {/* Left / Right Carousel Arrows */}
                {images.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handlePrevImage();
                      }}
                      aria-label="Previous Photo"
                      className="absolute left-2.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-spice-brown hover:text-spice-crimson flex items-center justify-center shadow-md backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleNextImage();
                      }}
                      aria-label="Next Photo"
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 z-30 w-9 h-9 rounded-full bg-white/90 hover:bg-white text-spice-brown hover:text-spice-crimson flex items-center justify-center shadow-md backdrop-blur-md opacity-80 sm:opacity-0 group-hover:opacity-100 transition-all hover:scale-110 active:scale-95"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}

                {/* Animated Indicator Dots (No numbers, interactive expanding pills) */}
                {images.length > 1 && (
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-30 flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-black/45 backdrop-blur-md border border-white/20 shadow-lg pointer-events-auto">
                    {images.map((_, i) => (
                      <button
                        key={i}
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          setSelectedImageIndex(i);
                        }}
                        aria-label={`Photo ${i + 1} of ${images.length}`}
                        className={`h-2 rounded-full transition-all duration-300 ${
                          selectedImageIndex === i
                            ? 'w-7 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] scale-105'
                            : 'w-2 bg-white/60 hover:bg-white hover:scale-125'
                        }`}
                      />
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Trust highlights below image */}
            <div className="grid grid-cols-3 gap-2 pt-2 text-center text-[11px] text-spice-brown/80 font-medium">
              <div className="bg-spice-cream p-2.5 rounded-xl border border-spice-tan/40">
                <Truck className="w-4 h-4 text-spice-crimson mx-auto mb-1" />
                <span>Fast Delivery</span>
              </div>
              <div className="bg-spice-cream p-2.5 rounded-xl border border-spice-tan/40">
                <ShieldCheck className="w-4 h-4 text-spice-green mx-auto mb-1" />
                <span>100% Pure Masala</span>
              </div>
              <div className="bg-spice-cream p-2.5 rounded-xl border border-spice-tan/40">
                <RotateCcw className="w-4 h-4 text-spice-turmeric mx-auto mb-1" />
                <span>Freshness Guaranteed</span>
              </div>
            </div>
          </div>

          {/* Right Column: Product Info & Buy Controls */}
          <div className="lg:col-span-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Category & Origin */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-spice-turmeric uppercase tracking-wider">
                  {product.category?.name || 'Traditional Spice'}
                </span>
                <span className="font-semibold text-spice-green flex items-center space-x-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Origin: {product.origin || 'Odisha, India'}</span>
                </span>
              </div>

              {/* Title */}
              <h1 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-spice-brown leading-tight">
                {product.name}
              </h1>

              {/* Rating & Reviews Count */}
              <div className="flex items-center space-x-2">
                <div className="flex items-center text-amber-500">
                  <Star className="w-4 h-4 fill-current" />
                  <span className="text-xs font-bold text-spice-brown ml-1">{product.rating}</span>
                </div>
                <span className="text-xs text-spice-brown/50">•</span>
                <span className="text-xs text-spice-brown/70 underline cursor-pointer">
                  {reviews.length} Customer Reviews
                </span>
              </div>

              {/* Price and MRP */}
              <div className="flex items-baseline space-x-3 pt-1">
                <span className="font-serif font-extrabold text-2xl sm:text-3xl text-spice-crimson">
                  ₹{currentPrice}
                </span>
                {currentCompareAt > currentPrice && (
                  <>
                    <span className="text-sm sm:text-base text-spice-brown/50 line-through">
                      MRP ₹{currentCompareAt}
                    </span>
                    <span className="text-xs font-bold text-spice-green bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                      Save ₹{currentCompareAt - currentPrice} ({currentDiscount}% OFF)
                    </span>
                  </>
                )}
              </div>
              <p className="text-[11px] text-spice-brown/60">Inclusive of all taxes. Free shipping above ₹499.</p>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-spice-brown/80 leading-relaxed pt-1">
                {product.shortDescription || product.description}
              </p>

              {/* Size Selector */}
              <div className="pt-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-spice-brown mb-2">
                  Select Pack Size: <span className="text-spice-crimson normal-case">{selectedSize}</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {(product.availableSizes || ['100g', '250g', '500g']).map((sz) => (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                        selectedSize === sz
                          ? 'bg-spice-crimson text-white border-spice-crimson shadow-xs'
                          : 'bg-spice-cream text-spice-brown border-spice-tan/70 hover:border-spice-crimson/50'
                      }`}
                    >
                      {sz}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quantity Selector & Stock Info */}
              <div className="flex items-center space-x-4 pt-1">
                <div className="flex items-center border border-spice-tan rounded-xl overflow-hidden bg-spice-cream">
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    className="p-2 text-spice-brown hover:bg-spice-sand transition-colors"
                  >
                    <Minus className="w-3.5 h-3.5" />
                  </button>
                  <span className="px-4 text-xs font-bold text-spice-brown">{quantity}</span>
                  <button
                    type="button"
                    onClick={() => setQuantity((q) => q + 1)}
                    className="p-2 text-spice-brown hover:bg-spice-sand transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="text-xs">
                  {currentStock > 0 ? (
                    <span className="text-spice-green font-semibold flex items-center space-x-1">
                      <span className="w-2 h-2 rounded-full bg-spice-green inline-block animate-pulse" />
                      <span>In Stock • Ready to dispatch from Odisha</span>
                    </span>
                  ) : (
                    <span className="text-red-500 font-semibold">Currently Out of Stock</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="grid grid-cols-2 gap-3 pt-3">
                <button
                  type="button"
                  onClick={handleAddToCart}
                  className="flex items-center justify-center space-x-2 py-3 px-4 sm:px-6 bg-spice-cream border-2 border-spice-crimson text-spice-crimson rounded-2xl text-xs sm:text-sm font-bold hover:bg-spice-crimson hover:text-white transition-all active:scale-95 shadow-xs"
                >
                  <ShoppingBag className="w-4 h-4 shrink-0" />
                  <span>Add to Cart</span>
                </button>
                <button
                  type="button"
                  onClick={handleBuyNow}
                  className="flex items-center justify-center space-x-2 py-3 px-4 sm:px-6 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-spice"
                >
                  <Zap className="w-4 h-4 fill-current shrink-0" />
                  <span>Buy Now</span>
                </button>
              </div>

              {/* Direct WhatsApp Instant Order Button */}
              <div className="pt-2">
                <a
                  href={`https://wa.me/919668659633?text=${encodeURIComponent(`Hi Chilika Spices, I would like to order: ${product.name} (${selectedSize}) × ${quantity} (Total: ₹${currentPrice * quantity})`)}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-[#25D366] hover:bg-[#1faa52] text-white rounded-2xl text-xs sm:text-sm font-bold transition-all active:scale-95 shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/>
                  </svg>
                  <span>Order via WhatsApp</span>
                </a>
              </div>

              {addedToast && (
                <div className="bg-green-50 border border-green-200 text-green-800 text-xs font-semibold p-2.5 rounded-xl flex items-center space-x-2">
                  <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
                  <span>Added {quantity} × {product.name} ({selectedSize}) to your cart!</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Detailed Tabs: Description, Ingredients, How To Use, Storage, Reviews */}
        <div className="mt-10 bg-white rounded-3xl p-6 sm:p-8 border border-spice-tan/50 shadow-sm">
          <div className="flex border-b border-spice-tan/50 space-x-6 overflow-x-auto no-scrollbar text-xs sm:text-sm font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('description')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'description' ? 'border-spice-crimson text-spice-crimson' : 'border-transparent text-spice-brown/60 hover:text-spice-brown'
              }`}
            >
              Description & Craft
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('ingredients')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'ingredients' ? 'border-spice-crimson text-spice-crimson' : 'border-transparent text-spice-brown/60 hover:text-spice-brown'
              }`}
            >
              Ingredients & Origin
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('usage')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'usage' ? 'border-spice-crimson text-spice-crimson' : 'border-transparent text-spice-brown/60 hover:text-spice-brown'
              }`}
            >
              How to Use & Storage
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('reviews')}
              className={`pb-3 border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'reviews' ? 'border-spice-crimson text-spice-crimson' : 'border-transparent text-spice-brown/60 hover:text-spice-brown'
              }`}
            >
              Reviews ({reviews.length})
            </button>
          </div>

          <div className="pt-6 text-xs sm:text-sm text-spice-brown/80 leading-relaxed">
            {activeTab === 'description' && (
              <div className="space-y-3">
                <p>{product.description}</p>
                <p className="text-spice-brown/70 italic">
                  Crafted strictly according to traditional Odisha processing methods. Never chemically bleached or treated with artificial coloring agents.
                </p>
              </div>
            )}

            {activeTab === 'ingredients' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif font-bold text-spice-brown mb-2">Ingredients:</h4>
                  <ul className="list-disc pl-5 space-y-1">
                    {(product.ingredients && product.ingredients.length > 0
                      ? product.ingredients
                      : ['100% Pure handpicked whole spices']
                    ).map((ing, idx) => (
                      <li key={idx}>{ing}</li>
                    ))}
                  </ul>
                </div>
                <div className="pt-2">
                  <h4 className="font-serif font-bold text-spice-brown mb-1">Place of Origin:</h4>
                  <p>{product.origin || 'Chilika & Odisha, India'}</p>
                </div>
              </div>
            )}

            {activeTab === 'usage' && (
              <div className="space-y-4">
                <div>
                  <h4 className="font-serif font-bold text-spice-brown mb-1">Culinary Use:</h4>
                  <p>{product.howToUse || 'Add as desired during cooking to bring out deep flavour and fragrant aroma.'}</p>
                </div>
                <div>
                  <h4 className="font-serif font-bold text-spice-brown mb-1">Storage Recommendation:</h4>
                  <p>{product.storageInfo || 'Store in an airtight container in a cool, dry place away from direct sunlight.'}</p>
                </div>
              </div>
            )}

            {activeTab === 'reviews' && (
              <div className="space-y-8">
                {/* Submit Review Form */}
                <div className="bg-spice-cream p-5 rounded-2xl border border-spice-tan/60 max-w-xl">
                  <h4 className="font-serif font-bold text-spice-brown text-sm sm:text-base mb-2">
                    Leave a Review for {product.name}
                  </h4>
                  {reviewMessage ? (
                    <p className="text-xs text-spice-green font-semibold">{reviewMessage}</p>
                  ) : (
                    <form onSubmit={handleReviewSubmit} className="space-y-3">
                      <div>
                        <label className="block text-xs font-semibold text-spice-brown mb-1">Rating</label>
                        <div className="flex space-x-1 text-amber-500">
                          {[1, 2, 3, 4, 5].map((st) => (
                            <button
                              key={st}
                              type="button"
                              onClick={() => setReviewRating(st)}
                              className="focus:outline-none"
                            >
                              <Star className={`w-5 h-5 ${st <= reviewRating ? 'fill-current' : 'text-gray-300'}`} />
                            </button>
                          ))}
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-spice-brown mb-1">Your Name</label>
                        <input
                          type="text"
                          value={reviewerName}
                          onChange={(e) => setReviewerName(e.target.value)}
                          placeholder="e.g. Meera"
                          className="w-full bg-white border border-spice-tan rounded-lg px-3 py-2 text-xs text-spice-brown"
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-spice-brown mb-1">Your Feedback</label>
                        <textarea
                          rows={3}
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Tell other home cooks about the fragrance and taste..."
                          className="w-full bg-white border border-spice-tan rounded-lg px-3 py-2 text-xs text-spice-brown"
                          required
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={reviewSubmitting}
                        className="bg-spice-crimson text-white px-5 py-2 rounded-xl text-xs font-bold hover:bg-spice-deepRed transition-colors disabled:opacity-70"
                      >
                        {reviewSubmitting ? 'Submitting...' : 'Post Review'}
                      </button>
                    </form>
                  )}
                </div>

                {/* Existing Reviews List */}
                <div className="space-y-4">
                  {reviews.length === 0 ? (
                    <p className="text-xs text-spice-brown/60">No reviews yet for this spice. Be the first to review!</p>
                  ) : (
                    reviews.map((r) => (
                      <div key={r._id} className="pb-4 border-b border-spice-tan/40 space-y-1">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="font-bold text-spice-brown text-xs sm:text-sm">{r.userName}</span>
                            {r.isVerifiedPurchase && (
                              <span className="text-[10px] font-bold text-spice-green bg-green-50 px-2 py-0.5 rounded-full">
                                Verified
                              </span>
                            )}
                          </div>
                          <div className="flex text-amber-500">
                            {[...Array(5)].map((_, i) => (
                              <Star key={i} className={`w-3.5 h-3.5 ${i < r.rating ? 'fill-current' : 'text-gray-300'}`} />
                            ))}
                          </div>
                        </div>
                        <p className="text-xs text-spice-brown/80">{r.comment}</p>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Random Suggestions Section Underneath */}
        {related.length > 0 && (
          <div className="mt-12 sm:mt-16 bg-white rounded-3xl p-6 sm:p-8 border border-spice-tan/50 shadow-sm">
            <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 border-b border-spice-tan/40 gap-4">
              <div>
                <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
                  You May Also Love
                </span>
                <h2 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown tracking-tight">
                  Suggested Odisha Spices
                </h2>
                <p className="text-xs sm:text-sm text-spice-brown/70 mt-1">
                  Fresh suggestions picked from our handcrafted collection
                </p>
              </div>

              <div className="flex items-center space-x-3">
                <button
                  type="button"
                  onClick={handleShuffleSuggestions}
                  className="flex items-center space-x-1.5 px-3.5 py-2 bg-spice-cream border border-spice-tan rounded-xl text-xs font-bold text-spice-brown hover:bg-spice-sand shadow-2xs transition-all active:scale-95 cursor-pointer"
                >
                  <Shuffle className="w-3.5 h-3.5 text-spice-crimson" />
                  <span>Shuffle</span>
                </button>
                <Link
                  to="/shop"
                  className="text-xs font-bold text-spice-crimson hover:underline"
                >
                  View All Spices →
                </Link>
              </div>
            </div>

            {/* Grid of random suggested spices */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3.5 sm:gap-5 pt-6">
              {related.slice(0, 4).map((relProduct) => (
                <ProductCard key={relProduct._id} product={relProduct} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sticky Mobile Add To Cart / Buy Now Bar */}
      <div className="sm:hidden fixed bottom-14 left-0 right-0 z-30 bg-white border-t border-spice-tan p-3 shadow-lg flex items-center justify-between gap-2">
        <div>
          <span className="text-[10px] text-spice-brown/60 block">{selectedSize}</span>
          <span className="font-serif font-bold text-base text-spice-crimson">₹{currentPrice}</span>
        </div>
        <div className="flex gap-2 flex-1 max-w-[240px]">
          <button
            type="button"
            onClick={handleAddToCart}
            className="flex-1 py-2.5 bg-spice-cream border border-spice-crimson text-spice-crimson rounded-xl text-xs font-bold active:scale-95"
          >
            Add to Cart
          </button>
          <button
            type="button"
            onClick={handleBuyNow}
            className="flex-1 py-2.5 bg-spice-crimson text-white rounded-xl text-xs font-bold active:scale-95 shadow-sm"
          >
            Buy Now
          </button>
        </div>
      </div>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-md flex flex-col justify-between p-4 sm:p-6 animate-fadeIn">
          {/* Header */}
          <div className="flex items-center justify-between text-white pb-3 border-b border-white/10">
            <h3 className="font-serif font-bold text-sm sm:text-base text-spice-gold">
              {product.name}
            </h3>
            <button
              type="button"
              onClick={() => setLightboxOpen(false)}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
              aria-label="Close Fullscreen View"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Center Main Stage with Left/Right Arrows */}
          <div className="relative flex-1 flex items-center justify-center my-4 overflow-hidden">
            {images.length > 1 && (
              <button
                type="button"
                onClick={handlePrevImage}
                aria-label="Previous image"
                className="absolute left-2 sm:left-6 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>
            )}

            <img
              src={images[selectedImageIndex]}
              alt={`${product.name} - Fullscreen View ${selectedImageIndex + 1}`}
              className="max-h-[75vh] max-w-[90vw] object-contain rounded-xl shadow-2xl transition-all duration-300"
            />

            {images.length > 1 && (
              <button
                type="button"
                onClick={handleNextImage}
                aria-label="Next image"
                className="absolute right-2 sm:right-6 z-10 w-12 h-12 rounded-full bg-black/50 hover:bg-black/80 text-white flex items-center justify-center border border-white/20 backdrop-blur-md transition-all hover:scale-110 active:scale-95"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            )}
          </div>

          {/* Bottom Animated Dots */}
          {images.length > 1 && (
            <div className="flex justify-center items-center space-x-2 py-3">
              {images.map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImageIndex(i)}
                  className={`h-2.5 rounded-full transition-all duration-300 ${
                    selectedImageIndex === i
                      ? 'w-8 bg-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.9)] scale-105'
                      : 'w-2.5 bg-white/40 hover:bg-white/80'
                  }`}
                  aria-label={`Photo ${i + 1}`}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
