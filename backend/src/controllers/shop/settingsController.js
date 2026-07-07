const Setting = require('../../models/Setting');

// Public, read-only view of the settings the storefront needs.
exports.getSettings = async (req, res, next) => {
  try {
    const all = await Setting.all();
    res.json({ cart_enabled: all.cart_enabled !== false });
  } catch (err) { next(err); }
};
