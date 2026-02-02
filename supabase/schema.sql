-- Create Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Products table
CREATE TABLE IF NOT EXISTS products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  sku TEXT UNIQUE NOT NULL,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  stock_quantity INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Transactions table
CREATE TABLE IF NOT EXISTS transactions (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_number TEXT UNIQUE NOT NULL,
  total NUMERIC(10, 2) NOT NULL DEFAULT 0,
  payment_method TEXT NOT NULL DEFAULT 'cash',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Transaction Items table
CREATE TABLE IF NOT EXISTS transaction_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  transaction_id UUID NOT NULL REFERENCES transactions(id) ON DELETE CASCADE,
  product_id UUID NOT NULL REFERENCES products(id),
  quantity INTEGER NOT NULL DEFAULT 1,
  unit_price NUMERIC(10, 2) NOT NULL DEFAULT 0,
  line_total NUMERIC(10, 2) NOT NULL DEFAULT 0
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_products_category ON products(category_id);
CREATE INDEX IF NOT EXISTS idx_products_sku ON products(sku);
CREATE INDEX IF NOT EXISTS idx_transactions_number ON transactions(transaction_number);
CREATE INDEX IF NOT EXISTS idx_transactions_created ON transactions(created_at);
CREATE INDEX IF NOT EXISTS idx_transaction_items_transaction ON transaction_items(transaction_id);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to auto-update updated_at
CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON products
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Function to generate transaction number
CREATE OR REPLACE FUNCTION generate_transaction_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.transaction_number := 'TXN' || TO_CHAR(NOW(), 'YYYYMMDD') || '-' || LPAD(nextval('transaction_number_seq')::TEXT, 4, '0');
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Sequence for transaction numbers
CREATE SEQUENCE IF NOT EXISTS transaction_number_seq START 1;

-- Trigger to auto-generate transaction number
CREATE TRIGGER generate_transaction_number_trigger
  BEFORE INSERT ON transactions
  FOR EACH ROW
  EXECUTE FUNCTION generate_transaction_number();

-- Insert default categories
INSERT INTO categories (name) VALUES
  ('Dog'),
  ('Cat'),
  ('Bird'),
  ('Fish'),
  ('Accessories')
ON CONFLICT DO NOTHING;
