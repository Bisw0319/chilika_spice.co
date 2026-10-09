import React from 'react';
import { Link } from 'react-router-dom';
import {
  Quote,
  Sparkles,
  ShieldCheck,
  Flame,
  Clock,
  ArrowRight,
  Leaf,
  CheckCircle2,
  ChefHat
} from 'lucide-react';

export const BrandStory = ({ content }) => {
  const customTitle = content?.brandStoryTitle;

  return (
    <section className="py-14 sm:py-20 lg:py-24 bg-gradient-to-b from-[#FFFBF5] via-[#FDEBD3]/40 to-[#FFFBF5] border-y border-[#EBDBC9]/60 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Top Header */}
        <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E57A22]/10 border border-[#E57A22]/25 text-[#A5470E] text-xs font-bold uppercase tracking-widest mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Origin Story</span>
          </div>
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#3D1A10] leading-tight">
            {customTitle || "From one kitchen in Odisha, to yours."}
          </h2>
          <p className="text-xs sm:text-sm text-[#6E4B3B] mt-2 leading-relaxed">
            Chilika Spices isn’t just about masalas—it’s about a vision to transform India’s relationship with its traditional foods.
          </p>
        </div>

        {/* 2-Column Grid: Left Visual & Founder / Right 3-Step Story Timeline */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Visual Artwork & Grandmother Quote */}
          <div className="lg:col-span-5 space-y-6">
            <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4A373]/40 shadow-xl bg-white p-2 sm:p-3 group">
              <img
                src="/images/brand/chilika-illustration.png"
                alt="Chilika Spices - Odia village spice grinding heritage"
                className="w-full h-auto object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
              />
            </div>

            {/* Grandmother's Inspiring Quote Card */}
            <div className="bg-[#5A0F17] rounded-2xl p-5 sm:p-6 text-white relative shadow-md">
              <Quote className="w-8 h-8 text-[#E57A22]/40 absolute top-3 right-4" />
              <blockquote className="font-serif text-sm sm:text-base text-[#FFECD4] leading-relaxed italic mb-2">
                "ଯେଉଁ ବାସ୍ନା ଆଉ ସ୍ୱାଦ ପାରମ୍ପରିକ ହାତବଟା ମସଲାରେ ଥାଏ, ତାହା କୌଣସି ମେସିନ୍‌ରେ ମିଳିପାରିବ ନାହିଁ।"
              </blockquote>
              <p className="text-xs text-[#FFD7BA]/80 italic">
                "The aroma and soul of traditional hand-ground spices can never be found in a factory machine."
              </p>
              <div className="mt-3 text-right">
                <span className="text-[11px] font-bold text-[#E57A22] uppercase tracking-wider block">
                  — Bou (Grandmother), Founding Inspiration
                </span>
              </div>
            </div>

            {/* Single Founder Note */}
            <div className="bg-white rounded-2xl p-4 border border-[#EBDBC9] shadow-2xs flex items-center space-x-3.5">
              <div className="w-12 h-12 rounded-full bg-[#8C271E] text-white flex items-center justify-center shrink-0 shadow-2xs font-serif font-bold text-base">
                <ChefHat className="w-6 h-6" />
              </div>
              <div>
                <h4 className="font-serif font-bold text-sm text-[#3D1A10]">Biswajit Baral</h4>
                <p className="text-[11px] text-[#8C271E] font-semibold">Founder & Master Blender</p>
                <p className="text-[11px] text-[#6E4B3B] mt-0.5 line-clamp-2">
                  "Born from a personal promise to bring pure village spices directly from Odisha to your kitchen."
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: 3-Milestone Story Timeline */}
          <div className="lg:col-span-7 space-y-5">
            
            {/* Step 1 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EBDBC9] shadow-sm hover:border-[#D4A373] transition-colors relative">
              <div className="flex items-center space-x-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-[#8C271E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  1
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#3D1A10] flex items-center space-x-1.5">
                  <Flame className="w-4 h-4 text-[#E57A22]" />
                  <span>The Spark of Curiosity</span>
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#5C3D2E] leading-relaxed pl-10">
                Observing commercial powdered masalas filled with synthetic enhancers in local markets, Biswajit wondered why packaged spices caused acute stomach burning and acidity. After falling ill from an adulterated curry powder, that sickness became a major turning point: Indian homes desperately needed clean, safe, and authentically stone-ground spices.
              </p>
            </div>

            {/* Step 2 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EBDBC9] shadow-sm hover:border-[#D4A373] transition-colors relative">
              <div className="flex items-center space-x-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-[#8C271E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  2
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#3D1A10] flex items-center space-x-1.5">
                  <Clock className="w-4 h-4 text-[#E57A22]" />
                  <span>A Widespread Problem</span>
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#5C3D2E] leading-relaxed pl-10">
                Commercial brands were stripping natural volatile essential oils to sell them separately to perfume industries, replacing authentic aroma with starch and synthetic fragrance. Regional treasures like Odisha's Machha Besara, royal Garam Masala, and raw Turmeric were degraded by industrial pulverizers. This was a nationwide crisis across Indian kitchens.
              </p>
            </div>

            {/* Step 3 */}
            <div className="bg-white rounded-2xl p-5 sm:p-6 border border-[#EBDBC9] shadow-sm hover:border-[#D4A373] transition-colors relative">
              <div className="flex items-center space-x-3 mb-2">
                <span className="w-7 h-7 rounded-full bg-[#8C271E] text-white flex items-center justify-center text-xs font-bold shrink-0">
                  3
                </span>
                <h3 className="font-serif font-bold text-base sm:text-lg text-[#3D1A10] flex items-center space-x-1.5">
                  <Sparkles className="w-4 h-4 text-[#E57A22]" />
                  <span>The Birth of a Movement</span>
                </h3>
              </div>
              <p className="text-xs sm:text-sm text-[#5C3D2E] leading-relaxed pl-10">
                That’s how <strong className="text-[#3D1A10]">Chilika Spices</strong> was born near the serene coastal waters of Chilika Lake, Odisha. Sourcing whole spices directly from rural farmers, slow-roasting on iron skillets, and slow-grinding to lock in 100% natural essential oils. Delivering pure, unadulterated heritage spices all year round.
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to="/about"
                className="inline-flex items-center space-x-2 bg-[#8C271E] hover:bg-[#6D1A12] text-white text-xs sm:text-sm font-bold px-6 py-3 rounded-full shadow-md transition-all active:scale-95"
              >
                <span>Read Full Origin Story</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                to="/shop"
                className="inline-flex items-center space-x-1 text-xs sm:text-sm font-bold text-[#8C271E] hover:text-[#5A0F17] underline underline-offset-4"
              >
                <span>Taste what we grew up on →</span>
              </Link>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default BrandStory;
