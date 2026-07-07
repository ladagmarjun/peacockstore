const db    = require('../config/database');
const bcrypt = require('bcryptjs');

const User = {
  async findById(id) {
    const { rows } = await db.query(
      'SELECT id,email,full_name,phone,role,is_active,created_at FROM users WHERE id=$1', [id]
    );
    return rows[0] || null;
  },

  async findByEmail(email) {
    const { rows } = await db.query('SELECT * FROM users WHERE email=$1', [email]);
    return rows[0] || null;
  },

  async create({ email, password, full_name, phone, role = 'customer' }) {
    const hash = await bcrypt.hash(password, 12);
    const { rows } = await db.query(`
      INSERT INTO users (email, password_hash, full_name, phone, role)
      VALUES ($1,$2,$3,$4,$5) RETURNING id,email,full_name,role
    `, [email, hash, full_name, phone || null, role]);
    return rows[0];
  },

  async verifyPassword(user, password) {
    return bcrypt.compare(password, user.password_hash);
  },

  async findAll({ limit = 50, offset = 0 } = {}) {
    const { rows } = await db.query(
      'SELECT id,email,full_name,phone,role,is_active,created_at FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return rows;
  },

  async count() {
    const { rows } = await db.query('SELECT COUNT(*) FROM users');
    return parseInt(rows[0].count);
  },

  async update(id, data) {
    const fields = [];
    const params = [];
    if (data.full_name !== undefined) { params.push(data.full_name); fields.push(`full_name=$${params.length}`); }
    if (data.phone     !== undefined) { params.push(data.phone);     fields.push(`phone=$${params.length}`);     }
    if (data.role      !== undefined) { params.push(data.role);      fields.push(`role=$${params.length}`);      }
    if (data.is_active !== undefined) { params.push(data.is_active); fields.push(`is_active=$${params.length}`); }
    if (data.password) {
      const hash = await bcrypt.hash(data.password, 12);
      params.push(hash); fields.push(`password_hash=$${params.length}`);
    }
    if (!fields.length) return null;
    params.push(new Date(), id);
    const { rows } = await db.query(
      `UPDATE users SET ${fields.join(', ')}, updated_at=$${params.length-1} WHERE id=$${params.length} RETURNING id,email,full_name,role`,
      params
    );
    return rows[0] || null;
  },
};

module.exports = User;
