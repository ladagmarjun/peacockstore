-- Migration 002: Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(100) NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO categories (name, slug, sort_order) VALUES
  ('All',        'all',       0),
  ('Bags',       'bags',      1),
  ('Backpacks',  'backpacks', 2),
  ('Sling',      'sling',     3),
  ('Belts',      'belts',     4)
ON CONFLICT (slug) DO NOTHING;
