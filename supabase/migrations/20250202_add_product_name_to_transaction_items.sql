-- Add product_name column to transaction_items table
-- This allows printing receipts without needing to fetch product names separately

ALTER TABLE transaction_items
ADD COLUMN IF NOT EXISTS product_name TEXT;

-- Create an index on product_name for faster queries
CREATE INDEX IF NOT EXISTS idx_transaction_items_product_name ON transaction_items(product_name);
