const Product  = require('../models/Product');
const Category = require('../models/Category');
const Order    = require('../models/Order');
const User     = require('../models/User');
const Store    = require('../models/Store');
const Banner   = require('../models/Banner');

// ─── Dashboard ────────────────────────────────────────────────────────────────
exports.dashboard = async (req, res, next) => {
  try {
    const [productCount, orderCount, userCount, revenue, recentOrders] = await Promise.all([
      Product.count(), Order.count(), User.count(), Order.revenue(),
      Order.findAll({ limit: 5 }),
    ]);
    res.json({ stats: { productCount, orderCount, userCount, revenue }, recentOrders });
  } catch (err) { next(err); }
};

// ─── Products ─────────────────────────────────────────────────────────────────
exports.getProducts = async (req, res, next) => {
  try {
    const [products, categories] = await Promise.all([
      Product.findAll({ activeOnly: false }),
      Category.findAll(),
    ]);
    res.json({ products, categories });
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const [product, categories] = await Promise.all([
      Product.findById(req.params.id),
      Category.findAll(),
    ]);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ product, categories });
  } catch (err) { next(err); }
};

exports.uploadImage = (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'No image uploaded.' });
  res.status(201).json({ url: `/uploads/products/${req.file.filename}` });
};

exports.createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(buildProductData(req.body));
    res.status(201).json(product);
  } catch (err) { next(err); }
};

exports.updateProduct = async (req, res, next) => {
  try {
    const product = await Product.update(req.params.id, buildProductData(req.body));
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) { next(err); }
};

exports.deleteProduct = async (req, res, next) => {
  try {
    await Product.delete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ─── Categories ─────────────────────────────────────────────────────────────
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAllWithCounts();
    res.json(categories);
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const data = buildCategoryData(req.body);
    if (!data.name) return res.status(400).json({ error: 'Category name is required.' });
    const category = await Category.create(data);
    res.status(201).json(category);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A category with that slug already exists.' });
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const data = buildCategoryData(req.body);
    if (!data.name) return res.status(400).json({ error: 'Category name is required.' });
    const category = await Category.update(req.params.id, data);
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json(category);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A category with that slug already exists.' });
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const count = await Category.productCount(req.params.id);
    if (count > 0) {
      return res.status(409).json({ error: `Cannot delete: ${count} product(s) still use this category.` });
    }
    await Category.delete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ─── Stores ─────────────────────────────────────────────────────────────────
exports.getStores = async (req, res, next) => {
  try {
    const stores = await Store.findAll();
    res.json(stores);
  } catch (err) { next(err); }
};

exports.createStore = async (req, res, next) => {
  try {
    const data = buildStoreData(req.body);
    if (!data.name || !data.address) return res.status(400).json({ error: 'Store name and address are required.' });
    const store = await Store.create(data);
    res.status(201).json(store);
  } catch (err) { next(err); }
};

exports.updateStore = async (req, res, next) => {
  try {
    const data = buildStoreData(req.body);
    if (!data.name || !data.address) return res.status(400).json({ error: 'Store name and address are required.' });
    const store = await Store.update(req.params.id, data);
    if (!store) return res.status(404).json({ error: 'Store not found.' });
    res.json(store);
  } catch (err) { next(err); }
};

exports.deleteStore = async (req, res, next) => {
  try {
    await Store.delete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ─── Banners (homepage slideshow) ─────────────────────────────────────────────
exports.getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.findAll();
    res.json(banners);
  } catch (err) { next(err); }
};

exports.createBanner = async (req, res, next) => {
  try {
    const data = buildBannerData(req.body);
    if (!data.image_url) return res.status(400).json({ error: 'A banner image is required.' });
    const banner = await Banner.create(data);
    res.status(201).json(banner);
  } catch (err) { next(err); }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const data = buildBannerData(req.body);
    if (!data.image_url) return res.status(400).json({ error: 'A banner image is required.' });
    const banner = await Banner.update(req.params.id, data);
    if (!banner) return res.status(404).json({ error: 'Banner not found.' });
    res.json(banner);
  } catch (err) { next(err); }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    await Banner.delete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ─── Orders ───────────────────────────────────────────────────────────────────
exports.getOrders = async (req, res, next) => {
  try {
    const orders = await Order.findAll({ status: req.query.status || null });
    res.json(orders);
  } catch (err) { next(err); }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) { next(err); }
};

exports.updateOrderStatus = async (req, res, next) => {
  try {
    const order = await Order.updateStatus(req.params.id, req.body.status);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) { next(err); }
};

// ─── Users ────────────────────────────────────────────────────────────────────
exports.getUsers = async (req, res, next) => {
  try {
    const users = await User.findAll();
    res.json(users);
  } catch (err) { next(err); }
};

exports.updateUser = async (req, res, next) => {
  try {
    const user = await User.update(req.params.id, {
      role:      req.body.role,
      is_active: req.body.is_active,
    });
    res.json(user);
  } catch (err) { next(err); }
};

// ─── Helper ───────────────────────────────────────────────────────────────────
function buildProductData(body) {
  const colors = [];
  if (body.color1) colors.push(body.color1);
  if (body.color2) colors.push(body.color2);
  if (body.color3) colors.push(body.color3);
  return {
    category_id:  parseInt(body.category_id),
    name:         body.name,
    slug:         body.slug || body.name.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
    description:  body.description,
    price:        parseFloat(body.price),
    was_price:    body.was_price ? parseFloat(body.was_price) : null,
    tag:          body.tag || null,
    brand:        body.brand ? body.brand.trim() : null,
    leather_type: body.leather_type,
    hardware:     body.hardware,
    dimensions:   body.dimensions,
    colors,
    images:       Array.isArray(body.images)
      ? body.images.filter(i => i && i.url).map(i => ({ url: i.url, color: i.color || null }))
      : [],
    links:        buildLinks(body),
    glyph:        body.glyph || '👜',
    stock:        parseInt(body.stock) || 0,
    is_active:    body.is_active === true || body.is_active === 'true',
  };
}

function buildCategoryData(body) {
  const name = (body.name || '').trim();
  const slug = (body.slug || name).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return {
    name,
    slug,
    sort_order: parseInt(body.sort_order) || 0,
  };
}

// Marketplace links: keep only the ones that actually have a URL.
function buildLinks(body) {
  const src = body.links && typeof body.links === 'object' ? body.links : body;
  const out = {};
  for (const key of ['shopee', 'lazada', 'tiktok']) {
    const url = (src[key] || src[`link_${key}`] || '').trim();
    if (url) out[key] = url;
  }
  return out;
}

function buildBannerData(body) {
  return {
    image_url:  (body.image_url || '').trim(),
    headline:   (body.headline || '').trim() || null,
    subtext:    (body.subtext || '').trim() || null,
    link_url:   (body.link_url || '').trim() || null,
    sort_order: parseInt(body.sort_order) || 0,
    is_active:  body.is_active === true || body.is_active === 'true',
  };
}

function buildStoreData(body) {
  return {
    name:       (body.name || '').trim(),
    address:    (body.address || '').trim(),
    hours:      (body.hours || '').trim() || 'Mon–Sun 10:00 AM – 9:00 PM',
    map_url:    (body.map_url || '').trim() || null,
    sort_order: parseInt(body.sort_order) || 0,
    is_active:  body.is_active === true || body.is_active === 'true',
  };
}
