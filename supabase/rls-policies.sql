-- Enable Row Level Security
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
ALTER TABLE transaction_items ENABLE ROW LEVEL SECURITY;

-- Public access policies (for MVP - single user)
-- In production, you should restrict these based on authenticated users

-- Products: Anyone can read, only authenticated can write
CREATE POLICY "Public read access for products"
  ON products FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated write access for products"
  ON products FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Categories: Public read, authenticated write
CREATE POLICY "Public read access for categories"
  ON categories FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated write access for categories"
  ON categories FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Transactions: Public read, authenticated write
CREATE POLICY "Public read access for transactions"
  ON transactions FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated write access for transactions"
  ON transactions FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

-- Transaction Items: Public read, authenticated write
CREATE POLICY "Public read access for transaction_items"
  ON transaction_items FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Authenticated write access for transaction_items"
  ON transaction_items FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
