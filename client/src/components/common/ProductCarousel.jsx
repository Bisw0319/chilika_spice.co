import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { ProductCard } from './ProductCard';

export const ProductCarousel = ({ title, subtitle, products = [], viewAllLink = '/shop' }) => {
  const scrollRef = useRef(null);

  const scroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -320 : 320;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  if (!products || products.length === 0) return null;

  return (
    <section className="py-8 sm:py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Title & Desktop Navigation Arrows */}
        <div className="flex items-end justify-between mb-5 sm:mb-7">
          <div>
            {subtitle && (
              <p className="text-xs font-bold text-spice-turmeric uppercase tracking-widest mb-1">
                {subtitle}
              </p>
            )}
            <h2 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-spice-brown tracking-tight">
              {title}
            </h2>
          </div>

          <div className="flex items-center space-x-2">
            {viewAllLink && (
              <a
                href={viewAllLink}
                className="text-xs sm:text-sm font-bold text-spice-crimson hover:underline mr-2"
              >
                View All →
              </a>
            )}
            {/* Desktop Left/Right Navigation Arrows */}
            <div className="hidden sm:flex items-center space-x-1.5">
              <button
                type="button"
                onClick={() => scroll('left')}
                aria-label="Scroll left"
                className="p-2 rounded-full border border-spice-tan/80 bg-white text-spice-brown hover:bg-spice-crimson hover:text-white transition-colors shadow-2xs"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => scroll('right')}
                aria-label="Scroll right"
                className="p-2 rounded-full border border-spice-tan/80 bg-white text-spice-brown hover:bg-spice-crimson hover:text-white transition-colors shadow-2xs"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Carousel Scroll Container
            Mobile: shows ~1.3 cards, smooth snap
            Desktop: shows 4 cards with smooth scroll
        */}
        <div
          ref={scrollRef}
          className="flex space-x-3.5 sm:space-x-5 overflow-x-auto no-scrollbar scroll-smooth snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-3"
          style={{ scrollSnapType: 'x mandatory' }}
        >
          {products.map((product) => (
            <div
              key={product._id}
              className="snap-start shrink-0 w-[78%] xs:w-[72%] sm:w-[45%] md:w-[31%] lg:w-[23.5%]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
