const db = require('../config/database');

const Category = {
  async findAll() {
    const { rows } = await db.query('SELECT * FROM categories ORDER BY sort_order, name');
    return rows;
  },

  // Same as findAll but with how many products reference each category.
  async findAllWithCounts() {
    const { rows } = await db.query(`
      SELECT c.*, COUNT(p.id)::int AS product_count
      FROM categories c
      LEFT JOIN products p ON p.category_id = c.id
      GROUP BY c.id
      ORDER BY c.sort_order, c.name
    `);
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM categories WHERE id=$1', [id]);
    return rows[0] || null;
  },

  async create({ name, slug, sort_order }) {
    const { rows } = await db.query(
      'INSERT INTO categories (name, slug, sort_order) VALUES ($1, $2, $3) RETURNING *',
      [name, slug, sort_order]
    );
    return rows[0];
  },

  async update(id, { name, slug, sort_order }) {
    const { rows } = await db.query(
      'UPDATE categories SET name=$1, slug=$2, sort_order=$3 WHERE id=$4 RETURNING *',
      [name, slug, sort_order, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    await db.query('DELETE FROM categories WHERE id=$1', [id]);
  },

  async productCount(id) {
    const { rows } = await db.query('SELECT COUNT(*)::int AS n FROM products WHERE category_id=$1', [id]);
    return rows[0].n;
  },
};

module.exports = Category;
