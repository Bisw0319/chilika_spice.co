import React from 'react';
import { Link } from 'react-router-dom';
import {
  Sparkles,
  ShieldCheck,
  Award,
  Heart,
  TreePine,
  Flame,
  CheckCircle2,
  ArrowRight,
  ShoppingBag,
  Leaf,
  Clock,
  Quote,
  ChefHat,
  UserCheck
} from 'lucide-react';
import { useContent } from '../context/ContentContext';

export const AboutPage = () => {
  const { content } = useContent();

  // Dynamic values with authentic fallbacks
  const heroBadge = content?.aboutHeroBadge || "Our Story";
  const heroTitle = content?.aboutHeroTitle || "From one kitchen in Odisha, to yours.";
  const heroPara1 = content?.aboutHeroParagraph1 || "Chilika Spices isn’t just about masalas—it’s about a vision to transform India’s relationship with its traditional foods.";
  const heroPara2 = content?.aboutHeroParagraph2 || "At the heart of this vision was a passionate dreamer from Odisha, Biswajit, who believed that authentic heritage spices should reach every household pure and unadulterated. He wasn’t backed by wealth or corporate investors—what he had was curiosity, deep love for the timeless flavours of Odisha, and the courage to solve a problem that market commercial brands ignored.";
  const heroImage = content?.aboutHeroImage || "/images/brand/chilika-illustration.png";
  const heroCaption = content?.aboutHeroImageCaption || "Rooted in Chilika’s coastal breezes & centuries-old stone mortars";

  const step1Title = content?.aboutTimelineStep1Title || "The Spark of Curiosity";
  const step1Text = content?.aboutTimelineStep1Text || "One day, while exploring local village spice markets, Biswajit observed commercial packet masalas packed with synthetic dyes and artificial enhancers. Curious about why modern curries caused chronic acidity and stomach burning while food in grandmother's village kitchen was healing and gentle, he asked elders. Soon after, falling ill from a batch of adulterated commercial curry powder was his turning point. That illness made him realize how dangerous unhygienic, chemically extracted spices could be, and how badly families needed clean, safe, and authentically stone-ground traditional spices.";

  const step2Title = content?.aboutTimelineStep2Title || "A Widespread Problem";
  const step2Text = content?.aboutTimelineStep2Text || "A year later, during festive gatherings in Odisha, Biswajit inspected store-bought spices. The aroma was hollow, and the prices were high. Commercial factories were stripping the natural volatile essential oils to sell them separately to fragrance companies, replacing genuine pungency with cheap fillers, starch, and synthetic aroma. Beloved regional staples—like royal heirloom Garam Masala, coastal Fish Curry Blend (Machha Besara), raw Kandhamal Turmeric, and slow-roasted Panch Phoron—were either adulterated on the shelves, overpriced under exotic organic tags, or ruined by high-speed industrial pulverizers. He realized this wasn’t an isolated problem—it was a nationwide challenge across every Indian kitchen.";

  const step3Title = content?.aboutTimelineStep3Title || "The Birth of a Movement";
  const step3Text = content?.aboutTimelineStep3Text || "That’s how Chilika Spices was born—not in a corporate boardroom, but from an uncompromising personal promise rooted near the serene coastal waters and fertile soils of Chilika Lake, Odisha. Sourcing directly from rural farmers, sun-drying whole spices on clean woven mats, slow-roasting on iron skillets, and slow-grinding to lock in 100% natural essential oils. His vision was clear: deliver premium quality, unadulterated spices at fair prices, available year-round across India. Chilika Spices became more than a brand—it became a movement to bring back India’s traditional flavours in a modern, healthy way.";

  const quoteOdia = content?.founderQuoteOdia || "ଯେଉଁ ବାସ୍ନା ଆଉ ସ୍ୱାଦ ପାରମ୍ପରିକ ହାତବଟା ମସଲାରେ ଥାଏ, ତାହା କୌଣସି ଫ୍ୟାକ୍ଟ୍ରି ମେସିନ୍‌ ଦେଇପାରିବ ନାହିଁ। ନିର୍ମଳ ମସଲା ଆଉ ଭଲପାଇବା ହିଁ ଅସଲ ସ୍ୱାଦ।";
  const quoteEnglish = content?.founderQuoteEnglish || "The aroma and soul that comes from traditional hand-roasted and stone-ground spices can never be found in a factory machine. Pure spices and patience are the secret ingredients.";
  const quoteAuthor = content?.founderQuoteAuthor || "— Bou (Grandmother), Founding Inspiration";

  const founderName = content?.founderName || "Biswajit Baral";
  const founderTitle = content?.founderTitle || "Founder & Master Blender";
  const founderBio = content?.founderBio || "Growing up in Odisha, I watched grandma hand-pound whole spices on heavy stone mortars. Chilika Spices is my humble promise to safeguard that dying art, connect village farmers directly with food lovers, and bring honest, pure flavours to every home in India.";
  const founderImage = content?.founderImage || "/images/brand/founder.jpg";
  const founderBadge = content?.founderBadge || "Small-Batch Artisanal Milling";

  return (
    <div className="min-h-screen bg-[#FFFBF5] text-[#2D1B11]">
      
      {/* 1. HERO / OUR STORY LEAD */}
      <section className="py-12 sm:py-16 lg:py-20 border-b border-[#EBDBC9]/60">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            
            {/* Left Narrative */}
            <div className="lg:col-span-7 space-y-5 text-left">
              <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-[#E57A22]/10 border border-[#E57A22]/25 text-[#A5470E] text-xs font-bold uppercase tracking-widest">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{heroBadge}</span>
              </div>

              <h1 className="font-serif font-bold text-3xl sm:text-4xl lg:text-5xl text-[#3D1A10] leading-tight">
                {heroTitle}
              </h1>

              <p className="text-sm sm:text-base text-[#5C3D2E] leading-relaxed">
                {heroPara1}
              </p>

              <p className="text-xs sm:text-sm text-[#6E4B3B] leading-relaxed">
                {heroPara2}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-amber-900/10 border border-amber-600/30 text-amber-900 text-xs font-bold">
                  <Leaf className="w-4 h-4 text-amber-700" />
                  <span>100% Cold-Pounded Heritage</span>
                </div>
                <div className="inline-flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-orange-900/10 border border-orange-600/30 text-orange-900 text-xs font-bold">
                  <Sparkles className="w-4 h-4 text-orange-700" />
                  <span>Authentic Odia Recipes</span>
                </div>
              </div>
            </div>

            {/* Right Illustration Artwork */}
            <div className="lg:col-span-5">
              <div className="relative rounded-3xl overflow-hidden border-2 border-[#D4A373]/40 shadow-xl bg-white p-2.5 sm:p-3 group">
                <img
                  src={heroImage}
                  alt={heroTitle}
                  className="w-full h-auto object-cover rounded-2xl group-hover:scale-[1.02] transition-transform duration-500"
                />
                {heroCaption && (
                  <div className="absolute bottom-5 left-5 right-5 p-3 rounded-xl bg-white/95 backdrop-blur-md border border-[#D4A373]/30 shadow-md text-center">
                    <p className="font-serif italic text-xs text-[#8C271E] font-bold">
                      "{heroCaption}"
                    </p>
                  </div>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. THE STORY TIMELINE */}
      <section className="py-14 sm:py-20 bg-[#FDEBD3] border-b border-[#EBDBC9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center space-y-2 mb-12 sm:mb-16">
            <span className="text-xs font-bold text-[#A5470E] uppercase tracking-widest block">
              The Genesis
            </span>
            <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#5A0F17] tracking-tight">
              The Story
            </h2>
            <div className="w-16 h-1 bg-[#8C271E] mx-auto rounded-full mt-2" />
          </div>

          <div className="relative">
            {/* Timeline Vertical Rail */}
            <div className="hidden sm:block absolute left-8 top-4 bottom-4 w-0.5 border-l-2 border-dashed border-[#C9B8A6]" />

            <div className="space-y-10 sm:space-y-14">
              
              {/* STEP 1 */}
              <div className="relative sm:pl-20">
                <div className="hidden sm:flex absolute left-5 top-1.5 w-6 h-6 rounded-full bg-[#5A0F17] text-white items-center justify-center text-xs font-bold shadow-md -translate-x-1/2">
                  1
                </div>
                <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-[#E6D2BF] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2 text-[#8C271E] font-serif font-bold text-lg sm:text-xl mb-3">
                    <Flame className="w-5 h-5 text-[#E57A22]" />
                    <h3>{step1Title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4A3225] leading-relaxed">
                    {step1Text}
                  </p>
                </div>
              </div>

              {/* STEP 2 */}
              <div className="relative sm:pl-20">
                <div className="hidden sm:flex absolute left-5 top-1.5 w-6 h-6 rounded-full bg-[#5A0F17] text-white items-center justify-center text-xs font-bold shadow-md -translate-x-1/2">
                  2
                </div>
                <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-[#E6D2BF] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2 text-[#8C271E] font-serif font-bold text-lg sm:text-xl mb-3">
                    <Clock className="w-5 h-5 text-[#E57A22]" />
                    <h3>{step2Title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4A3225] leading-relaxed">
                    {step2Text}
                  </p>
                </div>
              </div>

              {/* STEP 3 */}
              <div className="relative sm:pl-20">
                <div className="hidden sm:flex absolute left-5 top-1.5 w-6 h-6 rounded-full bg-[#5A0F17] text-white items-center justify-center text-xs font-bold shadow-md -translate-x-1/2">
                  3
                </div>
                <div className="bg-white/90 rounded-2xl p-6 sm:p-8 border border-[#E6D2BF] shadow-sm hover:shadow-md transition-shadow">
                  <div className="flex items-center space-x-2 text-[#8C271E] font-serif font-bold text-lg sm:text-xl mb-3">
                    <Sparkles className="w-5 h-5 text-[#E57A22]" />
                    <h3>{step3Title}</h3>
                  </div>
                  <p className="text-xs sm:text-sm text-[#4A3225] leading-relaxed">
                    {step3Text}
                  </p>
                </div>
              </div>

            </div>
          </div>

        </div>
      </section>

      {/* 3. CORE PILLARS */}
      <section className="py-14 sm:py-20 border-b border-[#EBDBC9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-2xl mx-auto mb-12 sm:mb-16">
            <span className="text-xs font-bold text-[#A5470E] uppercase tracking-widest block mb-1">
              Guiding Principles
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl lg:text-4xl text-[#3D1A10]">
              What Makes Us Different
            </h2>
            <p className="text-xs sm:text-sm text-[#6E4B3B] mt-1">
              Uncompromising standards from farm harvesting to your spice jar
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            
            <div className="bg-white rounded-2xl p-6 border border-[#EBDBC9] shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-[#C96E12] flex items-center justify-center mb-4">
                <Leaf className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#3D1A10] mb-2">Honest Ingredients</h3>
              <p className="text-xs text-[#6E4B3B] leading-relaxed">
                Sourced directly from local farmers in the fertile soils of coastal Odisha. No shortcuts, zero synthetic additives.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EBDBC9] shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-[#A5470E] flex items-center justify-center mb-4">
                <ChefHat className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#3D1A10] mb-2">Made by Hand & Stone</h3>
              <p className="text-xs text-[#6E4B3B] leading-relaxed">
                Industrial pulverizers burn delicate aroma. We slow-grind at low temperatures to lock in volatile therapeutic oils.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EBDBC9] shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-red-50 text-[#8C271E] flex items-center justify-center mb-4">
                <Heart className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#3D1A10] mb-2">Rooted in Home</h3>
              <p className="text-xs text-[#6E4B3B] leading-relaxed">
                Every pinch should feel like returning to your ancestral village courtyard and grandmother's clay hearth.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#EBDBC9] shadow-sm hover:-translate-y-1 transition-transform">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-4">
                <TreePine className="w-6 h-6" />
              </div>
              <h3 className="font-serif font-bold text-base text-[#3D1A10] mb-2">Lighter on Land</h3>
              <p className="text-xs text-[#6E4B3B] leading-relaxed">
                Eco-conscious multi-layer aroma-barrier pouches and plastic-free packing for a greener tomorrow.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. FOUNDING INSPIRATION QUOTE */}
      <section className="py-14 sm:py-16 bg-[#5A0F17] text-white relative overflow-hidden">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10 space-y-4">
          <Quote className="w-10 h-10 text-[#E57A22]/50 mx-auto" />
          
          <blockquote className="font-serif text-lg sm:text-2xl text-[#FFECD4] leading-relaxed italic font-normal">
            "{quoteOdia}"
          </blockquote>

          <p className="text-xs sm:text-sm text-[#FFD7BA]/80 italic max-w-xl mx-auto">
            "{quoteEnglish}"
          </p>

          <div className="pt-3">
            <span className="text-xs font-bold text-[#E57A22] uppercase tracking-widest block">
              {quoteAuthor}
            </span>
          </div>
        </div>
      </section>

      {/* 5. THE HANDS BEHIND IT (Founder "My Pic" Showcase Section) */}
      <section className="py-14 sm:py-20 border-b border-[#EBDBC9]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="mb-10 sm:mb-12 space-y-1">
            <span className="text-xs font-bold text-[#A5470E] uppercase tracking-widest block">
              Leadership & Craftsmanship
            </span>
            <h2 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#3D1A10]">
              The Hands Behind It
            </h2>
            <p className="text-xs sm:text-sm text-[#6E4B3B]">
              Meet our master blender dedicated to reviving authentic Odia spice heritage
            </p>
          </div>

          {/* Dedicated Founder "My Pic" Card */}
          <div className="max-w-xl mx-auto bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#D4A373]/40 shadow-xl text-center space-y-5 hover:shadow-2xl transition-all">
            {/* Founder Portrait "My Pic" */}
            <div className="relative w-36 h-36 sm:w-44 sm:h-44 mx-auto rounded-3xl overflow-hidden p-1.5 bg-gradient-to-tr from-[#8C271E] via-[#D4A373] to-[#E57A22] shadow-lg group">
              <img
                src={founderImage}
                alt={founderName}
                className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = '/images/brand/chilika-logo.jpg';
                }}
              />
              <div className="absolute bottom-2.5 right-2.5 bg-emerald-600 text-white p-1 rounded-full shadow-md border border-white" title="Verified Founder & Master Blender">
                <ShieldCheck className="w-4 h-4" />
              </div>
            </div>

            <div>
              <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-[11px] font-bold uppercase tracking-wider mb-2">
                <UserCheck className="w-3.5 h-3.5 text-amber-700" />
                <span>Founder Profile</span>
              </div>
              <h3 className="font-serif font-extrabold text-2xl sm:text-3xl text-[#3D1A10]">
                {founderName}
              </h3>
              <p className="text-xs sm:text-sm font-bold text-[#8C271E] uppercase tracking-wider mt-1">
                {founderTitle}
              </p>
            </div>

            <p className="text-xs sm:text-sm text-[#5C3D2E] leading-relaxed italic max-w-lg mx-auto">
              "{founderBio}"
            </p>

            <div className="pt-3 border-t border-[#EBDBC9]/60 flex items-center justify-center space-x-2 text-xs text-[#A5470E] font-bold">
              <Sparkles className="w-4 h-4 text-[#E57A22]" />
              <span>{founderBadge}</span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. KEY HEALTH & PURITY HIGHLIGHTS (6 Quality Badges Matching Shuddh Swad) */}
      <section className="py-14 sm:py-20 bg-[#FAF3EB] border-b border-[#EBDBC9]">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-xl mx-auto mb-10 sm:mb-12">
            <span className="text-xs font-bold text-[#A5470E] uppercase tracking-widest block mb-1">
              Quality Assurance
            </span>
            <h2 className="font-serif font-bold text-2xl sm:text-3xl text-[#3D1A10]">
              Purity You Can Trust
            </h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 text-center">
            
            <div className="bg-white p-5 rounded-2xl border border-[#EBDBC9] shadow-2xs space-y-2">
              <span className="inline-block p-2 rounded-full bg-red-100 text-[#8C271E] font-bold text-xs">
                Zero
              </span>
              <h4 className="font-serif font-bold text-sm text-[#3D1A10]">No Artificial Colours</h4>
              <p className="text-[11px] text-[#6E4B3B]">100% natural colour from sun-ripened village crops.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EBDBC9] shadow-2xs space-y-2">
              <span className="inline-block p-2 rounded-full bg-amber-100 text-[#A5470E] font-bold text-xs">
                Pure
              </span>
              <h4 className="font-serif font-bold text-sm text-[#3D1A10]">No Preservatives or Starch</h4>
              <p className="text-[11px] text-[#6E4B3B]">Zero fillers, sawdust, or synthetic anti-caking agents.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EBDBC9] shadow-2xs space-y-2">
              <span className="inline-block p-2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                Oils
              </span>
              <h4 className="font-serif font-bold text-sm text-[#3D1A10]">Essential Oils Retained</h4>
              <p className="text-[11px] text-[#6E4B3B]">Slow-ground at low temperatures to preserve volatile aromas.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EBDBC9] shadow-2xs space-y-2">
              <span className="inline-block p-2 rounded-full bg-purple-100 text-purple-800 font-bold text-xs">
                Gut
              </span>
              <h4 className="font-serif font-bold text-sm text-[#3D1A10]">Supports Digestion</h4>
              <p className="text-[11px] text-[#6E4B3B]">Natural carminative spices that soothe and strengthen gut health.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EBDBC9] shadow-2xs space-y-2">
              <span className="inline-block p-2 rounded-full bg-blue-100 text-blue-800 font-bold text-xs">
                Clean
              </span>
              <h4 className="font-serif font-bold text-sm text-[#3D1A10]">Hygienically Made</h4>
              <p className="text-[11px] text-[#6E4B3B]">Prepared in an inspected and sanitized spice facility.</p>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#EBDBC9] shadow-2xs space-y-2">
              <span className="inline-block p-2 rounded-full bg-emerald-100 text-emerald-800 font-bold text-xs">
                Fresh
              </span>
              <h4 className="font-serif font-bold text-sm text-[#3D1A10]">Fresh Small-Batch Milling</h4>
              <p className="text-[11px] text-[#6E4B3B]">Roasted and pounded in small weekly batches for kitchen freshness.</p>
            </div>

          </div>

        </div>
      </section>

      {/* 7. BOTTOM BANNER CTA (Matching Shuddh Swad's "Taste what we grew up on") */}
      <section className="py-16 sm:py-24 bg-gradient-to-b from-[#FAF3EB] to-[#F3E5D4] text-center">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          <span className="text-xs font-bold text-[#A5470E] uppercase tracking-widest block">
            Welcome To Our Table
          </span>
          <h2 className="font-serif font-extrabold text-3xl sm:text-4xl text-[#3D1A10] leading-tight">
            Taste what we grew up on,
          </h2>
          <p className="text-sm sm:text-base text-[#5C3D2E] leading-relaxed max-w-xl mx-auto">
            Experience the authentic warmth of Odisha's heirloom spices and the aroma of village kitchens. Our fresh batches are ready for your family table.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/shop"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-[#8C271E] hover:bg-[#6D1A12] text-white px-8 py-4 rounded-full text-xs sm:text-sm font-bold shadow-lg transition-all active:scale-95"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>SHOP CHILIKA SPICES</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/categories"
              className="w-full sm:w-auto inline-flex items-center justify-center space-x-2 bg-white hover:bg-stone-50 text-[#3D1A10] border border-[#D4A373] px-8 py-4 rounded-full text-xs sm:text-sm font-bold shadow-sm transition-all"
            >
              <span>VIEW ALL BLENDS</span>
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};

export default AboutPage;
