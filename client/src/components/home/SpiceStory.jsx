import React from 'react';

const spices = [
  {
    name: 'Kandhamal Haldi (Turmeric)',
    role: 'The Golden Soul',
    description: 'Harvested from the lush hillsides of Odisha, known for its intense golden color, rich natural aroma, and earthy warmth in curries and lentils.',
    image: '/images/products/turmeric.jpg'
  },
  {
    name: 'Sun-Dried Red Chilli',
    role: 'Bold Warmth & Hue',
    description: 'Dried naturally under the sun and whole-pounded to deliver pure crimson color and fiery balanced heat without artificial coloring.',
    image: '/images/products/chilli.jpg'
  },
  {
    name: 'Slow-Roasted Jeera (Cumin)',
    role: 'Earthy Aroma',
    description: 'Cast-iron roasted whole cumin seeds releasing deep nutty fragrance, creating the essential foundation of everyday tadka.',
    image: '/images/products/cumin.jpg'
  },
  {
    name: 'Fragrant Dhania (Coriander)',
    role: 'Citrusy Freshness',
    description: 'Stone-ground whole plump seeds that bring gentle citrus sweetness and body to family gravies and rasam.',
    image: '/images/products/coriander.jpg'
  },
  {
    name: 'Odisha Panch Phoron',
    role: 'The Signature Five',
    description: 'Fennel, cumin, brown mustard, fenugreek, and nigella seeds combined in timeless harmony for authentic Eastern Indian tempering.',
    image: '/images/products/panch-phoron.jpg'
  },
  {
    name: 'Royal Garam Masala Spices',
    role: 'Festive Perfume',
    description: 'Cardamom pods, cinnamon quills, cloves, and mace hand-selected for fragrant curries and celebration feasts.',
    image: '/images/products/garam-masala.jpg'
  }
];

export const SpiceStory = () => {
  return (
    <section className="py-12 sm:py-16 bg-white border-y border-spice-tan/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1">
            Ingredient Showcase
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown tracking-tight">
            The Soul of Odisha's Spices
          </h2>
          <p className="text-xs sm:text-sm text-spice-brown/70 mt-2">
            Every spice in the Chilika family is selected whole, cleaned by hand, and ground with patience.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {spices.map((spice, idx) => (
            <div
              key={idx}
              className="group bg-spice-cream/60 rounded-2xl p-4 sm:p-5 border border-spice-tan/50 hover:border-spice-crimson/30 hover:shadow-warm transition-all duration-300 flex items-start space-x-4"
            >
              <div className="w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-white border border-spice-tan shadow-2xs">
                <img
                  src={spice.image}
                  alt={spice.name}
                  loading="lazy"
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] font-bold text-spice-turmeric uppercase tracking-wider block">
                  {spice.role}
                </span>
                <h3 className="font-serif font-bold text-sm sm:text-base text-spice-brown group-hover:text-spice-crimson transition-colors">
                  {spice.name}
                </h3>
                <p className="text-xs text-spice-brown/70 leading-relaxed">
                  {spice.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
