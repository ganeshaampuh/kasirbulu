-- Insert sample products
INSERT INTO products (name, sku, category_id, price, stock_quantity)
SELECT
  'Premium Dog Food - 5kg',
  'DOG-001',
  (SELECT id FROM categories WHERE name = 'Dog' LIMIT 1),
  450000,
  20
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'DOG-001');

INSERT INTO products (name, sku, category_id, price, stock_quantity)
SELECT
  'Dog Collar - Medium',
  'DOG-002',
  (SELECT id FROM categories WHERE name = 'Dog' LIMIT 1),
  75000,
  15
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'DOG-002');

INSERT INTO products (name, sku, category_id, price, stock_quantity)
SELECT
  'Cat Food - 3kg',
  'CAT-001',
  (SELECT id FROM categories WHERE name = 'Cat' LIMIT 1),
  350000,
  25
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CAT-001');

INSERT INTO products (name, sku, category_id, price, stock_quantity)
SELECT
  'Cat Litter - 10L',
  'CAT-002',
  (SELECT id FROM categories WHERE name = 'Cat' LIMIT 1),
  120000,
  30
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'CAT-002');

INSERT INTO products (name, sku, category_id, price, stock_quantity)
SELECT
  'Bird Cage - Large',
  'BIRD-001',
  (SELECT id FROM categories WHERE name = 'Bird' LIMIT 1),
  550000,
  5
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'BIRD-001');

INSERT INTO products (name, sku, category_id, price, stock_quantity)
SELECT
  'Fish Tank - 60L',
  'FISH-001',
  (SELECT id FROM categories WHERE name = 'Fish' LIMIT 1),
  850000,
  3
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'FISH-001');

INSERT INTO products (name, sku, category_id, price, stock_quantity)
SELECT
  'Pet Shampoo - 500ml',
  'ACC-001',
  (SELECT id FROM categories WHERE name = 'Accessories' LIMIT 1),
  95000,
  40
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ACC-001');

INSERT INTO products (name, sku, category_id, price, stock_quantity)
SELECT
  'Pet Toy - Ball',
  'ACC-002',
  (SELECT id FROM categories WHERE name = 'Accessories' LIMIT 1),
  35000,
  50
WHERE NOT EXISTS (SELECT 1 FROM products WHERE sku = 'ACC-002');
