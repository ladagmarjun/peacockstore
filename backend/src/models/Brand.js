const db = require('../config/database');

// Brands are matched to products by name (products.brand stores the brand name).
const Brand = {
  async findAll({ activeOnly = false } = {}) {
    let q = 'SELECT * FROM brands';
    if (activeOnly) q += ' WHERE is_active = true';
    q += ' ORDER BY sort_order, name';
    const { rows } = await db.query(q);
    return rows;
  },

  // Same as findAll but with how many products carry each brand.
  async findAllWithCounts() {
    const { rows } = await db.query(`
      SELECT b.*, COUNT(p.id)::int AS product_count
      FROM brands b
      LEFT JOIN products p ON p.brand = b.name
      GROUP BY b.id
      ORDER BY b.sort_order, b.name
    `);
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM brands WHERE id=$1', [id]);
    return rows[0] || null;
  },

  async create({ name, slug, sort_order, is_active }) {
    const { rows } = await db.query(
      'INSERT INTO brands (name, slug, sort_order, is_active) VALUES ($1, $2, $3, $4) RETURNING *',
      [name, slug, sort_order, is_active]
    );
    return rows[0];
  },

  async update(id, { name, slug, sort_order, is_active }) {
    const { rows } = await db.query(
      'UPDATE brands SET name=$1, slug=$2, sort_order=$3, is_active=$4 WHERE id=$5 RETURNING *',
      [name, slug, sort_order, is_active, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    await db.query('DELETE FROM brands WHERE id=$1', [id]);
  },

  async productCount(id) {
    const brand = await this.findById(id);
    if (!brand) return 0;
    const { rows } = await db.query('SELECT COUNT(*)::int AS n FROM products WHERE brand=$1', [brand.name]);
    return rows[0].n;
  },
};

module.exports = Brand;
