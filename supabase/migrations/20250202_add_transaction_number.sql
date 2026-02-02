-- Add transaction_number column to transactions table
-- This provides a human-readable transaction ID for receipts

ALTER TABLE transactions
ADD COLUMN IF NOT EXISTS transaction_number TEXT UNIQUE;

-- Create an index on transaction_number for faster lookups
CREATE INDEX IF NOT EXISTS idx_transactions_transaction_number ON transactions(transaction_number);

-- Set default transaction_number for existing records (using transaction ID)
UPDATE transactions
SET transaction_number = 'TRX-' || id
WHERE transaction_number IS NULL;
