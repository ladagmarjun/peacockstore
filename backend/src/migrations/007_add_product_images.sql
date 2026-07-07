-- Migration 007: Add images gallery to products.
-- Each entry: { "url": "/uploads/products/xxx.jpg", "color": "#7a1414" }
ALTER TABLE products ADD COLUMN IF NOT EXISTS images JSONB NOT NULL DEFAULT '[]';
