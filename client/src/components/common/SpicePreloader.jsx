import React, { useState, useEffect } from 'react';

const spices = [
  {
    name: 'Kandhamal Haldi',
    image: '/images/products/turmeric.jpg',
    glow: 'rgba(230, 138, 0, 0.45)'
  },
  {
    name: 'Odia Lal Mirch',
    image: '/images/products/chilli.jpg',
    glow: 'rgba(153, 27, 30, 0.45)'
  },
  {
    name: 'Garam Masala',
    image: '/images/products/garam-masala-bowl.jpg',
    glow: 'rgba(201, 151, 0, 0.5)'
  },
  {
    name: 'Bhuna Jeera',
    image: '/images/products/cumin.jpg',
    glow: 'rgba(217, 119, 6, 0.45)'
  },
  {
    name: 'Panch Phoron',
    image: '/images/products/panch-phoron.jpg',
    glow: 'rgba(22, 163, 74, 0.4)'
  }
];

export const SpicePreloader = ({ onFinish }) => {
  // 'right' (starts offscreen to the right)
  // 'center' (settles in center for 2 seconds)
  // 'left' (speedily dashes off to the left)
  const [stage, setStage] = useState('right');
  const [isOverlayFading, setIsOverlayFading] = useState(false);
  const [mounted, setMounted] = useState(true);

  useEffect(() => {
    // Disable background scroll during intro animation
    document.body.style.overflow = 'hidden';

    // 1. Masalas smoothly glide in from right to center
    const enterTimer = setTimeout(() => {
      setStage('center');
    }, 50);

    // 2. Stay in center for 2 seconds
    // 50ms + 750ms entrance + 2000ms stay = 2800ms
    const exitTimer = setTimeout(() => {
      setStage('left');
    }, 2800);

    // 3. Immediately after speedy move to left, fade out the overlay
    const fadeTimer = setTimeout(() => {
      setIsOverlayFading(true);
    }, 3180);

    // 4. Completely unmount and reveal the site
    const unmountTimer = setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = '';
      if (onFinish) onFinish();
    }, 3550);

    return () => {
      clearTimeout(enterTimer);
      clearTimeout(exitTimer);
      clearTimeout(fadeTimer);
      clearTimeout(unmountTimer);
      document.body.style.overflow = '';
    };
  }, [onFinish]);

  const handleInstantOpen = () => {
    setStage('left');
    setIsOverlayFading(true);
    setTimeout(() => {
      setMounted(false);
      document.body.style.overflow = '';
      if (onFinish) onFinish();
    }, 200);
  };

  if (!mounted) return null;

  // Transform and transition configurations for the masalas row
  const rowStyle = {
    transform:
      stage === 'right'
        ? 'translateX(100vw)'
        : stage === 'center'
        ? 'translateX(0)'
        : 'translateX(-120vw)',
    opacity: stage === 'right' ? 0 : 1,
    transition:
      stage === 'right'
        ? 'none'
        : stage === 'center'
        ? 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.4s ease-out'
        : 'transform 0.38s cubic-bezier(0.65, 0, 0.9, 0.3), opacity 0.3s ease-in'
  };

  const textStyle = {
    opacity: stage === 'center' ? 1 : 0,
    transform:
      stage === 'right'
        ? 'translateY(16px)'
        : stage === 'center'
        ? 'translateY(0)'
        : 'translateX(-50px)',
    transition:
      stage === 'left'
        ? 'transform 0.32s ease-in, opacity 0.25s ease-in'
        : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.5s ease-out'
  };

  return (
    <div
      onClick={handleInstantOpen}
      className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-[#12100E] select-none cursor-pointer transition-opacity duration-400 ease-out ${
        isOverlayFading ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Main Center Container */}
      <div className="relative z-10 flex flex-col items-center px-4 max-w-5xl w-full text-center">
        
        {/* Square Masalas in a Horizontal Row */}
        <div
          style={rowStyle}
          className="flex items-center justify-center gap-3 sm:gap-4 md:gap-5 py-2 will-change-transform"
        >
          {spices.map((spice, idx) => (
            <div
              key={idx}
              className="relative w-14 h-14 sm:w-20 sm:h-20 md:w-24 md:h-24 aspect-square rounded-xl sm:rounded-2xl p-0.5 bg-white/5 border border-white/15 shadow-md flex-shrink-0"
            >
              <div className="w-full h-full rounded-[10px] sm:rounded-xl overflow-hidden bg-black/60">
                <img
                  src={spice.image}
                  alt={spice.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          ))}
        </div>

        {/* Welcome Text Section Underneath */}
        <div style={textStyle} className="mt-6 sm:mt-8 will-change-transform">
          <h1 className="font-serif font-medium text-xl sm:text-3xl md:text-4xl text-stone-200 tracking-wide">
            Welcome to Chilika Spices
          </h1>
        </div>

      </div>
    </div>
  );
};
