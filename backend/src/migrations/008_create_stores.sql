-- Migration 008: Create stores table (the "Our Stores" section on the homepage)
CREATE TABLE IF NOT EXISTS stores (
  id         SERIAL PRIMARY KEY,
  name       VARCHAR(150) NOT NULL,
  address    TEXT NOT NULL,
  hours      VARCHAR(150) NOT NULL DEFAULT 'Mon–Sun 10:00 AM – 9:00 PM',
  map_url    VARCHAR(500),
  sort_order INTEGER NOT NULL DEFAULT 0,
  is_active  BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

INSERT INTO stores (name, address, sort_order) VALUES
  ('Peacock — BGC',         'Level 2, Bonifacio High Street, BGC, Taguig City', 1),
  ('Peacock — SM Megamall', '4/F Mega Fashion Hall, SM Megamall, Mandaluyong',  2),
  ('Peacock — Cebu',        'GF, Ayala Center Cebu, Cebu City',                 3)
ON CONFLICT DO NOTHING;
