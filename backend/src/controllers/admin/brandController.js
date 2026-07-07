const Brand = require('../../models/Brand');

exports.getBrands = async (req, res, next) => {
  try {
    res.json(await Brand.findAllWithCounts());
  } catch (err) { next(err); }
};

exports.createBrand = async (req, res, next) => {
  try {
    const data = buildBrandData(req.body);
    if (!data.name) return res.status(400).json({ error: 'Brand name is required.' });
    const brand = await Brand.create(data);
    res.status(201).json(brand);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A brand with that slug already exists.' });
    next(err);
  }
};

exports.updateBrand = async (req, res, next) => {
  try {
    const data = buildBrandData(req.body);
    if (!data.name) return res.status(400).json({ error: 'Brand name is required.' });
    const brand = await Brand.update(req.params.id, data);
    if (!brand) return res.status(404).json({ error: 'Brand not found.' });
    res.json(brand);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A brand with that slug already exists.' });
    next(err);
  }
};

exports.deleteBrand = async (req, res, next) => {
  try {
    const count = await Brand.productCount(req.params.id);
    if (count > 0) {
      return res.status(409).json({ error: `Cannot delete: ${count} product(s) still use this brand.` });
    }
    await Brand.delete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildBrandData(body) {
  const name = (body.name || '').trim();
  const slug = (body.slug || name).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return {
    name,
    slug,
    sort_order: parseInt(body.sort_order) || 0,
    is_active:  body.is_active === true || body.is_active === 'true',
  };
}
