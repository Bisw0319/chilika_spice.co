import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Star, ArrowRight, ShoppingBag } from 'lucide-react';

export const PromoBanners = ({ content }) => {
  const newProduct = content?.newProductPromoBanner || {
    tag: "NEW PRODUCT LAUNCH",
    title: "Chilika Coastal Fish Curry Blend (Machha Besara)",
    subtitle: "Authentic coastal mustard and cumin tempering for timeless fish curries and village delicacies.",
    image: "/images/products/machha-besara.jpg",
    buttonText: "Shop New Arrival",
    buttonLink: "/shop?sort=newest",
    priceText: "Special Launch: ₹85",
    isActive: true
  };

  const bestSeller = content?.bestSellerPromoBanner || {
    tag: "TOP BEST SELLER",
    title: "Royal Aromatic Garam Masala",
    subtitle: "Over 1,200+ households love our heirloom 12-spice recipe hand-roasted on iron skillets.",
    image: "/images/products/garam-masala-bowl.jpg",
    buttonText: "Explore Best Seller",
    buttonLink: "/shop?sort=popular",
    priceText: "Customer Favourite: ₹95",
    isActive: true
  };

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-spice-cream relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
            Exclusive Showcases
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown tracking-tight">
            Handcrafted Spice Spotlight
          </h2>
          <p className="text-xs sm:text-sm text-spice-brown/70 mt-1">
            Discover our newest artisan creation and all-time household best seller
          </p>
        </div>

        {/* Mobile Swipe Cue */}
        <div className="flex lg:hidden items-center justify-between text-[11px] text-spice-brown/60 mb-2 px-1">
          <span>Featured Spotlight</span>
          <span className="font-semibold text-spice-crimson">Swipe →</span>
        </div>

        {/* 2 Big Banners: Horizontal Swipeable on Mobile, 2-Col Grid on Desktop */}
        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-2 lg:gap-8">
          
          {/* BANNER 1 — NEW PRODUCT PROMOTION */}
          {newProduct.isActive !== false && (
            <div className="w-[86vw] max-w-[380px] lg:w-auto snap-center shrink-0 lg:shrink group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#1E3A2F] via-[#14261F] to-[#0A1510] text-white p-6 sm:p-10 flex flex-col justify-between border border-emerald-900/40 shadow-xl transition-all duration-300 hover:shadow-2xl">
              {/* Subtle Ambient Glow */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Top Meta & Tag */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
                  <span>{newProduct.tag || "NEW PRODUCT LAUNCH"}</span>
                </span>
                {newProduct.priceText && (
                  <span className="text-xs sm:text-sm font-bold text-emerald-200/90 font-serif">
                    {newProduct.priceText}
                  </span>
                )}
              </div>

              {/* Main Content & Big Visual Showcase */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-6 sm:my-8">
                {/* Left: Text & Pitch */}
                <div className="sm:col-span-7 space-y-3 text-left">
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white leading-snug group-hover:text-emerald-200 transition-colors">
                    {newProduct.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-emerald-100/80 leading-relaxed">
                    {newProduct.subtitle}
                  </p>
                </div>

                {/* Right: Big Product Photo Tile */}
                <div className="sm:col-span-5 flex justify-center">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-black/40 border-2 border-emerald-400/30 shadow-2xl p-1 group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={newProduct.image || "/images/products/machha-besara.jpg"}
                      alt={newProduct.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Call To Action */}
              <div className="relative z-10 pt-2 border-t border-emerald-800/40 flex items-center justify-between">
                <Link
                  to={newProduct.buttonLink || "/shop"}
                  className="inline-flex items-center space-x-2 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{newProduct.buttonText || "Shop New Arrival"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-[11px] text-emerald-200/60 hidden sm:inline font-medium">
                  Village Harvested
                </span>
              </div>
            </div>
          )}

          {/* BANNER 2 — BEST SELLER ITEM PROMOTION */}
          {bestSeller.isActive !== false && (
            <div className="w-[86vw] max-w-[380px] lg:w-auto snap-center shrink-0 lg:shrink group relative rounded-3xl overflow-hidden bg-gradient-to-br from-[#38120B] via-[#240A06] to-[#120402] text-white p-6 sm:p-10 flex flex-col justify-between border border-amber-900/40 shadow-xl transition-all duration-300 hover:shadow-2xl">
              {/* Subtle Ambient Glow */}
              <div className="absolute -top-16 -right-16 w-64 h-64 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

              {/* Top Meta & Tag */}
              <div className="relative z-10 flex items-center justify-between gap-2">
                <span className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-400/30 text-[10px] sm:text-xs font-extrabold uppercase tracking-wider">
                  <Star className="w-3.5 h-3.5 text-amber-300 fill-current" />
                  <span>{bestSeller.tag || "TOP BEST SELLER"}</span>
                </span>
                {bestSeller.priceText && (
                  <span className="text-xs sm:text-sm font-bold text-amber-200/90 font-serif">
                    {bestSeller.priceText}
                  </span>
                )}
              </div>

              {/* Main Content & Big Visual Showcase */}
              <div className="relative z-10 grid grid-cols-1 sm:grid-cols-12 gap-6 items-center my-6 sm:my-8">
                {/* Left: Text & Pitch */}
                <div className="sm:col-span-7 space-y-3 text-left">
                  <h3 className="font-serif font-bold text-2xl sm:text-3xl text-white leading-snug group-hover:text-amber-200 transition-colors">
                    {bestSeller.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-amber-100/80 leading-relaxed">
                    {bestSeller.subtitle}
                  </p>
                </div>

                {/* Right: Big Product Photo Tile */}
                <div className="sm:col-span-5 flex justify-center">
                  <div className="relative w-40 h-40 sm:w-48 sm:h-48 rounded-2xl overflow-hidden bg-black/40 border-2 border-amber-400/30 shadow-2xl p-1 group-hover:scale-105 transition-transform duration-500">
                    <img
                      src={bestSeller.image || "/images/products/garam-masala-bowl.jpg"}
                      alt={bestSeller.title}
                      className="w-full h-full object-cover rounded-xl"
                    />
                  </div>
                </div>
              </div>

              {/* Bottom Call To Action */}
              <div className="relative z-10 pt-2 border-t border-amber-800/40 flex items-center justify-between">
                <Link
                  to={bestSeller.buttonLink || "/shop"}
                  className="inline-flex items-center space-x-2 bg-amber-400 hover:bg-amber-300 text-stone-950 font-bold px-6 py-3 rounded-xl text-xs sm:text-sm shadow-md transition-all active:scale-95"
                >
                  <ShoppingBag className="w-4 h-4" />
                  <span>{bestSeller.buttonText || "Explore Best Seller"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <span className="text-[11px] text-amber-200/60 hidden sm:inline font-medium">
                  Heirloom Recipe
                </span>
              </div>
            </div>
          )}

        </div>
      </div>
    </section>
  );
};

export default PromoBanners;
