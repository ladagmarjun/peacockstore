const db = require('../config/database');

const Order = {
  async create(data, items) {
    const client = await db.pool.connect();
    try {
      await client.query('BEGIN');
      const { rows } = await client.query(`
        INSERT INTO orders
          (user_id, customer_name, customer_email, customer_phone,
           shipping_address, city, province, postal_code,
           total_amount, payment_method, notes)
        VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
        RETURNING *
      `, [
        data.user_id || null, data.customer_name, data.customer_email,
        data.customer_phone || null, data.shipping_address,
        data.city || null, data.province || null, data.postal_code || null,
        data.total_amount, data.payment_method || 'cod', data.notes || null,
      ]);
      const order = rows[0];
      for (const item of items) {
        await client.query(`
          INSERT INTO order_items (order_id, product_id, quantity, unit_price, color)
          VALUES ($1,$2,$3,$4,$5)
        `, [order.id, item.product_id, item.quantity, item.unit_price, item.color || null]);
      }
      await client.query('COMMIT');
      return order;
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      client.release();
    }
  },

  async findById(id) {
    const { rows } = await db.query(`
      SELECT o.*,
        json_agg(json_build_object(
          'id', oi.id, 'product_id', oi.product_id, 'quantity', oi.quantity,
          'unit_price', oi.unit_price, 'color', oi.color,
          'product_name', p.name, 'glyph', p.glyph
        )) AS items
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      LEFT JOIN products p    ON p.id = oi.product_id
      WHERE o.id = $1
      GROUP BY o.id
    `, [id]);
    return rows[0] || null;
  },

  async findAll({ status, limit = 50, offset = 0 } = {}) {
    let q = `
      SELECT o.*, COUNT(oi.id)::int AS item_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE 1=1
    `;
    const params = [];
    if (status) { params.push(status); q += ` AND o.status=$${params.length}`; }
    params.push(limit, offset);
    q += ` GROUP BY o.id ORDER BY o.created_at DESC LIMIT $${params.length-1} OFFSET $${params.length}`;
    const { rows } = await db.query(q, params);
    return rows;
  },

  async findByUser(userId) {
    const { rows } = await db.query(`
      SELECT o.*, COUNT(oi.id)::int AS item_count
      FROM orders o
      LEFT JOIN order_items oi ON oi.order_id = o.id
      WHERE o.user_id = $1
      GROUP BY o.id ORDER BY o.created_at DESC
    `, [userId]);
    return rows;
  },

  async updateStatus(id, status) {
    const { rows } = await db.query(
      'UPDATE orders SET status=$1, updated_at=NOW() WHERE id=$2 RETURNING *',
      [status, id]
    );
    return rows[0] || null;
  },

  async count() {
    const { rows } = await db.query('SELECT COUNT(*) FROM orders');
    return parseInt(rows[0].count);
  },

  async revenue() {
    const { rows } = await db.query(
      "SELECT COALESCE(SUM(total_amount),0) AS total FROM orders WHERE status != 'cancelled'"
    );
    return parseFloat(rows[0].total);
  },
};

module.exports = Order;
