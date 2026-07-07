-- Migration 010: Homepage cover slideshow ("banners").
-- Recommended image size: 1600 x 600 px (landscape, ~8:3).
CREATE TABLE IF NOT EXISTS banners (
  id         SERIAL PRIMARY KEY,
  image_url  VARCHAR(500) NOT NULL,
  headline   VARCHAR(200),
  subtext    VARCHAR(300),
  link_url   VARCHAR(500),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO banners (image_url, headline, subtext, link_url, sort_order) VALUES
  ('/hero-sample-1.svg', 'Genuine Leather, Timeless Craft', 'Handcrafted bags, backpacks, slings and belts — built to last decades.', '#shop', 1),
  ('/hero-sample-2.svg', 'New Season Arrivals',             'Fresh full-grain leather pieces, just dropped.',                         '#shop', 2)
ON CONFLICT DO NOTHING;
