import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Flame, Layers } from 'lucide-react';

const quickCategories = [
  {
    name: 'All Spices',
    link: '/shop',
    image: '/images/brand/chilika-logo.jpg',
    tag: 'Shop All'
  },
  {
    name: 'Pure Haldi',
    link: '/shop?search=Turmeric',
    image: '/images/products/turmeric.jpg',
    tag: 'High Curcumin'
  },
  {
    name: 'Lal Mirch',
    link: '/shop?search=Chilli',
    image: '/images/products/chilli.jpg',
    tag: 'Sun-Dried'
  },
  {
    name: 'Garam Masala',
    link: '/shop?search=Garam+Masala',
    image: '/images/products/garam-masala.jpg',
    tag: '12-Spices'
  },
  {
    name: 'Fish Besara',
    link: '/shop?search=Fish+Curry',
    image: '/images/products/machha-besara.jpg',
    tag: 'Chilika Special'
  },
  {
    name: 'Panch Phoron',
    link: '/shop?search=Panch+Phoron',
    image: '/images/products/panch-phoron.jpg',
    tag: '5-Seed Tadka'
  },
  {
    name: 'Masala Badi',
    link: '/shop?search=Badi',
    image: '/images/products/masala-badi-wa.jpg',
    tag: 'Homemade'
  },
  {
    name: 'Jeera Powder',
    link: '/shop?search=Jeera',
    image: '/images/products/cumin.jpg',
    tag: 'Roasted'
  }
];

export const MobileCategoryPills = () => {
  return (
    <div className="md:hidden bg-white border-b border-spice-tan/50 py-3 px-3 shadow-2xs">
      <div className="flex items-center space-x-3.5 overflow-x-auto no-scrollbar scroll-smooth">
        {quickCategories.map((cat, idx) => (
          <Link
            key={idx}
            to={cat.link}
            className="flex flex-col items-center shrink-0 group text-center active:scale-95 transition-transform"
          >
            <div className="relative w-14 h-14 rounded-2xl p-0.5 bg-gradient-to-tr from-spice-gold/40 via-spice-sand to-spice-crimson/30 shadow-2xs group-hover:shadow-md transition-shadow">
              <div className="w-full h-full rounded-2xl overflow-hidden bg-white">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                  loading="lazy"
                />
              </div>
            </div>
            <span className="text-[11px] font-bold text-spice-brown mt-1.5 whitespace-nowrap tracking-tight group-hover:text-spice-crimson">
              {cat.name}
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default MobileCategoryPills;
