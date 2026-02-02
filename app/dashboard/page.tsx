'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/auth'
import Link from 'next/link'

interface DashboardStats {
  todaySales: number
  todayCount: number
  lowStockProducts: number
  recentTransactions: any[]
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    todaySales: 0,
    todayCount: 0,
    lowStockProducts: 0,
    recentTransactions: [],
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    // Get today's sales
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const { data: todayTransactions } = await supabase
      .from('transactions')
      .select('total')
      .gte('created_at', today.toISOString())

    const todaySales = todayTransactions?.reduce((sum, t) => sum + t.total, 0) || 0
    const todayCount = todayTransactions?.length || 0

    // Get low stock products
    const { count: lowStockCount } = await supabase
      .from('products')
      .select('*', { count: 'exact', head: true })
      .lt('stock_quantity', 10)

    // Get recent transactions
    const { data: recentTransactions } = await supabase
      .from('transactions')
      .select('*, transaction_items(*)')
      .order('created_at', { ascending: false })
      .limit(5)

    setStats({
      todaySales,
      todayCount,
      lowStockProducts: lowStockCount || 0,
      recentTransactions: recentTransactions || [],
    })
    setLoading(false)
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Dashboard</h1>

      {loading ? (
        <div className="text-center py-12">
          <div className="text-gray-500">Loading dashboard...</div>
        </div>
      ) : (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-lg shadow-lg">
              <div className="text-blue-100 text-sm font-medium mb-1">Today's Sales</div>
              <div className="text-3xl font-bold">
                Rp {stats.todaySales.toLocaleString('id-ID')}
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg">
              <div className="text-green-100 text-sm font-medium mb-1">Transactions Today</div>
              <div className="text-3xl font-bold">{stats.todayCount}</div>
            </div>

            <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-lg shadow-lg">
              <div className="text-orange-100 text-sm font-medium mb-1">Low Stock Items</div>
              <div className="text-3xl font-bold">{stats.lowStockProducts}</div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Link
                href="/checkout"
                className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-lg text-center font-medium transition-colors"
              >
                <div className="text-3xl mb-2">🛒</div>
                New Sale
              </Link>
              <Link
                href="/products"
                className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-lg text-center font-medium transition-colors"
              >
                <div className="text-3xl mb-2">📦</div>
                Products
              </Link>
              <Link
                href="/transactions"
                className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-lg text-center font-medium transition-colors"
              >
                <div className="text-3xl mb-2">📋</div>
                History
              </Link>
              <button
                onClick={fetchDashboardData}
                className="bg-gray-600 hover:bg-gray-700 text-white p-6 rounded-lg text-center font-medium transition-colors"
              >
                <div className="text-3xl mb-2">🔄</div>
                Refresh
              </button>
            </div>
          </div>

          {/* Recent Transactions */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Recent Transactions</h2>
            {stats.recentTransactions.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                No transactions yet. Start making sales!
              </div>
            ) : (
              <div className="space-y-3">
                {stats.recentTransactions.map((transaction: any) => (
                  <div
                    key={transaction.id}
                    className="flex justify-between items-center p-4 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <div className="font-medium">{transaction.transaction_number}</div>
                      <div className="text-sm text-gray-500">
                        {new Date(transaction.created_at).toLocaleString('id-ID', {
                          dateStyle: 'medium',
                          timeStyle: 'short',
                        })}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-bold text-lg">
                        Rp {transaction.total.toLocaleString('id-ID')}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.transaction_items?.length || 0} items
                      </div>
                    </div>
                  </div>
                ))}
                <Link
                  href="/transactions"
                  className="block text-center text-blue-600 hover:text-blue-800 mt-4"
                >
                  View All Transactions →
                </Link>
              </div>
            )}
          </div>

          {/* Low Stock Alert */}
          {stats.lowStockProducts > 0 && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4">
              <div className="flex items-center">
                <span className="text-2xl mr-3">⚠️</span>
                <div>
                  <div className="font-semibold text-red-800">Low Stock Alert</div>
                  <div className="text-sm text-red-600">
                    You have {stats.lowStockProducts} products with low stock.{' '}
                    <Link href="/products" className="underline font-medium">
                      Check now
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  )
}
