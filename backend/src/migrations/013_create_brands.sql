-- Migration 013: Create brands table
CREATE TABLE IF NOT EXISTS brands (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(100) NOT NULL,
  slug       VARCHAR(120) NOT NULL UNIQUE,
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Backfill from any brand names already stored on products.
INSERT INTO brands (name, slug)
SELECT DISTINCT TRIM(brand),
       TRIM(BOTH '-' FROM LOWER(REGEXP_REPLACE(TRIM(brand), '[^a-zA-Z0-9]+', '-', 'g')))
FROM products
WHERE brand IS NOT NULL AND TRIM(brand) <> ''
ON CONFLICT (slug) DO NOTHING;
