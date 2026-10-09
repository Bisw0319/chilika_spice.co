import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Category } from '../models/Category.js';
import { Product } from '../models/Product.js';

dotenv.config();

const syncProducts = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/chilika_spices';
    console.log('[Sync] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);

    let categories = await Category.find();
    const getCatId = (slug) => {
      const c = categories.find((cat) => cat.slug === slug);
      return c ? c._id : categories[0]._id;
    };

    const productsData = [
      {
        name: 'Jeera Powder (Cumin Powder)',
        slug: 'jeera-powder',
        shortDescription: 'Pure. Strong Aroma. Organic - 100% Stone-Ground Cumin',
        description: 'Chilika Spices Pure Jeera Powder is slow stone-ground from premium whole cumin seeds to retain rich volatile aromatic oils and deep earthy aroma. 100% pure with no artificial preservatives, additives, or adulterants.',
        productImages: [
          '/images/products/jeera-powder-wa.jpg',
          '/images/products/cumin-pack.jpg',
          '/images/products/cumin.jpg'
        ],
        category: getCatId('ground-spices'),
        subcategory: 'Cumin',
        ingredients: ['100% Pure Slow-Ground Cumin Seeds (Cuminum cyminum)'],
        availableSizes: ['50g', '100g'],
        variants: [
          { size: '50g', price: 29, compareAtPrice: 32, discountPercent: 9, stock: 150, sku: 'CHL-JR-50' },
          { size: '100g', price: 58, compareAtPrice: 65, discountPercent: 11, stock: 120, sku: 'CHL-JR-100' }
        ],
        price: 29,
        compareAtPrice: 32,
        discount: 9,
        stock: 150,
        sku: 'CHL-JR-50',
        weight: '50g',
        rating: 4.9,
        numReviews: 24,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        howToUse: 'Sprinkle over curries, chaat, raita, dalma, and daily vegetable fries.',
        storageInfo: 'Store in an airtight container away from direct sunlight.',
        origin: 'Odisha Heritage Farms'
      },
      {
        name: 'Black Pepper Powder (Golmaricha Gunda)',
        slug: 'black-pepper-powder',
        shortDescription: 'Pure Black Pepper Powder with fresh pungent aroma and natural piperine.',
        description: 'Finely ground from whole sun-dried black peppercorns. Rich in natural essential piperine with bold peppery kick and sharp lingering fragrance. Adds vibrant heat to curries, soups, marinades, and herbal teas.',
        productImages: [
          '/images/products/black-pepper-powder-wa.jpg'
        ],
        category: getCatId('ground-spices'),
        subcategory: 'Black Pepper',
        ingredients: ['100% Pure Black Peppercorns (Piper nigrum)'],
        availableSizes: ['50g', '100g', '500g'],
        variants: [
          { size: '50g', price: 60, compareAtPrice: 65, discountPercent: 8, stock: 110, sku: 'CHL-BP-50' },
          { size: '100g', price: 120, compareAtPrice: 130, discountPercent: 8, stock: 85, sku: 'CHL-BP-100' },
          { size: '500g', price: 300, compareAtPrice: 330, discountPercent: 9, stock: 40, sku: 'CHL-BP-500' }
        ],
        price: 60,
        compareAtPrice: 65,
        discount: 8,
        stock: 110,
        sku: 'CHL-BP-50',
        weight: '50g',
        rating: 4.8,
        numReviews: 19,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        howToUse: 'Freshly dust over dishes towards the end of cooking or season salads and soups.',
        storageInfo: 'Keep sealed tightly in cool, dry pantry.',
        origin: 'Highland Farms, Odisha'
      },
      {
        name: 'Dalchin Powder (Cinnamon Powder)',
        slug: 'dalchin-cinnamon-powder',
        shortDescription: 'Premium Quality Cinnamon Powder with sweet warm aroma.',
        description: 'Chilika Spices Dalchin Powder is hand-selected from prime fragrant cinnamon rolls, slow-milled to preserve sweet woody notes and comforting warmth. 100% natural, unadulterated spice perfect for gravies, biryani, and baking.',
        productImages: [
          '/images/products/dalchin-powder-wa.jpg'
        ],
        category: getCatId('ground-spices'),
        subcategory: 'Cinnamon',
        ingredients: ['100% Pure Cinnamon Bark (Cinnamomum verum)'],
        availableSizes: ['50g', '100g', '500g'],
        variants: [
          { size: '50g', price: 26, compareAtPrice: 32, discountPercent: 19, stock: 120, sku: 'CHL-DC-50' },
          { size: '100g', price: 52, compareAtPrice: 60, discountPercent: 13, stock: 95, sku: 'CHL-DC-100' },
          { size: '500g', price: 260, compareAtPrice: 270, discountPercent: 4, stock: 30, sku: 'CHL-DC-500' }
        ],
        price: 26,
        compareAtPrice: 32,
        discount: 19,
        stock: 120,
        sku: 'CHL-DC-50',
        weight: '50g',
        rating: 4.9,
        numReviews: 15,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: true,
        howToUse: 'Add 1/4 teaspoon in curries, pulao, desserts, or morning masala chai.',
        storageInfo: 'Store in dry airtight container.',
        origin: 'Forest Collectives, Odisha'
      },
      {
        name: 'Curry Powder (No Onion, No Garlic)',
        slug: 'curry-powder-no-onion-garlic',
        shortDescription: '100% Pure without onion garlic - Satvik Odia Tarkari Powder.',
        description: 'Signature Satvik blend crafted strictly without onion or garlic. Made from freshly milled coriander, golden turmeric, cumin, fenugreek, brown mustard, and heritage spices. Provides rich body and authentic Odia flavor to everyday vegetable curries, dalma, and stir fries.',
        productImages: [
          '/images/products/curry-powder-wa.jpg'
        ],
        category: getCatId('masala-blends'),
        subcategory: 'Curry Powder',
        ingredients: ['Coriander', 'Turmeric', 'Cumin', 'Fenugreek', 'Mustard', 'Ginger', 'Cardamom', 'Bay Leaves'],
        availableSizes: ['50g', '100g', '500g'],
        variants: [
          { size: '50g', price: 23, compareAtPrice: 26, discountPercent: 12, stock: 140, sku: 'CHL-CP-50' },
          { size: '100g', price: 46, compareAtPrice: 52, discountPercent: 12, stock: 110, sku: 'CHL-CP-100' },
          { size: '500g', price: 230, compareAtPrice: 240, discountPercent: 4, stock: 45, sku: 'CHL-CP-500' }
        ],
        price: 23,
        compareAtPrice: 26,
        discount: 12,
        stock: 140,
        sku: 'CHL-CP-50',
        weight: '50g',
        rating: 4.9,
        numReviews: 28,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        howToUse: 'Add 1 tablespoon while sauteing vegetables or cooking dalma.',
        storageInfo: 'Airtight spice container away from heat.',
        origin: 'Chilika Lake Coast, Odisha'
      },
      {
        name: 'Authentic Odia Masala Badi',
        slug: 'authentic-odia-masala-badi',
        shortDescription: 'Sun-Dried Spiced Lentil Dumplings with Ajwain & Jeera.',
        description: 'Traditional village-style sun-dried lentil dumplings handcrafted from black gram (biri dal) infused with aromatic ajwain (carom seeds), cumin, and secret grandmother spices. Naturally sun-dried under open skies. Crisp, crunchy, and richly fragrant when fried in hot mustard oil.',
        productImages: [
          '/images/products/masala-badi-wa.jpg'
        ],
        category: getCatId('coastal-blends'),
        subcategory: 'Odia Badi',
        ingredients: ['Black Gram (Biri Dal)', 'Ajwain (Carom Seeds)', 'Jeera (Cumin)', 'Hing', 'Rock Salt', 'Spices'],
        availableSizes: ['100g', '200g'],
        variants: [
          { size: '100g', price: 35, compareAtPrice: 37, discountPercent: 5, stock: 100, sku: 'CHL-MBADI-100' },
          { size: '200g', price: 70, compareAtPrice: 75, discountPercent: 7, stock: 80, sku: 'CHL-MBADI-200' }
        ],
        price: 35,
        compareAtPrice: 37,
        discount: 5,
        stock: 100,
        sku: 'CHL-MBADI-100',
        weight: '100g',
        rating: 5.0,
        numReviews: 31,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: true,
        howToUse: 'Shallow fry in mustard oil until golden brown. Crush over dalma, saga bhaja, or santula.',
        storageInfo: 'Keep completely moisture-free in airtight jar.',
        origin: 'Rural Women Collectives, Odisha'
      },
      {
        name: 'Traditional Pure Biri Badi',
        slug: 'traditional-pure-biri-badi',
        shortDescription: 'Pure Sun-Dried Lentil Dumplings - Handcrafted Village Recipe.',
        description: 'Hand-piped pure urad dal (biri) sun-dried dumplings made following age-old Odia cottage recipes. Light, airy, and delicately crisp. The quintessential staple of coastal Odisha home kitchens.',
        productImages: [
          '/images/products/biri-badi-wa.jpg'
        ],
        category: getCatId('coastal-blends'),
        subcategory: 'Odia Badi',
        ingredients: ['100% Pure Black Gram (Biri Dal)', 'Water', 'A pinch of salt'],
        availableSizes: ['100g', '200g'],
        variants: [
          { size: '100g', price: 25, compareAtPrice: 27, discountPercent: 7, stock: 120, sku: 'CHL-BBADI-100' },
          { size: '200g', price: 50, compareAtPrice: 55, discountPercent: 9, stock: 90, sku: 'CHL-BBADI-200' }
        ],
        price: 25,
        compareAtPrice: 27,
        discount: 7,
        stock: 120,
        sku: 'CHL-BBADI-100',
        weight: '100g',
        rating: 4.8,
        numReviews: 22,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: true,
        howToUse: 'Fry in ghee or mustard oil until pale golden. Enjoy as side dish or add to curries.',
        storageInfo: 'Keep in dry airtight container.',
        origin: 'Village Collectives, Odisha'
      },
      {
        name: 'Turmeric Powder (Haldi)',
        slug: 'pure-kandhamal-turmeric-powder',
        shortDescription: 'Pure Homemade Haldi Powder - High Curcumin Golden Yellow',
        description: 'Chilika Spices Pure Homemade Haldi Powder is harvested from highland village farms of Odisha. Sun-dried on bamboo mats and slowly ground at low temperatures, it preserves its intense golden colour, earthy fragrance, and natural curcumin content. Ideal for curries, dalma, and golden turmeric milk.',
        productImages: [
          '/images/products/haldi-powder-wa.jpg',
          '/images/products/turmeric-pack.jpg',
          '/images/products/turmeric.jpg'
        ],
        category: getCatId('ground-spices'),
        subcategory: 'Turmeric',
        ingredients: ['100% Pure Highland Turmeric Rhizomes (Curcuma longa)'],
        availableSizes: ['50g', '100g', '250g', '500g', '1kg'],
        variants: [
          { size: '50g', price: 18, compareAtPrice: 20, discountPercent: 10, stock: 150, sku: 'CHL-TUR-50' },
          { size: '100g', price: 36, compareAtPrice: 38, discountPercent: 5, stock: 120, sku: 'CHL-TUR-100' },
          { size: '250g', price: 85, compareAtPrice: 95, discountPercent: 11, stock: 80, sku: 'CHL-TUR-250' },
          { size: '500g', price: 165, compareAtPrice: 190, discountPercent: 13, stock: 60, sku: 'CHL-TUR-500' },
          { size: '1kg', price: 320, compareAtPrice: 370, discountPercent: 14, stock: 35, sku: 'CHL-TUR-1000' }
        ],
        price: 18,
        compareAtPrice: 20,
        discount: 10,
        stock: 150,
        sku: 'CHL-TUR-50',
        weight: '50g',
        rating: 4.9,
        numReviews: 48,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        howToUse: 'Add 1/2 teaspoon during tempering or simmering vegetables and gravies.',
        storageInfo: 'Store in an airtight container away from moisture.',
        origin: 'Kandhamal Highland Region, Odisha'
      },
      {
        name: 'Chilli Powder (Mirchi Powder)',
        slug: 'fiery-odia-red-chilli-powder',
        shortDescription: 'No added Color and chemical free - 100% Pure Sun-Dried Red Chilli',
        description: 'Chilika Spices Chilli Powder is made from whole stemless red chillies sun-dried and stone-ground without artificial food colouring, adulterants, or chemical additives. Delivers a vibrant natural scarlet red hue and balanced medium-high pungent warmth.',
        productImages: [
          '/images/products/chilli-powder-wa.jpg',
          '/images/products/chilli-pack.jpg',
          '/images/products/chilli.jpg'
        ],
        category: getCatId('ground-spices'),
        subcategory: 'Chilli',
        ingredients: ['Stemless Whole Dried Red Chillies (Capsicum annuum)'],
        availableSizes: ['50g', '100g', '200g', '500g'],
        variants: [
          { size: '50g', price: 23, compareAtPrice: 25, discountPercent: 8, stock: 130, sku: 'CHL-CHL-50' },
          { size: '100g', price: 45, compareAtPrice: 55, discountPercent: 18, stock: 110, sku: 'CHL-CHL-100' },
          { size: '200g', price: 85, compareAtPrice: 105, discountPercent: 19, stock: 70, sku: 'CHL-CHL-200' },
          { size: '500g', price: 210, compareAtPrice: 250, discountPercent: 16, stock: 40, sku: 'CHL-CHL-500' }
        ],
        price: 23,
        compareAtPrice: 25,
        discount: 8,
        stock: 130,
        sku: 'CHL-CHL-50',
        weight: '50g',
        rating: 4.8,
        numReviews: 36,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        howToUse: 'Use 1/2 to 1 teaspoon in marinades, gravies, or tadka.',
        storageInfo: 'Keep sealed tightly in cool, dry pantry.',
        origin: 'Ganjam & Chilika Outskirts, Odisha'
      },
      {
        name: 'Pure Garam Masala (Homemade)',
        slug: 'royal-aromatic-garam-masala',
        shortDescription: 'Pure Homemade Garam Masala. Made with 100% whole spices.',
        description: 'Authentic village-ground pure Garam Masala from Chilika Spices. Handcrafted from premium whole cardamom, cinnamon, cloves, mace, star anise, and cumin. No fillers, artificial colours, or preservatives.',
        productImages: [
          '/images/products/garam-masala-wa.jpg',
          '/images/products/garam-masala.jpg',
          '/images/products/garam-masala-pack.jpg',
          '/images/products/garam-masala-whole.jpg',
          '/images/products/garam-masala-bowl.jpg',
          '/images/products/garam-masala-curry.jpg'
        ],
        category: getCatId('masala-blends'),
        subcategory: 'Garam Masala',
        ingredients: ['Cinnamon', 'Green Cardamom', 'Black Cardamom', 'Cloves', 'Star Anise', 'Nutmeg', 'Mace', 'Black Pepper', 'Cumin'],
        availableSizes: ['50g', '100g', '250g', '500g'],
        variants: [
          { size: '50g', price: 41, compareAtPrice: 45, discountPercent: 9, stock: 100, sku: 'CHL-GM-50' },
          { size: '100g', price: 82, compareAtPrice: 89, discountPercent: 8, stock: 80, sku: 'CHL-GM-100' },
          { size: '250g', price: 195, compareAtPrice: 220, discountPercent: 11, stock: 50, sku: 'CHL-GM-250' },
          { size: '500g', price: 380, compareAtPrice: 420, discountPercent: 10, stock: 30, sku: 'CHL-GM-500' }
        ],
        price: 41,
        compareAtPrice: 45,
        discount: 9,
        stock: 100,
        sku: 'CHL-GM-50',
        weight: '50g',
        rating: 5.0,
        numReviews: 54,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        howToUse: 'Sprinkle 1/2 teaspoon towards the final 2 minutes of cooking curries or biryanis.',
        storageInfo: 'Store in airtight tin or dark glass jar.',
        origin: 'Chilika Spices Heritage Kitchen, Odisha'
      },
      {
        name: 'Authentic Odisha Panch Phoron',
        slug: 'authentic-odisha-panch-phoron',
        shortDescription: 'The classic 5-spice tempering blend for lentils, vegetable fries, and pickles.',
        description: 'Equal balanced ratio of five pure whole seeds: fennel (saunf), cumin (jeera), fenugreek (methi), brown mustard (rai), and nigella (kalonji). Creates the unforgettable signature aroma of Eastern Indian village kitchens.',
        productImages: [
          '/images/products/panch-phoron.jpg',
          '/images/products/panch-phoron-pack.jpg'
        ],
        category: getCatId('whole-spices'),
        subcategory: 'Whole Seeds',
        ingredients: ['Fennel Seeds', 'Cumin Seeds', 'Fenugreek Seeds', 'Mustard Seeds', 'Nigella Seeds (Kalonji)'],
        availableSizes: ['100g', '200g', '500g'],
        variants: [
          { size: '100g', price: 55, compareAtPrice: 70, discountPercent: 21, stock: 110, sku: 'CHL-PP-100' },
          { size: '200g', price: 100, compareAtPrice: 130, discountPercent: 23, stock: 65, sku: 'CHL-PP-200' },
          { size: '500g', price: 230, compareAtPrice: 299, discountPercent: 23, stock: 45, sku: 'CHL-PP-500' }
        ],
        price: 55,
        compareAtPrice: 70,
        discount: 21,
        stock: 110,
        sku: 'CHL-PP-100',
        weight: '100g',
        rating: 4.9,
        numReviews: 29,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        howToUse: 'Splutter 1 teaspoon in smoking mustard oil before adding vegetables or lentils.',
        storageInfo: 'Store in a dry container.',
        origin: 'Rural Farming Collectives, Odisha'
      },
      {
        name: 'Dhania Powder (Coriander Powder)',
        slug: 'freshly-ground-coriander-powder-dhania',
        shortDescription: 'Pure Coriander Powder with Strong Aroma - 100% Stone-Ground',
        description: 'Chilika Spices Pure Dhania Powder is made strictly from whole plump coriander seeds packed with natural aromatic essential oils. Adds refreshing citrusy depth, thickens gravies, and enriches every curry with authentic village freshness.',
        productImages: [
          '/images/products/dhania-powder-wa.jpg',
          '/images/products/coriander-pack.jpg',
          '/images/products/coriander.jpg'
        ],
        category: getCatId('ground-spices'),
        subcategory: 'Coriander',
        ingredients: ['Whole Coriander Seeds (Coriandrum sativum)'],
        availableSizes: ['50g', '100g', '250g', '500g'],
        variants: [
          { size: '50g', price: 16, compareAtPrice: 18, discountPercent: 11, stock: 140, sku: 'CHL-DH-50' },
          { size: '100g', price: 32, compareAtPrice: 36, discountPercent: 11, stock: 110, sku: 'CHL-DH-100' },
          { size: '250g', price: 75, compareAtPrice: 85, discountPercent: 12, stock: 65, sku: 'CHL-DH-250' },
          { size: '500g', price: 145, compareAtPrice: 170, discountPercent: 15, stock: 40, sku: 'CHL-DH-500' }
        ],
        price: 16,
        compareAtPrice: 18,
        discount: 11,
        stock: 140,
        sku: 'CHL-DH-50',
        weight: '50g',
        rating: 4.8,
        numReviews: 22,
        isFeatured: false,
        isBestSeller: true,
        isNewArrival: false,
        howToUse: 'Combine with turmeric and chilli powder as the foundational base for curries.',
        storageInfo: 'Airtight dry container.',
        origin: 'Odisha Farms'
      },
      {
        name: 'Chilika Coastal Fish Curry Blend (Machha Besara)',
        slug: 'chilika-coastal-fish-curry-blend-machha-besara',
        shortDescription: 'Signature yellow mustard, cumin, and dried mango blend for coastal curries.',
        description: 'The pride of Chilika lake fisher communities. A balanced dry spice blend combining sharp yellow mustard, roasted cumin, garlic, and dried green mango powder. Perfect for creating the authentic, tangy mustard gravy known as Machha Besara.',
        productImages: [
          '/images/products/machha-besara.jpg',
          '/images/products/machha-besara-pack.jpg'
        ],
        category: getCatId('coastal-blends'),
        subcategory: 'Specialty Blends',
        ingredients: ['Yellow Mustard Seeds', 'Cumin', 'Dry Garlic', 'Amchur (Dry Mango)', 'Turmeric', 'Fenugreek', 'Chilli'],
        availableSizes: ['100g', '250g'],
        variants: [
          { size: '100g', price: 95, compareAtPrice: 125, discountPercent: 24, stock: 65, sku: 'CHL-MB-100' },
          { size: '250g', price: 220, compareAtPrice: 280, discountPercent: 21, stock: 40, sku: 'CHL-MB-250' }
        ],
        price: 95,
        compareAtPrice: 125,
        discount: 24,
        stock: 65,
        sku: 'CHL-MB-100',
        weight: '100g',
        rating: 5.0,
        numReviews: 42,
        isFeatured: true,
        isBestSeller: true,
        isNewArrival: false,
        howToUse: 'Make a quick paste with warm water and simmer with fresh fish or vegetables.',
        storageInfo: 'Store in a cool dry spice jar.',
        origin: 'Chilika Lake Coast, Odisha'
      }
    ];

    console.log(`[Sync] Upserting ${productsData.length} products...`);
    for (const p of productsData) {
      await Product.findOneAndUpdate(
        { slug: p.slug },
        { $set: p },
        { upsert: true, new: true }
      );
      console.log(`  ✓ Synced: ${p.name}`);
    }

    // Clean up duplicate old cumin slug if present
    await Product.deleteOne({ slug: 'aromatic-roasted-cumin-powder-bhuna-jeera' });

    const total = await Product.countDocuments();
    console.log(`[Sync] Finished! Total active products in DB: ${total}`);
    process.exit(0);
  } catch (err) {
    console.error('[Sync] Error:', err);
    process.exit(1);
  }
};

syncProducts();
