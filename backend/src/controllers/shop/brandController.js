const Brand = require('../../models/Brand');

exports.getBrands = async (req, res, next) => {
  try {
    res.json(await Brand.findAll({ activeOnly: true }));
  } catch (err) { next(err); }
};
