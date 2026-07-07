require('dotenv').config();
const fs   = require('fs');
const path = require('path');
const db   = require('../config/database');
const bcrypt = require('bcryptjs');

const MIGRATIONS_DIR = __dirname;

async function ensureMigrationsTable() {
  await db.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      id         SERIAL PRIMARY KEY,
      filename   VARCHAR(255) NOT NULL UNIQUE,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

async function getApplied() {
  const { rows } = await db.query('SELECT filename FROM schema_migrations ORDER BY filename');
  return new Set(rows.map(r => r.filename));
}

async function runUp() {
  await ensureMigrationsTable();
  const applied = await getApplied();

  const files = fs.readdirSync(MIGRATIONS_DIR)
    .filter(f => f.match(/^\d{3}_.*\.sql$/))
    .sort();

  for (const file of files) {
    if (applied.has(file)) {
      console.log(`  skip  ${file}`);
      continue;
    }
    const sql = fs.readFileSync(path.join(MIGRATIONS_DIR, file), 'utf8');
    await db.query(sql);
    await db.query('INSERT INTO schema_migrations (filename) VALUES ($1)', [file]);
    console.log(`  ✓     ${file}`);
  }
  console.log('Migrations complete.');
}

async function runSeed() {
  const email    = process.env.ADMIN_EMAIL    || 'admin@peacock.com';
  const password = process.env.ADMIN_PASSWORD || 'Admin@1234';
  const hash     = await bcrypt.hash(password, 12);

  await db.query(`
    INSERT INTO users (email, password_hash, full_name, role)
    VALUES ($1, $2, 'Admin', 'admin')
    ON CONFLICT (email) DO NOTHING
  `, [email, hash]);

  console.log(`Admin seeded — email: ${email}`);
}

(async () => {
  const cmd = process.argv[2] || 'up';
  try {
    if (cmd === 'up')   await runUp();
    if (cmd === 'seed') { await runUp(); await runSeed(); }
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
  process.exit(0);
})();
