const db = require('../config/database');

// Boolean-ish settings are stored as the strings 'true' / 'false'.
const BOOL_KEYS = new Set(['cart_enabled']);

const Setting = {
  // Returns all settings as a plain object, coercing known boolean keys.
  async all() {
    const { rows } = await db.query('SELECT key, value FROM settings');
    const out = {};
    for (const { key, value } of rows) {
      out[key] = BOOL_KEYS.has(key) ? value === 'true' : value;
    }
    return out;
  },

  async get(key) {
    const { rows } = await db.query('SELECT value FROM settings WHERE key = $1', [key]);
    if (!rows[0]) return null;
    return BOOL_KEYS.has(key) ? rows[0].value === 'true' : rows[0].value;
  },

  async set(key, value) {
    const stored = typeof value === 'boolean' ? String(value) : String(value);
    const { rows } = await db.query(`
      INSERT INTO settings (key, value, updated_at) VALUES ($1, $2, NOW())
      ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value, updated_at = NOW()
      RETURNING key, value
    `, [key, stored]);
    return rows[0];
  },
};

module.exports = Setting;
