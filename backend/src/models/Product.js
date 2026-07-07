const db = require('../config/database');

const Product = {
  async findAll({ categorySlug, activeOnly = true } = {}) {
    let q = `
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE 1=1
    `;
    const params = [];
    if (activeOnly) { params.push(true); q += ` AND p.is_active = $${params.length}`; }
    if (categorySlug && categorySlug !== 'all') {
      params.push(categorySlug);
      q += ` AND c.slug = $${params.length}`;
    }
    q += ' ORDER BY p.created_at DESC';
    const { rows } = await db.query(q, params);
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.id = $1
    `, [id]);
    return rows[0] || null;
  },

  async findBySlug(slug) {
    const { rows } = await db.query(`
      SELECT p.*, c.name AS category_name, c.slug AS category_slug
      FROM products p
      JOIN categories c ON c.id = p.category_id
      WHERE p.slug = $1 AND p.is_active = true
    `, [slug]);
    return rows[0] || null;
  },

  async create(data) {
    const { rows } = await db.query(`
      INSERT INTO products
        (category_id, name, slug, description, price, was_price, tag, brand,
         leather_type, hardware, dimensions, colors, images, links, glyph, stock, is_active)
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17)
      RETURNING *
    `, [
      data.category_id, data.name, data.slug, data.description,
      data.price, data.was_price || null, data.tag || null, data.brand || null,
      data.leather_type, data.hardware, data.dimensions,
      JSON.stringify(data.colors || []), JSON.stringify(data.images || []),
      JSON.stringify(data.links || {}),
      data.glyph || '👜', data.stock || 0, data.is_active !== false,
    ]);
    return rows[0];
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    const allowed = [
      'category_id','name','slug','description','price','was_price','tag',
      'brand','leather_type','hardware','dimensions','colors','images','links','glyph','stock','is_active','image_url',
    ];
    for (const key of allowed) {
      if (data[key] !== undefined) {
        params.push(key === 'colors' || key === 'images' || key === 'links' ? JSON.stringify(data[key]) : data[key]);
        fields.push(`${key} = $${params.length}`);
      }
    }
    if (!fields.length) return null;
    params.push(new Date(), id);
    const { rows } = await db.query(
      `UPDATE products SET ${fields.join(', ')}, updated_at = $${params.length - 1}
       WHERE id = $${params.length} RETURNING *`,
      params
    );
    return rows[0] || null;
  },

  async delete(id) {
    await db.query('DELETE FROM products WHERE id = $1', [id]);
  },

  async count() {
    const { rows } = await db.query('SELECT COUNT(*) FROM products');
    return parseInt(rows[0].count);
  },
};

module.exports = Product;
