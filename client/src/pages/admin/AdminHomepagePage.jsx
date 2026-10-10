import React, { useState, useEffect } from 'react';
import {
  Save,
  CheckCircle2,
  Upload,
  Loader2,
  Sparkles,
  Star,
  User,
  Image as ImageIcon,
  Phone,
  Mail,
  MapPin,
  Quote,
  Flame,
  Layers,
  Megaphone,
  BookOpen,
  MessageSquare,
  Camera,
  Plus,
  Trash2,
  ShieldCheck
} from 'lucide-react';
import { InstagramIcon, YoutubeIcon, FacebookIcon } from '../../components/common/SocialIcons';
import { api } from '../../services/api';
import { useContent } from '../../context/ContentContext';

export const AdminHomepagePage = () => {
  const { refreshContent } = useContent();
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState('');
  const [activeTab, setActiveTab] = useState('hero');

  // Upload loading states
  const [uploadingHero, setUploadingHero] = useState(false);
  const [uploadingBanner1, setUploadingBanner1] = useState(false);
  const [uploadingBanner2, setUploadingBanner2] = useState(false);
  const [uploadingStory, setUploadingStory] = useState(false);
  const [uploadingFounder, setUploadingFounder] = useState(false);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await api.getHomepageContent();
        if (res.success && res.content) {
          setContent(res.content);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, []);

  const handleFileUpload = async (file, updateFn, setLoadingState) => {
    if (!file) return;
    setLoadingState(true);
    try {
      const res = await api.uploadImages(file);
      if (res.success && res.url) {
        updateFn(res.url);
      } else {
        alert(res.message || 'Image upload failed');
      }
    } catch (err) {
      alert(`Upload failed: ${err.message}`);
    } finally {
      setLoadingState(false);
    }
  };

  const handleSave = async (e) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      const res = await api.updateHomepageContent(content);
      if (res.success) {
        setSavedMsg('All website changes saved and published live successfully!');
        if (refreshContent) refreshContent();
        setTimeout(() => setSavedMsg(''), 4000);
      }
    } catch (err) {
      alert(`Failed to save: ${err.message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading || !content) {
    return (
      <div className="p-12 text-center text-gray-500 text-xs flex flex-col items-center justify-center space-y-2">
        <Loader2 className="w-6 h-6 animate-spin text-spice-crimson" />
        <span>Loading website content management suite...</span>
      </div>
    );
  }

  const tabs = [
    { id: 'hero', label: '1. Notice & Hero Banner', icon: Megaphone },
    { id: 'promo', label: '2. Product Promo Banners', icon: Sparkles },
    { id: 'why', label: '3. Why Cooks Choose Chilika', icon: Flame },
    { id: 'reviews', label: '4. Words From Home Cooks', icon: MessageSquare },
    { id: 'gallery', label: '5. @chilikaspices Gallery', icon: Camera },
    { id: 'story', label: '6. Our Story & My Pic', icon: BookOpen },
    { id: 'contact', label: '7. Contact & Social Media', icon: Phone }
  ];

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-gray-200">
        <div>
          <h1 className="font-serif font-bold text-2xl text-gray-900">Website Content & Media Manager</h1>
          <p className="text-xs text-gray-500">
            Control all pictures, headers, paragraphs, prompts, founder profile, and social links across Chilika Spices
          </p>
        </div>

        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex items-center space-x-2 bg-spice-crimson hover:bg-spice-deepRed text-white px-6 py-2.5 rounded-xl text-xs font-bold shadow-spice transition-all disabled:opacity-60"
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
          <span>{saving ? 'Publishing...' : 'Publish All Changes'}</span>
        </button>
      </div>

      {savedMsg && (
        <div className="p-3.5 bg-green-50 border border-green-200 text-green-800 text-xs font-semibold rounded-2xl flex items-center space-x-2 shadow-xs">
          <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center space-x-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-spice-crimson text-white shadow-sm'
                  : 'bg-white text-gray-600 hover:text-gray-900 hover:bg-gray-100 border border-gray-200'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={handleSave} className="space-y-6 text-xs">
        {/* ========================================================================= */}
        {/* TAB 1: NOTICE PROMPT & HERO SECTION */}
        {/* ========================================================================= */}
        {activeTab === 'hero' && (
          <div className="space-y-6">
            {/* Top Prompt / Announcement Bar */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="font-serif font-bold text-base text-gray-900 flex items-center space-x-2">
                  <Megaphone className="w-4 h-4 text-spice-crimson" />
                  <span>Top Header Notice Bar / Announcement Prompt</span>
                </h3>
                <label className="flex items-center space-x-2 cursor-pointer font-bold text-xs text-gray-700">
                  <input
                    type="checkbox"
                    checked={content.announcementActive !== false}
                    onChange={(e) => setContent({ ...content, announcementActive: e.target.checked })}
                    className="rounded text-spice-crimson focus:ring-spice-crimson"
                  />
                  <span>Show Top Notice Bar</span>
                </label>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Notice Prompt Text</label>
                <input
                  type="text"
                  value={content.announcementText || ''}
                  onChange={(e) => setContent({ ...content, announcementText: e.target.value })}
                  placeholder="e.g. Authentic Indian spices from Odisha • Free shipping on orders above ₹499"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2.5 text-gray-900"
                />
              </div>
            </div>

            {/* Hero Main Copy & Picture */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center space-x-2">
                <ImageIcon className="w-4 h-4 text-spice-turmeric" />
                <span>Homepage Hero Showcase (Headline, Pitch & Picture)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Hero Badge Prompt</label>
                  <input
                    type="text"
                    value={content.heroBadgeText || ''}
                    onChange={(e) => setContent({ ...content, heroBadgeText: e.target.value })}
                    placeholder="e.g. Chilika Spice Co. • Odisha Heritage"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Hero Main Headline</label>
                  <input
                    type="text"
                    value={content.heroHeadline || ''}
                    onChange={(e) => setContent({ ...content, heroHeadline: e.target.value })}
                    placeholder="e.g. From village to your kitchen"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Hero Subheadline Paragraph</label>
                <textarea
                  rows={2}
                  value={content.heroSubheadline || ''}
                  onChange={(e) => setContent({ ...content, heroSubheadline: e.target.value })}
                  placeholder="e.g. Authentic spices inspired by the flavours, traditions and kitchens of Odisha."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Primary Button Text</label>
                  <input
                    type="text"
                    value={content.heroButtonText || ''}
                    onChange={(e) => setContent({ ...content, heroButtonText: e.target.value })}
                    placeholder="e.g. Shop Spices"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Primary Button Link</label>
                  <input
                    type="text"
                    value={content.heroButtonLink || ''}
                    onChange={(e) => setContent({ ...content, heroButtonLink: e.target.value })}
                    placeholder="e.g. /shop"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                  />
                </div>
              </div>

              {/* Hero Banner Image Upload */}
              <div className="pt-3 border-t border-gray-100 space-y-2">
                <label className="block font-bold text-gray-700">Hero Section Main Illustration / Picture</label>
                <div className="border-2 border-dashed border-gray-300 hover:border-spice-crimson rounded-2xl p-4 bg-gray-50/70 text-center transition-colors">
                  <input
                    type="file"
                    id="hero-image-upload"
                    accept="image/*"
                    disabled={uploadingHero}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(
                          file,
                          (url) => setContent((prev) => ({ ...prev, heroBannerImage: url })),
                          setUploadingHero
                        );
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="hero-image-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-1.5">
                    {uploadingHero ? (
                      <div className="flex items-center space-x-2 text-spice-crimson font-bold py-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading Hero Image...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-spice-crimson/10 text-spice-crimson flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs text-spice-crimson hover:underline">
                          Upload Local Picture for Hero (From Computer)
                        </span>
                        <p className="text-[10px] text-gray-500">Supports JPG, PNG, WEBP files up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  {content.heroBannerImage && (
                    <img
                      src={content.heroBannerImage}
                      alt="Hero Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                    />
                  )}
                  <input
                    type="text"
                    value={content.heroBannerImage || ''}
                    onChange={(e) => setContent({ ...content, heroBannerImage: e.target.value })}
                    placeholder="/images/brand/chilika-illustration.png"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 2: PRODUCT PROMO BANNERS */}
        {/* ========================================================================= */}
        {activeTab === 'promo' && (
          <div className="space-y-6">
            {/* Banner 1: New Product */}
            <div className="bg-white rounded-3xl p-6 border border-emerald-900/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="font-serif font-bold text-base text-gray-900 flex items-center space-x-2">
                  <Sparkles className="w-4 h-4 text-emerald-600" />
                  <span>Promotional Banner 1: New Product Showcase</span>
                </h3>
                <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-bold text-emerald-800">
                  <input
                    type="checkbox"
                    checked={content.newProductPromoBanner?.isActive !== false}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        newProductPromoBanner: {
                          ...(content.newProductPromoBanner || {}),
                          isActive: e.target.checked
                        }
                      })
                    }
                    className="rounded text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Show On Homepage</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={content.newProductPromoBanner?.tag || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        newProductPromoBanner: {
                          ...(content.newProductPromoBanner || {}),
                          tag: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. NEW PRODUCT LAUNCH"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price / Offer Tag</label>
                  <input
                    type="text"
                    value={content.newProductPromoBanner?.priceText || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        newProductPromoBanner: {
                          ...(content.newProductPromoBanner || {}),
                          priceText: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. Special Launch: ₹85"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Promotion Title</label>
                <input
                  type="text"
                  value={content.newProductPromoBanner?.title || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      newProductPromoBanner: {
                        ...(content.newProductPromoBanner || {}),
                        title: e.target.value
                      }
                    })
                  }
                  placeholder="e.g. Chilika Coastal Fish Curry Blend (Machha Besara)"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Supporting Pitch / Paragraph</label>
                <textarea
                  rows={2}
                  value={content.newProductPromoBanner?.subtitle || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      newProductPromoBanner: {
                        ...(content.newProductPromoBanner || {}),
                        subtitle: e.target.value
                      }
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={content.newProductPromoBanner?.buttonText || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        newProductPromoBanner: {
                          ...(content.newProductPromoBanner || {}),
                          buttonText: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. Shop New Arrival"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={content.newProductPromoBanner?.buttonLink || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        newProductPromoBanner: {
                          ...(content.newProductPromoBanner || {}),
                          buttonLink: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. /shop?sort=newest"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              {/* Banner 1 Image Upload */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700">Banner 1 Product Picture</label>
                <div className="border-2 border-dashed border-gray-300 hover:border-emerald-600 rounded-2xl p-4 bg-gray-50/70 text-center transition-colors">
                  <input
                    type="file"
                    id="banner1-image-upload"
                    accept="image/*"
                    disabled={uploadingBanner1}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(
                          file,
                          (url) =>
                            setContent((prev) => ({
                              ...prev,
                              newProductPromoBanner: {
                                ...(prev.newProductPromoBanner || {}),
                                image: url
                              }
                            })),
                          setUploadingBanner1
                        );
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="banner1-image-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-1.5">
                    {uploadingBanner1 ? (
                      <div className="flex items-center space-x-2 text-emerald-700 font-bold text-xs py-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading Banner 1 Picture...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs text-emerald-700 hover:underline">
                          Upload Local Product Picture for Banner 1 (Computer)
                        </span>
                        <p className="text-[10px] text-gray-500">Supports JPG, PNG, WEBP up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  {content.newProductPromoBanner?.image && (
                    <img
                      src={content.newProductPromoBanner.image}
                      alt="Banner 1 Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                    />
                  )}
                  <input
                    type="text"
                    value={content.newProductPromoBanner?.image || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        newProductPromoBanner: {
                          ...(content.newProductPromoBanner || {}),
                          image: e.target.value
                        }
                      })
                    }
                    placeholder="/images/products/machha-besara.jpg"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* Banner 2: Best Seller */}
            <div className="bg-white rounded-3xl p-6 border border-amber-900/20 shadow-sm space-y-4">
              <div className="flex items-center justify-between border-b border-gray-100 pb-2">
                <h3 className="font-serif font-bold text-base text-gray-900 flex items-center space-x-2">
                  <Star className="w-4 h-4 text-amber-500 fill-current" />
                  <span>Promotional Banner 2: Best Seller Item Showcase</span>
                </h3>
                <label className="flex items-center space-x-1.5 cursor-pointer text-xs font-bold text-amber-800">
                  <input
                    type="checkbox"
                    checked={content.bestSellerPromoBanner?.isActive !== false}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        bestSellerPromoBanner: {
                          ...(content.bestSellerPromoBanner || {}),
                          isActive: e.target.checked
                        }
                      })
                    }
                    className="rounded text-amber-600 focus:ring-amber-500"
                  />
                  <span>Show On Homepage</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={content.bestSellerPromoBanner?.tag || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        bestSellerPromoBanner: {
                          ...(content.bestSellerPromoBanner || {}),
                          tag: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. TOP BEST SELLER"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Price / Offer Tag</label>
                  <input
                    type="text"
                    value={content.bestSellerPromoBanner?.priceText || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        bestSellerPromoBanner: {
                          ...(content.bestSellerPromoBanner || {}),
                          priceText: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. Customer Favourite: ₹95"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Promotion Title</label>
                <input
                  type="text"
                  value={content.bestSellerPromoBanner?.title || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      bestSellerPromoBanner: {
                        ...(content.bestSellerPromoBanner || {}),
                        title: e.target.value
                      }
                    })
                  }
                  placeholder="e.g. Royal Aromatic Garam Masala"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Supporting Pitch / Paragraph</label>
                <textarea
                  rows={2}
                  value={content.bestSellerPromoBanner?.subtitle || ''}
                  onChange={(e) =>
                    setContent({
                      ...content,
                      bestSellerPromoBanner: {
                        ...(content.bestSellerPromoBanner || {}),
                        subtitle: e.target.value
                      }
                    })
                  }
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Text</label>
                  <input
                    type="text"
                    value={content.bestSellerPromoBanner?.buttonText || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        bestSellerPromoBanner: {
                          ...(content.bestSellerPromoBanner || {}),
                          buttonText: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. Explore Best Seller"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Button Link</label>
                  <input
                    type="text"
                    value={content.bestSellerPromoBanner?.buttonLink || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        bestSellerPromoBanner: {
                          ...(content.bestSellerPromoBanner || {}),
                          buttonLink: e.target.value
                        }
                      })
                    }
                    placeholder="e.g. /shop?sort=popular"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
              </div>

              {/* Banner 2 Image Upload */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700">Banner 2 Product Picture</label>
                <div className="border-2 border-dashed border-gray-300 hover:border-amber-600 rounded-2xl p-4 bg-gray-50/70 text-center transition-colors">
                  <input
                    type="file"
                    id="banner2-image-upload"
                    accept="image/*"
                    disabled={uploadingBanner2}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(
                          file,
                          (url) =>
                            setContent((prev) => ({
                              ...prev,
                              bestSellerPromoBanner: {
                                ...(prev.bestSellerPromoBanner || {}),
                                image: url
                              }
                            })),
                          setUploadingBanner2
                        );
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="banner2-image-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-1.5">
                    {uploadingBanner2 ? (
                      <div className="flex items-center space-x-2 text-amber-700 font-bold text-xs py-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading Banner 2 Picture...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs text-amber-700 hover:underline">
                          Upload Local Product Picture for Banner 2 (Computer)
                        </span>
                        <p className="text-[10px] text-gray-500">Supports JPG, PNG, WEBP up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  {content.bestSellerPromoBanner?.image && (
                    <img
                      src={content.bestSellerPromoBanner.image}
                      alt="Banner 2 Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                    />
                  )}
                  <input
                    type="text"
                    value={content.bestSellerPromoBanner?.image || ''}
                    onChange={(e) =>
                      setContent({
                        ...content,
                        bestSellerPromoBanner: {
                          ...(content.bestSellerPromoBanner || {}),
                          image: e.target.value
                        }
                      })
                    }
                    placeholder="/images/products/garam-masala-bowl.jpg"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 3: WHY CHILIKA SPICES SECTION */}
        {/* ========================================================================= */}
        {activeTab === 'why' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-gray-900 flex items-center space-x-2">
                <Flame className="w-5 h-5 text-spice-turmeric" />
                <span>Section: Why Cooks Choose Chilika Spices</span>
              </h3>
              <label className="flex items-center space-x-2 cursor-pointer font-bold text-xs text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  checked={content.whyChilikaActive !== false}
                  onChange={(e) => setContent({ ...content, whyChilikaActive: e.target.checked })}
                  className="rounded text-spice-crimson focus:ring-spice-crimson"
                />
                <span>Display This Section On Home Page</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Section Badge Tag</label>
                <input
                  type="text"
                  value={content.whyChilikaBadge || ''}
                  onChange={(e) => setContent({ ...content, whyChilikaBadge: e.target.value })}
                  placeholder="e.g. The Chilika Difference"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Section Main Heading</label>
                <input
                  type="text"
                  value={content.whyChilikaTitle || ''}
                  onChange={(e) => setContent({ ...content, whyChilikaTitle: e.target.value })}
                  placeholder="e.g. Why Cooks Choose Chilika Spices"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Subtitle / Supporting Paragraph</label>
              <textarea
                rows={2}
                value={content.whyChilikaSubtitle || ''}
                onChange={(e) => setContent({ ...content, whyChilikaSubtitle: e.target.value })}
                placeholder="Description of regional purity and unadulterated methods"
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
              />
            </div>

            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h4 className="font-bold text-sm text-gray-800">Pillar & Value Feature Cards ({content.whyChilikaItems?.length || 0})</h4>
                <button
                  type="button"
                  onClick={() => {
                    const current = content.whyChilikaItems || [];
                    setContent({
                      ...content,
                      whyChilikaItems: [
                        ...current,
                        { title: 'New Pure Standard', description: 'Handpicked and traditionally processed with care.', tag: 'Chilika Standard' }
                      ]
                    });
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-spice-crimson/10 text-spice-crimson hover:bg-spice-crimson hover:text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Feature Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(content.whyChilikaItems || []).map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-spice-crimson uppercase tracking-wider">
                        Feature Card #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (content.whyChilikaItems || []).filter((_, i) => i !== idx);
                          setContent({ ...content, whyChilikaItems: updated });
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        title="Delete Card"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Card Heading</label>
                      <input
                        type="text"
                        value={item.title || ''}
                        onChange={(e) => {
                          const newItems = [...(content.whyChilikaItems || [])];
                          newItems[idx] = { ...newItems[idx], title: e.target.value };
                          setContent({ ...content, whyChilikaItems: newItems });
                        }}
                        placeholder="Title (e.g. Traditional Flavour)"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900 font-bold"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Card Tag / Stamp</label>
                      <input
                        type="text"
                        value={item.tag || ''}
                        onChange={(e) => {
                          const newItems = [...(content.whyChilikaItems || [])];
                          newItems[idx] = { ...newItems[idx], tag: e.target.value };
                          setContent({ ...content, whyChilikaItems: newItems });
                        }}
                        placeholder="Tag (e.g. Chilika Standard)"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Card Description</label>
                      <textarea
                        rows={2}
                        value={item.description || ''}
                        onChange={(e) => {
                          const newItems = [...(content.whyChilikaItems || [])];
                          newItems[idx] = { ...newItems[idx], description: e.target.value };
                          setContent({ ...content, whyChilikaItems: newItems });
                        }}
                        placeholder="Description..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: REAL KITCHEN EXPERIENCES / WORDS FROM HOME COOKS */}
        {/* ========================================================================= */}
        {activeTab === 'reviews' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-gray-900 flex items-center space-x-2">
                <MessageSquare className="w-5 h-5 text-spice-turmeric" />
                <span>Section: Real Kitchen Experiences (Words From Home Cooks)</span>
              </h3>
              <label className="flex items-center space-x-2 cursor-pointer font-bold text-xs text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  checked={content.reviewsSectionActive !== false}
                  onChange={(e) => setContent({ ...content, reviewsSectionActive: e.target.checked })}
                  className="rounded text-spice-crimson focus:ring-spice-crimson"
                />
                <span>Display This Section On Home Page</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Section Badge Tag</label>
                <input
                  type="text"
                  value={content.reviewsBadge || ''}
                  onChange={(e) => setContent({ ...content, reviewsBadge: e.target.value })}
                  placeholder="e.g. Real Kitchen Experiences"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 font-medium"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Section Main Heading</label>
                <input
                  type="text"
                  value={content.reviewsTitle || ''}
                  onChange={(e) => setContent({ ...content, reviewsTitle: e.target.value })}
                  placeholder="e.g. Words From Home Cooks"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 mb-1">Section Subtitle / Description</label>
              <textarea
                rows={2}
                value={content.reviewsSubtitle || ''}
                onChange={(e) => setContent({ ...content, reviewsSubtitle: e.target.value })}
                placeholder="e.g. Honest feedback from households cooking everyday meals with Chilika Spices."
                className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
              />
            </div>

            {/* Custom Featured Customer Testimonials */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-sm text-gray-800">Featured Customer Testimonials ({content.customTestimonials?.length || 0})</h4>
                  <p className="text-[11px] text-gray-500">Manage curated testimonials that appear on the Home Page carousel</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = content.customTestimonials || [];
                    setContent({
                      ...content,
                      customTestimonials: [
                        ...current,
                        { userName: 'Happy Customer', rating: 5, comment: 'Amazing authentic aroma and fresh taste!', productName: 'Pure Garam Masala', isVerified: true }
                      ]
                    });
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-spice-crimson/10 text-spice-crimson hover:bg-spice-crimson hover:text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Testimonial</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {(content.customTestimonials || []).map((t, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2.5 relative">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                        <span>Testimonial #{idx + 1}</span>
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (content.customTestimonials || []).filter((_, i) => i !== idx);
                          setContent({ ...content, customTestimonials: updated });
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        title="Delete Testimonial"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Customer Name</label>
                      <input
                        type="text"
                        value={t.userName || ''}
                        onChange={(e) => {
                          const updated = [...(content.customTestimonials || [])];
                          updated[idx] = { ...updated[idx], userName: e.target.value };
                          setContent({ ...content, customTestimonials: updated });
                        }}
                        placeholder="e.g. Priya Sharma"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900 font-bold"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Rating (1-5)</label>
                        <select
                          value={t.rating || 5}
                          onChange={(e) => {
                            const updated = [...(content.customTestimonials || [])];
                            updated[idx] = { ...updated[idx], rating: Number(e.target.value) };
                            setContent({ ...content, customTestimonials: updated });
                          }}
                          className="w-full bg-white border border-gray-200 rounded-xl px-2 py-1.5 text-gray-900 font-bold"
                        >
                          <option value={5}>5 Stars ★★★★★</option>
                          <option value={4}>4 Stars ★★★★</option>
                          <option value={3}>3 Stars ★★★</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Verified</label>
                        <label className="flex items-center space-x-1.5 pt-1 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={t.isVerified !== false}
                            onChange={(e) => {
                              const updated = [...(content.customTestimonials || [])];
                              updated[idx] = { ...updated[idx], isVerified: e.target.checked };
                              setContent({ ...content, customTestimonials: updated });
                            }}
                            className="rounded text-green-600 focus:ring-green-600"
                          />
                          <span className="text-xs font-semibold text-gray-700">Verified Buyer</span>
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Spice Product</label>
                      <input
                        type="text"
                        value={t.productName || ''}
                        onChange={(e) => {
                          const updated = [...(content.customTestimonials || [])];
                          updated[idx] = { ...updated[idx], productName: e.target.value };
                          setContent({ ...content, customTestimonials: updated });
                        }}
                        placeholder="e.g. Pure Garam Masala"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Review Comment</label>
                      <textarea
                        rows={3}
                        value={t.comment || ''}
                        onChange={(e) => {
                          const updated = [...(content.customTestimonials || [])];
                          updated[idx] = { ...updated[idx], comment: e.target.value };
                          setContent({ ...content, customTestimonials: updated });
                        }}
                        placeholder="Customer review words..."
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: @CHILIKASPICES GLIMPSES FROM VILLAGE & KITCHEN */}
        {/* ========================================================================= */}
        {activeTab === 'gallery' && (
          <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-gray-100 pb-3">
              <h3 className="font-serif font-bold text-base text-gray-900 flex items-center space-x-2">
                <Camera className="w-5 h-5 text-spice-crimson" />
                <span>Section: @chilikaspices (Glimpses From Village & Kitchen)</span>
              </h3>
              <label className="flex items-center space-x-2 cursor-pointer font-bold text-xs text-gray-700 bg-gray-50 px-3 py-1.5 rounded-xl border border-gray-200">
                <input
                  type="checkbox"
                  checked={content.socialGalleryActive !== false}
                  onChange={(e) => setContent({ ...content, socialGalleryActive: e.target.checked })}
                  className="rounded text-spice-crimson focus:ring-spice-crimson"
                />
                <span>Display This Section On Home Page</span>
              </label>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Social Handle Badge</label>
                <input
                  type="text"
                  value={content.socialGalleryHandle || ''}
                  onChange={(e) => setContent({ ...content, socialGalleryHandle: e.target.value })}
                  placeholder="e.g. @chilikaspices"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 font-bold text-spice-crimson"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Handle Click URL</label>
                <input
                  type="text"
                  value={content.socialGalleryUrl || ''}
                  onChange={(e) => setContent({ ...content, socialGalleryUrl: e.target.value })}
                  placeholder="https://instagram.com/chilikaspices"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-gray-700 mb-1">Section Main Heading</label>
                <input
                  type="text"
                  value={content.socialGalleryTitle || ''}
                  onChange={(e) => setContent({ ...content, socialGalleryTitle: e.target.value })}
                  placeholder="e.g. Glimpses From Village & Kitchen"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 font-bold"
                />
              </div>
              <div>
                <label className="block font-bold text-gray-700 mb-1">Subtitle / Bio Description</label>
                <textarea
                  rows={2}
                  value={content.socialGallerySubtitle || ''}
                  onChange={(e) => setContent({ ...content, socialGallerySubtitle: e.target.value })}
                  placeholder="Follow our journey from sun-baked spice mats to hearty everyday home cooking."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                />
              </div>
            </div>

            {/* Gallery Photos Grid */}
            <div className="pt-2 border-t border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h4 className="font-bold text-sm text-gray-800">Gallery Photos & Captions ({content.socialGalleryItems?.length || 0})</h4>
                  <p className="text-[11px] text-gray-500">Add or edit photos showing pure stone grinding, village packaging, and kitchen cooking</p>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    const current = content.socialGalleryItems || [];
                    setContent({
                      ...content,
                      socialGalleryItems: [
                        ...current,
                        { image: '/images/products/turmeric.jpg', caption: 'Authentic pure spices in our village kitchen', link: '/shop' }
                      ]
                    });
                  }}
                  className="inline-flex items-center space-x-1.5 px-3 py-1.5 bg-spice-crimson/10 text-spice-crimson hover:bg-spice-crimson hover:text-white rounded-xl text-xs font-bold transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Gallery Photo</span>
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {(content.socialGalleryItems || []).map((item, idx) => (
                  <div key={idx} className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-3 relative group">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-spice-crimson uppercase tracking-wider">
                        Photo #{idx + 1}
                      </span>
                      <button
                        type="button"
                        onClick={() => {
                          const updated = (content.socialGalleryItems || []).filter((_, i) => i !== idx);
                          setContent({ ...content, socialGalleryItems: updated });
                        }}
                        className="text-gray-400 hover:text-red-500 p-1 transition-colors"
                        title="Delete Photo"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Image Preview & Upload */}
                    <div className="flex items-center space-x-3">
                      <div className="w-16 h-16 rounded-xl overflow-hidden bg-gray-200 shrink-0 border border-gray-300">
                        <img
                          src={item.image}
                          alt="preview"
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/images/brand/chilika-illustration.png'; }}
                        />
                      </div>
                      <div className="flex-1 space-y-1.5">
                        <input
                          type="text"
                          value={item.image || ''}
                          onChange={(e) => {
                            const updated = [...(content.socialGalleryItems || [])];
                            updated[idx] = { ...updated[idx], image: e.target.value };
                            setContent({ ...content, socialGalleryItems: updated });
                          }}
                          placeholder="/images/... or URL"
                          className="w-full bg-white border border-gray-200 rounded-xl px-2.5 py-1 text-xs text-gray-900"
                        />
                        <label className="cursor-pointer inline-flex items-center space-x-1.5 bg-white border border-gray-200 hover:bg-gray-100 px-2.5 py-1 rounded-lg text-[10px] font-bold text-gray-700 shadow-2xs">
                          <Upload className="w-3 h-3 text-spice-crimson" />
                          <span>Upload File</span>
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(e) => {
                              const file = e.target.files?.[0];
                              if (file) {
                                handleFileUpload(file, (url) => {
                                  const updated = [...(content.socialGalleryItems || [])];
                                  updated[idx] = { ...updated[idx], image: url };
                                  setContent({ ...content, socialGalleryItems: updated });
                                }, () => {});
                              }
                            }}
                          />
                        </label>
                      </div>
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Hover Caption</label>
                      <input
                        type="text"
                        value={item.caption || ''}
                        onChange={(e) => {
                          const updated = [...(content.socialGalleryItems || [])];
                          updated[idx] = { ...updated[idx], caption: e.target.value };
                          setContent({ ...content, socialGalleryItems: updated });
                        }}
                        placeholder="Caption when hovered"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900 text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-semibold text-gray-600 mb-0.5">Click Link (Optional)</label>
                      <input
                        type="text"
                        value={item.link || ''}
                        onChange={(e) => {
                          const updated = [...(content.socialGalleryItems || [])];
                          updated[idx] = { ...updated[idx], link: e.target.value };
                          setContent({ ...content, socialGalleryItems: updated });
                        }}
                        placeholder="/shop or instagram link"
                        className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 text-gray-900 text-xs"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 4: OUR STORY & MY PIC / FOUNDER SECTION */}
        {/* ========================================================================= */}
        {activeTab === 'story' && (
          <div className="space-y-6">
            {/* FOUNDER "MY PIC" & PROFILE (Requested prominently by User) */}
            <div className="bg-white rounded-3xl p-6 border-2 border-[#D4A373]/40 shadow-sm space-y-4">
              <div className="flex items-center space-x-2 border-b border-gray-100 pb-2">
                <User className="w-5 h-5 text-spice-crimson" />
                <div>
                  <h3 className="font-serif font-bold text-base text-gray-900">
                    Founder Profile & "My Pic" Section (Appears in Our Story)
                  </h3>
                  <p className="text-[11px] text-gray-500">
                    Upload your personal photo and customize your bio, title, and name
                  </p>
                </div>
              </div>

              {/* Founder Photo "My Pic" Upload Area */}
              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-200/60 space-y-3">
                <label className="block font-bold text-amber-950">Founder Photograph ("My Pic")</label>
                
                <div className="border-2 border-dashed border-amber-300 hover:border-spice-crimson rounded-2xl p-5 bg-white text-center transition-colors">
                  <input
                    type="file"
                    id="founder-pic-upload"
                    accept="image/*"
                    disabled={uploadingFounder}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(
                          file,
                          (url) => setContent((prev) => ({ ...prev, founderImage: url })),
                          setUploadingFounder
                        );
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="founder-pic-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-2">
                    {uploadingFounder ? (
                      <div className="flex items-center space-x-2 text-spice-crimson font-bold py-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading Your Photo...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-12 h-12 rounded-full bg-amber-100 text-[#8C271E] flex items-center justify-center shadow-xs">
                          <Upload className="w-6 h-6" />
                        </div>
                        <span className="font-bold text-xs text-[#8C271E] hover:underline">
                          Click To Upload My Photo From Computer ("My Pic")
                        </span>
                        <p className="text-[10px] text-gray-500">
                          Recommended: Clean square portrait photo (JPG, PNG, WEBP)
                        </p>
                      </>
                    )}
                  </label>
                </div>

                {/* Preview Thumbnail & URL */}
                <div className="flex items-center space-x-3 pt-1">
                  {content.founderImage && (
                    <img
                      src={content.founderImage}
                      alt="My Pic Preview"
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-amber-300 shrink-0 shadow-md"
                    />
                  )}
                  <div className="flex-1 space-y-1">
                    <span className="text-[10px] text-gray-500 block">Current Photo Path:</span>
                    <input
                      type="text"
                      value={content.founderImage || ''}
                      onChange={(e) => setContent({ ...content, founderImage: e.target.value })}
                      placeholder="/images/brand/founder.jpg"
                      className="w-full bg-white border border-gray-200 rounded-xl px-3 py-1.5 font-mono text-[11px]"
                    />
                  </div>
                </div>
              </div>

              {/* Founder Details */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Founder Name</label>
                  <input
                    type="text"
                    value={content.founderName || ''}
                    onChange={(e) => setContent({ ...content, founderName: e.target.value })}
                    placeholder="e.g. Biswajit Baral"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 font-bold"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Founder Title</label>
                  <input
                    type="text"
                    value={content.founderTitle || ''}
                    onChange={(e) => setContent({ ...content, founderTitle: e.target.value })}
                    placeholder="e.g. Founder & Master Blender"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Badge Tag</label>
                  <input
                    type="text"
                    value={content.founderBadge || ''}
                    onChange={(e) => setContent({ ...content, founderBadge: e.target.value })}
                    placeholder="e.g. Small-Batch Artisanal Milling"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Founder Bio / Personal Message</label>
                <textarea
                  rows={3}
                  value={content.founderBio || ''}
                  onChange={(e) => setContent({ ...content, founderBio: e.target.value })}
                  placeholder="Growing up in Odisha, I watched grandma hand-pound whole spices..."
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                />
              </div>
            </div>

            {/* Grandmother Wisdom Quote */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center space-x-2">
                <Quote className="w-4 h-4 text-[#8C271E]" />
                <span>Founding Inspiration Quote (Grandmother's Wisdom)</span>
              </h3>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Quote In Odia Script</label>
                <textarea
                  rows={2}
                  value={content.founderQuoteOdia || ''}
                  onChange={(e) => setContent({ ...content, founderQuoteOdia: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 font-serif"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">English Translation</label>
                <textarea
                  rows={2}
                  value={content.founderQuoteEnglish || ''}
                  onChange={(e) => setContent({ ...content, founderQuoteEnglish: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 italic"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Quote Attribution</label>
                <input
                  type="text"
                  value={content.founderQuoteAuthor || ''}
                  onChange={(e) => setContent({ ...content, founderQuoteAuthor: e.target.value })}
                  placeholder="— Bou (Grandmother), Founding Inspiration"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                />
              </div>
            </div>

            {/* Our Story Lead Section & Picture */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-spice-turmeric" />
                <span>Our Story Lead Section (Headline & Story Picture)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Badge</label>
                  <input
                    type="text"
                    value={content.aboutHeroBadge || ''}
                    onChange={(e) => setContent({ ...content, aboutHeroBadge: e.target.value })}
                    placeholder="e.g. Our Story"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                  />
                </div>
                <div>
                  <label className="block font-bold text-gray-700 mb-1">Headline</label>
                  <input
                    type="text"
                    value={content.aboutHeroTitle || ''}
                    onChange={(e) => setContent({ ...content, aboutHeroTitle: e.target.value })}
                    placeholder="e.g. From one kitchen in Odisha, to yours."
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900 font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Story Lead Paragraph 1</label>
                <textarea
                  rows={2}
                  value={content.aboutHeroParagraph1 || ''}
                  onChange={(e) => setContent({ ...content, aboutHeroParagraph1: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Story Lead Paragraph 2</label>
                <textarea
                  rows={3}
                  value={content.aboutHeroParagraph2 || ''}
                  onChange={(e) => setContent({ ...content, aboutHeroParagraph2: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                />
              </div>

              {/* Story Image Upload */}
              <div className="space-y-2 pt-2 border-t border-gray-100">
                <label className="block font-bold text-gray-700">Story Lead Picture / Illustration</label>
                <div className="border-2 border-dashed border-gray-300 hover:border-spice-crimson rounded-2xl p-4 bg-gray-50/70 text-center transition-colors">
                  <input
                    type="file"
                    id="story-image-upload"
                    accept="image/*"
                    disabled={uploadingStory}
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (file) {
                        handleFileUpload(
                          file,
                          (url) => setContent((prev) => ({ ...prev, aboutHeroImage: url })),
                          setUploadingStory
                        );
                        e.target.value = '';
                      }
                    }}
                    className="hidden"
                  />
                  <label htmlFor="story-image-upload" className="cursor-pointer flex flex-col items-center justify-center space-y-1.5">
                    {uploadingStory ? (
                      <div className="flex items-center space-x-2 text-spice-crimson font-bold text-xs py-2">
                        <Loader2 className="w-5 h-5 animate-spin" />
                        <span>Uploading Story Picture...</span>
                      </div>
                    ) : (
                      <>
                        <div className="w-10 h-10 rounded-full bg-spice-sand text-spice-brown flex items-center justify-center">
                          <Upload className="w-5 h-5" />
                        </div>
                        <span className="font-bold text-xs text-spice-crimson hover:underline">
                          Upload Local Picture for Our Story (Computer)
                        </span>
                        <p className="text-[10px] text-gray-500">Supports JPG, PNG, WEBP up to 10MB</p>
                      </>
                    )}
                  </label>
                </div>

                <div className="flex items-center space-x-3 pt-1">
                  {content.aboutHeroImage && (
                    <img
                      src={content.aboutHeroImage}
                      alt="Story Preview"
                      className="w-14 h-14 rounded-xl object-cover border border-gray-200 shrink-0 shadow-2xs"
                    />
                  )}
                  <input
                    type="text"
                    value={content.aboutHeroImage || ''}
                    onChange={(e) => setContent({ ...content, aboutHeroImage: e.target.value })}
                    placeholder="/images/brand/chilika-illustration.png"
                    className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2 font-mono text-[11px]"
                  />
                </div>
              </div>
            </div>

            {/* 3 Story Timeline Steps */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2">
                Timeline / 3 Genesis Milestones
              </h3>

              <div className="space-y-4">
                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <span className="font-bold text-xs text-spice-crimson">Step 1</span>
                  <input
                    type="text"
                    value={content.aboutTimelineStep1Title || ''}
                    onChange={(e) => setContent({ ...content, aboutTimelineStep1Title: e.target.value })}
                    placeholder="Step 1 Title"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold"
                  />
                  <textarea
                    rows={2}
                    value={content.aboutTimelineStep1Text || ''}
                    onChange={(e) => setContent({ ...content, aboutTimelineStep1Text: e.target.value })}
                    placeholder="Step 1 Paragraph"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <span className="font-bold text-xs text-spice-crimson">Step 2</span>
                  <input
                    type="text"
                    value={content.aboutTimelineStep2Title || ''}
                    onChange={(e) => setContent({ ...content, aboutTimelineStep2Title: e.target.value })}
                    placeholder="Step 2 Title"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold"
                  />
                  <textarea
                    rows={2}
                    value={content.aboutTimelineStep2Text || ''}
                    onChange={(e) => setContent({ ...content, aboutTimelineStep2Text: e.target.value })}
                    placeholder="Step 2 Paragraph"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>

                <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-2">
                  <span className="font-bold text-xs text-spice-crimson">Step 3</span>
                  <input
                    type="text"
                    value={content.aboutTimelineStep3Title || ''}
                    onChange={(e) => setContent({ ...content, aboutTimelineStep3Title: e.target.value })}
                    placeholder="Step 3 Title"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900 font-bold"
                  />
                  <textarea
                    rows={2}
                    value={content.aboutTimelineStep3Text || ''}
                    onChange={(e) => setContent({ ...content, aboutTimelineStep3Text: e.target.value })}
                    placeholder="Step 3 Paragraph"
                    className="w-full bg-white border border-gray-200 rounded-xl px-3 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ========================================================================= */}
        {/* TAB 5: CONTACT & SOCIAL MEDIA */}
        {/* ========================================================================= */}
        {activeTab === 'contact' && (
          <div className="space-y-6">
            {/* Social Media Links (Instagram, YouTube, Facebook, WhatsApp) */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center space-x-2">
                <InstagramIcon className="w-4 h-4 text-[#E1306C]" />
                <span>Social Media Links (Footer & Connect)</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center space-x-1.5">
                    <InstagramIcon className="w-3.5 h-3.5 text-[#E1306C]" />
                    <span>Instagram URL</span>
                  </label>
                  <input
                    type="text"
                    value={content.instagramUrl || ''}
                    onChange={(e) => setContent({ ...content, instagramUrl: e.target.value })}
                    placeholder="https://instagram.com/chilikaspices"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center space-x-1.5">
                    <YoutubeIcon className="w-3.5 h-3.5 text-[#FF0000]" />
                    <span>YouTube URL</span>
                  </label>
                  <input
                    type="text"
                    value={content.youtubeUrl || ''}
                    onChange={(e) => setContent({ ...content, youtubeUrl: e.target.value })}
                    placeholder="https://youtube.com/@chilikaspices"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center space-x-1.5">
                    <FacebookIcon className="w-3.5 h-3.5 text-[#1877F2]" />
                    <span>Facebook URL</span>
                  </label>
                  <input
                    type="text"
                    value={content.facebookUrl || ''}
                    onChange={(e) => setContent({ ...content, facebookUrl: e.target.value })}
                    placeholder="https://facebook.com/chilikaspices"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                  />
                </div>
              </div>
            </div>

            {/* Contact Details */}
            <div className="bg-white rounded-3xl p-6 border border-gray-200 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-base text-gray-900 border-b border-gray-100 pb-2 flex items-center space-x-2">
                <Phone className="w-4 h-4 text-spice-crimson" />
                <span>Contact Details & Footer Copy</span>
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center space-x-1.5">
                    <Phone className="w-3.5 h-3.5 text-spice-turmeric" />
                    <span>Customer Support Phone</span>
                  </label>
                  <input
                    type="text"
                    value={content.contactPhone || ''}
                    onChange={(e) => setContent({ ...content, contactPhone: e.target.value })}
                    placeholder="+91 98765 43210"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                  />
                </div>

                <div>
                  <label className="block font-bold text-gray-700 mb-1 flex items-center space-x-1.5">
                    <Mail className="w-3.5 h-3.5 text-spice-turmeric" />
                    <span>Care Email Address</span>
                  </label>
                  <input
                    type="text"
                    value={content.contactEmail || ''}
                    onChange={(e) => setContent({ ...content, contactEmail: e.target.value })}
                    placeholder="care@chilikaspices.com"
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1 flex items-center space-x-1.5">
                  <MapPin className="w-3.5 h-3.5 text-spice-turmeric" />
                  <span>Physical Address</span>
                </label>
                <textarea
                  rows={2}
                  value={content.contactAddress || ''}
                  onChange={(e) => setContent({ ...content, contactAddress: e.target.value })}
                  placeholder="Chilika Spice Co., Old Town, Khordha / Puri District, Odisha, India"
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                />
              </div>

              <div>
                <label className="block font-bold text-gray-700 mb-1">Footer Brand Summary Paragraph</label>
                <textarea
                  rows={2}
                  value={content.footerAboutText || ''}
                  onChange={(e) => setContent({ ...content, footerAboutText: e.target.value })}
                  className="w-full bg-gray-50 border border-gray-200 rounded-xl px-3.5 py-2 text-gray-900"
                />
              </div>
            </div>
          </div>
        )}

        {/* Floating Sticky Bottom Save Bar */}
        <div className="sticky bottom-4 z-40 flex items-center justify-between p-4 bg-white/95 backdrop-blur-md rounded-2xl border border-gray-200 shadow-2xl">
          <div className="flex items-center space-x-2">
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
            <p className="text-xs font-semibold text-gray-700">
              Live Cloud Publishing Mode: Updates apply globally across all browsers
            </p>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="flex items-center space-x-2 bg-spice-crimson hover:bg-spice-deepRed text-white px-8 py-3 rounded-2xl text-xs font-bold shadow-spice transition-all disabled:opacity-60 cursor-pointer"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? 'Publishing Changes...' : 'Publish Website Changes'}</span>
          </button>
        </div>
      </form>

    </div>
  );
};

export default AdminHomepagePage;
