import { Product } from '../models/Product.js';
import { Category } from '../models/Category.js';
import { logAudit } from '../services/auditLogger.js';

// Helper to generate SEO friendly slug
const slugify = (text) => {
  return text
    .toString()
    .toLowerCase()
    .trim()
    .replace(/\s+/g, '-')
    .replace(/[^\w\-]+/g, '')
    .replace(/\-\-+/g, '-');
};

// @desc    Get all products with filtering, search and sorting
// @route   GET /api/products
export const getProducts = async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      rating,
      inStock,
      isFeatured,
      isBestSeller,
      isNewArrival,
      sort,
      page = 1,
      limit = 24
    } = req.query;

    const query = { isActive: true };

    // Search filter
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
        { subcategory: { $regex: search, $options: 'i' } },
        { ingredients: { $in: [new RegExp(search, 'i')] } }
      ];
    }

    // Category filter (supports slug or ObjectId)
    if (category && category !== 'all') {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await Category.findOne({ slug: category });
        if (cat) {
          query.category = cat._id;
        }
      }
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    // Rating
    if (rating) {
      query.rating = { $gte: Number(rating) };
    }

    // Stock availability
    if (inStock === 'true') {
      query.stock = { $gt: 0 };
    }

    // Specific tags
    if (isFeatured === 'true') query.isFeatured = true;
    if (isBestSeller === 'true') query.isBestSeller = true;
    if (isNewArrival === 'true') query.isNewArrival = true;

    // Sorting
    let sortOptions = { createdAt: -1 };
    if (sort === 'price-low') {
      sortOptions = { price: 1 };
    } else if (sort === 'price-high') {
      sortOptions = { price: -1 };
    } else if (sort === 'rating') {
      sortOptions = { rating: -1 };
    } else if (sort === 'popular' || sort === 'bestseller') {
      sortOptions = { isBestSeller: -1, rating: -1 };
    } else if (sort === 'newest') {
      sortOptions = { createdAt: -1 };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [products, totalCount] = await Promise.all([
      Product.find(query)
        .populate('category', 'name slug')
        .sort(sortOptions)
        .skip(skip)
        .limit(Number(limit)),
      Product.countDocuments(query)
    ]);

    res.json({
      success: true,
      products,
      page: Number(page),
      totalPages: Math.ceil(totalCount / Number(limit)),
      totalCount
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Best Sellers for horizontal carousel
// @route   GET /api/products/bestsellers
export const getBestSellers = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isBestSeller: true })
      .populate('category', 'name slug')
      .limit(10);
    
    // Fallback if none explicitly marked
    if (products.length === 0) {
      const topProducts = await Product.find({ isActive: true })
        .populate('category', 'name slug')
        .sort({ rating: -1 })
        .limit(8);
      return res.json({ success: true, products: topProducts });
    }

    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Featured Products
// @route   GET /api/products/featured
export const getFeaturedProducts = async (req, res) => {
  try {
    const products = await Product.find({ isActive: true, isFeatured: true })
      .populate('category', 'name slug')
      .limit(8);
    res.json({ success: true, products });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Product by Slug
// @route   GET /api/products/slug/:slug
export const getProductBySlug = async (req, res) => {
  try {
    const product = await Product.findOne({ slug: req.params.slug, isActive: true })
      .populate('category', 'name slug description');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Product by ID
// @route   GET /api/products/:id
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate('category', 'name slug description');
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }
    res.json({ success: true, product });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Get Related Products
// @route   GET /api/products/related/:id
export const getRelatedProducts = async (req, res) => {
  try {
    const current = await Product.findById(req.params.id);
    if (!current) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    let related = await Product.find({
      _id: { $ne: current._id },
      category: current.category,
      isActive: true
    })
      .populate('category', 'name slug')
      .limit(6);

    // If fewer than 4 related spices in the same category, backfill with other active spices
    if (related.length < 4) {
      const existingIds = [current._id, ...related.map((p) => p._id)];
      const others = await Product.find({
        _id: { $nin: existingIds },
        isActive: true
      })
        .populate('category', 'name slug')
        .limit(6 - related.length);

      related = [...related, ...others];
    }

    // Randomize/shuffle order for genuine random suggestions every time
    related = related.sort(() => 0.5 - Math.random());

    res.json({ success: true, products: related });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Create Product
// @route   POST /api/products
export const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      shortDescription,
      productImages,
      category,
      subcategory,
      ingredients,
      availableSizes,
      variants,
      price,
      compareAtPrice,
      discount,
      stock,
      sku,
      weight,
      isFeatured,
      isBestSeller,
      isNewArrival,
      isActive,
      howToUse,
      storageInfo,
      origin
    } = req.body;

    let slug = slugify(name);
    // Ensure slug uniqueness
    const existing = await Product.findOne({ slug });
    if (existing) {
      slug = `${slug}-${Date.now().toString().slice(-4)}`;
    }

    const product = await Product.create({
      name,
      slug,
      description,
      shortDescription,
      productImages: productImages && productImages.length ? productImages : ['/images/products/turmeric.jpg'],
      category,
      subcategory,
      ingredients: ingredients || [],
      availableSizes: availableSizes || ['100g', '250g', '500g'],
      variants: variants || [],
      price,
      compareAtPrice: compareAtPrice || 0,
      discount: discount || (compareAtPrice && compareAtPrice > price ? Math.round(((compareAtPrice - price) / compareAtPrice) * 100) : 0),
      stock: stock !== undefined ? stock : 50,
      sku: sku || `CHL-${Math.floor(1000 + Math.random() * 9000)}`,
      weight: weight || '',
      isFeatured: !!isFeatured,
      isBestSeller: !!isBestSeller,
      isNewArrival: !!isNewArrival,
      isActive: isActive !== undefined ? isActive : true,
      howToUse,
      storageInfo,
      origin: origin || 'Odisha, India'
    });

    await logAudit(req, {
      action: 'PRODUCT_CREATED',
      resourceType: 'Product',
      resourceId: product._id,
      details: { name: product.name, price: product.price, stock: product.stock }
    });

    res.status(201).json({ success: true, product, message: 'Product created successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Update Product
// @route   PUT /api/products/:id
export const updateProduct = async (req, res) => {
  try {
    const updateData = { ...req.body };
    if (updateData.name) {
      updateData.slug = slugify(updateData.name);
    }

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await logAudit(req, {
      action: 'PRODUCT_UPDATED',
      resourceType: 'Product',
      resourceId: updated._id,
      details: { name: updated.name, changes: req.body }
    });

    res.json({ success: true, product: updated, message: 'Product updated successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc    Admin: Delete Product
// @route   DELETE /api/products/:id
export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    await logAudit(req, {
      action: 'PRODUCT_DELETED',
      resourceType: 'Product',
      resourceId: req.params.id,
      details: { name: product.name }
    });

    res.json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
