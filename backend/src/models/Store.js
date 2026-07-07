const db = require('../config/database');

const Store = {
  async findAll({ activeOnly = false } = {}) {
    const where = activeOnly ? 'WHERE is_active = true' : '';
    const { rows } = await db.query(`SELECT * FROM stores ${where} ORDER BY sort_order, name`);
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM stores WHERE id=$1', [id]);
    return rows[0] || null;
  },

  async create({ name, address, hours, map_url, sort_order, is_active }) {
    const { rows } = await db.query(
      `INSERT INTO stores (name, address, hours, map_url, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, address, hours, map_url, sort_order, is_active]
    );
    return rows[0];
  },

  async update(id, { name, address, hours, map_url, sort_order, is_active }) {
    const { rows } = await db.query(
      `UPDATE stores SET name=$1, address=$2, hours=$3, map_url=$4, sort_order=$5, is_active=$6
       WHERE id=$7 RETURNING *`,
      [name, address, hours, map_url, sort_order, is_active, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    await db.query('DELETE FROM stores WHERE id=$1', [id]);
  },
};

module.exports = Store;
