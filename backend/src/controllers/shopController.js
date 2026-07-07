const Product  = require('../models/Product');
const Category = require('../models/Category');
const Order    = require('../models/Order');
const Store    = require('../models/Store');
const Banner   = require('../models/Banner');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) { next(err); }
};

exports.getStores = async (req, res, next) => {
  try {
    const stores = await Store.findAll({ activeOnly: true });
    res.json(stores);
  } catch (err) { next(err); }
};

exports.getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.findAll({ activeOnly: true });
    res.json(banners);
  } catch (err) { next(err); }
};

exports.getProducts = async (req, res, next) => {
  try {
    const products = await Product.findAll({ categorySlug: req.query.cat, activeOnly: true });
    res.json(products);
  } catch (err) { next(err); }
};

exports.getProduct = async (req, res, next) => {
  try {
    const product = await Product.findBySlug(req.params.slug);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) { next(err); }
};

exports.getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product || !product.is_active) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) { next(err); }
};

exports.placeOrder = async (req, res, next) => {
  try {
    const {
      customer_name, customer_email, customer_phone,
      shipping_address, city, province, postal_code,
      payment_method, notes, items,
    } = req.body;

    if (!items || !items.length) return res.status(400).json({ error: 'No items in order.' });
    if (!customer_name || !customer_email || !shipping_address) {
      return res.status(400).json({ error: 'Name, email and address are required.' });
    }

    const parsedItems = [];
    let total = 0;
    for (const item of items) {
      const product = await Product.findById(item.product_id);
      if (!product || !product.is_active) continue;
      const qty       = Math.max(1, parseInt(item.quantity) || 1);
      const unitPrice = parseFloat(product.price);
      total += unitPrice * qty;
      parsedItems.push({ product_id: product.id, quantity: qty, unit_price: unitPrice, color: item.color || null });
    }
    if (!parsedItems.length) return res.status(400).json({ error: 'No valid products in order.' });

    const order = await Order.create({
      user_id: req.session.userId || null,
      customer_name, customer_email, customer_phone,
      shipping_address, city, province, postal_code,
      total_amount: total, payment_method: payment_method || 'cod', notes,
    }, parsedItems);

    res.status(201).json({ success: true, order_id: order.id });
  } catch (err) { next(err); }
};

exports.getOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    res.json(order);
  } catch (err) { next(err); }
};
