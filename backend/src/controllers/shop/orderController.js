const Product = require('../../models/Product');
const Order   = require('../../models/Order');
const Setting = require('../../models/Setting');

exports.placeOrder = async (req, res, next) => {
  try {
    // Online ordering can be switched off site-wide from the admin.
    if (await Setting.get('cart_enabled') === false) {
      return res.status(403).json({ error: 'Online ordering is currently unavailable. Please shop via our marketplace or visit a store.' });
    }
    // Checkout requires a logged-in account ("cart, then login").
    if (!req.session.userId) {
      return res.status(401).json({ error: 'Please log in to place an order.' });
    }

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
