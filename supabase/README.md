# Supabase Setup Instructions

## Step 1: Create a Supabase Project

1. Go to [https://supabase.com](https://supabase.com)
2. Sign up or log in
3. Click "New Project"
4. Choose a name (e.g., "kasir-bulu-pos")
5. Set a database password (save it securely)
6. Select a region closest to you
7. Click "Create new project"

## Step 2: Get Your Credentials

Once your project is ready:

1. Go to Project Settings → API
2. Copy your:
   - Project URL (this will be `NEXT_PUBLIC_SUPABASE_URL`)
   - anon/public key (this will be `NEXT_PUBLIC_SUPABASE_ANON_KEY`)

## Step 3: Set Up Database Tables

1. Go to SQL Editor in your Supabase dashboard
2. Run each SQL file in order:
   - `schema.sql` - Creates tables and indexes
   - `rls-policies.sql` - Sets up row level security
   - `sample-data.sql` - Inserts sample data (optional)

## Step 4: Configure Environment Variables

1. Copy `.env.local.example` to `.env.local`:
   ```bash
   cp .env.local.example .env.local
   ```

2. Edit `.env.local` and add your Supabase credentials:
   ```
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
   ```

## Step 5: Verify Setup

1. Start the dev server: `npm run dev`
2. Go to [http://localhost:3000](http://localhost:3000)
3. The app should connect to your Supabase database

## Database Schema

### Tables

- `categories`: Product categories
- `products`: Product catalog
- `transactions`: Sales transactions
- `transaction_items`: Line items for each transaction

### Features

- Auto-generated transaction numbers (TXNYYYYMMDD-####)
- Auto-updating timestamps
- Row Level Security (RLS) enabled
- Sample data included for testing
