import { HomepageContent } from '../models/HomepageContent.js';

export const getHomepageContent = async (req, res) => {
  try {
    let content = await HomepageContent.findOne();
    if (!content) {
      content = await HomepageContent.create({
        heroHeadline: "From village to your kitchen",
        heroSubheadline: "Authentic spices inspired by the flavours, traditions and kitchens of Odisha.",
        heroBannerImage: "/images/brand/chilika-illustration.png",
        trustStripItems: [
          "Authentic Flavours",
          "Carefully Selected Spices",
          "Traditional Taste",
          "Packed With Care",
          "From Village To Kitchen"
        ],
        brandStoryTitle: "From the heart of Odisha to your kitchen",
        brandStoryParagraph1: "Rooted near the serene waters and fertile coastal lands of Chilika, our spice journey began with an age-old tradition: sun-drying whole spices on woven mats and slow-pounding them to preserve natural essential oils.",
        brandStoryParagraph2: "Chilika Spices brings the honest aroma and deep warmth of Odisha's everyday family kitchens directly to your home. Every spice batch is carefully selected, ground with traditional patience, and packed with care.",
        founderMessage: "Growing up in Odisha, the aroma of fresh cumin, mustard and roasted spices from our grandmother's kitchen was our warmest memory. We started Chilika Spices to share that pure, unhurried flavour with every home cook.",
        brandMission: "To deliver authentic, unadulterated traditional Indian spices packed with natural goodness from village kitchens to your table.",
        brandVision: "To celebrate regional culinary heritage through honest flavours, sustainable packaging, and timeless spice craftsmanship.",
        faqs: [
          {
            question: "Where do you deliver?",
            answer: "We deliver across all pin codes in India through trusted express courier partners."
          },
          {
            question: "How can I track my order?",
            answer: "Use our dedicated Track Order page by entering your unique Order ID (e.g. CHL-2026-000001) and phone number to see live status updates."
          },
          {
            question: "What payment methods are available?",
            answer: "We support Cash on Delivery (COD), UPI (Google Pay, PhonePe, Paytm), Net Banking, and Debit/Credit Cards."
          },
          {
            question: "How long does delivery take?",
            answer: "Orders are dispatched within 24-48 hours. Delivery usually takes 3-6 business days depending on your location."
          },
          {
            question: "How can I contact Chilika Spices?",
            answer: "You can reach us at care@chilikaspices.com or via WhatsApp/Phone at +91 98765 43210 from Monday to Saturday, 9 AM to 7 PM."
          },
          {
            question: "What is your return policy?",
            answer: "If your spice package arrived damaged or incorrect, contact us within 48 hours with a photo for an immediate replacement or full refund."
          }
        ]
      });
    } else {
      let needsSave = false;
      if (!content.newProductPromoBanner) {
        content.newProductPromoBanner = {
          tag: "NEW PRODUCT LAUNCH",
          title: "Chilika Coastal Fish Curry Blend (Machha Besara)",
          subtitle: "Authentic coastal mustard and cumin tempering for timeless fish curries and village delicacies.",
          image: "/images/products/machha-besara.jpg",
          buttonText: "Shop New Arrival",
          buttonLink: "/shop?sort=newest",
          priceText: "Special Launch: ₹85",
          isActive: true
        };
        needsSave = true;
      }
      if (!content.bestSellerPromoBanner) {
        content.bestSellerPromoBanner = {
          tag: "TOP BEST SELLER",
          title: "Royal Aromatic Garam Masala",
          subtitle: "Over 1,200+ households love our heirloom 12-spice recipe hand-roasted on iron skillets.",
          image: "/images/products/garam-masala-bowl.jpg",
          buttonText: "Explore Best Seller",
          buttonLink: "/shop?sort=popular",
          priceText: "Customer Favourite: ₹95",
          isActive: true
        };
        needsSave = true;
      }
      if (!content.whyChilikaItems || content.whyChilikaItems.length === 0) {
        content.whyChilikaItems = [
          {
            title: "Traditional Flavour",
            description: "Slow-pounded and stone-ground at low temperatures to ensure vital spice oils and signature pungency never evaporate."
          },
          {
            title: "Carefully Selected",
            description: "Each seed, pod, and root is hand-inspected for ripeness, aroma, and clean purity before entering the processing batch."
          },
          {
            title: "Made For Everyday Cooking",
            description: "Balanced flavours formulated for daily home kitchens — from comforting morning dalma to festive Sunday feasts."
          },
          {
            title: "From Village To Kitchen",
            description: "Direct relationships with farming communities around Chilika and Odisha hinterlands, packed with care and hygiene."
          }
        ];
        needsSave = true;
      }
      if (!content.founderImage) {
        content.founderImage = "/images/brand/founder.jpg";
        needsSave = true;
      }
      if (!content.founderName) {
        content.founderName = "Biswajit Baral";
        needsSave = true;
      }
      if (!content.founderTitle) {
        content.founderTitle = "Founder & Master Blender";
        needsSave = true;
      }
      if (!content.founderBio) {
        content.founderBio = "Growing up in Odisha, I watched grandma hand-pound whole spices on heavy stone mortars. Chilika Spices is my humble promise to safeguard that dying art, connect village farmers directly with food lovers, and bring honest, pure flavours to every home in India.";
        needsSave = true;
      }
      if (!content.founderQuoteOdia) {
        content.founderQuoteOdia = "ଯେଉଁ ବାସ୍ନା ଆଉ ସ୍ୱାଦ ପାରମ୍ପରିକ ହାତବଟା ମସଲାରେ ଥାଏ, ତାହା କୌଣସି ଫ୍ୟାକ୍ଟ୍ରି ମେସିନ୍‌ ଦେଇପାରିବ ନାହିଁ। ନିର୍ମଳ ମସଲା ଆଉ ଭଲପାଇବା ହିଁ ଅସଲ ସ୍ୱାଦ।";
        needsSave = true;
      }
      if (!content.founderQuoteEnglish) {
        content.founderQuoteEnglish = "The aroma and soul that comes from traditional hand-roasted and stone-ground spices can never be found in a factory machine. Pure spices and patience are the secret ingredients.";
        needsSave = true;
      }
      if (!content.instagramUrl) {
        content.instagramUrl = "https://instagram.com/chilikaspices";
        needsSave = true;
      }
      if (!content.youtubeUrl) {
        content.youtubeUrl = "https://youtube.com/@chilikaspices";
        needsSave = true;
      }
      if (!content.facebookUrl) {
        content.facebookUrl = "https://facebook.com/chilikaspices";
        needsSave = true;
      }
      if (!content.announcementText) {
        content.announcementText = "Authentic Indian spices from Odisha • Free shipping on orders above ₹499";
        needsSave = true;
      }
      if (!content.socialGalleryItems || content.socialGalleryItems.length === 0) {
        content.socialGalleryItems = [
          {
            image: '/images/products/turmeric.jpg',
            caption: 'Pure sun-dried Kandhamal turmeric root grinding',
            link: '/shop'
          },
          {
            image: '/images/brand/chilika-illustration.png',
            caption: 'Tradition meets daily cooking in Odisha homes',
            link: '/about'
          },
          {
            image: '/images/products/garam-masala-wa.jpg',
            caption: 'Handpicked whole spices slow-roasted in iron kadai',
            link: '/shop'
          },
          {
            image: '/images/products/chilli-powder-wa.jpg',
            caption: 'Fiery natural red chillies dried under village skies',
            link: '/shop'
          },
          {
            image: '/images/products/panch-phoron.jpg',
            caption: 'The golden crackle of authentic panch phoron tadka',
            link: '/shop'
          },
          {
            image: '/images/products/machha-besara.jpg',
            caption: 'Chilika mustard blend prepared for fresh coastal delicacies',
            link: '/shop'
          }
        ];
        needsSave = true;
      }
      if (!content.customTestimonials || content.customTestimonials.length === 0) {
        content.customTestimonials = [
          {
            userName: "Ananya Mishra",
            rating: 5,
            comment: "The aroma of this Garam Masala reminds me of my grandmother's kitchen in Puri. Pure and chemical-free!",
            productName: "Pure Garam Masala (Homemade)",
            isVerified: true
          },
          {
            userName: "Debashis Rout",
            rating: 5,
            comment: "Finest Kandhamal Turmeric. High curcumin, authentic vibrant colour, zero adulteration.",
            productName: "Turmeric Powder (Haldi)",
            isVerified: true
          },
          {
            userName: "Rashmi Rekha Parida",
            rating: 5,
            comment: "The Machha Besara blend is simply mind-blowing. Authentic mustard sharpness that completes fish curry.",
            productName: "Chilika Coastal Fish Curry Blend",
            isVerified: true
          }
        ];
        needsSave = true;
      }
      if (needsSave) {
        await content.save();
      }
    }
    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHomepageContent = async (req, res) => {
  try {
    let content = await HomepageContent.findOne();
    if (!content) {
      content = new HomepageContent(req.body);
    } else {
      Object.assign(content, req.body);
    }
    await content.save();
    res.json({ success: true, content, message: 'Homepage content updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
