const Store = require('../../models/Store');

exports.getStores = async (req, res, next) => {
  try {
    const stores = await Store.findAll({ activeOnly: true });
    res.json(stores);
  } catch (err) { next(err); }
};
