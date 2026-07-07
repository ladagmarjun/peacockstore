const Category = require('../../models/Category');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (err) { next(err); }
};
