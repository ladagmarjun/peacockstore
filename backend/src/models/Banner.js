const db = require('../config/database');

const Banner = {
  async findAll({ activeOnly = false } = {}) {
    const where = activeOnly ? 'WHERE is_active = true' : '';
    const { rows } = await db.query(`SELECT * FROM banners ${where} ORDER BY sort_order, id`);
    return rows;
  },

  async findById(id) {
    const { rows } = await db.query('SELECT * FROM banners WHERE id=$1', [id]);
    return rows[0] || null;
  },

  async create({ image_url, headline, subtext, link_url, sort_order, is_active }) {
    const { rows } = await db.query(
      `INSERT INTO banners (image_url, headline, subtext, link_url, sort_order, is_active)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [image_url, headline, subtext, link_url, sort_order, is_active]
    );
    return rows[0];
  },

  async update(id, { image_url, headline, subtext, link_url, sort_order, is_active }) {
    const { rows } = await db.query(
      `UPDATE banners SET image_url=$1, headline=$2, subtext=$3, link_url=$4, sort_order=$5, is_active=$6
       WHERE id=$7 RETURNING *`,
      [image_url, headline, subtext, link_url, sort_order, is_active, id]
    );
    return rows[0] || null;
  },

  async delete(id) {
    await db.query('DELETE FROM banners WHERE id=$1', [id]);
  },
};

module.exports = Banner;
