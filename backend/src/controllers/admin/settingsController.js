const Setting = require('../../models/Setting');

exports.getSettings = async (req, res, next) => {
  try {
    res.json(await Setting.all());
  } catch (err) { next(err); }
};

exports.updateSettings = async (req, res, next) => {
  try {
    const { cart_enabled } = req.body;
    if (cart_enabled !== undefined) {
      await Setting.set('cart_enabled', cart_enabled === true || cart_enabled === 'true');
    }
    res.json(await Setting.all());
  } catch (err) { next(err); }
};
