const Product  = require('../../models/Product');
const Category = require('../../models/Category');

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

// ─── Helpers ──────────────────────────────────────────────────────────────────
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
