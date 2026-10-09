import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag, Tag, Check, X, ShieldCheck } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

export const CartPage = () => {
  const {
    cartItems,
    updateQuantity,
    removeFromCart,
    clearCart,
    subtotal,
    shippingFee,
    discount,
    finalTotal,
    coupon,
    couponError,
    couponSuccess,
    applyCoupon,
    removeCoupon
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [applying, setApplying] = useState(false);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const handleProceedToCheckout = () => {
    if (!isAuthenticated) {
      navigate('/login?redirect=/checkout');
    } else {
      navigate('/checkout');
    }
  };

  const handleApplyCoupon = async (e) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setApplying(true);
    await applyCoupon(couponInput.trim());
    setApplying(false);
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-spice-cream py-16 sm:py-24">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-20 h-20 rounded-full bg-spice-sand/80 flex items-center justify-center mx-auto mb-5 text-spice-brown/50">
            <ShoppingBag className="w-10 h-10" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-spice-brown mb-2">
            Your Spice Basket is Empty
          </h2>
          <p className="text-xs sm:text-sm text-spice-brown/70 mb-6 leading-relaxed">
            Fill your kitchen with the authentic aromas of Odisha's finest pure spices, ground and packed with love.
          </p>
          <Link
            to="/shop"
            className="inline-flex items-center space-x-2 bg-spice-crimson hover:bg-spice-deepRed text-white px-7 py-3 rounded-full text-sm font-bold shadow-spice transition-all"
          >
            <span>Explore Spices</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-spice-cream py-6 sm:py-10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between pb-6 border-b border-spice-tan/50">
          <div>
            <h1 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown tracking-tight">
              Your Spice Basket
            </h1>
            <p className="text-xs sm:text-sm text-spice-brown/70 mt-0.5">
              {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'} in your cart
            </p>
          </div>
          <button
            type="button"
            onClick={clearCart}
            className="text-xs text-spice-crimson hover:underline font-semibold"
          >
            Clear Basket
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 pt-8">
          {/* Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {cartItems.map((item) => (
              <div
                key={`${item.productId}-${item.size}`}
                className="bg-white rounded-2xl p-4 sm:p-5 border border-spice-tan/60 shadow-2xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
              >
                <div className="flex items-center space-x-4">
                  <img
                    src={item.image || '/images/products/turmeric.jpg'}
                    alt={item.name}
                    className="w-18 h-18 sm:w-20 sm:h-20 rounded-xl object-cover bg-spice-sand/30 shrink-0 border border-spice-tan/40"
                  />
                  <div>
                    <span className="veg-badge mr-2" />
                    <Link
                      to={`/product/${item.slug}`}
                      className="font-serif font-bold text-sm sm:text-base text-spice-brown hover:text-spice-crimson transition-colors block"
                    >
                      {item.name}
                    </Link>
                    <div className="text-xs text-spice-brown/60 mt-0.5">
                      Pack: <span className="font-semibold text-spice-brown">{item.size}</span> • ₹{item.price} each
                    </div>
                    <div className="font-serif font-bold text-sm text-spice-crimson mt-1 sm:hidden">
                      Subtotal: ₹{item.price * item.quantity}
                    </div>
                  </div>
                </div>

                {/* Quantity Controls & Remove */}
                <div className="flex items-center justify-between w-full sm:w-auto space-x-4 sm:space-x-6">
                  <div className="flex items-center border border-spice-tan rounded-xl overflow-hidden bg-spice-cream">
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity - 1)}
                      className="p-1.5 sm:p-2 text-spice-brown hover:bg-spice-sand transition-colors"
                      aria-label="Decrease quantity"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-xs font-bold text-spice-brown">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(item.productId, item.size, item.quantity + 1)}
                      className="p-1.5 sm:p-2 text-spice-brown hover:bg-spice-sand transition-colors"
                      aria-label="Increase quantity"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="hidden sm:block text-right min-w-[80px]">
                    <span className="font-serif font-bold text-base text-spice-brown">
                      ₹{item.price * item.quantity}
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeFromCart(item.productId, item.size)}
                    className="p-2 text-gray-400 hover:text-red-500 rounded-lg transition-colors"
                    aria-label="Remove item"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}

            {/* Sourcing Promise note */}
            <div className="p-4 bg-spice-sand/50 rounded-2xl border border-spice-tan/50 flex items-center space-x-3 text-xs text-spice-brown/80">
              <ShieldCheck className="w-5 h-5 text-spice-green shrink-0" />
              <span>
                All spices are freshly packed upon order placement to retain natural essential oils and uncompromised fragrance.
              </span>
            </div>
          </div>

          {/* Order Summary & Coupon Sidebar */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 border border-spice-tan/60 shadow-sm space-y-5">
              <h3 className="font-serif font-bold text-lg text-spice-brown border-b border-spice-tan/40 pb-3">
                Order Summary
              </h3>

              {/* Coupon Box */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-spice-brown mb-1.5 flex items-center space-x-1">
                  <Tag className="w-3.5 h-3.5 text-spice-crimson" />
                  <span>Have a Promo Code?</span>
                </label>
                {coupon ? (
                  <div className="flex items-center justify-between p-2.5 bg-green-50 border border-green-200 rounded-xl text-xs text-green-800 font-semibold">
                    <div className="flex items-center space-x-1.5">
                      <Check className="w-4 h-4 text-green-600" />
                      <span>{coupon.code} applied (-₹{discount})</span>
                    </div>
                    <button
                      type="button"
                      onClick={removeCoupon}
                      className="text-red-600 hover:text-red-800 p-1"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <input
                      type="text"
                      value={couponInput}
                      onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                      placeholder="e.g. CHILIKA10"
                      className="w-full bg-spice-cream border border-spice-tan rounded-xl px-3 py-2 text-xs font-bold uppercase text-spice-brown focus:outline-none focus:border-spice-crimson"
                    />
                    <button
                      type="submit"
                      disabled={applying}
                      className="bg-spice-crimson text-white px-4 py-2 rounded-xl text-xs font-bold hover:bg-spice-deepRed transition-colors disabled:opacity-70"
                    >
                      {applying ? '...' : 'Apply'}
                    </button>
                  </form>
                )}
                {couponError && <p className="text-[11px] text-red-600 mt-1 font-medium">{couponError}</p>}
                {couponSuccess && <p className="text-[11px] text-green-600 mt-1 font-medium">{couponSuccess}</p>}
              </div>

              {/* Breakdown */}
              <div className="space-y-2.5 text-xs sm:text-sm border-t border-spice-tan/40 pt-4">
                <div className="flex justify-between text-spice-brown/80">
                  <span>Subtotal</span>
                  <span className="font-semibold text-spice-brown">₹{subtotal}</span>
                </div>
                <div className="flex justify-between text-spice-brown/80">
                  <span>Shipping Fee</span>
                  <span>
                    {shippingFee === 0 ? (
                      <span className="text-spice-green font-bold uppercase text-xs">FREE</span>
                    ) : (
                      `₹${shippingFee}`
                    )}
                  </span>
                </div>
                {subtotal < 499 && (
                  <p className="text-[11px] text-spice-turmeric font-medium">
                    Add ₹{499 - subtotal} more for Free Express Delivery!
                  </p>
                )}
                {discount > 0 && (
                  <div className="flex justify-between text-spice-green font-semibold">
                    <span>Discount</span>
                    <span>-₹{discount}</span>
                  </div>
                )}
                <div className="border-t border-spice-tan/50 pt-3 flex justify-between font-serif font-extrabold text-base sm:text-lg text-spice-brown">
                  <span>Total Amount</span>
                  <span className="text-spice-crimson">₹{finalTotal}</span>
                </div>
              </div>

              {/* Checkout Button */}
              <button
                type="button"
                onClick={handleProceedToCheckout}
                className="w-full flex items-center justify-center space-x-2 py-3.5 bg-spice-crimson hover:bg-spice-deepRed text-white rounded-2xl text-sm font-bold shadow-spice transition-all active:scale-95"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="text-center">
                <Link to="/shop" className="text-xs text-spice-brown/70 hover:text-spice-crimson underline">
                  ← Continue Shopping
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
