import React from 'react';

export const ProductCardSkeleton = () => {
  return (
    <div className="bg-white rounded-2xl border border-spice-tan/40 p-3.5 sm:p-4 flex flex-col justify-between shadow-xs animate-pulse text-left overflow-hidden">
      {/* Media Skeleton */}
      <div className="relative aspect-square rounded-xl bg-gradient-to-br from-spice-sand/60 via-spice-sand/40 to-spice-sand/70 overflow-hidden mb-3">
        {/* Shimmer sweep */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent animate-shimmer" />

        {/* Top Badges Skeleton */}
        <div className="absolute top-2 left-2 flex items-center space-x-1.5">
          <div className="w-4 h-4 rounded bg-black/10" />
          <div className="w-12 h-4 rounded-full bg-black/10" />
        </div>

        {/* Wishlist Button Skeleton */}
        <div className="absolute top-2 right-2 w-7 h-7 rounded-full bg-white/70" />
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 flex flex-col justify-between space-y-3">
        <div>
          {/* Rating Line */}
          <div className="flex items-center space-x-2 mb-2">
            <div className="h-3.5 w-12 bg-spice-sand/70 rounded" />
            <div className="h-3 w-8 bg-spice-sand/40 rounded" />
            <div className="h-3 w-14 bg-spice-sand/40 rounded ml-auto" />
          </div>

          {/* Title Line */}
          <div className="h-4 sm:h-5 bg-spice-sand/80 rounded-md w-4/5 mb-2" />

          {/* Description Lines */}
          <div className="space-y-1.5 mb-3">
            <div className="h-3 bg-spice-sand/50 rounded w-full" />
            <div className="h-3 bg-spice-sand/40 rounded w-3/5" />
          </div>

          {/* Size Pills */}
          <div className="flex items-center space-x-1.5 mb-3">
            <div className="h-5 w-10 bg-spice-sand/60 rounded-md" />
            <div className="h-5 w-10 bg-spice-sand/40 rounded-md" />
            <div className="h-5 w-10 bg-spice-sand/40 rounded-md" />
          </div>

          {/* Price */}
          <div className="flex items-baseline space-x-2">
            <div className="h-5 sm:h-6 w-16 bg-spice-sand/80 rounded" />
            <div className="h-3.5 w-10 bg-spice-sand/40 rounded" />
          </div>
        </div>

        {/* Bottom Buttons */}
        <div className="grid grid-cols-2 gap-2 pt-1">
          <div className="h-8 rounded-xl bg-spice-sand/60" />
          <div className="h-8 rounded-xl bg-spice-sand/80" />
        </div>
      </div>
    </div>
  );
};

export default ProductCardSkeleton;
