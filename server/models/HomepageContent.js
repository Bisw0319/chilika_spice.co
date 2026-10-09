import mongoose from 'mongoose';

const homepageContentSchema = new mongoose.Schema({
  // Top Notice Bar / Prompt
  announcementText: {
    type: String,
    default: "Authentic Indian spices from Odisha • Free shipping on orders above ₹499"
  },
  announcementActive: {
    type: Boolean,
    default: true
  },

  // Hero Section
  heroBadgeText: {
    type: String,
    default: "Chilika Spice Co. • Odisha Heritage"
  },
  heroHeadline: {
    type: String,
    default: "From village to your kitchen"
  },
  heroSubheadline: {
    type: String,
    default: "Authentic spices inspired by the flavours, traditions and kitchens of Odisha."
  },
  heroBannerImage: {
    type: String,
    default: "/images/brand/chilika-illustration.png"
  },
  heroButtonText: {
    type: String,
    default: "Shop Spices"
  },
  heroButtonLink: {
    type: String,
    default: "/shop"
  },

  // Trust Strip Items
  trustStripItems: [{ type: String }],

  // Big Promotional Banners
  newProductPromoBanner: {
    tag: { type: String, default: "NEW PRODUCT LAUNCH" },
    title: { type: String, default: "Chilika Coastal Fish Curry Blend (Machha Besara)" },
    subtitle: { type: String, default: "Authentic coastal mustard and cumin tempering for timeless fish curries and village delicacies." },
    image: { type: String, default: "/images/products/machha-besara.jpg" },
    buttonText: { type: String, default: "Shop New Arrival" },
    buttonLink: { type: String, default: "/shop?sort=newest" },
    priceText: { type: String, default: "Special Launch: ₹85" },
    isActive: { type: Boolean, default: true }
  },
  bestSellerPromoBanner: {
    tag: { type: String, default: "TOP BEST SELLER" },
    title: { type: String, default: "Royal Aromatic Garam Masala" },
    subtitle: { type: String, default: "Over 1,200+ households love our heirloom 12-spice recipe hand-roasted on iron skillets." },
    image: { type: String, default: "/images/products/garam-masala-bowl.jpg" },
    buttonText: { type: String, default: "Explore Best Seller" },
    buttonLink: { type: String, default: "/shop?sort=popular" },
    priceText: { type: String, default: "Customer Favourite: ₹95" },
    isActive: { type: Boolean, default: true }
  },

  // Why Chilika Spices Section
  whyChilikaActive: {
    type: Boolean,
    default: true
  },
  whyChilikaBadge: {
    type: String,
    default: "The Chilika Difference"
  },
  whyChilikaTitle: {
    type: String,
    default: "Why Cooks Choose Chilika Spices"
  },
  whyChilikaSubtitle: {
    type: String,
    default: "No synthetic fillers. No artificial food colours. Just honest spices from Odisha's agricultural soil."
  },
  whyChilikaItems: [{
    title: { type: String },
    description: { type: String },
    tag: { type: String, default: "Chilika Standard" },
    icon: { type: String, default: "Flame" }
  }],

  // Customer Reviews / Words From Home Cooks Section
  reviewsSectionActive: {
    type: Boolean,
    default: true
  },
  reviewsBadge: {
    type: String,
    default: "Real Kitchen Experiences"
  },
  reviewsTitle: {
    type: String,
    default: "Words From Home Cooks"
  },
  reviewsSubtitle: {
    type: String,
    default: "Honest feedback from households cooking everyday meals with Chilika Spices."
  },
  customTestimonials: [{
    userName: { type: String },
    rating: { type: Number, default: 5 },
    comment: { type: String },
    productName: { type: String },
    isVerified: { type: Boolean, default: true }
  }],

  // Social Style Gallery Section (@chilikaspices)
  socialGalleryActive: {
    type: Boolean,
    default: true
  },
  socialGalleryHandle: {
    type: String,
    default: "@chilikaspices"
  },
  socialGalleryUrl: {
    type: String,
    default: "https://instagram.com"
  },
  socialGalleryTitle: {
    type: String,
    default: "Glimpses From Village & Kitchen"
  },
  socialGallerySubtitle: {
    type: String,
    default: "Follow our journey from sun-baked spice mats to hearty everyday home cooking."
  },
  socialGalleryItems: [{
    image: { type: String },
    caption: { type: String },
    link: { type: String, default: "" }
  }],

  // Our Story / About Us Section
  aboutHeroBadge: {
    type: String,
    default: "Our Story"
  },
  aboutHeroTitle: {
    type: String,
    default: "From one kitchen in Odisha, to yours."
  },
  aboutHeroParagraph1: {
    type: String,
    default: "Chilika Spices isn’t just about masalas—it’s about a vision to transform India’s relationship with its traditional foods."
  },
  aboutHeroParagraph2: {
    type: String,
    default: "At the heart of this vision was a passionate dreamer from Odisha, Biswajit, who believed that authentic heritage spices should reach every household pure and unadulterated. He wasn’t backed by wealth or corporate investors—what he had was curiosity, deep love for the timeless flavours of Odisha, and the courage to solve a problem that market commercial brands ignored."
  },
  aboutHeroImage: {
    type: String,
    default: "/images/brand/chilika-illustration.png"
  },
  aboutHeroImageCaption: {
    type: String,
    default: "Rooted in Chilika’s coastal breezes & centuries-old stone mortars"
  },

  // Timeline / Milestones
  aboutTimelineStep1Title: {
    type: String,
    default: "The Spark of Curiosity"
  },
  aboutTimelineStep1Text: {
    type: String,
    default: "One day, while exploring local village spice markets, Biswajit observed commercial packet masalas packed with synthetic dyes and artificial enhancers. Curious about why modern curries caused chronic acidity and stomach burning while food in grandmother's village kitchen was healing and gentle, he asked elders. Soon after, falling ill from a batch of adulterated commercial curry powder was his turning point. That illness made him realize how dangerous unhygienic, chemically extracted spices could be, and how badly families needed clean, safe, and authentically stone-ground traditional spices."
  },
  aboutTimelineStep2Title: {
    type: String,
    default: "A Widespread Problem"
  },
  aboutTimelineStep2Text: {
    type: String,
    default: "A year later, during festive gatherings in Odisha, Biswajit inspected store-bought spices. The aroma was hollow, and the prices were high. Commercial factories were stripping the natural volatile essential oils to sell them separately to fragrance companies, replacing genuine pungency with cheap fillers, starch, and synthetic aroma. Beloved regional staples were either adulterated, overpriced, or ruined by high-speed industrial pulverizers. He realized this wasn’t an isolated problem—it was a nationwide challenge across every Indian kitchen."
  },
  aboutTimelineStep3Title: {
    type: String,
    default: "The Birth of a Movement"
  },
  aboutTimelineStep3Text: {
    type: String,
    default: "That’s how Chilika Spices was born—not in a corporate boardroom, but from an uncompromising personal promise rooted near the serene coastal waters and fertile soils of Chilika Lake, Odisha. Sourcing directly from rural farmers, sun-drying whole spices on clean woven mats, slow-roasting on iron skillets, and slow-grinding to lock in 100% natural essential oils. Chilika Spices became more than a brand—it became a movement to bring back India’s traditional flavours in a modern, healthy way."
  },

  // Grandmother / Founding Wisdom Quote
  founderQuoteOdia: {
    type: String,
    default: "ଯେଉଁ ବାସ୍ନା ଆଉ ସ୍ୱାଦ ପାରମ୍ପରିକ ହାତବଟା ମସଲାରେ ଥାଏ, ତାହା କୌଣସି ଫ୍ୟାକ୍ଟ୍ରି ମେସିନ୍‌ ଦେଇପାରିବ ନାହିଁ। ନିର୍ମଳ ମସଲା ଆଉ ଭଲପାଇବା ହିଁ ଅସଲ ସ୍ୱାଦ।"
  },
  founderQuoteEnglish: {
    type: String,
    default: "The aroma and soul that comes from traditional hand-roasted and stone-ground spices can never be found in a factory machine. Pure spices and patience are the secret ingredients."
  },
  founderQuoteAuthor: {
    type: String,
    default: "— Bou (Grandmother), Founding Inspiration"
  },

  // Founder Profile & "My Pic" Section
  founderName: {
    type: String,
    default: "Biswajit Baral"
  },
  founderTitle: {
    type: String,
    default: "Founder & Master Blender"
  },
  founderBio: {
    type: String,
    default: "Growing up in Odisha, I watched grandma hand-pound whole spices on heavy stone mortars. Chilika Spices is my humble promise to safeguard that dying art, connect village farmers directly with food lovers, and bring honest, pure flavours to every home in India."
  },
  founderImage: {
    type: String,
    default: "/images/brand/founder.jpg"
  },
  founderBadge: {
    type: String,
    default: "Small-Batch Artisanal Milling"
  },

  // Brand Story Fallbacks (Legacy)
  brandStoryTitle: { type: String, default: "From the heart of Odisha to your kitchen" },
  brandStoryParagraph1: { type: String, default: "Rooted near the serene waters and fertile coastal lands of Chilika..." },
  brandStoryParagraph2: { type: String, default: "Chilika Spices brings the honest aroma..." },
  founderMessage: { type: String, default: "Growing up in Odisha, the aroma of fresh cumin..." },
  brandMission: { type: String, default: "To deliver authentic, unadulterated traditional Indian spices..." },
  brandVision: { type: String, default: "To celebrate regional culinary heritage..." },

  // Social Links
  instagramUrl: {
    type: String,
    default: "https://instagram.com"
  },
  youtubeUrl: {
    type: String,
    default: "https://youtube.com"
  },
  facebookUrl: {
    type: String,
    default: "https://facebook.com"
  },
  whatsappNumber: {
    type: String,
    default: "+91 98765 43210"
  },

  // Contact Info & Footer
  contactPhone: { type: String, default: "+91 98765 43210" },
  contactEmail: { type: String, default: "care@chilikaspices.com" },
  contactAddress: { type: String, default: "Chilika Spice Co., Old Town, Khordha / Puri District, Odisha, India" },
  footerAboutText: {
    type: String,
    default: "Authentic spices inspired by the flavours, traditions and kitchens of Odisha. Sourced directly from village growers and stone-ground to preserve every ounce of pure aroma."
  },
  fssaiLicenseNumber: {
    type: String,
    default: "12026001000189"
  },

  // FAQs (for /faq page)
  faqs: [{
    question: { type: String, required: true },
    answer: { type: String, required: true },
    category: { type: String, default: 'General' }
  }]
}, {
  timestamps: true
});

export const HomepageContent = mongoose.model('HomepageContent', homepageContentSchema);

