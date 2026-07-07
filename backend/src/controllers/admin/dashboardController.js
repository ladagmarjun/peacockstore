const Product = require('../../models/Product');
const Order   = require('../../models/Order');
const User    = require('../../models/User');

exports.dashboard = async (req, res, next) => {
  try {
    const [productCount, orderCount, userCount, revenue, recentOrders] = await Promise.all([
      Product.count(), Order.count(), User.count(), Order.revenue(),
      Order.findAll({ limit: 5 }),
    ]);
    res.json({ stats: { productCount, orderCount, userCount, revenue }, recentOrders });
  } catch (err) { next(err); }
};
