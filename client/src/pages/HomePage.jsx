import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { HeroSection } from '../components/home/HeroSection';
import { TrustStrip } from '../components/common/TrustStrip';
import { PromoBanners } from '../components/home/PromoBanners';
import { WhyChilika } from '../components/home/WhyChilika';
import { ReviewCarousel } from '../components/home/ReviewCarousel';
import { SocialGallery } from '../components/home/SocialGallery';
import { Newsletter } from '../components/home/Newsletter';
import { MobileCategoryPills } from '../components/home/MobileCategoryPills';

export const HomePage = () => {
  const [reviews, setReviews] = useState([]);
  const [homepageContent, setHomepageContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadHomeData = async () => {
      try {
        const [revRes, homeRes] = await Promise.all([
          api.getFeaturedReviews(),
          api.getHomepageContent()
        ]);

        if (revRes.success) setReviews(revRes.reviews);
        if (homeRes.success) setHomepageContent(homeRes.content);
      } catch (err) {
        console.error('Error loading home data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadHomeData();
  }, []);

  return (
    <div className="min-h-screen bg-spice-cream">
      {/* HERO SECTION */}
      <HeroSection content={homepageContent} />

      {/* MOBILE QUICK CATEGORY PILLS (FLIPKART STYLE) */}
      <MobileCategoryPills />

      {/* TRUST / BRAND STRIP */}
      <TrustStrip content={homepageContent} />

      {/* BIG PROMOTIONAL BANNERS — PRODUCT PROMOTION SPOTLIGHT */}
      <PromoBanners content={homepageContent} />

      {/* WHY CHILIKA SPICES */}
      <WhyChilika content={homepageContent} />

      {/* CUSTOMER REVIEWS */}
      <ReviewCarousel reviews={reviews} content={homepageContent} />

      {/* SOCIAL STYLE GALLERY */}
      <SocialGallery content={homepageContent} />

      {/* NEWSLETTER */}
      <Newsletter />
    </div>
  );
};
