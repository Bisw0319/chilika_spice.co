import React, { useRef } from 'react';
import { Star, CheckCircle, ChevronLeft, ChevronRight, Quote } from 'lucide-react';

export const ReviewCarousel = ({ reviews = [], content = null }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (content && content.reviewsSectionActive === false) {
    return null;
  }

  const badge = content?.reviewsBadge || "Real Kitchen Experiences";
  const title = content?.reviewsTitle || "Words From Home Cooks";
  const subtitle = content?.reviewsSubtitle || "Honest feedback from households cooking everyday meals with Chilika Spices.";

  const displayReviews = (content?.customTestimonials && content.customTestimonials.length > 0)
    ? [
        ...content.customTestimonials.map((ct, i) => ({
          _id: `custom-${i}`,
          userName: ct.userName,
          rating: ct.rating || 5,
          comment: ct.comment,
          product: { name: ct.productName },
          isVerifiedPurchase: ct.isVerified !== false
        })),
        ...(reviews || [])
      ]
    : reviews;

  if (!displayReviews || displayReviews.length === 0) return null;

  return (
    <section className="py-12 sm:py-16 bg-spice-sand/40 border-b border-spice-tan/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
              {badge}
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown tracking-tight">
              {title}
            </h2>
            {subtitle && (
              <p className="text-xs sm:text-sm text-spice-brown/70 mt-1">
                {subtitle}
              </p>
            )}
          </div>
          <div className="flex items-center space-x-2">
            <span className="sm:hidden text-[11px] font-semibold text-spice-crimson">Swipe Reviews →</span>
            <div className="hidden sm:flex items-center space-x-2">
              <button
                type="button"
                onClick={() => scroll('left')}
                className="p-2 rounded-full border border-spice-tan bg-white hover:bg-spice-crimson hover:text-white transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                className="p-2 rounded-full border border-spice-tan bg-white hover:bg-spice-crimson hover:text-white transition-colors shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="flex space-x-4 sm:space-x-5 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-3"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {displayReviews.map((rev) => (
            <div
              key={rev._id}
              className="snap-start shrink-0 w-[82vw] max-w-[320px] sm:w-[48%] lg:w-[32%] bg-white rounded-2xl p-5 sm:p-6 border border-spice-tan/60 shadow-sm flex flex-col justify-between relative"
            >
              <Quote className="w-8 h-8 text-spice-turmeric/20 absolute top-4 right-4" />
              <div>
                {/* Rating */}
                <div className="flex items-center space-x-1 text-amber-500 mb-3">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < rev.rating ? 'fill-current' : 'text-gray-300'
                      }`}
                    />
                  ))}
                </div>

                {/* Review Text */}
                <p className="text-xs sm:text-sm text-spice-brown/80 italic leading-relaxed mb-4">
                  "{rev.comment}"
                </p>
              </div>

              {/* Author & Badge */}
              <div className="pt-3 border-t border-spice-tan/40 flex items-center justify-between">
                <div>
                  <p className="font-serif font-bold text-sm text-spice-brown">{rev.userName}</p>
                  {rev.product?.name && (
                    <p className="text-[10px] text-spice-brown/60 truncate max-w-[180px]">
                      Reviewed: {rev.product.name}
                    </p>
                  )}
                </div>
                {rev.isVerifiedPurchase && (
                  <span className="inline-flex items-center text-[10px] font-bold text-spice-green bg-green-50 px-2 py-0.5 rounded-full border border-green-200">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Verified
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
