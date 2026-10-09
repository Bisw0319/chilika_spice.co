import React from 'react';
import { Camera } from 'lucide-react';

const galleryItems = [
  {
    image: '/images/products/turmeric.jpg',
    caption: 'Pure sun-dried Kandhamal turmeric root grinding'
  },
  {
    image: '/images/brand/chilika-illustration.png',
    caption: 'Tradition meets daily cooking in Odisha homes'
  },
  {
    image: '/images/products/garam-masala.jpg',
    caption: 'Handpicked whole spices slow-roasted in iron kadai'
  },
  {
    image: '/images/products/chilli.jpg',
    caption: 'Fiery natural red chillies dried under village skies'
  },
  {
    image: '/images/products/panch-phoron.jpg',
    caption: 'The golden crackle of authentic panch phoron tadka'
  },
  {
    image: '/images/products/machha-besara.jpg',
    caption: 'Chilika mustard blend prepared for fresh coastal delicacies'
  }
];

export const SocialGallery = ({ content = null }) => {
  if (content && content.socialGalleryActive === false) {
    return null;
  }

  const handle = content?.socialGalleryHandle || "@chilikaspices";
  const url = content?.socialGalleryUrl || "https://instagram.com/chilikaspices";
  const title = content?.socialGalleryTitle || "Glimpses From Village & Kitchen";
  const subtitle = content?.socialGallerySubtitle || "Follow our journey from sun-baked spice mats to hearty everyday home cooking.";
  const items = (content?.socialGalleryItems && content.socialGalleryItems.length > 0)
    ? content.socialGalleryItems
    : galleryItems;

  return (
    <section className="py-12 sm:py-16 bg-white border-b border-spice-tan/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-10">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center space-x-1.5 text-spice-crimson hover:text-spice-deepRed text-xs font-bold uppercase tracking-widest mb-1 transition-colors group"
          >
            <Camera className="w-4 h-4 group-hover:scale-110 transition-transform" />
            <span>{handle}</span>
          </a>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown tracking-tight">
            {title}
          </h2>
          {subtitle && (
            <p className="text-xs sm:text-sm text-spice-brown/70 mt-1.5">
              {subtitle}
            </p>
          )}
        </div>

        {/* Mobile Swipe Cue */}
        <div className="flex sm:hidden items-center justify-between text-[11px] text-spice-brown/60 mb-2 px-1">
          <span>Village Moments</span>
          <span className="font-semibold text-spice-crimson">Swipe →</span>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-3 pb-2 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-3 lg:grid-cols-6 sm:gap-4">
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.link || url || '#'}
              target={item.link?.startsWith('http') ? '_blank' : '_self'}
              rel="noopener noreferrer"
              className="w-36 h-36 sm:w-auto sm:h-auto snap-start shrink-0 sm:shrink group relative rounded-2xl overflow-hidden aspect-square bg-spice-sand/50 border border-spice-tan/50 shadow-2xs block"
            >
              <img
                src={item.image}
                alt={item.caption}
                loading="lazy"
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-spice-charcoal/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3 text-center">
                <p className="text-[11px] text-white font-medium leading-snug">
                  {item.caption}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
};
