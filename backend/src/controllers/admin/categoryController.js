const Category = require('../../models/Category');

exports.getCategories = async (req, res, next) => {
  try {
    const categories = await Category.findAllWithCounts();
    res.json(categories);
  } catch (err) { next(err); }
};

exports.createCategory = async (req, res, next) => {
  try {
    const data = buildCategoryData(req.body);
    if (!data.name) return res.status(400).json({ error: 'Category name is required.' });
    const category = await Category.create(data);
    res.status(201).json(category);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A category with that slug already exists.' });
    next(err);
  }
};

exports.updateCategory = async (req, res, next) => {
  try {
    const data = buildCategoryData(req.body);
    if (!data.name) return res.status(400).json({ error: 'Category name is required.' });
    const category = await Category.update(req.params.id, data);
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json(category);
  } catch (err) {
    if (err.code === '23505') return res.status(409).json({ error: 'A category with that slug already exists.' });
    next(err);
  }
};

exports.deleteCategory = async (req, res, next) => {
  try {
    const count = await Category.productCount(req.params.id);
    if (count > 0) {
      return res.status(409).json({ error: `Cannot delete: ${count} product(s) still use this category.` });
    }
    await Category.delete(req.params.id);
    res.json({ success: true });
  } catch (err) { next(err); }
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
function buildCategoryData(body) {
  const name = (body.name || '').trim();
  const slug = (body.slug || name).toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
  return {
    name,
    slug,
    sort_order: parseInt(body.sort_order) || 0,
  };
}
