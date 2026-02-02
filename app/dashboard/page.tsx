'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import Link from 'next/link'
import { FiShoppingCart, FiBox, FiList, FiRefreshCw, FiTrendingUp, FiAlertCircle } from 'react-icons/fi'

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
    <div className="min-h-screen bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-2xl font-semibold text-gray-900 mb-6">Dasbor</h1>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-16">
            <div className="w-10 h-10 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-gray-500 text-sm">Memuat dasbor...</p>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-blue-100 text-sm font-medium">Penjualan Hari Ini</div>
                  <FiTrendingUp className="w-6 h-6 text-blue-200" />
                </div>
                <div className="text-3xl font-bold">
                  Rp {stats.todaySales.toLocaleString('id-ID')}
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-green-100 text-sm font-medium">Transaksi Hari Ini</div>
                  <FiShoppingCart className="w-6 h-6 text-green-200" />
                </div>
                <div className="text-3xl font-bold">{stats.todayCount}</div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white p-6 rounded-xl shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <div className="text-orange-100 text-sm font-medium">Stok Menipis</div>
                  <FiBox className="w-6 h-6 text-orange-200" />
                </div>
                <div className="text-3xl font-bold">{stats.lowStockProducts}</div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Aksi Cepat</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Link
                  href="/checkout"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-6 rounded-xl text-center font-medium transition-colors flex flex-col items-center"
                >
                  <FiShoppingCart className="w-8 h-8 mb-2" />
                  <span>Penjualan Baru</span>
                </Link>
                <Link
                  href="/products"
                  className="bg-purple-600 hover:bg-purple-700 text-white p-6 rounded-xl text-center font-medium transition-colors flex flex-col items-center"
                >
                  <FiBox className="w-8 h-8 mb-2" />
                  <span>Produk</span>
                </Link>
                <Link
                  href="/transactions"
                  className="bg-green-600 hover:bg-green-700 text-white p-6 rounded-xl text-center font-medium transition-colors flex flex-col items-center"
                >
                  <FiList className="w-8 h-8 mb-2" />
                  <span>Riwayat</span>
                </Link>
                <button
                  onClick={fetchDashboardData}
                  className="bg-gray-600 hover:bg-gray-700 text-white p-6 rounded-xl text-center font-medium transition-colors flex flex-col items-center"
                >
                  <FiRefreshCw className="w-8 h-8 mb-2" />
                  <span>Refresh</span>
                </button>
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white border border-gray-200 rounded-xl shadow-sm p-6">
              <h2 className="text-xl font-semibold mb-4">Transaksi Terbaru</h2>
              {stats.recentTransactions.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  Belum ada transaksi. Mulai penjualan sekarang!
                </div>
              ) : (
                <div className="space-y-3">
                  {stats.recentTransactions.map((transaction: any) => (
                    <div
                      key={transaction.id}
                      className="flex justify-between items-center p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div>
                        <div className="font-medium text-gray-900">{transaction.transaction_number}</div>
                        <div className="text-sm text-gray-500">
                          {new Date(transaction.created_at).toLocaleString('id-ID', {
                            dateStyle: 'medium',
                            timeStyle: 'short',
                          })}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="font-bold text-lg text-gray-900">
                          Rp {transaction.total.toLocaleString('id-ID')}
                        </div>
                        <div className="text-sm text-gray-500">
                          {transaction.transaction_items?.length || 0} item
                        </div>
                      </div>
                    </div>
                  ))}
                  <Link
                    href="/transactions"
                    className="block text-center text-blue-600 hover:text-blue-800 mt-4 font-medium"
                  >
                    Lihat Semua Transaksi →
                  </Link>
                </div>
              )}
            </div>

            {/* Low Stock Alert */}
            {stats.lowStockProducts > 0 && (
              <div className="mt-6 bg-orange-50 border border-orange-200 rounded-xl p-4">
                <div className="flex items-center">
                  <FiAlertCircle className="w-6 h-6 text-orange-600 mr-3 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-orange-800">Peringatan Stok Menipis</div>
                    <div className="text-sm text-orange-600">
                      Anda memiliki {stats.lowStockProducts} produk dengan stok menipis.{' '}
                      <Link href="/products" className="underline font-medium">
                        Cek sekarang
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
