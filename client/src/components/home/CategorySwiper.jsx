import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const CategorySwiper = ({ categories = [] }) => {
  if (!categories || categories.length === 0) return null;

  return (
    <section className="py-8 sm:py-12 bg-spice-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-6">
          <div>
            <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
              Explore The Pantry
            </span>
            <h2 className="font-serif font-bold text-xl sm:text-2xl lg:text-3xl text-spice-brown tracking-tight">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/categories"
            className="text-xs sm:text-sm font-bold text-spice-crimson hover:underline flex items-center space-x-1"
          >
            <span>All Categories</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Carousel / Swiper on Mobile, Grid on Desktop */}
        <div className="flex sm:grid sm:grid-cols-2 lg:grid-cols-4 gap-4 overflow-x-auto no-scrollbar snap-x snap-mandatory -mx-4 px-4 sm:mx-0 sm:px-0 pb-2">
          {categories.map((cat) => (
            <Link
              key={cat._id}
              to={`/shop?category=${cat.slug}`}
              className="snap-start shrink-0 w-[65%] xs:w-[58%] sm:w-auto group relative rounded-2xl overflow-hidden bg-white border border-spice-tan/60 shadow-sm hover:shadow-spice transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-spice-sand/40">
                <img
                  src={cat.image || '/images/categories/ground-spices.jpg'}
                  alt={cat.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-spice-charcoal/80 via-spice-charcoal/20 to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <h3 className="font-serif font-bold text-base sm:text-lg drop-shadow-xs">
                    {cat.name}
                  </h3>
                  <span className="text-[11px] text-spice-yellow font-medium flex items-center space-x-1 mt-0.5">
                    <span>Explore blends</span>
                    <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
              <div className="p-3 bg-white flex-1 flex flex-col justify-between">
                <p className="text-xs text-spice-brown/70 line-clamp-2">
                  {cat.description || 'Authentic stone ground fresh spices.'}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
