-- Migration 009: Per-product marketplace links (Shopee, Lazada, TikTok, …)
-- Stored as { "shopee": "https://…", "lazada": "https://…", "tiktok": "https://…" }.
-- Only keys with a URL are present; empty ones are omitted.
ALTER TABLE products ADD COLUMN IF NOT EXISTS links JSONB NOT NULL DEFAULT '{}';
