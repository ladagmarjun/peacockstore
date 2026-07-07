-- Migration 007: Create settings table (site-wide key/value config)
CREATE TABLE IF NOT EXISTS settings (
  key        VARCHAR(64) PRIMARY KEY,
  value      TEXT NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO settings (key, value) VALUES
  ('cart_enabled', 'true')
ON CONFLICT (key) DO NOTHING;
