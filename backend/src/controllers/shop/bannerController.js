const Banner = require('../../models/Banner');

exports.getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.findAll({ activeOnly: true });
    res.json(banners);
  } catch (err) { next(err); }
};
