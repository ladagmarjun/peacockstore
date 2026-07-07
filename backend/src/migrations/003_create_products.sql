-- Migration 003: Create products table
CREATE TABLE IF NOT EXISTS products (
  id            SERIAL PRIMARY KEY,
  category_id   INTEGER NOT NULL REFERENCES categories(id) ON DELETE RESTRICT,
  name          VARCHAR(255) NOT NULL,
  slug          VARCHAR(255) NOT NULL UNIQUE,
  description   TEXT,
  price         NUMERIC(12,2) NOT NULL,
  was_price     NUMERIC(12,2),
  tag           VARCHAR(50),
  leather_type  VARCHAR(100),
  hardware      VARCHAR(100),
  dimensions    VARCHAR(100),
  colors        JSONB NOT NULL DEFAULT '[]',
  glyph         VARCHAR(10) NOT NULL DEFAULT '👜',
  image_url     VARCHAR(500),
  rating        NUMERIC(2,1) NOT NULL DEFAULT 5.0,
  review_count  INTEGER NOT NULL DEFAULT 0,
  stock         INTEGER NOT NULL DEFAULT 0,
  is_active     BOOLEAN NOT NULL DEFAULT TRUE,
  created_at    TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at    TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_products_category  ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_slug      ON products(slug);
CREATE INDEX IF NOT EXISTS idx_products_is_active ON products(is_active);
CREATE INDEX IF NOT EXISTS idx_products_tag       ON products(tag);
