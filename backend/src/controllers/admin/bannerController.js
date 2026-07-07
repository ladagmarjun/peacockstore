const Banner = require('../../models/Banner');

exports.getBanners = async (req, res, next) => {
  try {
    const banners = await Banner.findAll();
    res.json(banners);
  } catch (err) { next(err); }
};

exports.createBanner = async (req, res, next) => {
  try {
    const data = buildBannerData(req.body);
    if (!data.image_url) return res.status(400).json({ error: 'A banner image is required.' });
    const banner = await Banner.create(data);
    res.status(201).json(banner);
  } catch (err) { next(err); }
};

exports.updateBanner = async (req, res, next) => {
  try {
    const data = buildBannerData(req.body);
    if (!data.image_url) return res.status(400).json({ error: 'A banner image is required.' });
    const banner = await Banner.update(req.params.id, data);
    if (!banner) return res.status(404).json({ error: 'Banner not found.' });
    res.json(banner);
  } catch (err) { next(err); }
};

exports.deleteBanner = async (req, res, next) => {
  try {
    await Banner.delete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildBannerData(body) {
  return {
    image_url:  (body.image_url || '').trim(),
    headline:   (body.headline || '').trim() || null,
    subtext:    (body.subtext || '').trim() || null,
    link_url:   (body.link_url || '').trim() || null,
    sort_order: parseInt(body.sort_order) || 0,
    is_active:  body.is_active === true || body.is_active === 'true',
  };
}
