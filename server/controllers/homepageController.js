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
            answer: "Use our dedicated Track Order page by entering your unique Order ID and phone number to see live status updates."
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
        ],
        whyChilikaItems: [
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
        ],
        founderName: "Biswajit Baral",
        founderTitle: "Founder & Master Blender",
        founderBio: "Growing up in Odisha, I watched grandma hand-pound whole spices on heavy stone mortars. Chilika Spices is my humble promise to safeguard that dying art, connect village farmers directly with food lovers, and bring honest, pure flavours to every home in India."
      });
    }

    res.json({ success: true, content });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHomepageContent = async (req, res) => {
  try {
    // Atomic direct update in MongoDB Atlas without dropping deletions
    const updated = await HomepageContent.findOneAndUpdate(
      {},
      { $set: req.body },
      { new: true, upsert: true, runValidators: true }
    );
    res.json({ success: true, content: updated, message: 'Homepage content updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
