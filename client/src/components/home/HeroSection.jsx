import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, BookOpen, Sparkles, CheckCircle2 } from 'lucide-react';

export const HeroSection = ({ content }) => {
  const headline = content?.heroHeadline || "From village to your kitchen";
  const subheadline = content?.heroSubheadline || "Authentic spices inspired by the flavours, traditions and kitchens of Odisha.";
  const badgeText = content?.heroBadgeText || "Chilika Spice Co. • Odisha Heritage";
  const bannerImage = content?.heroBannerImage || "/images/brand/chilika-illustration.png";
  const buttonText = content?.heroButtonText || "Shop Spices";
  const buttonLink = content?.heroButtonLink || "/shop";

  return (
    <section className="relative bg-gradient-to-b from-spice-sand/50 via-spice-cream to-white overflow-hidden py-10 sm:py-16 lg:py-20 border-b border-spice-tan/40">
      {/* Decorative Warm Ambient Glow */}
      <div className="absolute top-0 right-0 -mr-20 -mt-20 w-80 h-80 rounded-full bg-spice-yellow/10 blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 -ml-20 -mb-20 w-80 h-80 rounded-full bg-spice-crimson/5 blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Storytelling & Action */}
          <div className="lg:col-span-7 text-center lg:text-left space-y-5 sm:space-y-6">
            {/* Heritage Badge */}
            <div className="inline-flex items-center space-x-2 bg-spice-crimson/10 border border-spice-crimson/20 px-3.5 py-1.5 rounded-full text-xs font-bold text-spice-crimson uppercase tracking-widest shadow-2xs">
              <Sparkles className="w-3.5 h-3.5 text-spice-turmeric" />
              <span>{badgeText}</span>
            </div>

            {/* Main Headline */}
            <h1 className="font-serif font-extrabold text-3xl sm:text-4xl md:text-5xl lg:text-6xl text-spice-brown leading-tight sm:leading-tight lg:leading-[1.15] tracking-tight">
              {headline}
            </h1>

            {/* Supporting Text */}
            <p className="text-sm sm:text-base md:text-lg text-spice-brown/80 leading-relaxed max-w-xl mx-auto lg:mx-0 font-normal">
              {subheadline} Handpicked seeds, low-heat stone grinding, and pure aroma preserved with traditional care.
            </p>

            {/* Verified Trust Badges */}
            <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4 pt-1 text-xs text-spice-brown/80 font-medium">
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-spice-green" />
                <span>100% Pure & Unadulterated</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-spice-green" />
                <span>Slow Stone-Ground</span>
              </span>
              <span className="flex items-center space-x-1.5">
                <CheckCircle2 className="w-4 h-4 text-spice-green" />
                <span>Aroma Preserved</span>
              </span>
            </div>

            {/* Call to Actions */}
            <div className="pt-2 flex flex-col sm:flex-row items-center justify-center lg:justify-start space-y-3 sm:space-y-0 sm:space-x-4">
              <Link
                to={buttonLink}
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-spice-crimson hover:bg-spice-deepRed text-white px-7 py-3.5 rounded-full text-sm font-bold shadow-spice-lg hover:shadow-spice transition-all active:scale-95"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{buttonText}</span>
              </Link>
              <Link
                to="/about"
                className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-spice-sand text-spice-brown border border-spice-tan px-7 py-3.5 rounded-full text-sm font-bold shadow-xs transition-colors"
              >
                <BookOpen className="w-4 h-4 text-spice-crimson" />
                <span>Explore Our Story</span>
              </Link>
            </div>
          </div>

          {/* Right Column: Brand Artwork Illustration */}
          <div className="lg:col-span-5 flex justify-center">
            <div className="relative w-full max-w-md lg:max-w-none">
              {/* Gold Ornament Frame */}
              <div className="absolute -inset-2 bg-gradient-to-r from-spice-turmeric/40 via-spice-gold/30 to-spice-crimson/30 rounded-3xl blur-md opacity-70" />
              <div className="relative rounded-2xl overflow-hidden bg-white p-2 border-2 border-spice-gold/60 shadow-xl">
                <img
                  src={bannerImage}
                  alt={headline}
                  className="w-full h-auto object-cover rounded-xl"
                />

                {/* Overlay Caption Pill */}
                <div className="absolute bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm p-2.5 rounded-xl border border-spice-tan shadow-md flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="veg-badge" />
                    <div>
                      <p className="text-[11px] font-bold text-spice-crimson uppercase tracking-wider">Traditional Recipe</p>
                      <p className="text-[10px] text-spice-brown/70">Stone-ground in Odisha villages</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-spice-yellow/30 text-spice-brown px-2 py-0.5 rounded-md">
                    Heritage
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
