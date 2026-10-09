import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Heart, ShoppingBag, Zap, Check } from 'lucide-react';
import { useCart } from '../../context/CartContext';
import { useWishlist } from '../../context/WishlistContext';

export const ProductCard = ({ product }) => {
  const [selectedSize, setSelectedSize] = useState(() => {
    if (product.variants && product.variants.length > 0) {
      return product.variants[0].size;
    }
    return (product.availableSizes && product.availableSizes[0]) || '100g';
  });

  const [addedAnimation, setAddedAnimation] = useState(false);
  const { addToCart } = useCart();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const navigate = useNavigate();

  // Find active variant pricing
  let activePrice = product.price;
  let activeCompareAt = product.compareAtPrice;
  let activeDiscount = product.discount;

  if (product.variants && product.variants.length > 0) {
    const variant = product.variants.find((v) => v.size === selectedSize);
    if (variant) {
      activePrice = variant.price;
      activeCompareAt = variant.compareAtPrice || 0;
      activeDiscount = variant.discountPercent || (activeCompareAt > activePrice ? Math.round(((activeCompareAt - activePrice) / activeCompareAt) * 100) : 0);
    }
  }

  const isFavorited = isInWishlist(product._id);
  const mainImage = (product.productImages && product.productImages[0]) || '/images/products/turmeric.jpg';

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
    setAddedAnimation(true);
    setTimeout(() => setAddedAnimation(false), 1200);
  };

  const handleBuyNow = (e) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, selectedSize, 1);
    navigate('/checkout');
  };

  const handleWishlist = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
  };

  return (
    <div className="group relative bg-white rounded-2xl border border-spice-tan/50 shadow-sm hover:shadow-spice transition-all duration-300 flex flex-col justify-between overflow-hidden p-3.5 sm:p-4 text-left">
      {/* Top Media & Badges */}
      <div className="relative">
        {/* Badges: Veg Mark & Discount */}
        <div className="absolute top-2 left-2 z-10 flex flex-col space-y-1">
          <div className="flex items-center space-x-1.5">
            <span className="veg-badge" title="Vegetarian Product" />
            {activeDiscount > 0 && (
              <span className="bg-spice-crimson text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-xs">
                {activeDiscount}% OFF
              </span>
            )}
          </div>
          {product.isBestSeller && (
            <span className="bg-spice-yellow text-spice-brown text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded-sm tracking-wider w-max shadow-2xs">
              Best Seller
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          type="button"
          onClick={handleWishlist}
          aria-label="Save to Wishlist"
          className={`absolute top-2 right-2 z-10 p-1.5 rounded-full backdrop-blur-md transition-colors ${
            isFavorited
              ? 'bg-red-50 text-red-600'
              : 'bg-white/80 text-spice-brown/70 hover:text-spice-crimson hover:bg-white'
          }`}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-current' : ''}`} />
        </button>

        {/* Product Image */}
        <Link to={`/product/${product.slug}`} className="block overflow-hidden rounded-xl bg-spice-sand/30 aspect-square">
          <img
            src={mainImage}
            alt={product.name}
            loading="lazy"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          />
        </Link>
      </div>

      {/* Product Information */}
      <div className="pt-3 flex-1 flex flex-col justify-between">
        <div>
          {/* Rating */}
          <div className="flex items-center space-x-1.5 mb-1.5">
            <div className="flex items-center text-amber-500">
              <Star className="w-3.5 h-3.5 fill-current" />
              <span className="text-xs font-bold text-spice-brown ml-1">{product.rating || 4.8}</span>
            </div>
            <span className="text-[11px] text-spice-brown/50">({product.numReviews || 24})</span>
            {product.origin && (
              <span className="text-[10px] text-spice-green font-semibold ml-auto truncate max-w-[110px]">
                {product.origin.split(',')[0]}
              </span>
            )}
          </div>

          {/* Title */}
          <Link to={`/product/${product.slug}`} className="block">
            <h3 className="font-serif font-bold text-spice-brown text-sm sm:text-base leading-snug line-clamp-1 group-hover:text-spice-crimson transition-colors">
              {product.name}
            </h3>
          </Link>

          {/* Short Description */}
          <p className="text-[11px] sm:text-xs text-spice-brown/70 line-clamp-2 mt-1 min-h-[32px]">
            {product.shortDescription || product.description}
          </p>

          {/* Size Variant Selector */}
          <div className="mt-2.5">
            <div className="flex items-center space-x-1 overflow-x-auto no-scrollbar py-0.5">
              {(product.availableSizes || ['100g', '250g', '500g']).map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => setSelectedSize(size)}
                  className={`text-[10px] font-semibold px-2 py-0.5 rounded-md border transition-all ${
                    selectedSize === size
                      ? 'bg-spice-crimson text-white border-spice-crimson shadow-2xs'
                      : 'bg-spice-cream text-spice-brown border-spice-tan/70 hover:border-spice-crimson/50'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Pricing */}
          <div className="mt-2.5 flex items-baseline space-x-2">
            <span className="font-serif font-bold text-base sm:text-lg text-spice-crimson">
              ₹{activePrice}
            </span>
            {activeCompareAt > activePrice && (
              <span className="text-xs text-spice-brown/50 line-through">
                ₹{activeCompareAt}
              </span>
            )}
          </div>
        </div>

        {/* Action Buttons: Add to Cart & Buy Now */}
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            className={`flex items-center justify-center space-x-1 py-2 px-2 rounded-xl text-xs font-bold transition-all active:scale-95 border ${
              addedAnimation
                ? 'bg-green-600 text-white border-green-600'
                : 'bg-spice-cream text-spice-crimson border-spice-crimson/40 hover:bg-spice-crimson hover:text-white'
            }`}
          >
            {addedAnimation ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add</span>
              </>
            )}
          </button>

          <button
            type="button"
            onClick={handleBuyNow}
            className="flex items-center justify-center space-x-1 py-2 px-2 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-xl text-xs font-bold transition-transform active:scale-95 shadow-xs"
          >
            <Zap className="w-3.5 h-3.5 fill-current" />
            <span>Buy Now</span>
          </button>
        </div>
      </div>
    </div>
  );
};
