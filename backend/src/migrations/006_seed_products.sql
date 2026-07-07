-- Migration 006: Seed initial product data
INSERT INTO products
  (category_id, name, slug, description, price, was_price, tag, leather_type, hardware, dimensions, colors, glyph, rating, review_count, stock)
VALUES
  (2, 'Heritage Tote',     'heritage-tote',
   'A structured everyday tote in genuine full-grain leather that fits a 14" laptop and softens beautifully with use.',
   6850, 7900, 'Bestseller', 'Full-grain cowhide', 'Solid brass', '36 × 28 × 12 cm',
   '["#7a1414","#3a2418","#1c1c1c"]', '👜', 5.0, 128, 20),

  (3, 'Voyager Backpack',  'voyager-backpack',
   'A roll-top leather backpack built for the commute and the weekend, with a padded sleeve and brass buckles.',
   8900, NULL, 'New', 'Veg-tanned cowhide', 'Solid brass', '45 × 30 × 15 cm',
   '["#6f1212","#5a4634","#2b2b2b"]', '🎒', 5.0, 74, 15),

  (4, 'Crossbody Sling',   'crossbody-sling',
   'A compact sling sized for phone, wallet and keys, with an adjustable strap that sits flat across the body.',
   3450, 4200, 'Sale', 'Full-grain goatskin', 'Antique brass', '22 × 16 × 6 cm',
   '["#7a1414","#7a5230","#111111"]', '👝', 4.0, 96, 30),

  (5, 'Artisan Belt',      'artisan-belt',
   'A single-ply 35mm belt cut from one strip of leather and finished with a hand-burnished edge.',
   1950, NULL, NULL, 'Bridle leather', 'Brushed nickel', '110 cm × 3.5 cm',
   '["#3a2418","#7a1414","#1c1c1c"]', '🪢', 5.0, 210, 50),

  (2, 'Weekender Duffel',  'weekender-duffel',
   'A two-night duffel with a wide mouth, leather grab handles and a detachable padded shoulder strap.',
   11200, 12500, 'Bestseller', 'Full-grain cowhide', 'Solid brass', '52 × 26 × 26 cm',
   '["#6f1212","#43321f","#222222"]', '🧳', 5.0, 58, 10),

  (2, 'Field Satchel',     'field-satchel',
   'A flap satchel with twin gussets and a magnetic snap under the buckle so you can open it one-handed.',
   7400, NULL, 'New', 'Veg-tanned cowhide', 'Antique brass', '33 × 25 × 10 cm',
   '["#7a1414","#5a4634","#1a1a1a"]', '💼', 4.0, 41, 18),

  (4, 'Trail Sling Pack',  'trail-sling-pack',
   'A larger sling worn across the back, with a zip main compartment and a quick-access front pocket.',
   4100, NULL, NULL, 'Pull-up leather', 'Gunmetal', '30 × 18 × 8 cm',
   '["#7a1414","#4a3826","#000000"]', '🥡', 4.0, 33, 25),

  (3, 'Commuter Pack',     'commuter-pack',
   'A flap-over backpack with a 16" laptop sleeve, organiser panel and leather-wrapped magnetic closures.',
   9600, 10800, 'Sale', 'Full-grain cowhide', 'Solid brass', '42 × 30 × 14 cm',
   '["#7a1414","#3a2418","#1c1c1c"]', '🎒', 5.0, 67, 12),

  (5, 'Reversible Belt',   'reversible-belt',
   'One belt, two finishes — a rotating buckle flips between oxblood and black bridle leather.',
   2300, NULL, 'New', 'Bridle leather', 'Brushed brass', '115 cm × 3.5 cm',
   '["#7a1414","#1c1c1c","#5a4634"]', '🪢', 5.0, 88, 40)

ON CONFLICT (slug) DO NOTHING;
