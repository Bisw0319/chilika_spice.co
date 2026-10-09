import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, PackageCheck, Flame } from 'lucide-react';

const trustItems = [
  { icon: Flame, text: 'Authentic Flavours' },
  { icon: ShieldCheck, text: 'Carefully Selected Spices' },
  { icon: Sparkles, text: 'Traditional Taste' },
  { icon: PackageCheck, text: 'Packed With Care' },
  { icon: HeartHandshake, text: 'From Village To Kitchen' }
];

export const TrustStrip = () => {
  return (
    <div className="bg-spice-sand/70 border-y border-spice-tan/50 py-3.5 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop grid */}
        <div className="hidden md:flex items-center justify-between divide-x divide-spice-tan/60">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center justify-center space-x-2.5 px-4 flex-1 first:pl-0 last:pr-0">
                <div className="p-1.5 rounded-full bg-spice-cream text-spice-crimson shadow-xs border border-spice-tan/40">
                  <Icon className="w-4 h-4" />
                </div>
                <span className="font-serif font-semibold text-xs text-spice-brown tracking-wide uppercase">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>

        {/* Mobile horizontal scroll / marquee */}
        <div className="flex md:hidden items-center space-x-6 overflow-x-auto no-scrollbar py-1">
          {trustItems.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="flex items-center space-x-2 shrink-0">
                <div className="p-1 rounded-full bg-spice-cream text-spice-crimson border border-spice-tan/40">
                  <Icon className="w-3.5 h-3.5" />
                </div>
                <span className="font-serif font-semibold text-xs text-spice-brown whitespace-nowrap tracking-wide">
                  {item.text}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
