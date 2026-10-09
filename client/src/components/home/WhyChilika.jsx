import React from 'react';
import { Flame, ShieldCheck, UtensilsCrossed, TreePine } from 'lucide-react';

const pillars = [
  {
    icon: Flame,
    title: 'Traditional Flavour',
    description: 'Slow-pounded and stone-ground at low temperatures to ensure the vital spice oils and signature pungency never evaporate.'
  },
  {
    icon: ShieldCheck,
    title: 'Carefully Selected',
    description: 'Each seed, pod, and root is hand-inspected for ripeness, aroma, and clean purity before entering the processing batch.'
  },
  {
    icon: UtensilsCrossed,
    title: 'Made For Everyday Cooking',
    description: 'Balanced flavours formulated for daily home kitchens — from comforting morning dalma to festive Sunday family feasts.'
  },
  {
    icon: TreePine,
    title: 'From Village To Kitchen',
    description: 'Direct relationships with farming communities around Chilika and Odisha hinterlands, packed with care and hygiene.'
  }
];

const defaultIcons = [Flame, ShieldCheck, UtensilsCrossed, TreePine];

export const WhyChilika = ({ content }) => {
  if (content && content.whyChilikaActive === false) {
    return null;
  }

  const badge = content?.whyChilikaBadge || "The Chilika Difference";
  const title = content?.whyChilikaTitle || "Why Cooks Choose Chilika Spices";
  const subtitle = content?.whyChilikaSubtitle || "No synthetic fillers. No artificial food colours. Just honest spices from Odisha's agricultural soil.";

  const items = (content?.whyChilikaItems && content.whyChilikaItems.length > 0)
    ? content.whyChilikaItems
    : pillars;

  return (
    <section className="py-12 sm:py-16 bg-white border-y border-spice-tan/40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-12">
          <span className="text-xs font-bold text-spice-turmeric uppercase tracking-widest block mb-1.5">
            {badge}
          </span>
          <h2 className="font-serif font-bold text-2xl sm:text-3xl text-spice-brown tracking-tight">
            {title}
          </h2>
          <p className="text-xs sm:text-sm text-spice-brown/70 mt-2">
            {subtitle}
          </p>
        </div>

        {/* Mobile Swipe Cue */}
        <div className="flex sm:hidden items-center justify-between text-[11px] text-spice-brown/60 mb-2 px-1">
          <span>Our Heritage Pillars</span>
          <span className="font-semibold text-spice-crimson">Swipe →</span>
        </div>

        <div className="flex overflow-x-auto snap-x snap-mandatory no-scrollbar gap-4 pb-3 -mx-4 px-4 sm:mx-0 sm:px-0 sm:grid sm:grid-cols-2 lg:grid-cols-4 sm:gap-6">
          {items.map((pillar, idx) => {
            const Icon = pillar.icon || defaultIcons[idx % defaultIcons.length];
            return (
              <div
                key={idx}
                className="w-[74vw] max-w-[280px] sm:w-auto snap-start shrink-0 sm:shrink group relative bg-spice-cream rounded-2xl p-5 sm:p-6 border border-spice-tan/50 hover:border-spice-crimson/30 hover:shadow-warm transition-all duration-300 text-left flex flex-col justify-between"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-white border border-spice-tan text-spice-crimson flex items-center justify-center mb-4 mx-auto sm:mx-0 shadow-2xs group-hover:bg-spice-crimson group-hover:text-white transition-colors duration-300">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-serif font-bold text-base text-spice-brown mb-2 group-hover:text-spice-crimson transition-colors">
                    {pillar.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-spice-brown/70 leading-relaxed">
                    {pillar.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-spice-tan/30 flex items-center text-[11px] font-bold text-spice-turmeric uppercase tracking-wider">
                  <span>Chilika Standard</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
