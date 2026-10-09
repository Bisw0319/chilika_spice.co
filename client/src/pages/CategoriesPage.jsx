import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export const CategoriesPage = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCats = async () => {
      try {
        const res = await api.getCategories();
        if (res.success) setCategories(res.categories);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchCats();
  }, []);

  return (
    <div className="min-h-screen bg-spice-cream py-8 sm:py-14">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-10">
          <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
            Odisha Spice Heritage
          </span>
          <h1 className="font-serif font-bold text-3xl sm:text-4xl text-spice-brown tracking-tight">
            Spice Categories
          </h1>
          <p className="text-xs sm:text-sm text-spice-brown/70 mt-2">
            Explore our curated collections — from sun-dried single spices to celebrated secret family masala blends.
          </p>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="bg-white rounded-2xl h-64 animate-pulse border border-spice-tan" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((cat) => (
              <Link
                key={cat._id}
                to={`/shop?category=${cat.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-spice-tan/60 shadow-sm hover:shadow-spice transition-all duration-300 flex flex-col justify-between"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-spice-sand/30">
                  <img
                    src={cat.image || '/images/categories/ground-spices.jpg'}
                    alt={cat.name}
                    className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <h3 className="font-serif font-bold text-lg sm:text-xl">{cat.name}</h3>
                  </div>
                </div>
                <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                  <p className="text-xs sm:text-sm text-spice-brown/75 leading-relaxed">
                    {cat.description}
                  </p>
                  <span className="inline-flex items-center space-x-1 text-xs font-bold text-spice-crimson group-hover:translate-x-1 transition-transform">
                    <span>View All Spices</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
