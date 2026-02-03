import { createBrowserClient } from '@supabase/auth-helpers-nextjs'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Product {
  id: string
  name: string
  sku: string
  category_id: string
  price: number
  stock_quantity: number
  created_at: string
  updated_at: string
}

export interface Category {
  id: string
  name: string
  created_at: string
}

export interface Transaction {
  id: string
  transaction_number?: string
  total: number
  payment_method: string
  created_at: string
}

export interface TransactionItem {
  id: string
  transaction_id: string
  product_id: string
  product_name?: string
  quantity: number
  unit_price: number
  line_total: number
}

// Helper function to join transactions with their items
export interface TransactionWithItems extends Transaction {
  transaction_items: TransactionItem[]
}
