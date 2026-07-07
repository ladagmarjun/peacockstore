-- Migration 011: Add a brand/label to products.
ALTER TABLE products ADD COLUMN IF NOT EXISTS brand VARCHAR(120);
